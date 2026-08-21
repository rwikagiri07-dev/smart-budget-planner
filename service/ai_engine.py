import os
import google.generativeai as genai
from data_client import (
    get_dashboard_summary,
    get_expense_report,
    get_budgets,
    get_expenses,
    get_events,
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-3.5-flash"

TOOL_FUNCTIONS = {
    "get_dashboard_summary": get_dashboard_summary,
    "get_expense_report": get_expense_report,
    "get_budgets": get_budgets,
    "get_expenses": get_expenses,
    "get_events": get_events,
}

TOOLS = [
    {
        "function_declarations": [
            {
                "name": "get_dashboard_summary",
                "description": "Overall stats: total budget, total expenses, remaining budget, upcoming event count.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_expense_report",
                "description": "Full report: totals, expenses grouped by category, expenses grouped by month.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_budgets",
                "description": "All budgets: name, category, amount, spentAmount, status, startDate, endDate.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_expenses",
                "description": "All individual expenses: title, category, amount, date, notes.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_events",
                "description": "All events: title, date, budget, spentAmount, status, description.",
                "parameters": {"type": "object", "properties": {}},
            },
        ]
    }
]

# SYSTEM_INSTRUCTION = (
#     "You are 'Ask AI' inside the Smart Budget Planner app. Answer using ONLY "
#     "data you retrieve via tools — never invent numbers. Call whichever tools "
#     "you need to answer accurately, including multiple tools if needed. Keep "
#     "answers short and clear. If data is missing, say so honestly."
# )


# SYSTEM_INSTRUCTION = (
#     "You are 'Chat' inside the Smart Budget Planner app, shown in a small "
#     "floating chat widget. Answer using ONLY data you retrieve via tools — "
#     "never invent numbers.\n\n"
#     "STRICT STYLE RULES:\n"
#     "- Plain conversational text only. NO markdown: no #, ##, ###, no ** bold, "
#     "no bullet points, no tables.\n"
#     "- Keep it short: 1-3 sentences for simple questions, max ~5 short lines "
#     "for anything involving multiple numbers.\n"
#     "- Write numbers plainly, e.g. 'You've spent $500 of your $50,000 budget "
#     "(Food), leaving $49,500.'\n"
#     "- Only mention categories/details that are directly relevant to the "
#     "question — don't dump the full report unless asked for a summary.\n"
#     "- Sound like a helpful person texting a quick answer, not a generated "
#     "report."
# )


SYSTEM_INSTRUCTION = (
    "You are 'Chat' inside the Smart Budget Planner app, shown in a small "
    "floating chat widget. Answer using ONLY data you retrieve via tools — "
    "never invent numbers.\n\n"
    "STRICT STYLE RULES:\n"
    "- Plain conversational text only. NO markdown: no #, ##, ###, no ** bold, "
    "no bullet points, no tables.\n"
    "- Keep it short: 1-3 sentences for simple questions, max ~5 short lines "
    "for anything involving multiple numbers.\n"
    "- ALL amounts are in Indian Rupees. Always format them with the ₹ symbol "
    "and Indian digit grouping, e.g. ₹50,000 or ₹1,25,000 — never use $.\n"
    "- Only mention categories/details that are directly relevant to the "
    "question — don't dump the full report unless asked for a summary.\n"
    "- Sound like a helpful person texting a quick answer, not a generated "
    "report."
)


def ask_ai(question: str, token: str) -> str:
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        tools=TOOLS,
        system_instruction=SYSTEM_INSTRUCTION,
    )

    chat = model.start_chat()
    response = chat.send_message(question)

    for _ in range(5):  # cap tool-call rounds to avoid infinite loops
        calls = _extract_function_calls(response)
        if not calls:
            break

        parts = []
        for call in calls:
            func = TOOL_FUNCTIONS.get(call["name"])
            try:
                result = func(token) if func else {"error": "Unknown tool"}
            except Exception as exc:
                result = {"error": str(exc)}

            parts.append(
                genai.protos.Part(
                    function_response=genai.protos.FunctionResponse(
                        name=call["name"], response={"result": result}
                    )
                )
            )

        response = chat.send_message(genai.protos.Content(parts=parts))

    return _extract_text(response)


def _extract_function_calls(response):
    calls = []
    try:
        for part in response.candidates[0].content.parts:
            if part.function_call and part.function_call.name:
                calls.append({"name": part.function_call.name})
    except (IndexError, AttributeError):
        pass
    return calls


def _extract_text(response):
    try:
        return response.text
    except Exception:
        return "Sorry, I couldn't generate an answer right now."
