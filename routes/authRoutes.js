import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import jwtSecret from "../utils/auth_config.js";

const router = express.Router();

// Login dengan Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: "1" }, jwtSecret, {
      expiresIn: "8h",
    });

    console.log("token", token);

    res.json({ token });
  }
);

router.get("/get_token", (req, res) => {
  // Generate JWT token
  const token = jwt.sign({ id: "1" }, jwtSecret, {
    expiresIn: "8h",
  });

  res.json({ message: "Get token successful", token });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.redirect("/");
  });
});

export default router;
