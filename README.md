# 🚀 Employee Portal DevOps Project

<p align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge\&logo=python)
![Flask](https://img.shields.io/badge/Flask-REST%20API-black?style=for-the-badge\&logo=flask)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge\&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge\&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge\&logo=docker)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge\&logo=prometheus)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?style=for-the-badge\&logo=grafana)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20CloudFront-FF9900?style=for-the-badge\&logo=amazonaws)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI/CD-2088FF?style=for-the-badge\&logo=githubactions)

</p>

---

# 📌 Overview

The **Employee Portal DevOps Project** is a production-inspired employee management system that demonstrates modern DevOps practices from application development to deployment and monitoring.

The project consists of two web applications:

* 👤 **Employee Portal** – Search employee records by Employee ID.
* 👨‍💼 **HR Dashboard** – Manage employee records using complete CRUD operations.

The backend is built using **Flask** with **PostgreSQL** as the primary database and **Redis** for caching. The application is containerized using **Docker Compose**, monitored with **Prometheus** and **Grafana**, deployed on **AWS EC2**, accelerated using **AWS CloudFront**, and integrated with **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD).

---

# ✨ Key Features

| Module             | Features                                                                           |
| ------------------ | ---------------------------------------------------------------------------------- |
| 👤 Employee Portal | Search Employee, Responsive UI, Loading Spinner, Toast Notifications, Clear Search |
| 👨‍💼 HR Dashboard | Search, Add, Update, Delete Employees, Backend Status, Employee Statistics         |
| ⚙ Backend          | Flask REST API, PostgreSQL, SQLAlchemy ORM, Redis Cache                            |
| 📊 Monitoring      | Prometheus, Grafana, Node Exporter, PostgreSQL Exporter, Redis Exporter            |
| ☁ DevOps           | Docker, Docker Compose, AWS EC2, CloudFront, GitHub Actions                        |

---

# 🛠 Technology Stack

| Category         | Technologies                                       |
| ---------------- | -------------------------------------------------- |
| Frontend         | HTML5, CSS3, JavaScript                            |
| Backend          | Python, Flask                                      |
| Database         | PostgreSQL                                         |
| ORM              | SQLAlchemy                                         |
| Cache            | Redis                                              |
| Monitoring       | Prometheus, Grafana                                |
| Exporters        | Node Exporter, PostgreSQL Exporter, Redis Exporter |
| Containerization | Docker, Docker Compose                             |
| Cloud            | AWS EC2, AWS CloudFront                            |
| CI/CD            | GitHub Actions                                     |
| Version Control  | Git & GitHub                                       |

---

# 🌐 Live Demo

| Service            | URL                                                    |
| ------------------ | ------------------------------------------------------ |
| Employee Portal    | https://djrsvxg7njjaz.cloudfront.net                   |
| HR Dashboard       | https://djrsvxg7njjaz.cloudfront.net/hr_dashboard.html |
| Backend Health     | https://djrsvxg7njjaz.cloudfront.net/health            |
| Prometheus Metrics | https://djrsvxg7njjaz.cloudfront.net/metrics           |

---

# 🏗 System Architecture

```text
                           User
                             │
                             ▼
                    AWS CloudFront CDN
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                   ▼
    Amazon S3 Frontend                Flask Backend (EC2)
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
             PostgreSQL Database                                Redis Cache
                    │                                                   │
                    └──────────────────────┬────────────────────────────┘
                                           ▼
                                      Prometheus
                                           │
                                           ▼
                                        Grafana
                                           │
                                           ▼
                               Alertmanager → Telegram
```

---

# 📂 Project Structure

```text
employee-portal-devops/
│
├── backend/
├── frontend/
├── monitoring/
├── screenshots/
├── docker-compose.yml
├── README.md
└── .github/workflows/
```

---

# 🚀 Core Components

## 👤 Employee Portal

* Search employee by Employee ID
* Responsive and modern UI
* Loading animation
* Toast notifications
* Clear search option
* Keyboard search support

### Preview

![Employee Portal](screenshots/01-employee_portal_dashboard-1.png)

---

## 👨‍💼 HR Dashboard

* Search employees
* Add new employee
* Update employee details
* Delete employee
* Live employee count
* Backend health indicator
* Responsive dashboard

### Preview

![HR Dashboard](screenshots/03-hr_portal_dashboard-1.png)

---
# ⚙️ Installation

## 📋 Prerequisites

Ensure the following software is installed before running the project.

* Git
* Docker
* Docker Compose
* Python 3.12+
* AWS CLI (Optional)

Verify installation:

```bash
git --version
docker --version
docker compose version
python3 --version
```

---

## 📥 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/employee-portal-devops.git

