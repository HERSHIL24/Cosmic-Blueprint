FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies for postgres/celery
RUN apt-get update || (sed -i 's/http:/https:/g' /etc/apt/sources.list.d/debian.sources && apt-get update) \
    && apt-get install -y gcc libpq-dev netcat-openbsd \
    && apt-get clean

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/
