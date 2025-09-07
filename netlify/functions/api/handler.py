"""
Netlify Function to handle FastAPI requests.
This is a serverless function that acts as an adapter between Netlify and FastAPI.
"""
import os
import sys
import json
from mangum import Mangum
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Import the FastAPI app
from app.main import app as fastapi_app

# Add CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a Mangum handler for the FastAPI app
handler = Mangum(fastapi_app, api_gateway_base_path="/api")

def lambda_handler(event, context):
    """AWS Lambda handler function for Netlify Functions."""
    # Set the root path for API requests
    if 'path' in event and event['path'].startswith('/.netlify/functions/api'):
        event['path'] = event['path'].replace('/.netlify/functions/api', '', 1)
    
    # Handle the request
    response = handler(event, context)
    
    # Handle binary responses (like file downloads)
    if response and 'isBase64Encoded' in response and response['isBase64Encoded']:
        return response
    
    # Ensure CORS headers are set
    headers = response.get('headers', {})
    headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    })
    
    return {
        'statusCode': response['statusCode'],
        'headers': headers,
        'body': response['body'],
        'isBase64Encoded': False
    }

# Local development server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8000)
