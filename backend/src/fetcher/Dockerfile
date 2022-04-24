FROM python:3.8-buster

WORKDIR /fetcher

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./src/utils ./utils
COPY ./src/fetcher.py .

ENTRYPOINT ["python", "fetcher.py"]
