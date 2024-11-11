const dotenv = require("dotenv");
const express = require("express");
const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const routes = require("./routes/index.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
  console.log(`server berjalan di port ${PORT}`);
});
