#!/usr/bin/env bash
# exit on error
set -o errexit

# Print current directory logic for debugging
echo "Build script started"
echo "Current directory: $(pwd)"

# Ensure we are in the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"
echo "Changed to script directory: $(pwd)"

# Install dependencies
if [ -f "requirements.txt" ]; then
    echo "Installing requirements..."
    pip install -r requirements.txt
else
    echo "Error: requirements.txt not found in $(pwd)"
    exit 1
fi

# Run Django commands
echo "Collecting statics..."
python manage.py collectstatic --no-input

echo "Running make migrations..."
python manage.py makemigrations

echo "Running migrations..."
python manage.py migrate

echo "Build script completed successfully"