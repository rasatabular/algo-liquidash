FROM python:3.8-buster

WORKDIR /api

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./src/utils ./utils
COPY ./src/auth.py .
COPY ./src/api.py .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]
