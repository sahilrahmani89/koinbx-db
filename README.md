

## Getting Started

### Prerequisites

- Nextjs
- Firebase

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sahilrahmani89/koinbx-db.git
    cd koinbx-db
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add your Firebase config connection string:
    ```env
        NEXT_PUBLIC_apiKey=your-api-key
        NEXT_PUBLIC_authDomain=your-auth-domain
        NEXT_PUBLIC_databaseURL=your-database-url
        NEXT_PUBLIC_projectId=your-project-id
        NEXT_PUBLIC_storageBucket=your-storage-bucket
        NEXT_PUBLIC_messagingSenderId=your-messaging-sender-id
        NEXT_PUBLIC_appId=your-app-id
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

# Koinbx Dashboard UI

This project is a Next.js application that features a dashboard UI with real-time data synchronization using Firebase Realtime Database. The application displays two lists: "Hot List" and "New List," which are updated in real-time as data changes in the Firebase Realtime Database. The project also includes a responsive design.

## Features

- **Real-Time Data Sync**: The dashboard synchronizes "Hot list" and "New List" data with Firebase Realtime   Database. Any changes in the database are instantly reflected on the UI.
- **Tabbed Interface**: The dashboard includes tabs for "Hot List" and "New List." By default, it displays the "Hot List," and users can switch to view the "New List."
- **Responsive Design**: The dashboard UI is fully responsive and adapts to various screen sizes.
- **Loading State**: The UI displays a loading indicator while fetching data from the Firebase Realtime Database.






## Technologies Used

- **Next.js 14**: A React framework used for building the frontend and backend of the application.
- **TypeScript**: Used for type safety and better development experience.
- **Tailwind CSS**: A utility-first CSS framework used for responsive and modern UI design.
- **Firebase**: Real-time NoSQL cloud database.




