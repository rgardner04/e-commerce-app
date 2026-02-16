require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authController = require("./controllers/authController");
const errorMiddleware = require("./middlewares/errorMiddleware");
const loggingMiddleware = require("./middlewares/loggingMiddleware");

const app = express();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`Connected to E-commerce DB at: ${process.env.MONGO_DB_URI}`);
  } catch (error) {
    console.log(
      `An error occured when connecting to the E-commerce DB: ${error}`,
    );
  }
}

(async () => {
  await connectToDatabase();
})();

//Request Middlewares
app.use(express.json());
app.use(loggingMiddleware);

//Controllers
app.use("/auth", authController);

//Response Middlewares
app.use(errorMiddleware);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 3000}`);
});
