FROM python:3.8-buster

WORKDIR /notify

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./src/utils ./utils
COPY ./src/notify.py .

ENTRYPOINT ["python", "notify.py"]
