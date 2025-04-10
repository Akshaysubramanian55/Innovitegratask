const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const Usercontroller = require('../controllers/usercontroller');
const verifyToken =require('../validations/verifyToken');



const uploadDir = path.join(__dirname,'..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});
const upload = multer({ storage });


router.post('/signup', Usercontroller.signup);
router.post('/login', Usercontroller.login);
router.post('/submit-expense', upload.array('receipt'), Usercontroller.postexpenses);
router.get('/myexpenses', verifyToken, Usercontroller.getMyExpenses);
router.get('/expenses/pending', Usercontroller.getPendingExpenses);
router.get('/expenses/approved',Usercontroller.getApproveedExpenses)
router.post('/expenses/:id/:action', Usercontroller.updateExpenseStatus);
router.post('/teams/create', verifyToken, Usercontroller.createTeam);
router.get('/users/employees',verifyToken,Usercontroller.getEmployees);
router.get('/teams',verifyToken,Usercontroller.getTeams);
router.put('/teams/:id/budget', verifyToken, Usercontroller.updateBudget);
router.get('/admin/users', verifyToken,Usercontroller.getAllUsers);
router.get('/api/expenses', verifyToken,Usercontroller.getAllExpenses);
router.delete('/admin/users/:id',verifyToken,  Usercontroller.deleteUser);
router.get('/admin/teams',verifyToken, Usercontroller.getAllTeams);
router.post('/admin/categories',verifyToken, Usercontroller.addCategory);
router.get('/admin/categories',verifyToken, Usercontroller.getCategories);
router.put('/admin/update/:id',verifyToken, Usercontroller.updateBudget);
router.post('/admin/comapnybudget',verifyToken,Usercontroller.setCompanyBudget)
router.get('/admin/getcomapnybudget',verifyToken,Usercontroller.getCompanyBudget)
router.get('/employee/teams',verifyToken,Usercontroller.employeeteams)
module.exports = router;
