const pool = require("../database/db");
const fs = require("fs");
const path = require("path");

// CREATE USER
exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const image = req.file?.filename;
  
  const result = await pool.query(
    "INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING *",
    [name, email, image]
  );
  res.status(201).json(result.rows[0]);
};

// GET USER
exports.getUsers = async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const newImage = req.file?.filename;

    const existingUserRes = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (existingUserRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUser = existingUserRes.rows[0];

    if (newImage && existingUser.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        existingUser.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imageToUpdate = newImage || existingUser.image;

    const updateQuery = `
      UPDATE users
      SET name = $1, email = $2, image = $3
      WHERE id = $4
      RETURNING *
    `;
    const updateValues = [name, email, imageToUpdate, id];
    const updatedUserRes = await pool.query(updateQuery, updateValues);

    res.json(updatedUserRes.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  const imgRes = await pool.query("SELECT image FROM users WHERE id = $1", [
    id,
  ]);
  if (imgRes.rows.length) {
    const img = imgRes.rows[0].image;
    if (img) {
      const imgPath = path.join(__dirname, "..", "uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
  }
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json({ message: "User deleted" });
};
