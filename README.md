# ReviewHub Backend

ReviewHub is an application designed to help consumers make informed purchasing decisions by providing easy access to product reviews. The backend of this project is built using Node.js and Express, and it serves as the server-side component of the ReviewHub application.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the ReviewHub backend, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/destinydinam/reviewhubserver.git
   ```

2. Navigate to the project directory:

   ```bash
   cd reviewhubserver
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

The backend should now be running locally. Ensure that it's running on the expected port and that the frontend is configured to communicate with it.

## Features

- **API Endpoints**: The backend provides API endpoints for the ReviewHub frontend to interact with.

## API Endpoints

The ReviewHub backend exposes the following API endpoints:

- `GET /v1/api/amazon?keyword=`: Add the keyword of the product you want reviews for.

## Contributing

We welcome contributions to the ReviewHub project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
