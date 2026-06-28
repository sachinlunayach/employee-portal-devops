from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import redis

from config import Config
from models import db, Employee

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# -----------------------------
# Redis Connection
# -----------------------------
redis_client = redis.Redis(
    host="redis",
    port=6379,
    decode_responses=True
)

# -----------------------------
# Database Initialization
# -----------------------------
db.init_app(app)

with app.app_context():
    db.create_all()


# -----------------------------
# Home
# -----------------------------
@app.route("/")
def home():
    return "Employee Portal Backend is Running"


# -----------------------------
# Get Employee (Redis + PostgreSQL)
# -----------------------------
@app.route("/employee")
def get_employee():

    employee_id = request.args.get("id", type=int)

    if employee_id is None:
        return jsonify({"message": "Employee ID is required"}), 400

    # Redis Key
    cache_key = f"employee:{employee_id}"

    # -----------------------------
    # Check Redis First
    # -----------------------------
    cached_employee = redis_client.get(cache_key)

    if cached_employee:
        print("✅ Cache Hit")
        return jsonify(json.loads(cached_employee))

    print("❌ Cache Miss")

    # -----------------------------
    # Fetch From PostgreSQL
    # -----------------------------
    employee = Employee.query.filter_by(id=employee_id).first()

    if not employee:
        return jsonify({"message": "Employee Not Found"}), 404

    employee_data = employee.to_dict()

    # -----------------------------
    # Save Into Redis (5 Minutes)
    # -----------------------------
    redis_client.setex(
        cache_key,
        300,
        json.dumps(employee_data)
    )

    return jsonify(employee_data)
@app.route("/employee", methods=["POST"])
def add_employee():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    required_fields = ["id", "name", "role", "salary"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "message": f"{field} is required"
            }), 400

    existing_employee = Employee.query.filter_by(id=data["id"]).first()

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

        return jsonify({
            "message": "Employee Added Successfully"
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "message": "Failed to add employee",
            "error": str(e)
        }), 500

@app.route("/employee/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    employee = Employee.query.filter_by(id=employee_id).first()

    if not employee:
        return jsonify({
            "message": "Employee not found"
        }), 404

    try:

        if "name" in data:
            employee.name = data["name"]

        if "role" in data:
            employee.role = data["role"]

        if "salary" in data:
            employee.salary = data["salary"]

        db.session.commit()
        redis_client.delete(f"employee:{employee_id}")

        return jsonify({
            "message": "Employee Updated Successfully"
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "message": "Failed to update employee",
            "error": str(e)
        }), 500
# -----------------------------
# Health Check
# -----------------------------
@app.route("/health")
def health():

    try:

        db.session.execute(db.text("SELECT 1"))

        return jsonify({
            "status": "healthy",
            "database": "connected",
            "service": "employee-backend"
        }), 200

    except Exception as e:

        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }), 500


# -----------------------------
# Redis Test
# -----------------------------
@app.route("/redis-test")
def redis_test():

    redis_client.set("message", "Hello Redis")

    value = redis_client.get("message")

    return jsonify({
        "redis": value
    })


# -----------------------------
# Run App
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
