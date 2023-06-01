const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

require("./db/connection");

const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const roleRouter = require("./routes/roleRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/role",  roleRouter);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}`);
});
