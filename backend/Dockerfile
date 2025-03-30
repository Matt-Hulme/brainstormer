# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container at /code
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code into the container at /code/app
COPY ./app /code/app

# Expose port 8000 for the FastAPI app (as defined in .env)
EXPOSE 8000

# Run the command to start uvicorn server
# Assumes your main FastAPI app instance is named 'app' in 'main.py' inside the 'app' directory
# Adjust the command if your file/instance name is different
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 