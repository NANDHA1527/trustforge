"""
TrustForge OCR & Machine-Readable Zone (MRZ) Extraction Engine
SIH26188: AI-Based Fake Identity & Document Screening System
"""

def extract_ocr_data(document_type: str = "Passport", scenario_type: str = "GENUINE"):
    scenarios = {
        "TAMPERED": {
            "name": "VIKTOR ALEXANDER PETROV",
            "dateOfBirth": "14/06/1984",
            "documentNumber": "P8921004",
            "nationality": "CAN",
            "issueDate": "01/02/2019",
            "expiryDate": "01/02/2029",
            "confidence": 95.4,
            "status": "FLAGGED",
            "mrzRaw": "P<CANPETROV<<VIKTOR<ALEXANDER<<<<<<<<<<<<<<\nP8921004<1CAN8406143M2902011<<<<<<<<<<<<<<02",
            "isSimulated": True
        },
        "FACE_MISMATCH": {
            "name": "ALEXANDER JAMES WRIGHT",
            "dateOfBirth": "28/03/1991",
            "documentNumber": "G5582910",
            "nationality": "GBR",
            "issueDate": "10/05/2020",
            "expiryDate": "09/05/2030",
            "confidence": 98.6,
            "status": "PASS",
            "mrzRaw": "P<GBRWRIGHT<<ALEXANDER<JAMES<<<<<<<<<<<<<<<\nG5582910<4GBR9103287M3005094<<<<<<<<<<<<<<04",
            "isSimulated": True
        },
        "REVIEW_REQUIRED": {
            "name": "MEI-LING CHEN",
            "dateOfBirth": "17/10/1989",
            "documentNumber": "C7741029",
            "nationality": "SGP",
            "issueDate": "14/11/2021",
            "expiryDate": "13/11/2031",
            "confidence": 71.3,
            "status": "FLAGGED",
            "mrzRaw": "P<SGPCHEN<<MEI<LING<<<<<<<<<<<<<<<<<<<<<<<\nC7741029<9SGP8910174F3111138<<<<<<<<<<<<<<08",
            "isSimulated": True
        },
        "GENUINE": {
            "name": "AARAV DEV SHARMA",
            "dateOfBirth": "14/08/1992",
            "documentNumber": "Z8942104",
            "nationality": "IND",
            "issueDate": "10/01/2021",
            "expiryDate": "09/01/2031",
            "confidence": 99.2,
            "status": "PASS",
            "mrzRaw": "P<INDAAARAV<DEV<SHARMA<<<<<<<<<<<<<<<<<<<<<\nZ8942104<4IND9208148M3101095<<<<<<<<<<<<<<06",
            "isSimulated": True
        }
    }
    return scenarios.get(scenario_type.upper(), scenarios["GENUINE"])
