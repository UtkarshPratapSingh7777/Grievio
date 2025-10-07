const express=require("express");
const app=express();
const mongoose=require("mongoose");
const { MONGODB_URL } = require("./config");
const Citizenrouter=require("./routes/citizen");
const Staffrouter=require("./routes/staff");
const Adminrouter=require("./routes/admin");
const Complaintrouter=require("./routes/complaint");
const cors=require("cors");
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("Connected to MongoDB"))
  .catch((err)=> console.error("MongoDB connection error:", err));

// Mount routers
app.use("/api/citizen",Citizenrouter);
app.use("/api/staff",Staffrouter);
app.use("/api/admin",Adminrouter);
app.use("/api/complaints",Complaintrouter);
// app.use("/api/report",reportrouter);

app.listen(3000,()=>{
    console.log("server started at port 3000");
})