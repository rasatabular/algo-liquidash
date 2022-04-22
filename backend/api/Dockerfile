FROM python:3.8-buster

WORKDIR /api

COPY ../requirements.txt .
RUN pip install -r requirements.txt

COPY ../utils ./utils
COPY ../main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
