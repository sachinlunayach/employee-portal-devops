from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


def load_employees():
    with open("employee.json", "r") as file:
        return json.load(file)


@app.route("/employee")
def get_employee():

    employee_id = request.args.get("id", type=int)

    employees = load_employees()

    for emp in employees:
        if emp["id"] == employee_id:
            return jsonify(emp)

    return jsonify({"message": "Employee Not Found"}), 404


if __name__ == "__main__":
    app.run(debug=True)