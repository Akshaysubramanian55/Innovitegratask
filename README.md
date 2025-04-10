#  Company Budget Management System

This application allows a company to manage budget allocations across different categories, track expenses, and visualize budget usage via reports and charts.

---

##  Project Setup

###  Folder Structure
```
project-root/
├── client/          # React Frontend
│   └── my-project/
│       └── ...
└── server/          # Node.js Backend (Express)
    └── app.js
```
###  Frontend Setup (open terminal)

cd client/my-project
npm install
npm run dev


###  Backend Setup  (open terminal)

cd server
npm install
npm run dev


##  Tech Stack

### Backend (Node.js + Express)
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.2",
    "nodemon": "^3.1.9"
  }
}
```

### Frontend (React + Tailwind)
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.3",
    "axios": "^1.8.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.5.0",
    "recharts": "^2.15.2",
    "tailwindcss": "^4.1.3"
  }
}
```

Database Schema (MongoDB with Mongoose)

1.User

{
  name: String,          // Required
  email: String,         // Required, Unique
  password: String,      // Required, Min 6 characters
  role: String,          // One of: 'admin', 'manager', 'employee'
  createdAt: Date,
  updatedAt: Date
}

2.CompanyBudget

{
  budget: Number         // Required
}

3.Category

{
  name: String,          // Required, Unique
  budget: Number         // Required
}

4.Expense

{
  userId: ObjectId,      // Reference to User, Required
  amount: Number,        // Required
  category: String,      // Required
  project: String,
  date: Date,            // Required
  notes: String,
  receiptUrls: [String],
  status: String,        // Enum: 'pending', 'approved', 'rejected', default: 'pending'
  createdAt: Date
}


5.Team

{
  name: String,          // Required
  createdBy: ObjectId,   // Reference to User, Required
  members: [ObjectId],   // Reference to Users
  expenses: Number,
  createdAt: Date
}


 API Endpoints

 1. Auth
 Method	    Endpoint	     Description	                 Auth Required
 POST	    /signup	      Register a new user	                 ❌
 POST	     /login	      Login and get token	                 ❌


 2. Expense Management

 Method	          Endpoint	                            Description	                         Auth Required
 POST	       /submit-expense	                    Submit an expense with receipt(s)	           ❌
 GET	       /myexpenses	                        Get expenses of the logged-in user	           ✅
 GET	       /expenses/pending	                     Get all pending expenses	               ❌
 GET	       /expenses/approved	                     Get all approved expenses	               ❌
 POST	      /expenses/:id/:action	              Approve or reject expense by ID	               ❌
 GET	      /api/expenses	                         Admin: Get all expenses	                   ✅


 3. Team Management
   Method	   Endpoint	               Description	                   Auth Required
    POST	 /teams/create	         Create a new team	                    ✅
    GET	       /teams	         Get teams of the logged-in user	        ✅
    PUT	    /teams/:id/budget	  Update budget for a team	                ✅
    GET	      /admin/teams	        Admin: Get all teams	                ✅

 4. User Management
  Method	   Endpoint	               Description	                        Auth Required
   GET	    /users/employees	  Get all users with role 'employee'	         ✅
   GET	      /admin/users	         Admin: Get all users	                     ✅
  DELETE	    /admin/users/:id	  Admin: Delete user by ID	                 ✅


 5. Categories & Budget
  Method	    Endpoint	                    Description	                 Auth Required
   POST	      /admin/categories	             Add a new category	                   ✅
   GET	     /admin/categories	             Get all categories	                   ✅
   PUT	     /admin/update/:id	             Update budget for a category	       ✅
   POST	     /admin/comapnybudget	         Set company-wide budget	           ✅
   GET	     /admin/getcomapnybudget	     Get company-wide budget	           ✅


   # Expense Management System Role Matrix

## Employee Role
- **Expense Management**
  - Enter personal expenses
  - View personal expense history
- **Team**
  - View team members

## Manager Role
- **Expense Approval**
  - Accept expenses
  - Reject expenses
- **Team Management**
  - Create teams
  - View team members and structure

## Admin Role
- **User Management**
  - View all users
  - Delete users
- **Expense Oversight**
  - View all expenses across the organization
- **Budget Configuration**
  - Set expense categories
  - Assign category budgets
  - Set company-wide budgets
- **Team Management**
  - View all teams
- **Reporting**
  - Generate expense reports
  - Generate company budget reports