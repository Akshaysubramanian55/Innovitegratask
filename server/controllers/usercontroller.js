const error_function = require('../utils/responsehandler').error_function
const success_function = require('../utils/responsehandler').success_function
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const users = require('../db/User');
const Expense = require('../db/Expense')
const Team = require('../db/Team');
const Category = require('../db/Category')
const CompanyBudget = require('../db/companybudget')
exports.signup = async function (req, res) {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            let response = error_function({
                statusCode: 400,
                message: 'All fields are required',
            });
            return res.status(response.statusCode).send(response.message);
        }

        const userexist = await users.findOne({ email });

        if (userexist) {
            let response = error_function({
                statusCode: 400,
                message: 'User already exists'
            });
            return res.status(response.statusCode).send(response.message);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);

        const new_user = await users.create({
            name,
            email,
            role,
            password: hashed_password,
        });

        if (new_user) {
            let response = success_function({
                statusCode: 200,
                message: "User created successfully"
            });
            return res.status(response.statusCode).send(response.message);
        } else {
            let response = error_function({
                statusCode: 400,
                message: 'User creation failed'
            });
            return res.status(response.statusCode).send(response.message);
        }

    } catch (error) {
        console.error('Signup error:', error);
        let response = error_function({
            statusCode: 500,
            message: 'Something went wrong'
        });
        return res.status(response.statusCode).send(response.message);
    }
};


exports.login = async function (req, res) {
    
    try {
        const { email, password } = req.body;
  console.log(req.body)
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "No user found" });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, },
        process.env.PRIVATE_KEY, 
        { expiresIn: "1d" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token: accessToken,
        role: user.role
      });
  
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  exports.postexpenses = async function (req, res) {
    try {
      const { userId, amount, category, project, date, notes } = req.body;
  
      const receiptUrls = req.files.map(file => `/uploads/${file.filename}`);
  console.log(receiptUrls)
      const newExpense = new Expense({
        userId,
        amount,
        category,
        project,
        date,
        notes,
        receiptUrls
      });
  
      await newExpense.save();
      res.status(201).json({ message: 'Expense submitted successfully' });
    } catch (err) {
      console.error('Error submitting expense:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getMyExpenses = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { month } = req.query;
  
      const filter = { userId: new mongoose.Types.ObjectId(userId) };
  
      if (month) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(`${currentYear}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
  
        filter.date = { $gte: startDate, $lt: endDate };
      }
  
      const expenses = await Expense.find(filter).sort({ createdAt: -1 });
  
      res.status(200).json({ expenses });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getPendingExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find({ status: 'pending' })
        .populate('userId', 'name email') 
        .sort({ createdAt: -1 });
  
      res.status(200).json(expenses);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch pending expenses' });
    }
  };
  
  exports.updateExpenseStatus = async (req, res) => {
    const { id, action } = req.params;
  
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
  
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        { status: action === 'approve' ? 'approved' : 'rejected' },
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.status(200).json({ message: `Expense ${action}d successfully` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update expense status' });
    }
  };


  exports.getApproveedExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find({ status: 'approved' })
        .populate('userId', 'name email') 
        .sort({ createdAt: -1 });
  
      res.status(200).json(expenses);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch pending expenses' });
    }
  };


  exports.createTeam = async (req, res) => {
    try {
      const { teamName, members } = req.body;
      const userId = req.user.userId;
      if (!teamName) {
        return res.status(400).json({ message: 'Team name is required' });
      }
  
      const newTeam = new Team({
        name:teamName,
        members: members || [],
        createdBy: userId,
      });
  
      await newTeam.save();
  
      res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
      console.error('Create team error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getTeams = async (req, res) => {
    try {
      const teams = await Team.find({ createdBy: req.user.userId }) 
        .populate('members', 'name email') 
        .sort({ createdAt: -1 });
  
      res.status(200).json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Failed to fetch teams' });
    }
  };


  exports.getEmployees = async (req, res) => {
    try {
      const employees = await users.find({ role: 'employee' }).select('_id name email');
      res.status(200).json(employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ message: 'Server error fetching employees' });
    }
  };


  exports.updateBudget = async (req, res) => {
    const teamId = req.params.id;
    const { expenses } = req.body;
  
    try {
      const team = await Team.findByIdAndUpdate(
        teamId,
        { expenses },
        { new: true }
      );
  
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      res.status(200).json({ message: 'Budget updated successfully', team });
    } catch (error) {
      console.error('Error updating team budget:', error);
      res.status(500).json({ message: 'Server error while updating budget' });
    }
  };


  exports.getAllUsers = async (req, res) => {
    try {
      const allUsers = await users.find().select('-password');
      res.status(200).json(allUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  exports.getAllExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find().sort({ createdAt: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Failed to fetch expenses' });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }




        await Expense.deleteMany({ userId });

        const teams = await Team.find({ members: userId });

        for (const team of teams) {
            if (team.members.length === 1) {
                
                await Team.findByIdAndDelete(team._id);
            } else {
                
                await Team.findByIdAndUpdate(team._id, {
                    $pull: { members: userId }
                });
            }
        }

        
        await users.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User and related data deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('createdBy', 'name email') 
      .populate('members', 'name email');  
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCategory = async (req, res) => {
  try {
      const { name, budget } = req.body;

      const categories = await Category.find();
      const totalAllocated = categories.reduce((acc, cat) => acc + cat.budget, 0);

      const companyBudget = await CompanyBudget.findOne();
      if (!companyBudget) {
          return res.status(400).json({ error: 'Company budget not set' });
      }

      if (totalAllocated + budget > companyBudget.budget) {
          return res.status(400).json({ error: 'Total budget exceeds company budget' });
      }

      const newCategory = new Category({ name, budget });
      await newCategory.save();

      res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ error: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setCompanyBudget = async (req, res) => {
  try {
      const { budget } = req.body;

      let existing = await CompanyBudget.findOne();
      if (existing) {
          existing.budget = budget;
          await existing.save();
      } else {
          await CompanyBudget.create({ budget });
      }

      res.status(200).json({ message: 'Budget updated' });
  } catch (err) {
      res.status(500).json({ error: 'Server error' });
  }
};

exports.getCompanyBudget = async (req, res) => {
  try {
      const data = await CompanyBudget.findOne();
      res.status(200).json({ budget: data?.budget || 0 });
  } catch (err) {
      res.status(500).json({ error: 'Server error' });
  }
};


exports.employeeteams = async (req, res) => {
  try {
    const userId = req.user.userId;

    const teams = await Team.find({ members: userId })
      .populate('members', 'name email') 
      .populate('createdBy', 'name email');

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching employee teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};
