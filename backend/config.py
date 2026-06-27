import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://employee:employee123@postgres:5432/employee_db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
