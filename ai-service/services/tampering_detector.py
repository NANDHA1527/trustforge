"""
TrustForge Document Forensic & Tampering Detection Service
Error Level Analysis (ELA) and Glyph Consistency Scanner
SIH26188: AI-Based Fake Identity & Document Screening System
"""

def detect_tampering(scenario_type: str = "GENUINE"):
    scenarios = {
        "TAMPERED": {
            "tamperingScore": 91.4,
            "manipulationProbability": 92.8,
            "status": "SUSPICIOUS_MODIFICATION_DETECTED",
            "confidence": 96.0,
            "elaScore": 88.5,
            "detectedRegions": [
                {
                    "region": "Expiry Date Field (Altered 2024 -> 2029)",
                    "severity": "HIGH",
                    "box": { "x": 52, "y": 58, "width": 32, "height": 12 },
                    "description": "Severe high-frequency noise mismatch in font boundary pixels. Digital typeface replacement detected."
                },
                {
                    "region": "National Security Holographic Seal",
                    "severity": "HIGH",
                    "box": { "x": 68, "y": 22, "width": 24, "height": 26 },
                    "description": "Overlay artifact detected via Error Level Analysis. Missing micro-emboss diffraction lines."
                }
            ],
            "isSimulated": True
        },
        "FACE_MISMATCH": {
            "tamperingScore": 5.1,
            "manipulationProbability": 4.2,
            "status": "GENUINE",
            "confidence": 97.0,
            "elaScore": 3.2,
            "detectedRegions": [],
            "isSimulated": True
        },
        "REVIEW_REQUIRED": {
            "tamperingScore": 42.0,
            "manipulationProbability": 41.5,
            "status": "REVIEW_REQUIRED",
            "confidence": 88.0,
            "elaScore": 39.4,
            "detectedRegions": [
                {
                    "region": "Document Surface Glare & Scratches",
                    "severity": "MEDIUM",
                    "box": { "x": 15, "y": 20, "width": 70, "height": 60 },
                    "description": "Low-contrast illumination and micro-abrasions causing ambiguous edge gradients."
                }
            ],
            "isSimulated": True
        },
        "GENUINE": {
            "tamperingScore": 3.2,
            "manipulationProbability": 2.8,
            "status": "GENUINE",
            "confidence": 98.5,
            "elaScore": 2.9,
            "detectedRegions": [],
            "isSimulated": True
        }
    }
    return scenarios.get(scenario_type.upper(), scenarios["GENUINE"])
