from typing import Any, Dict, Optional
from fastapi.responses import JSONResponse
from fastapi import status

def success_response(data: Any = None, message: str = "Success", status_code: int = status.HTTP_200_OK) -> JSONResponse:
    content = {
        "status": "success",
        "message": message,
        "data": data,
        "error": None
    }
    return JSONResponse(status_code=status_code, content=content)

def error_response(message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, details: Optional[Dict] = None) -> JSONResponse:
    content = {
        "status": "error",
        "message": message,
        "data": None,
        "error": {
            "code": status_code,
            "details": details
        }
    }
    return JSONResponse(
        status_code=status_code, 
        content=content,
        headers={"Access-Control-Allow-Origin": "*"}
    )
