FROM python:3.8-buster

WORKDIR /fetcher

COPY ../requirements.txt .
RUN pip install -r requirements.txt

COPY ../utils ./utils
COPY ../fetcher.py .

ENTRYPOINT ["python", "fetcher.py"]
