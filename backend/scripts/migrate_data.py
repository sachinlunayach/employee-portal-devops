import json

from flask import Flask
from config import Config
from models import db, Employee

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():

    # JSON file read karo
    with open("employee.json", "r") as file:
        employees = json.load(file)

    # Data insert karo
    for emp in employees:

        # Duplicate check
        existing = Employee.query.filter_by(id=emp["id"]).first()

        if not existing:
            employee = Employee(
                id=emp["id"],
                name=emp["name"],
                role=emp["role"],
                salary=emp["salary"]
            )

            db.session.add(employee)

    db.session.commit()

    print(" Employee data migrated successfully!")
