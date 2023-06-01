const mongoose = require('mongoose');

require("dotenv").config();

const url = process.env.DB_CONNECT
mongoose.connect( url || "mongodb+srv://ArtiKhillare:jR067NcnClM96Fp1@cluster0.wi9j2.mongodb.net/NodejsAss1-Db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } ).then(() => {
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
})