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

const PORT = process.env.PORT || 50006;


conDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }



    res.status(200).json({ msg: "User logged in" });
  } catch {
    res.status(400).json({ msg: "User does not exist" });
  }
});

app.delete("/users", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    await User.findOneAndDelete({ email });
    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.log(error);
  }
});
