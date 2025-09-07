# Setup Python environment and install dependencies
$ErrorActionPreference = "Stop"

# Create and activate virtual environment
python -m venv .venv
. \.venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install wheel first to avoid build issues
pip install wheel

# Install psycopg2-binary with a specific version that works on Windows
pip install psycopg2-binary==2.9.6

# Install other requirements
pip install -r backend\requirements.txt

Write-Host "Environment setup completed successfully!" -ForegroundColor Green
