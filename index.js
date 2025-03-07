const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const TransportSchema = require("./models/transportSchema");
const path = require("path");
const sl_no =0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
  let data = await TransportSchema.find();
  data = data.map(item => ({
    ...item._doc, // Keep existing properties
    movementDate: item.movementDate ? formatDate(item.movementDate) : '',
    invoiceDate: item.invoiceDate ? formatDate(item.invoiceDate) : '',
    paidToVendorOn: item.paidToVendorOn ? formatDate(item.paidToVendorOn) : '',
    paymentReceiptDate: item.paymentReceiptDate ? formatDate(item.paymentReceiptDate) : '',
    paidOn: item.paidOn ? formatDate(item.paidOn) : '',
}));

  res.render("dsr", { sl_no, data });
});
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
app.post("/post", async (req, res) => {
  await TransportSchema.create(req.body);
  res.redirect("/");
});
app.post('/saveChanges/:id',async (req,res)=>{
    console.log(req.body);
    
    let updatedData= await TransportSchema.findByIdAndUpdate(req.params.id,req.body)
    res.redirect('/')

})

app.get('/delete/:id', async(req,res)=>{
    let deletedUser = await TransportSchema.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


