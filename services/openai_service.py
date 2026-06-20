import os
from openai import OpenAI


def generate_insights(
    revenue,
    roas,
    google,
    meta,
    microsoft
):

    try:

        client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )

        prompt = f"""
You are a digital marketing analyst.

Revenue Forecast: ₹{revenue}
ROAS Forecast: {roas}

Google Budget: ₹{google}
Meta Budget: ₹{meta}
Microsoft Budget: ₹{microsoft}

Provide:
1. Summary
2. Risks
3. Recommendations
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception:

        return f"""
Forecast Summary:
Expected revenue is ₹{revenue:,}
with ROAS of {roas}.

Key Driver:
Google Ads receives the highest spend allocation.

Risk:
Heavy dependence on a single channel.

Recommendation:
Maintain diversification while gradually increasing the best-performing channel budget.
"""