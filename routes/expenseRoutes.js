
import express from 'express';
import Expense from '../models/Expense.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

//Get all expenses
router.get("/", protect, async(req,res) => {
    try{
        const expenses = await Expense.find({user: req.user.id}).sort({date: -1});
        const totalExpense = expenses
            .filter(item => item.type === "expense")
            .reduce((sum,item) => sum + item.amount, 0);

        const totalIncome = expenses
            .filter(item => item.type === "income")
            .reduce((sum,item) => sum + item.amount, 0);

        const savings = totalIncome - totalExpense;
        res.status(200).json({ expenses, totalExpense, totalIncome, savings, totalTransactions: expenses.length})
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Server error!", error: err.message})
    }
})

//Add Expense

router.post("/", protect, async(req,res) => {
    try{
        const {title, amount, category, type, date} = req.body
        const expense = new Expense({title, amount, category, date, type, user: req.user.id})

        await expense.save();
        res.status(201).json(expense);
    }catch(err){
        res.status(500).json({message: "Server error!", error: err.message})
    
    }
})

//update expense
router.put("/:id", protect, async(req,res) => {
    try{
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if(!expense){
            return res.status(404).json({message:"Expensenot found"})
        }

        const {title, amount, category, date} = req.body;
        if(title !== undefined) expense.title = title
        if(amount !== undefined) expense.amount = amount
        if(category !== undefined) expense.category = category
        if(date !== undefined) expense.date = date

        await expense.save();
        res.status(200).json(expense)

    }catch(err){
            res.status(500).json({message: "Server error!", error: err.message})
    }
})

//Delete expense

router.delete("/:id", protect, async(req,res) => {
    try{
        const expense = await Expense.findOneAndDelete({
        _id:req.params.id,
        user: req.user.id
        })

        if(!expense){
            return res.status(401).json({message: "Expense not found"})
        }
        res.status(200).json({message:"Expense deleted"})
    }catch(err){
        res.status(500).json({message: "Server error!", error: err.message})
    }
})

export default router;