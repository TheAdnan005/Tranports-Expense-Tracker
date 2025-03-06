const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ExpenseTracker', { useNewUrlParser: true, useUnifiedTopology: true });

const transportSchema = new mongoose.Schema({
    movementDate: Date,
    vehicleNo: String,
    containerNo: String,
    containerSize: {
      type: String,
      enum: ["20'", "40'"],
    },
    cargo: String,
    onAccount: String,
    billTo: String,
    from: String,
    to: String,
    ladenContainerOffload: String,
    invoiceNo: String,
    invoiceDate: Date,
    rate: Number,
    halting: Number,
    totalAmount: Number,
    advanceDieselAmount: Number,
    balanceToBePaid: Number,
    paidToVendorOn: Date,
    billingRate: Number,
    emptyPickupExpense: Number,
    haltingTwo: Number,
    billingAmount: Number,
    tdsDeducted: {
      type: Number,
      min: 0,
    },
    netAmountReceived: {
      type: Number,
      min: 0,
    },
    paymentReceiptDate: Date,
    businessPromotion: String,
    paidOn: Date,
    tripExpenses: String,
    margin: String,
    transporter: String,
    remarks: String,
  }, { timestamps: true });
  
  module.exports = mongoose.model('expenses', transportSchema);
