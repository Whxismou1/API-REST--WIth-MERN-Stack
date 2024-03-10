import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
import User from "./Models/User.js";
import conDB from "./BBDD/DBConexion.js";
import bcrypt from "bcrypt";

app.use(cors());
app.use(express.json());
dotenv.config();

conDB();

app.listen(65000, () => {
  console.log("Server is running on port 50006");
});

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const encriptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: encriptedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: "User created" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/users", async (req, res) => {});
