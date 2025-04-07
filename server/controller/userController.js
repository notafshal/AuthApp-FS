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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        status: "failed",
        message: "Password must be atleast 6 characters long",
      });
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
const getUsers = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`Select * from users`);
    if (!rows || rows.length === 0) {
      return res
        .status(400)
        .send({ status: "failed", message: "No Record Found" });
    }
    res.status(200).send({
      status: "success",
      message: "Record of all users",
      totalUsers: rows.length,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Error getting the data",
      error: err,
    });
  }
};
const getSingleUser = async (req, res) => {
  try {
    const db = req.db;
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).send({
        status: "failed",
        message: "Invalid ID",
      });
    }
    const [userRows] = await db.query(`Select * From users Where id = ?`, [
      userId,
    ]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      message: "User data and booking history retrieved successfully",
      data: {
        user: userRows[0],
      },
    });
  } catch (err) {
    console.log("Error fetching user", err.message || err);
    res.status(500).send({
      status: "failed",
      message: "Error fetching userData",
      error: err?.message,
    });
  }
};
module.exports = { registerUser, getUsers, getSingleUser };
