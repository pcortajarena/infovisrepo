#!/bin/bash

while !</dev/tcp/db/5432; do sleep 1; done;

echo "Make migrations"
python manage.py makemigrations api

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000