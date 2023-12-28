const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

async function connectToMongoDB() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      `mongodb+srv://santhosh:${process.env.MONGODB_PASSWORD}@laundry-service.mopo5cn.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`listening on http://localhost:${port}`));

// decode function

const DecodedToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

// Home route

app.get("/", async (req, res) => {
  res.send("Welcome Home");
});

// sign-up Route

app.post("/register", async (req, res) => {
  try {
    const { name, password, mobile, registerNumber, year } = req.body;
    const data = await userModel.create({
      name,
      password,
      mobile,
      registerNumber,
      year,
    });
    await data.save();
    return await res.status(200).send(data);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send("Duplicate key error");
    }
    res.status(500).send(error);
  }
});

// login Route
app.post("/login", async (req, res) => {
  try {
    const { registerNumber, password } = req.body;
    const data = await userModel.find({
      registerNumber: registerNumber,
      password: password,
    });
    if (data.length !== 0) {
      // const token = jwt.sign(
      //   {
      //     id: data[0]._id,
      //     name: data[0].name,
      //     registerNumber: data[0].registerNumber,
      //   },
      //   process.env.SECRET_KEY
      // );
      console.log(data);
      return await res.status(200).send(data[0]);
    } else {
      return await res.status(409).send({ login: "login failed" });
    }
  } catch (error) {
    return res.send(error).status(500);
  }
});
