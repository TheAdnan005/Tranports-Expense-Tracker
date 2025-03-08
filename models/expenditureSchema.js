const mongoose = require('mongoose');


const expenditureSchema = new mongoose.Schema({
  // Trip Details
  slNo: Number,
  tripDate: Date,
  contrNo: String,
  vehicleSize: {
    type: String,
    enum: ["20'", "40'", "Other"]
  },
  customer: String,
  
  // Route Information
  from: String,
  to: String,
  backTo: String,
  
  // Mileage Details
  startReading: Number,
  closingReading: Number,
  totalKms: Number,
  kmsPerLiter: Number,
  
  // Fuel Details
  dieselQuantity: {
    type: Number,
    min: 0
  },
  dieselAmount: {
    type: Number,
    min: 0
  },
  
  // Expenses
  tollGateExpense: {
    type: Number,
    default: 0
  },
  otherExpenses: {
    type: Number,
    default: 0
  },
  bpExpenses: {
    type: Number,
    default: 0
  },
  taxesAmount: {
    type: Number,
    default: 0
  },
  driverSalary: {
    type: Number,
    default: 0
  },
  haltingCharges: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    min: 0
  },
  
  // Revenue Details
  movementRate: Number,
  invoiceAmount: Number,
  advancePaid: {
    type: Number,
    default: 0
  },
  balanceToReceive: {
    type: Number,
    default: 0
  },
  
  // Profitability
  netMargin: Number,
  
  // Personnel
  driverName: String,
  driverPaymentDate: Date,
  
  // Additional Fields
  tripReturnDate: Date,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Expenditure', expenditureSchema);