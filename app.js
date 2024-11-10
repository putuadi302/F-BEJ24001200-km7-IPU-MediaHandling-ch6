if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

app.listen(PORT, (req, res) => {
  console.log(`server berjalan di port ${PORT}`);
});