cd employee-portal-devops
```

---

## 🐳 Build Docker Images

```bash
docker compose build
```

---

## 🚀 Start All Services

```bash
docker compose up -d
```

Verify running containers

```bash
docker compose ps
```

---

## 📜 View Logs

```bash
docker compose logs -f backend
```

---

## 🛑 Stop Services

```bash
docker compose down
```

---

# 🌐 Local URLs

| Service         | URL                                |
| --------------- | ---------------------------------- |
| Employee Portal | http://localhost                   |
| HR Dashboard    | http://localhost/hr_dashboard.html |
| Backend         | http://localhost:5001              |
| Health          | http://localhost:5001/health       |
| Metrics         | http://localhost:5001/metrics      |
| Prometheus      | http://localhost:9090              |
| Grafana         | http://localhost:3000              |

---

# 📡 REST API

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/employee?id={id}` | Get employee by ID       |
| GET    | `/employees`        | Get all employees        |
| POST   | `/employee`         | Add new employee         |
| PUT    | `/employee/{id}`    | Update employee          |
| DELETE | `/employee/{id}`    | Delete employee          |
| GET    | `/health`           | Application health check |
| GET    | `/metrics`          | Prometheus metrics       |

---

## Example Request

### Get Employee

```http
GET /employee?id=101
```

### Add Employee

```json
{
    "id":106,
    "name":"John",
    "role":"DevOps Engineer",
    "salary":"₹1,20,000"
}
```

### Update Employee

```json
{
    "name":"John Doe",
    "role":"Senior DevOps Engineer",
    "salary":"₹1,50,000"
}
```

---

# 📊 Monitoring Stack

The project uses Prometheus and Grafana to monitor application health and infrastructure.

### Monitoring Components

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| Prometheus          | Metrics Collection         |
| Grafana             | Dashboards & Visualization |
| Alertmanager        | Alert Processing           |
| Node Exporter       | EC2 Metrics                |
| Redis Exporter      | Redis Metrics              |
| PostgreSQL Exporter | Database Metrics           |
| Telegram            | Alert Notifications        |

---

# 📈 Custom Metrics

The backend exposes several custom Prometheus metrics.

| Metric                            | Description                |
| --------------------------------- | -------------------------- |
| employee_requests_total           | Employee search requests   |
| employee_request_duration_seconds | API response time          |
| employee_created_total            | Employees created          |
| employee_updated_total            | Employees updated          |
| employee_deleted_total            | Employees deleted          |
| employee_cache_hits_total         | Redis cache hits           |
| employee_cache_miss_total         | Redis cache misses         |
| employee_list_requests_total      | Employee list requests     |
| employee_list_cache_hits_total    | Employee list cache hits   |
| employee_list_cache_miss_total    | Employee list cache misses |

---

# 📸 Project Screenshots

## 👤 Employee Portal

![Employee Portal](screenshots/01-employee_portal_dashboard-1.png)

![Employee Search](screenshots/02-employee_portal_dashboard-2.png)

---

## 👨‍💼 HR Dashboard

![HR Dashboard](screenshots/03-hr_portal_dashboard-1.png)

![Employee Management](screenshots/04-hr_portal_dashboard-2.png)

---

## 📊 Monitoring Dashboards

![Monitoring Dashboard](screenshots/05-system-monitoring-dashboard-1.png)

![Infrastructure Dashboard](screenshots/06-system-monitoring-dashboard-2.png)

![Grafana Overview](screenshots/08-grafana-overview-dashboard.png)

![Prometheus Targets](screenshots/12-prometheus-targets.png)

---

## 🚨 Alert Rules

| Alert           | Screenshot                                         |
| --------------- | -------------------------------------------------- |
| Backend Down    | ![](screenshots/07-alert-rule-backend-down.png)    |
| PostgreSQL Down | ![](screenshots/09-alert-rule-postgresql-down.png) |
| High Memory     | ![](screenshots/10-alert-rule-high-memory.png)     |
| Redis Down      | ![](screenshots/11-alert-rule-redis-down.png)      |
| High CPU        | ![](screenshots/17-alert-rule-high-cpu.png)        |

---

## 📱 Telegram Notifications

| Notification    | Screenshot                                             |
| --------------- | ------------------------------------------------------ |
| High CPU        | ![](screenshots/13-telegram-high-cpu-alert.png)        |
| High Memory     | ![](screenshots/14-telegram-high-memory-alert.png)     |
| PostgreSQL Down | ![](screenshots/15-telegram-postgresql-down-alert.png) |
| Redis Down      | ![](screenshots/16-telegram-redis-down-alert.png)      |

---
# 🚀 Deployment

The application is deployed using a modern DevOps workflow that combines containerization, cloud infrastructure, monitoring, and automation.

## ☁ AWS Infrastructure

