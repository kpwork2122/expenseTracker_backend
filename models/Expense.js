import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: {type:String, required:true, trim:true},
    amount: {type:Number, required:true},
    category: {type:String, enum:["Food", "Travel", "Shopping", "Bills", "Transportation", "Entertainment", "Salary", "Other"], default:"Other"},
    type: {type:String, enum:["income", "expense"],default:"expense"},
    date:{type:Date, default:Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true }
}, {timestamps: true})

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense