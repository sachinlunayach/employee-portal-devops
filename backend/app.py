from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config
from models import db, Employee

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# Initialize Database
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return "Employee Portal Backend is Running"


@app.route("/employee")
def get_employee():

    employee_id = request.args.get("id", type=int)

    employee = Employee.query.filter_by(id=employee_id).first()

    if employee:
        return jsonify(employee.to_dict())

    return jsonify({"message": "Employee Not Found"}), 404
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

if __name__ == "__main__":
    app.run(debug=True)
