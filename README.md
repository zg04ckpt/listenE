# ListenE - TOEIC Listening Practice Website

A web application designed to help users practice TOEIC listening skills through various exercises:
- Basic practice with individual sentences from dialogues.
- Practice with multiple-choice questions simulating TOEIC Parts 1, 2, 3, and 4.

## Technology Stack
- **Frontend**: React 18, TypeScript
- **Backend**: .NET 6, ASP.NET Core, Entity Framework Core, Cloudinary, Redis
- **Database**: MySQL
- **DevOps**: Docker, Vercel
- **Tools**: Git, Vite, Visual Studio Code, Visual Studio 2022

## Prerequisites
- **.NET 6 SDK**: [Download](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- **Node.js 18+**: [Download](https://nodejs.org/)
- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop/)
- **MySQL**: Ensure a running MySQL instance or use Docker for setup.
- **Accounts**: Cloudinary account, email service credentials, and Google OAuth credentials.

## API Setup
1. Install **.NET 6 SDK** and **Docker Desktop** for your operating system.
2. Create a `docker-compose.yaml` file in the project root.
3. Copy the contents of `docker-compose.example.yaml` into `docker-compose.yaml`.
4. Update the following parameters in `docker-compose.yaml`:
   - **General**: `[api_run_port]` (e.g., `5000`)
   - **MySQL Connection**: `[db_port]`, `[db_name]`, `[db_username]`, `[db_password]`
   - **Admin Account**: `[admin_email]`, `[admin_password]`
   - **Cloudinary**: `[cloudinary_name]`, `[cloudinary_key]`, `[cloudinary_secret]`
   - **Email Service**: `[mailbot_email]`, `[mailbot_password]`
   - **Google OAuth**: `[google_client_id]`, `[google_client_secret]`
5. Run the API (root folder):

   ```bash
   docker-compose -f docker-compose.yaml up -d

- Now, the API will be available at http://localhost:[api_run_port]/api/v1

## Web Setup
1. Install **Node.js** (version 18 or higher).
2. Navigate to the project root and install dependencies:

   ```bash
   npm install

3. Create a .env file in the project root with the following:

    ```env
    VITE_HOST_API=http://localhost:[api_run_port]/api/v1

4. Start the development server:

    ```bash
    npm run dev

- The website will be accessible at http://localhost:5173.


