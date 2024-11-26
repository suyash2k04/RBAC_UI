# RBAC Dashboard

This is a Role-Based Access Control (RBAC) Dashboard built with React and Material-UI. It allows you to manage users, roles, and permissions in an easy-to-use interface. The dashboard includes features for adding, editing, and deleting users, managing roles, and viewing related statistics.

## Features

- **Dashboard**: Displays summary statistics for users, roles, and permissions.
- **User Management**: Manage users, view and update their details, and assign roles.
- **Role Management**: Create, update, and delete roles, and define permissions for each role.
- **Responsive Design**: The app is fully responsive and works on mobile and desktop devices.

## Technologies Used

- **Frontend**: React, Material-UI, React Router
- **Backend**: JSON server (for mock API)
- **State Management**: React state (for simplicity)
- **Styling**: CSS, Material-UI styling

## Getting Started

Follow the steps below to set up the project locally.

### Prerequisites

You need to have Node.js and npm installed. If not, download and install Node.js from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/RBAC-Dashboard.git
    cd RBAC-Dashboard
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the mock server (for API simulation):

    To run the mock server for users and roles, you need to install `json-server`:

    ```bash
    npm install -g json-server
    ```

    Then, start the server with:

    ```bash
    json-server --watch db.json --port 2004
    ```

4. Start the React development server:

    ```bash
    npm start
    ```

    This will start the frontend at `http://localhost:3000`.

### Running the Project

Once the server is running, open your browser and navigate to:
