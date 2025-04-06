const express = require("express");
const dotenv = require("dotenv");
const initalizedDB = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Running Successfully</h1>");
});

(async () => {
  try {
    const dbPool = await initalizedDB();
    app.use((req, res, next) => {
      req.db = dbPool;
      next();
    });
    app.use("/api/users", userRouter);
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start app", err);
  }
})();
