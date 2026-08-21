import os
import requests

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")


def _get(path: str, token: str):
    response = requests.get(
        f"{BACKEND_URL}{path}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def get_dashboard_summary(token: str):
    return _get("/api/reports/dashboard", token)


def get_expense_report(token: str):
    return _get("/api/reports", token)


def get_budgets(token: str):
    return _get("/api/budgets", token)


def get_expenses(token: str):
    return _get("/api/expenses", token)


def get_events(token: str):
    return _get("/api/events", token)