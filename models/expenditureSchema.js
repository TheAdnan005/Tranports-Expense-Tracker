const mongoose = require('mongoose');
const expenditureSchema = new mongoose.Schema({
    tripDate: Date,
    contrNo: String,
    vehicleNumber:String,
    vehicleSize: {
      type: String,
      enum: ["20'", "40'", "Other"]
    },
    customer: String,
    from: String,
    to: String,
    backTo: String,
    dieselQuantity: {
      type: Number,
      min: 0
    },
    dieselAmount: {
      type: Number,
      min: 0
    },
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
    totalExpenses: {
      type: Number,
      min: 0
    },
    haltingCharges: {
      type: Number,
      default: 0
    },
    movementRate: Number,
    invoiceAmount: Number,
    netMargin: Number,
    advancePaid: {
      type: Number,
      default: 0
    },
    balanceToReceive: {
      type: Number,
      default: 0
    },
    tripReturnDate: Date,
    startReading: Number,
    closingReading: Number,
    totalKms: Number,
    kmsPerLiter: Number,
    driverName: String,
    remarks: String,
  
    // Fields not in table headers (keep at end)
    driverPaymentDate: Date,
  }, { timestamps: true });

module.exports = mongoose.model('Expenditure', expenditureSchema);