import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


// const conDB = async () => {
//   console.log(process.env.MONGODB_URI);
// }

const conDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default conDB;