| Service         | Purpose                                            |
| --------------- | -------------------------------------------------- |
| Amazon EC2      | Hosts the Flask backend and Docker containers      |
| Amazon S3       | Stores static frontend files                       |
| AWS CloudFront  | Delivers frontend globally and routes API requests |
| Security Groups | Controls inbound and outbound traffic              |

---

## 🐳 Docker Services

The project is fully containerized using **Docker Compose**.

| Container           | Purpose                   |
| ------------------- | ------------------------- |
| Backend             | Flask REST API (Gunicorn) |
| PostgreSQL          | Primary Database          |
| Redis               | Caching Layer             |
| Prometheus          | Metrics Collection        |
| Grafana             | Monitoring Dashboard      |
| Node Exporter       | EC2 Metrics               |
| Redis Exporter      | Redis Metrics             |
| PostgreSQL Exporter | Database Metrics          |

---

# 🔄 CI/CD Pipeline

The repository uses **GitHub Actions** for Continuous Integration and Continuous Deployment.

## Workflow

```text
Developer
     │
     ▼
Git Commit
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     ▼
Build Docker Images
     │
     ▼
Deploy to AWS EC2
     │
     ▼
Docker Compose Restart
     │
     ▼
Production Deployment
```

---

# 🧪 Verification Checklist

### Frontend

* ✅ Employee Search
* ✅ HR Dashboard
* ✅ Responsive UI
* ✅ Loading Animation
* ✅ Toast Notifications

### Backend

* ✅ Search Employee
* ✅ Get All Employees
* ✅ Add Employee
* ✅ Update Employee
* ✅ Delete Employee
* ✅ Redis Cache
* ✅ Health Endpoint
* ✅ Metrics Endpoint

### Monitoring

* ✅ Prometheus
* ✅ Grafana
* ✅ Alertmanager
* ✅ Telegram Alerts
* ✅ Redis Monitoring
* ✅ PostgreSQL Monitoring

### Infrastructure

* ✅ Docker Compose
* ✅ AWS EC2
* ✅ CloudFront
* ✅ GitHub Actions

---

# 🎯 Skills Demonstrated

This project demonstrates practical knowledge of:

## Backend

* Flask REST API
* SQLAlchemy ORM
* PostgreSQL
* Redis
* CRUD Operations
* API Design
* Health Checks

---

## Frontend

* HTML5
* CSS3
* JavaScript
* Responsive UI
* DOM Manipulation
* Async Fetch API

---

## DevOps

* Docker
* Docker Compose
* AWS EC2
* AWS CloudFront
* GitHub Actions
* CI/CD
* Linux
* Nginx (if applicable)

---

## Monitoring

* Prometheus
* Grafana
* Alertmanager
* Exporters
* Custom Metrics
* Telegram Integration

---

# 📚 What I Learned

During this project I gained hands-on experience in:

* Designing REST APIs
* Building containerized applications
* Database management with PostgreSQL
* Implementing Redis caching
* Writing Prometheus metrics
* Creating Grafana dashboards
* Configuring alert rules
* Sending Telegram alerts
* Deploying applications on AWS
* Setting up CI/CD pipelines with GitHub Actions
* Managing production-style infrastructure

---

# 🚀 Future Improvements

Planned enhancements include:

* JWT Authentication
* Role-Based Access Control (RBAC)
* Search by Name & Role
* Employee Profile Photos
* CSV / Excel Export
* Pagination
* Audit Logs
* Email Notifications
* Kubernetes Deployment
* Terraform Infrastructure
* HTTPS with Custom Domain
* Automated Backup Strategy

---

# 🏆 Project Highlights

* 🚀 Production-inspired Architecture
* 🐳 Dockerized Application
* ☁ AWS Deployment
* ⚡ Redis Caching
* 📊 Prometheus Monitoring
* 📈 Grafana Dashboards
* 📱 Telegram Alerting
* 🔄 GitHub Actions CI/CD
* 👨‍💼 Modern HR Dashboard
* 👤 Responsive Employee Portal
* 📡 RESTful API
* 💾 PostgreSQL Database
* ❤️ Health Monitoring
* 📈 Custom Prometheus Metrics

---

# 👨‍💻 Author

**Sachin Choudhary**

B.Tech – Computer Science Engineering (Artificial Intelligence)

**Interests**

* DevOps
* Cloud Computing
* Backend Development
* Python
* AWS
* Docker
* Monitoring & Observability

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

If you have ideas for improving this project, feel free to open an Issue or submit a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you found this project useful:

* ⭐ Star this repository
* 🍴 Fork the repository
* 🐛 Report issues
* 💡 Suggest improvements

Your support is appreciated!

---

<p align="center">

## 🎉 Thank You for Visiting!

If you enjoyed this project, don't forget to leave a ⭐ on GitHub.

</p>
