from dotenv import load_dotenv

load_dotenv()

from services.openai_service import generate_insights

result = generate_insights(
    revenue=2100000,
    roas=12,
    google=100000,
    meta=50000,
    microsoft=25000
)

print(result)
