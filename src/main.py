from fastapi import FastAPI
from src.api.routes import router
from src.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
