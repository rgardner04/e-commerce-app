require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authController = require("./controllers/authController");
const landingPageController = require("./controllers/landingPageController");
const productController = require("./controllers/productController");
const categoryController = require("./controllers/categoryController");

const errorMiddleware = require("./middlewares/errorMiddleware");
const loggingMiddleware = require("./middlewares/loggingMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const tokenExpiryFlagMiddleware = require("./middlewares/tokenExpiryFlagMiddleware");

const app = express();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to e-commerce DB!");
  } catch (error) {
    console.log(
      `An error occured when connecting to the e-commerce DB: ${error}`,
    );
  }
}

(async () => {
  await connectToDatabase();
})();

app.use(
  cors({
    origin: process.env.WEB_APP_URL,
  }),
);

//Request Middlewares
app.use(express.json());
app.use(loggingMiddleware);

//Controllers
app.use("/auth", authController);
app.use(
  "/landing-page",
  authMiddleware,
  tokenExpiryFlagMiddleware,
  landingPageController,
);
app.use(
  "/products",
  authMiddleware,
  tokenExpiryFlagMiddleware,
  productController,
);
app.use(
  "/categories",
  authMiddleware,
  tokenExpiryFlagMiddleware,
  categoryController,
);

//Response Middlewares
app.use(errorMiddleware);

app.use(express.static(path.join(__dirname, "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 3000}`);
});
