# MiniCommerce

MiniCommerce is a full-stack e-commerce application built with a modern technology stack. It features a React-based frontend, a Node.js (Express) backend, and infrastructure managed by Terraform. The application provides essential e-commerce functionalities including product listings, a shopping cart, user libraries, and an admin dashboard for managing products.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Axios
- **Backend:** Node.js, Express.js, Firebase Admin (for authentication)
- **Database:** AWS DynamoDB
- **Infrastructure:** Terraform, Docker
- **Deployment:** Docker

## Features

- **User Features:**
  - Browse and search for products.
  - View detailed product pages.
  - Add products to a shopping cart.
  - "Purchase" items and add them to a personal library.
  - User authentication.
- **Admin Features:**
  - Add, edit, and delete products.
  - View all products in an admin-specific list.

## Project Structure

The repository is organized into three main directories:

- `frontend/`: Contains the React/TypeScript frontend application.
- `backend/`: Contains the Node.js/Express backend API.
- `infra/`: Contains the Terraform scripts for provisioning AWS infrastructure.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Terraform
- AWS CLI (configured with credentials)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    PORT=5000
    DYNAMODB_ENDPOINT=http://localhost:8000
    AWS_REGION=localhost
    ```
4.  **Set up Firebase:**
    - Place your Firebase service account key in `backend/secrets/serviceAccountKey.json`.
    - To assign an admin role to a user, run the following script with the user's UID:
      ```bash
      node scripts/setAdminRole.js <USER_UID>
      ```
5.  **Run the application:**
    The backend is containerized using Docker. To start the backend service and the DynamoDB local instance, run:
    ```bash
    docker-compose up
    ```
    This will also create the necessary DynamoDB table and seed it with initial product data.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `frontend` directory and add the following, pointing to your backend API:
    ```
    VITE_API_BASE_URL=http://localhost:5000
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Infrastructure

The `infra/` directory contains Terraform scripts to provision the necessary AWS infrastructure for a production-like environment, including VPC, subnets, and security groups.

1.  **Navigate to the infrastructure directory:**
    ```bash
    cd infra
    ```
2.  **Initialize Terraform:**
    ```bash
    terraform init
    ```
3.  **Apply the configuration:**
    ```bash
    terraform apply
    ```

## API Endpoints

The backend exposes the following RESTful API endpoints:

- `GET /api/products`: Get all products.
- `GET /api/products/:productId`: Get a single product by its ID.
- `POST /api/products`: Create a new product (admin).
- `PUT /api/products/:productId`: Update a product (admin).
- `DELETE /api/products/:productId`: Delete a product (admin).
- `GET /api/cart/:user_id`: Get a user's cart items.
- `POST /api/cart/:user_id`: Add an item to a user's cart.
- `DELETE /api/cart/:user_id/:productId`: Remove an item from a user's cart.
- `DELETE /api/cart/:user_id`: Clear a user's cart.
- `GET /api/library/:user_id`: Get a user's library of purchased items.
- `POST /api/orders/:user_id`: Create a new order.
