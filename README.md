# 🎥 VideoTube Backend

A production-ready backend for a YouTube-like video hosting platform built with Node.js, Express.js, MongoDB, and Mongoose. This project implements modern backend development practices including JWT authentication, media uploads, user management, subscriptions, playlists, comments, likes, and watch history.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User Registration & Login
* JWT Access & Refresh Tokens
* Secure Password Hashing with Bcrypt
* Protected Routes Middleware
* User Logout Functionality

### 👤 User Management

* User Profile Management
* Avatar & Cover Image Upload
* Update Account Details
* Change Password
* Get Current User Information

### 🎬 Video Management

* Upload Videos
* Update Video Details
* Delete Videos
* View Video Information
* Track Video Views
* Thumbnail Upload Support

### ❤️ Social Features

* Like & Unlike Videos
* Comment on Videos
* Reply to Comments
* Channel Subscription System
* Watch History Tracking

### 📂 Playlist Management

* Create Playlists
* Update Playlists
* Delete Playlists
* Add/Remove Videos from Playlists

### ☁️ Media Handling

* Cloudinary Integration
* Video Storage
* Image Storage
* File Upload Management using Multer

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Token)
* Bcrypt
* Cookie Parser

### Media & File Uploads

* Cloudinary
* Multer

### Utilities

* Dotenv
* CORS
* Mongoose Aggregate Paginate V2

---

## 📂 Project Structure

```bash
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
├── app.js
└── index.js

public/
.env.sample
package.json
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/AakashSudheendra/VideoTubeBackend.git
cd VideoTubeBackend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## 📌 API Modules

### User APIs

* Register User
* Login User
* Logout User
* Change Password
* Update Profile
* Get Current User

### Video APIs

* Upload Video
* Update Video
* Delete Video
* Get Video Details
* Get All Videos

### Comment APIs

* Add Comment
* Update Comment
* Delete Comment
* Get Video Comments

### Like APIs

* Like Video
* Unlike Video
* Get Liked Videos

### Playlist APIs

* Create Playlist
* Update Playlist
* Delete Playlist
* Manage Playlist Videos

### Subscription APIs

* Subscribe Channel
* Unsubscribe Channel
* Get Subscribers
* Get Subscribed Channels

---

## 🔒 Security Features

* JWT Authentication
* Refresh Token Mechanism
* Password Hashing using Bcrypt
* Secure Cookie Handling
* Protected API Routes
* Environment Variable Management

---

## 📈 Future Enhancements

* Real-time Notifications
* Video Recommendations
* Live Streaming Support
* Video Analytics Dashboard
* Community Posts
* Search & Filtering
* AI-Powered Content Recommendations

---

## 👨‍💻 Author

**Gollapalli Aakash Sudheendra**

🌐 Portfolio: https://aakashportfolio2045.netlify.app/

💻 GitHub: https://github.com/AakashSudheendra

🔗 LinkedIn: https://www.linkedin.com/in/aakashsudheendra

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

---

## 📄 License

This project is open-source and available for learning and educational purposes.
