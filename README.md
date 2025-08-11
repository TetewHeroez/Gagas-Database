# Gagas Database Management System

A comprehensive document management system built with **Node.js**, **Express**, **MongoDB**, and **React**. This system provides secure document storage, user management, and role-based access control with advanced features like forgot password functionality.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🚀 Features

### Core Features

- **📄 Document Management**: Upload, view, edit, and delete documents
- **👥 User Management**: Admin can manage users and their permissions
- **🔐 Authentication & Authorization**: JWT-based authentication with role-based access
- **🔍 Advanced Search**: Search documents by title, type, or content
- **📊 Dashboard**: Comprehensive dashboard with statistics and recent activities
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Security Features

- **🔒 Forgot Password**: Email-based password reset functionality
- **🛡️ Token-based Authentication**: Secure JWT implementation
- **👮 Role-based Access Control**: Admin and user roles with different permissions
- **🔐 Password Hashing**: Secure password storage with bcrypt
- **⏰ Session Management**: Automatic token expiration and refresh
- **🔑 Database Admin Auto-Access**: Database Admin role has automatic access to all documents

### Document Features

- **☁️ Cloud Storage**: Integration with Cloudinary for file storage
- **📎 Multiple File Types**: Support for various document formats
- **🏷️ Document Categories**: Organize documents by type and division
- **📋 Document Permissions**: Control who can view and edit documents
- **📈 Document Analytics**: Track document views and downloads
- **🚀 Auto-Permission System**: Database Admin automatically gets access to new document types

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Cloud storage for files
- **Multer** - File upload handling

### Frontend

- **React** - Frontend library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **pnpm** (recommended) or npm
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TetewHeroez/Gagas-Database.git
cd Gagas-Database
```

### 2. Backend Setup

```bash
cd backend
pnpm install
```

### 3. Frontend Setup

```bash
cd ../frontend
pnpm install
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret-key"

# Cloudinary Configuration (for file storage)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Default Admin Configuration
ADMIN_USERNAME="admin_super"
ADMIN_EMAIL="admin@company.com"
ADMIN_NAMA_LENGKAP="System Administrator"
ADMIN_PASSWORD="SecureAdminPassword123!"
ADMIN_DIVISI="IT Department"

# Email Configuration (for forgot password feature)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### 5. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist
5. Update `MONGO_URI` in your `.env` file

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/gagas-database`

### 6. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the Cloudinary variables in your `.env` file

### 7. Email Setup (Optional for Development)

#### For Development (Default)

- Leave email configuration as is
- Emails will be logged to console instead of being sent

#### For Production (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Update `EMAIL_USER` and `EMAIL_PASS` in `.env`

#### For Production (Other Providers)

```env
# For Outlook/Hotmail
EMAIL_USER="your-email@outlook.com"
EMAIL_PASS="your-password"

# For Yahoo
EMAIL_USER="your-email@yahoo.com"
EMAIL_PASS="your-password"
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**:

```bash
cd backend
pnpm run dev
```

The backend will run on `http://localhost:5000`

2. **Start Frontend Development Server**:

```bash
cd frontend
pnpm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

### Production Mode

1. **Build Frontend**:

```bash
cd frontend
pnpm run build
```

2. **Start Backend**:

```bash
cd backend
pnpm start
```

## 📁 Project Structure

```
Gagas-Database/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── documentController.js # Document CRUD operations
│   │   │   ├── userController.js     # User management
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   └── uploadMiddleware.js   # File upload handling
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Document.js           # Document schema
│   │   │   └── Permission.js         # Permission schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Authentication routes
│   │   │   ├── documentRoutes.js     # Document routes
│   │   │   └── ...
│   │   └── utils/
│   │       ├── generateToken.js      # JWT utilities
│   │       ├── emailService.js       # Email functionality
│   │       └── seeder.js             # Database seeding
│   ├── server.js                     # Main server file
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Main pages
│   │   ├── layouts/                  # Layout components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # React context providers
│   │   ├── api/                      # API utilities
│   │   └── assets/                   # Static assets
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔑 Default Admin Account

After seeding the database, you can login with:

- **Username**: `admin_super`
- **Email**: `admin@company.com` (or as configured in .env)
- **Password**: `SecureAdminPassword123!` (or as configured in .env)
- **Division**: `Database Admin` (automatically gets access to all documents)

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | `/api/auth/login`                 | User login                |
| POST   | `/api/auth/forgot-password`       | Request password reset    |
| POST   | `/api/auth/reset-password/:token` | Reset password with token |

