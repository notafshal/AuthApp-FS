const bcrypt = require("bcrypt");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const db = req.db;
    if (!fullName) {
      return res
        .status(400)
        .send({ status: "failed", message: "Name is missing!!!" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ status: "failed", message: "Email is missing!!!" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: "failed", message: "Password is missing!!!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      `Insert Into users(fullName,email,password) Values (?,?,?)`,
      [fullName, email, hashedPassword]
    );
    if (!result || result.affectedRows === 0) {
      return res
        .status(500)
        .send({ status: "failed", message: "Error in insert Query" });
    }
    res.status(200).send({
      status: "success",
      message: "New User Added",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "Error Creating a new User",
      error: err.message,
    });
  }
};

module.exports = { registerUser };
