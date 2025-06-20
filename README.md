# TeamUp - Real-time Messaging & Voice/Video Call Application

TeamUp is a full-featured communication platform similar to Discord, Slack, and Zoom, enabling users to communicate through text, voice, and video. The application offers real-time messaging, server and channel management, voice and video calls, and much more.

## Features

- **Authentication System**
  - User registration and login
  - JWT-based authentication

- **Server & Channel Management**
  - Create, join, and manage servers
  - Create text, voice, and video channels
  - Manage members and permissions

- **Real-time Messaging**
  - Send and receive messages instantly
  - Edit and delete messages
  - Reactions and attachments
  - Typing indicators
  - Unread message counters

- **Voice & Video Communication**
  - One-on-one video calls
  - Voice channels
  - Screen sharing
  - Mute/unmute and camera toggle

- **Direct Messaging**
  - Private conversations between users
  - One-on-one and group chats

## Tech Stack

### Backend
- Node.js & Express
- Socket.io for real-time communication
- MongoDB & Mongoose
- JWT for authentication
- WebRTC for voice/video calling

### Frontend
- React
- Redux Toolkit for state management
- Material UI for responsive design
- Socket.io client for real-time data
- Simple-peer for WebRTC connections

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/team-up.git
cd team-up
```

2. Install server dependencies:
```
npm install
```

3. Install client dependencies:
```
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

5. Start the development server:
```
npm run dev:all
```

This will start both the backend server and the React frontend application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Discord, Slack, and Zoom
- Built with ❤️ by [Your Name] 