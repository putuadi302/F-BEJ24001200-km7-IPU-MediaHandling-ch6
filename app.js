const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const PORT = process.env.PORT || 3000;
const routes = require("./routes/index.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
app.use("/coba", (req, res) => {
  res.send("berhasil masuk");
});

app.listen(PORT, (req, res) => {
  console.log(`server berjalan di port ${PORT}`);
});
