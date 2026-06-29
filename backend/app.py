from flask import Flask, jsonify, request
from flask_cors import CORS

import json
import redis

from config import Config
from models import db, Employee

from prometheus_client import (
    Counter,
    Histogram,
    generate_latest,
    CONTENT_TYPE_LATEST
)

# -----------------------------------------
# Flask App
# -----------------------------------------

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# -----------------------------------------
# Redis Connection
# -----------------------------------------

redis_client = redis.Redis(
    host="redis",
    port=6379,
    decode_responses=True
)

# -----------------------------------------
# Prometheus Metrics
# -----------------------------------------

employee_requests = Counter(
    "employee_requests_total",
    "Total Employee API Requests"
)

cache_hits = Counter(
    "employee_cache_hits_total",
    "Total Redis Cache Hits"
)

cache_misses = Counter(
    "employee_cache_miss_total",
    "Total Redis Cache Misses"
)

employees_created = Counter(
    "employee_created_total",
    "Total Employees Created"
)

employees_updated = Counter(
    "employee_updated_total",
    "Total Employees Updated"
)

request_duration = Histogram(
    "employee_request_duration_seconds",
    "Employee API Response Time"
)

employees_deleted = Counter(
    "employee_deleted_total",
    "Total employees deleted"
)

employee_list_requests = Counter(
    "employee_list_requests_total",
    "Total employee list requests"
)

employee_list_cache_hits = Counter(
    "employee_list_cache_hits_total",
    "Total employee list cache hits"
)

employee_list_cache_misses = Counter(
    "employee_list_cache_miss_total",
    "Total employee list cache misses"
)

# -----------------------------------------
# Database Initialization
# -----------------------------------------

db.init_app(app)

with app.app_context():
    db.create_all()

# -----------------------------------------
# Home Route
# -----------------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "Employee Portal Backend Running"
    })

# -----------------------------------------
# Health Check
# -----------------------------------------

@app.route("/health")
def health():

    try:

        db.session.execute(db.text("SELECT 1"))

        return jsonify({
            "status": "healthy",
            "database": "connected",
            "redis": "connected",
            "service": "employee-backend",
            "version": "v2"
        }), 200

    except Exception as e:

        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

# -----------------------------------------
# Prometheus Metrics Endpoint
# -----------------------------------------

@app.route("/metrics")
def metrics():

    return (
        generate_latest(),
        200,
        {
            "Content-Type": CONTENT_TYPE_LATEST
        }
    )

# -----------------------------------------
# Redis Test
# -----------------------------------------

@app.route("/redis-test")
def redis_test():

    redis_client.set(
        "message",
        "Hello Redis"
    )

    value = redis_client.get("message")

    return jsonify({
        "redis": value
    })

# -----------------------------------------
# GET Employee
# -----------------------------------------


@app.route("/employee", methods=["GET"])
@request_duration.time()
def get_employee():

    employee_requests.inc()

    employee_id = request.args.get("id", type=int)

    if employee_id is None:

        return jsonify({
            "message": "Employee ID is required"
        }), 400

    cache_key = f"employee:{employee_id}"

    # ---------------------------------
    # Check Redis Cache
    # ---------------------------------

    cached_employee = redis_client.get(cache_key)

    if cached_employee:

        cache_hits.inc()

        return jsonify(
            json.loads(cached_employee)
        )

    # ---------------------------------
    # Cache Miss
    # ---------------------------------

    cache_misses.inc()

    employee = Employee.query.filter_by(
        id=employee_id
    ).first()

    if employee is None:

        return jsonify({
            "message": "Employee Not Found"
        }), 404

    employee_data = employee.to_dict()

    # ---------------------------------
    # Save Employee Into Redis
    # ---------------------------------

    redis_client.setex(

        cache_key,

        300,

        json.dumps(employee_data)

    )

    return jsonify(employee_data)

@app.route("/employees", methods=["GET"])
def get_all_employees():
    employee_list_requests.inc()
    cache_key = "employees:all"

    cached_data = redis_client.get(cache_key)

    # -------------------------------
    # Cache Hit
    # -------------------------------
    if cached_data:

        employee_list_cache_hits.inc()

        return jsonify(
            json.loads(cached_data)
    )

    # -------------------------------
    # Cache Miss
    # -------------------------------

    employee_list_cache_misses.inc()

    employees = Employee.query.order_by(
        Employee.id
    ).all()

    employee_data = [

        employee.to_dict()

        for employee in employees

    ]

    response = {

        "count": len(employee_data),

        "employees": employee_data

    }

    redis_client.setex(

        cache_key,

        300,

        json.dumps(response)

    )

    return jsonify(response)

# -----------------------------------------
# Add Employee
# -----------------------------------------

@app.route("/employee", methods=["POST"])
@request_duration.time()
def add_employee():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    required_fields = [
        "id",
        "name",
        "role",
        "salary"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "message": f"{field} is required"
            }), 400

    existing_employee = Employee.query.filter_by(
        id=data["id"]
    ).first()

    if existing_employee:

        return jsonify({
            "message": "Employee already exists"
        }), 409

    try:

        employee = Employee(
            id=data["id"],
            name=data["name"],
            role=data["role"],
            salary=data["salary"]
        )

        db.session.add(employee)
        db.session.commit()

        employees_created.inc()

        redis_client.delete(
            f"employee:{employee.id}"
        )
        redis_client.delete("employees:all")

        return jsonify({
            "message": "Employee Added Successfully",
            "employee": employee.to_dict()
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "message": "Failed to add employee",
            "error": str(e)
        }), 500


# -----------------------------------------
# Update Employee
# -----------------------------------------

@app.route("/employee/<int:employee_id>", methods=["PUT"])
@request_duration.time()
def update_employee(employee_id):

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "Request body is required"
        }), 400

    employee = Employee.query.filter_by(
        id=employee_id
    ).first()

    if employee is None:

        return jsonify({
            "message": "Employee Not Found"
        }), 404

    try:

        if "name" in data:
            employee.name = data["name"]

        if "role" in data:
            employee.role = data["role"]

        if "salary" in data:
            employee.salary = data["salary"]

        db.session.commit()

        employees_updated.inc()

        # Cache Invalidation
        redis_client.delete(
            f"employee:{employee_id}"
        )
        redis_client.delete("employees:all")

        return jsonify({
            "message": "Employee Updated Successfully",
            "employee": employee.to_dict()
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "message": "Failed to update employee",
            "error": str(e)
        }), 500
# -----------------------------------------
# Delete Employee
# -----------------------------------------

@app.route("/employee/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    employee = Employee.query.filter_by(
        id=employee_id
    ).first()

    if employee is None:

        return jsonify({

            "message": "Employee not found"

        }), 404

    try:

        db.session.delete(employee)

        db.session.commit()

        # ---------------------------------
        # Remove Redis Cache
        # ---------------------------------
        employees_deleted.inc()

        redis_client.delete(
            f"employee:{employee_id}"
        )

        redis_client.delete(
            "employees:all"
        )

        return jsonify({

            "message": "Employee deleted successfully"

        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "message": "Failed to delete employee",

            "error": str(e)

        }), 500


# -----------------------------------------
# Run Flask App
# -----------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
