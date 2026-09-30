# ForecastIQ-AI

**AI-powered marketing forecasting and budget simulation.**

ForecastIQ-AI helps marketers and analysts answer one question: *"If I split my ad budget this way, what should I expect back?"* Enter spend across Google, Meta and Microsoft, and get projected revenue, ROAS, confidence ranges and plain-English AI recommendations in seconds.

---

## Features

- **Budget simulator**: allocate spend across Google Ads, Meta Ads and Microsoft Ads and instantly see each channel's share of the total budget.
- **Revenue and ROAS forecast**: projected revenue and return on ad spend, with low/high ranges (±10%) around each estimate.
- **AI-generated insights**: an OpenAI-powered service turns the numbers into readable recommendations.
- **Forecast dashboard**: revenue trend charts for 30, 60 and 90-day horizons.
- **Data upload**: upload a dataset from the dashboard for use in forecasting.
- **Forecast history**: every simulation is saved to SQLite, and the dashboard shows the five most recent runs.
- **CSV export**: download your full forecast history as `forecast_report.csv` with one click.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| AI | OpenAI API |
| Database | SQLite |
| Frontend | Jinja2 templates, HTML/CSS/JS (`templates/`, `static/`) |
| Data / ML libraries | pandas, NumPy, scikit-learn, SciPy |
| Deployment | Gunicorn |

## Project Structure

```
ForecastIQ-AI/
├── app.py            # Flask app and routes
├── database.py       # SQLite setup (forecasts table)
├── config.py         # App configuration
├── services/         # OpenAI insight generation
├── templates/        # HTML templates (landing page, dashboard)
├── static/           # CSS, JS and uploaded files
├── requirements.txt
├── run.sh
└── test_openai.py    # Quick check that your OpenAI setup works
```

## Getting Started

### Prerequisites
- Python 3.10+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
git clone https://github.com/Mayur-N-D/ForecastIQ-AI.git
cd ForecastIQ-AI

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_api_key_here
```

Optionally confirm your key works:

```bash
python test_openai.py
```

### Run

```bash
python app.py
```

Open **http://127.0.0.1:5000** in your browser.

For production, use Gunicorn:

```bash
gunicorn app:app
```

## Usage

1. Open the **Dashboard** and choose a forecast horizon (30, 60 or 90 days).
2. Optionally upload a data file.
3. Enter your budget for Google, Meta and Microsoft in the simulator.
4. Review the projected revenue, ROAS, budget split and AI insights.
5. Click **Export** to download your forecast history as CSV.

## API

### `POST /simulate`

**Request**
```json
{ "google": 50000, "meta": 30000, "microsoft": 20000 }
```

**Response**
```json
{
  "revenue": 1200000,
  "roas": 12.0,
  "google_percent": 50.0,
  "meta_percent": 30.0,
  "microsoft_percent": 20.0,
  "revenue_low": 1080000,
  "revenue_high": 1320000,
  "roas_low": 10.8,
  "roas_high": 13.2,
  "insights": "...",
  "timestamp": "2026-09-30 12:00:00"
}
```

### `GET /export-report`
Returns all saved forecasts as a CSV download.

## Roadmap

- Replace the baseline estimate with trained models (scikit-learn) using each channel's historical performance
- Parse and use uploaded datasets directly in forecasts
- Per-channel ROAS and diminishing-returns modelling
- More ad platforms (LinkedIn, TikTok, Amazon)
- User accounts and saved scenarios
- Dockerfile and one-click deployment

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss major changes.

## Author

Built by [Mayur N D](https://github.com/Mayur-N-D).
