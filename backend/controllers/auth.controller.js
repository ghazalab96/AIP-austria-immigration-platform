const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUsers, saveUsers } = require("../utils/db");


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = getUsers();

    // check existing user
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User created",
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = getUsers();

    // find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT 
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};