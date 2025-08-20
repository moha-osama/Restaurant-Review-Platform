from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

class Review(BaseModel):
  text: str

@app.get('/')
def hello_world():
    return {"message": "Hello, World!"}

@app.post('/analyze')
def analyze_sentiment(review: Review):
    result = sentiment_pipeline(review.text)
    return {"label": result[0]["label"], "score": result[0]["score"]}