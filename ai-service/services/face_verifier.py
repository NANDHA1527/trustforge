"""
TrustForge Facial Biometric Verification Service
SIH26188: AI-Based Fake Identity & Document Screening System
"""

def verify_face(scenario_type: str = "GENUINE"):
    scenarios = {
        "TAMPERED": {
            "similarityScore": 94.2,
            "confidence": 96.5,
            "status": "MATCHED",
            "documentPhotoUrl": "/assets/demo/face_doc_tampered.jpg",
            "liveCaptureUrl": "/assets/demo/face_live_tampered.jpg",
            "isSimulated": True
        },
        "FACE_MISMATCH": {
            "similarityScore": 41.2,
            "confidence": 97.2,
            "status": "MISMATCH",
            "documentPhotoUrl": "/assets/demo/face_doc_mismatch.jpg",
            "liveCaptureUrl": "/assets/demo/face_live_mismatch.jpg",
            "isSimulated": True
        },
        "REVIEW_REQUIRED": {
            "similarityScore": 86.1,
            "confidence": 89.4,
            "status": "MATCHED",
            "documentPhotoUrl": "/assets/demo/face_doc_review.jpg",
            "liveCaptureUrl": "/assets/demo/face_live_review.jpg",
            "isSimulated": True
        },
        "GENUINE": {
            "similarityScore": 97.8,
            "confidence": 99.4,
            "status": "MATCHED",
            "documentPhotoUrl": "/assets/demo/face_doc_genuine.jpg",
            "liveCaptureUrl": "/assets/demo/face_live_genuine.jpg",
            "isSimulated": True
        }
    }
    return scenarios.get(scenario_type.upper(), scenarios["GENUINE"])
