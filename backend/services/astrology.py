# Mock astrology service due to missing pyswisseph (requires C++ build tools)
from models.schemas import KundliResponse, PlanetPosition

def generate_mock_kundli(dob: str, time: str, lat: float, lon: float) -> KundliResponse:
    # Mock data for demonstration purposes
    return KundliResponse(
        ascendant=15.5,
        lagna_rashi="Aries",
        houses=[15.5, 45.5, 75.5, 105.5, 135.5, 165.5, 195.5, 225.5, 255.5, 285.5, 315.5, 345.5],
        planets=[
            PlanetPosition(name="Sun", degree=10.0, rashi="Libra", house=7, retrograde=False, nakshatra="Swati", pada=1),
            PlanetPosition(name="Moon", degree=20.0, rashi="Cancer", house=4, retrograde=False, nakshatra="Ashlesha", pada=2),
            PlanetPosition(name="Mars", degree=5.0, rashi="Aries", house=1, retrograde=False, nakshatra="Ashwini", pada=3),
            PlanetPosition(name="Mercury", degree=12.0, rashi="Virgo", house=6, retrograde=False, nakshatra="Hasta", pada=4),
            PlanetPosition(name="Jupiter", degree=18.0, rashi="Sagittarius", house=9, retrograde=False, nakshatra="Mula", pada=1),
            PlanetPosition(name="Venus", degree=25.0, rashi="Taurus", house=2, retrograde=False, nakshatra="Rohini", pada=2),
            PlanetPosition(name="Saturn", degree=8.0, rashi="Capricorn", house=10, retrograde=True, nakshatra="Uttarashada", pada=3),
            PlanetPosition(name="Rahu", degree=14.0, rashi="Gemini", house=3, retrograde=True, nakshatra="Ardra", pada=4),
            PlanetPosition(name="Ketu", degree=14.0, rashi="Sagittarius", house=9, retrograde=True, nakshatra="Purvashada", pada=1)
        ]
    )
