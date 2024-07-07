# Hotel Booking Chatbot

This is a hotel booking chatbot application built with a backend and a frontend component. The chatbot leverages OpenAI's API to interact with users and handle hotel booking inquiries.

## Table of Contents
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [API Key Setup](#api-key-setup)
- [Testing](#testing)

## Installation

1. **Clone the repository**
    ```sh
    git clone https://github.com/Rudrakc/hotel-booking-chatbot.git
    cd hotel-booking-chatbot
    ```

2. **Backend Setup**
    Features

    - Handles hotel booking queries using OpenAI's API.
    - Provides endpoints for chat interactions.
    - Stores conversation history in an SQLite database.
    - Supports CORS.

     Prerequisites

    - Node.js (version 14.x or later)
    - npm (version 6.x or later)
    - SQLite3


    Install the dependencies:
        ```sh
        npm install
        ```

3. **Frontend Setup**
    ```sh
    cd ../frontend
    npm install
    ```

## Setup

### Backend Configuration

1. Create a `.env` file in the root directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

### Frontend Configuration

1. **Configure API endpoint**
    Update the API endpoint in the frontend configuration file if needed.

## Usage

### Running the Backend Server

1. **Start the server**:
    ```sh
    npm start
    ```

2. The server will run on `http://localhost:3000` by default.

### Running the Frontend Server

1. **Start the frontend server**
    ```sh
    cd frontend
    npm start
    ```

The application should now be running, and you can interact with the chatbot through the frontend interface.

## API Key Setup

To set up the OpenAI API key:

1. Go to [OpenAI](https://beta.openai.com/signup/) and sign up for an API key.
2. After obtaining your API key, add it to the `.env` file in the `backend` directory as shown in the setup section.

## Testing

To test the chatbot API, you can use tools like `curl` or Postman to send requests.

### Example API Request

```sh
curl -X POST http://localhost:5000/chat \
     -H "Content-Type: application/json" \
     -d '{
           "message": "I want to book a hotel room for tomorrow"
            "userId": "user123"
         }'
```


### Example API Request

```json
{
  "response": "Sure, I can help with that. Can you please provide more details about your booking such as the location and type of room?"
}
```
