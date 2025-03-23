require("dotenv").config()

const express = require("express");
const path = require("path");
const cors = require("cors");
const conn = require("./src/config/db.js")

const port = process.env.PORT;

const app = express();

// config JSON and form data response
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

// upload directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const router = require("./src/routes/Router.js");

//conn();

app.use(router);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})
