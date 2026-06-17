# Grievio - Grievance Management System

A comprehensive full-stack web application for managing citizen grievances and complaints. Grievio provides a platform for citizens to file complaints, for staff to review and process them, and for administrators to manage the entire system.

## Features

### For Citizens
- **Account Creation & Login**: Secure registration and authentication
- **File Complaints**: Submit grievances with detailed information
- **Track Status**: Monitor complaint status in real-time
- **Dashboard**: View all submitted complaints and their updates

### For Staff
- **Complaint Review**: View and assess incoming complaints
- **Status Updates**: Update complaint status and add notes
- **Activity Tracking**: Monitor all complaint-related activities
- **Dashboard**: Overview of assigned complaints

### For Administrators
- **System Management**: Manage users and staff members
- **Reporting**: Generate complaints and activity reports
- **Dashboard**: Monitor system-wide metrics and activities
- **Verification**: Verify and approve complaints

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Validation**: Zod schema validation
- **CORS**: Enabled for cross-origin requests
- **Image Storage**: Cloudflare R2 for image uploads and storage

### Frontend
- **Framework**: React 19.x with Vite
- **Routing**: React Router v7.x
- **Styling**: Tailwind CSS v4.x
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
Grievio/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── Activity.js
│   │   ├── Admin.js
│   │   ├── Citizens.js
│   │   ├── Complaint.js
│   │   ├── Staff.js
│   ├── routes/              # API endpoints
│   │   ├── activity.js
│   │   ├── admin.js
│   │   ├── citizen.js
│   │   ├── complaint.js
│   │   ├── report.js
│   │   ├── staff.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # Authentication middleware
│   ├── utils/              # Utility functions
│   │   ├── loginvalidation.js
│   │   ├── registervalidation.js
│   │   ├── complaintcreatevalidation.js
│   ├── index.js            # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── UserTypeSelector.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── StepCard.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── ComplaintVerificationPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js      # API client configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievio
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLOUDFLARE_ACCESS_KEY=your_cloudflare_access_key
CLOUDFLARE_SECRET_KEY=your_cloudflare_secret_key
CLOUDFLARE_BUCKET_NAME=your_r2_bucket_name
```

4. Start the backend server:
```bash
node index.js
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
Update the API base URL in `src/utils/api.js` if needed (default: `http://localhost:5000`)

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

### Backend
- `npm test` - Run tests (not yet configured)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production

## API Endpoints

### Authentication
- `POST /api/citizen/signup` - Register as citizen
- `POST /api/citizen/login` - Login as citizen
- `POST /api/admin/signup` - Register as admin
- `POST /api/admin/login` - Login as admin
- `POST /api/staff/signup` - Register as staff
- `POST /api/staff/login` - Login as staff

### Complaints
- `POST /api/complaint/create` - Create new complaint
- `GET /api/complaint/all` - Get all complaints
- `GET /api/complaint/:id` - Get complaint details
- `PUT /api/complaint/:id/verify` - Verify complaint (admin)

### Citizens
- `GET /api/citizen/profile` - Get citizen profile
- `PUT /api/citizen/profile` - Update citizen profile

### Staff
- `GET /api/staff/complaints` - Get assigned complaints
- `PUT /api/complaint/:id/update` - Update complaint status

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users

### Reports
- `GET /api/report/complaints` - Get complaint reports
- `GET /api/report/activity` - Get activity reports

### Activity
- `GET /api/activity` - Get all activities
- `GET /api/activity/:id` - Get specific activity

## Authentication Flow

1. Users register with email and password
2. Password is hashed using bcrypt
3. Upon login, JWT token is generated
4. Token is sent with subsequent requests in Authorization header
5. Middleware validates token for protected routes

## Database Models

- **Citizens**: Stores citizen account information
- **Complaint**: Stores complaint details and status
- **Staff**: Stores staff member information
- **Admin**: Stores admin account information
- **Activity**: Logs all system activities

## Image Management

Images are uploaded and stored using Cloudflare :
- Citizens can upload complaint images
- Images are securely stored in R2
- Unique URLs are generated for each uploaded image
- Images are linked to complaint records in MongoDB

## Validation

Input validation is implemented using Zod schema validation:
- Login validation
- Registration validation
- Complaint creation validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Roadmap

- [ ] Email notifications for complaint updates
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Automated complaint categorization
