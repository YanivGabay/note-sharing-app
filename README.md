# Collaborative Notes Application

## Overview

The Collaborative Notes Application is designed to allow users to create, edit, and manage notes within a secure and dynamic environment. Built with React, Firebase, and Bootstrap, this project not only provides essential functionality for note management but also incorporates authentication and real-time database interactions.
More than welcome to check the showcase in the youtube link:
[Collaborative Notes Showcase Video](https://youtu.be/fppggEKl9X4)


![image](https://github.com/user-attachments/assets/0ae5afcd-e88f-40b7-9be1-013f7ef3e8fc)



## Features

- **User Authentication**: Secure login and registration functionality using Firebase Auth.
- **Real-Time Data Storage**: Notes are stored in Firebase Firestore, allowing for real-time updates and retrieval.
- **Responsive Design**: Utilizing Bootstrap for a clean, responsive layout.
- **Live Updates**: Changes made by users are instantly reflected across all clients, thanks to Firestore's real-time capabilities.
- **History Tracking**: Each note's modifications are tracked, allowing users to revert to previous versions.

## Technologies Used

- **React**: For building the user interface.
- **Firebase**:
  - **Firestore**: For database services.
  - **Firebase Auth**: For handling user authentication.
- **Bootstrap**: For styling and responsive design.
- **React Router**: For navigation within the application.

## Setup and Installation

1. **Clone the Repository**

```bash
   git clone https://github.com/your-username/collaborative-notes.git
   cd collaborative-notes
```

1. **Install Dependencies**

```bash
   npm install
```

1. **Set Up Firebase**
   - Go to the Firebase Console and create a new project.
   - Add a web app to your project and copy the Firebase configuration.
   - Enable Firestore and Firebase Auth.

2. **Add Firebase Configuration**
   - Create a new file named `.env.local` in the project root.
   - Add the following configuration to the file:
  
   ```bash
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

    - Replace the values with your Firebase project's configuration.

3. **Run the Application**

```bash
   npm start
```

## Usage

After starting the application, navigate to `http://localhost:3000` in your browser. You can register a new account or log in with an existing one to start creating and managing notes.

