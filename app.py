from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from database import init_db
from datetime import datetime
from flask import Response
import sqlite3
import os 

load_dotenv()

from services.openai_service import generate_insights

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():

    horizon = "30 Days"

    if request.method == "POST":

        horizon = request.form.get(
            "horizon"
        )

        uploaded_file = request.files.get(
            "file"
        )

        if uploaded_file and uploaded_file.filename != "":

            uploaded_file.save(
                os.path.join(
                    UPLOAD_FOLDER,
                    uploaded_file.filename
                )
            )

    if horizon == "30 Days":
        revenue_data = [1000000, 1100000, 1200000]
        labels = ["Week 1", "Week 2", "Week 3"]

    elif horizon == "60 Days":
        revenue_data = [1000000, 1200000, 1350000]
        labels = ["Month 1", "Month 2", "Month 3"]

    else:
        revenue_data = [1000000, 1300000, 1500000]
        labels = ["Month 1", "Month 2", "Month 3"]

    conn = sqlite3.connect(
        "forecasts.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            revenue,
            roas,
            created_at
        FROM forecasts
        ORDER BY id DESC
        LIMIT 5
        """
    )

    history = cursor.fetchall()

    conn.close()

    return render_template(
        "dashboard.html",
        horizon=horizon,
        revenue_data=revenue_data,
        labels=labels,
        history=history
    )

@app.route("/simulate", methods=["POST"])
def simulate():

    data = request.get_json()

    google = int(data["google"])
    meta = int(data["meta"])
    microsoft = int(data["microsoft"])

    total_budget = (
        google +
        meta +
        microsoft
    )

    google_percent = round(
        google / total_budget * 100,
        1
    )

    meta_percent = round(
        meta / total_budget * 100,
        1
    )

    microsoft_percent = round(
        microsoft / total_budget * 100,
        1
    )

    revenue = total_budget * 12

    roas = round(
        revenue / total_budget,
        2
    )

    conn = sqlite3.connect(
       "forecasts.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO forecasts
        (
            revenue,
            roas
        )
        VALUES (?, ?)
        """,
        (
            revenue,
            roas
        )
    )

    conn.commit()
    conn.close()

    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    insights = generate_insights(
        revenue,
        roas,
        google,
        meta,
        microsoft
    )

    return jsonify({
        "revenue": revenue,
        "roas": roas,

        "google_percent": google_percent,
        "meta_percent": meta_percent,
        "microsoft_percent": microsoft_percent,

        "revenue_low": int(revenue * 0.9),
        "revenue_high": int(revenue * 1.1),

        "roas_low": round(roas * 0.9, 2),
        "roas_high": round(roas * 1.1, 2),

       "insights": insights,
       "timestamp": current_time
    })

@app.route("/export-report")
def export_report():

    conn = sqlite3.connect("forecasts.db")

    cursor = conn.cursor()

    cursor.execute("""
        SELECT revenue, roas, created_at
        FROM forecasts
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    csv_data = "Revenue,ROAS,Date\n"

    for row in rows:

        csv_data += f"{row[0]},{row[1]},{row[2]}\n"

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=forecast_report.csv"
        }
    )

init_db()

if __name__ == "__main__":
    app.run(debug=True)