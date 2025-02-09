import passport from "passport";
import { User } from "../models/index.js";

export const login = (req, res) => {
  res.redirect("/auth/login");
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.redirect("/");
  });
};

export const oauthCallback = (req, res) => {
  res.redirect("/");
};
