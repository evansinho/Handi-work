# Handi-work

## Table of Contents

- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Technologies

- **Backend**:
  - **Node.js** - JavaScript runtime for building server-side applications.
  - **Express** - Web framework for building RESTful APIs.
  - **TypeScript** - Superset of JavaScript that compiles to plain JavaScript, adding static types.
  - **Prisma** - ORM for Node.js and TypeScript that simplifies database access.
  - **PostgreSQL** - Relational database management system.

- **Frontend**:
  - **React** - JavaScript library for building user interfaces.

- **Containerization**:
  - **Docker** - Platform for developing, shipping, and running applications in containers.
  - **Docker Compose** - Tool for defining and running multi-container Docker applications.


## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

> **Note**: Docker Desktop comes with Docker Compose included. 

## Getting Started

To get started with this application, follow these steps:

1. **Clone the Repository:**

Open your terminal and run the following command to clone the repository:

```
git https://github.com/evansinho/Handi-work.git
cd handi-work
```

2. **Environment Configuration:**
Create a .env file in the backend directory and add your database connection string. For example:

```DATABASE_URL=postgres://user:password@db:5432/mydb```

You can customize the username, password, and database name as needed.

3. **Build and Start the Application:**

In the root directory of your project, run the following command to build the Docker containers and start the application:

```docker-compose up --build```

The backend API will be available at http://localhost:5000.
The frontend React application will be available at http://localhost:3000.

4. **Accessing the Application:**

Open your web browser and navigate to ```http://localhost:3000``` to view the React frontend.
Use tools like Postman or cURL to interact with the API at ```http://localhost:8000.```

5. **Stopping the Application:**

To stop the application and remove the containers, run:

```docker-compose down```

## Running Prisma Generate Manually
If you make changes to your Prisma schema and need to regenerate the Prisma client, you can do so with the following command:

```docker-compose run backend npx prisma generate```

## Endpoints
- GET / - Returns a greeting message from the Express server.
- Add additional API endpoints here as your application grows.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