### User Management Endpoints

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/api/users`         | Get all users (Admin only)   |
| GET    | `/api/users/profile` | Get current user profile     |
| POST   | `/api/users`         | Create new user (Admin only) |
| PUT    | `/api/users/:id`     | Update user (Admin only)     |
| DELETE | `/api/users/:id`     | Delete user (Admin only)     |

### Document Management Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/documents`     | Get all documents   |
| GET    | `/api/documents/:id` | Get document by ID  |
| POST   | `/api/documents`     | Create new document |
| PUT    | `/api/documents/:id` | Update document     |
| DELETE | `/api/documents/:id` | Delete document     |

### Dashboard Endpoints

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/dashboard/stats`            | Get dashboard statistics |
| GET    | `/api/dashboard/recent-documents` | Get recent documents     |

## 🔐 Forgot Password Feature

### How it Works

1. **Request Reset**: User enters email on forgot password page
2. **Email Sent**: System generates secure token and sends email
3. **Reset Password**: User clicks link in email and enters new password
4. **Token Validation**: System validates token and updates password

### Email Configuration Modes

#### Development Mode

- Emails are logged to backend console
- Reset URLs are displayed in console for testing
- No actual email sending required

#### Production Mode

- Emails are sent to user's inbox
- Requires valid email service configuration
- Supports Gmail, Outlook, Yahoo, and custom SMTP

### Security Features

- Tokens expire after 1 hour
- Tokens are cryptographically hashed
- Email validation before sending
- Account status verification
- Password strength validation

## 🎨 Features Overview

### User Roles

#### Admin

- Full access to all features
- User management (create, edit, delete users)
- Document management for all documents
- Permission management
- Dashboard with full statistics

#### Regular User

- View and manage assigned documents
- Profile management
- Limited dashboard access
- Document search and filtering

#### Database Admin (Special Role)

- **Automatic access** to all document types (existing and future)
- **Cannot be modified** in permission management
- **Hidden from permission settings** to prevent accidental changes
- **Future-proof access** - automatically gets access to new document types
- All admin privileges plus unrestricted document access

### Document Types

- Surat Masuk (Incoming Letters)
- Surat Keluar (Outgoing Letters)
- Memo Internal (Internal Memos)
- Laporan (Reports)
- Kontrak (Contracts)
- Invoice
- SOP (Standard Operating Procedures)
- Lainnya (Others)

### Divisions

- Direktur (Director)
- Manager
- Supervisor
- Staff
- Admin
- IT
- HR
- Finance
- Marketing
- Operations

## 🎯 Permission System

### How Permissions Work

- **Regular Users**: Access controlled by permission settings in admin panel
- **Admin Users**: Can access all documents and manage permissions
- **Database Admin**: Special role with automatic access to all documents

### Database Admin Features

- **Automatic Permission**: Gets access to all document types without manual configuration
- **Future-Proof**: Automatically receives access to newly added document types
- **Protected Settings**: Cannot be modified in permission management interface
- **Hidden from UI**: Does not appear in permission management to prevent confusion

### Permission Management

- Admins can set document type permissions for each division
- Permissions are granted per division (not per individual user)
- Database Admin division is automatically excluded from permission management
- Real-time permission updates across the system

## 🛡️ Security Best Practices

- **Environment Variables**: All sensitive data stored in environment variables
- **Password Hashing**: Passwords hashed using bcrypt with salt
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file handling with Cloudinary
- **CORS Protection**: Configured CORS for frontend-backend communication
- **Rate Limiting**: Consider implementing rate limiting for production

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:

```bash
cd frontend
pnpm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Ensure all environment variables are set
2. Update `FRONTEND_URL` to your deployed frontend URL
3. Deploy the backend folder to your hosting service

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **TetewHeroez** - _Initial work_ - [TetewHeroez](https://github.com/TetewHeroez)

## 🙏 Acknowledgments

- Thanks to all contributors who helped with this project
- Inspiration from modern document management systems
- Built with love using open-source technologies

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the documentation above
2. Search existing issues on GitHub
3. Create a new issue if your problem isn't covered

---

**Happy coding!** 🎉
