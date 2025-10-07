# 🐪 The Caravan Chronicle  

A grievance redressal & city management platform designed for the **Circus of Wonders**, a traveling mobile city with performers, vendors, and roadies.  

As the circus travels, infrastructure issues (like road damage, water leakage, and garbage pile-ups) often arise. Citizens can use **The Caravan Chronicle** to report problems, track resolutions, and ensure their temporary city runs as smoothly as the show itself.  

---

## ✨ Features  

- **User Registration & Login**: Secure accounts for citizens, staff, and admins.  
- **Complaint Submission**: Report issues with text, location, and photo uploads.  
- **Ticket Lifecycle**: Status flow → `OPEN → IN PROGRESS → RESOLVED`.  
- **Dashboards**:  
  - Citizens: Track and manage complaints.  
  - Staff: Assign, update, and resolve complaints.  
  - Admin: Oversee metrics, manage staff, and generate reports.  
- **Search & Filtering**: Filter complaints by type, area, urgency, or date.  
- **Notifications**: Email/SMS/push alerts for updates.  
- **Reports & Analytics**: Export data in CSV/PDF and view resolution trends.  

---

## 🏗️ Tech Stack  

**Frontend**  
- React.js (or Next.js)  
- TailwindCSS  

**Backend**  
- Node.js (Express) 
-  MongoDB  
- JWT 
- Firebase  

**Utilities**  
- Puppeteer / ReportLab for PDF reports  
- Docker for deployment  

---

## 📂 Folder Structure  

```bash
caravan-chronicle/
│
├── backend/
│   ├── index.js
│   ├── config.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/                # Static files
│   ├── src/
│   │   ├── api/               # Axios API calls
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level views
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Dashboard layouts
│   │   ├── context/           # Auth & global state
│   │   ├── styles/            # CSS/Tailwind config
│   │   └── utils/             # Frontend utilities
│   ├── package.json
│
├── docs/
│   ├── architecture.md        # System design
│   ├── api-spec.md            # API endpoints
│   ├── user-stories.md        # User scenarios
│   └── ui-wireframes/         # Mockups
│
├── scripts/                   # Deployment scripts
├── .env                       # Environment variables
├── docker-compose.yml         # Container setup
└── README.md
```

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js >= 16  
- MongoDB  
- npm or yarn  

### Installation  

```bash
# Clone the repo
git clone https://github.com/your-username/caravan-chronicle.git

# Backend setup
cd caravan-chronicle/backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm start
```

### Environment Variables  
Create a `.env` file in `/backend` with:  

```env
PORT=5000
DATABASE_URL=your_db_url
JWT_SECRET=your_secret_key
EMAIL_SERVICE_API=your_email_api_key
STORAGE_BUCKET=your_storage_bucket
```

---

## 📊 Product Flow  

1. Citizen logs in → submits a complaint.  
2. Complaint marked as **OPEN** and visible in staff dashboard.  
3. Staff assigns themselves → marks as **IN PROGRESS**.  
4. After resolution → status updated to **RESOLVED**.  
5. Citizen notified of resolution.  
6. Admin reviews analytics and exports reports.  

---

## 🤝 Contributing  

1. Fork the project  
2. Create a feature branch (`git checkout -b feature/xyz`)  
3. Commit changes (`git commit -m 'Add new feature'`)  
4. Push to branch (`git push origin feature/xyz`)  
5. Open a Pull Request  

---

## 📜 License  

Distributed under the MIT License. See `LICENSE` for more information.  

---

## 🧑‍💻 Authors  

- **Your Name** - Initial Work  
- Open to Contributors 🚀  

