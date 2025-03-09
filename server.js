const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors"); 
const app = express();
const bodyParser = require("body-parser");
const TransportSchema = require("./models/transportSchema");
const ExpenditureSchema = require("./models/expenditureSchema");
const path = require("path");
const expenditureSchema = require("./models/expenditureSchema");
const sl_no =0;

mongoose.connect('mongodb://localhost/ExpenseTracker');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.get('/', async (req, res) => {
  async function calculateTotalSum() {
    try {
      const result = await TransportSchema.aggregate([
        {
          $group: {
            _id: null,
            totalSum: { $sum: "$totalAmount" }
          }
        }
      ]);
      
      // Return the result directly
      return result[0]?.totalSum || 0;
    } catch (error) {
      console.error("Error calculating sum:", error);
      return 0;
    }
  }
  const totalsum = await calculateTotalSum();
  res.render('index', { totalsum });
});

app.get("/dsr", async (req, res) => {
  let data = await TransportSchema.find();
  data = data.map(item => ({
    ...item._doc,
    movementDate: item.movementDate ? formatDate(item.movementDate) : '',
    invoiceDate: item.invoiceDate ? formatDate(item.invoiceDate) : '',
    paidToVendorOn: item.paidToVendorOn ? formatDate(item.paidToVendorOn) : '',
    paymentReceiptDate: item.paymentReceiptDate ? formatDate(item.paymentReceiptDate) : '',
    paidOn: item.paidOn ? formatDate(item.paidOn) : '',
}));

  res.render("dsr", { sl_no, data });
});

app.get('/expenditure',async (req,res)=>{
  let data = await ExpenditureSchema.find();
  data = data.map(item => ({
    ...item._doc,
    tripDate: item.tripDate ? formatDate(item.tripDate) : '',
    tripReturnDate: item.tripReturnDate ? formatDate(item.tripReturnDate) : '',

}));
  res.render('expenditure',{ sl_no, data });
})
function formatDate(date) {
    let d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}

app.get('/edit/:id',async (req,res)=>{
    const data = await TransportSchema.findById(req.params.id)
    console.log("Paid To Vendor Value:", data.paidToVendor);
    data.paidToVendor = data.paidToVendor ? new Date(data.paidToVendor).toISOString().split('T')[0] : '';


    res.render('edit', {data})
})
app.get('/expenditureEdit/:id',async (req,res)=>{
    const data = await ExpenditureSchema.findById(req.params.id);
    res.render('expenditureEdit', {data})
})
app.post("/post", async (req, res) => {
  await TransportSchema.create(req.body);
  res.redirect("/dsr");
});
app.post("/expenditurePost", async (req, res) => {
  await ExpenditureSchema.create(req.body);
  res.redirect("/expenditure");
});
app.post('/saveChanges/:id',async (req,res)=>{
    console.log(req.body);
    
    let updatedData= await TransportSchema.findByIdAndUpdate(req.params.id,req.body)
    res.redirect('/dsr')

})
app.post('/expenditureEdit/:id',async (req,res)=>{
    console.log(req.body);
    
    let updatedData= await ExpenditureSchema.findByIdAndUpdate(req.params.id,req.body)
    res.redirect('/expenditure')

})

app.get('/delete/:id', async(req,res)=>{
    let deletedUser = await TransportSchema.findByIdAndDelete(req.params.id)
    res.redirect('/dsr')
})
app.get('/Expdelete/:id', async(req,res)=>{
    let deletedUser = await ExpenditureSchema.findByIdAndDelete(req.params.id)
    res.redirect('/expenditure')
})
// Single endpoint for all suggestions
app.get("/search", async (req, res) => {
  const { q: searchQuery, field } = req.query;

  if (!searchQuery || !field) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    const results = await TransportSchema.find(
      { [field]: new RegExp(searchQuery, "i") }, // Dynamic field matching
      { [field]: 1, _id: 0 } // Dynamic field selection
    ).limit(5).lean();

    res.json(results.map((item) => item[field])); // Return array of field values
  } catch (err) {
    console.error(`Error fetching ${field}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/expSearch", async (req, res) => {
  const { q: searchQuery, field } = req.query;

  if (!searchQuery || !field) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    const results = await ExpenditureSchema.find(
      { [field]: new RegExp(searchQuery, "i") }, // Dynamic field matching
      { [field]: 1, _id: 0 } // Dynamic field selection
    ).limit(5).lean();

    res.json(results.map((item) => item[field])); // Return array of field values
  } catch (err) {
    console.error(`Error fetching ${field}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


