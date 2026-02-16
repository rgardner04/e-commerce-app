const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

router.post("/register", async (req, res) => {
  const { status, body } = await authService.register(req.body);
  return res.status(status).send(body);
});

router.post("/login", async (req, res) => {
  const { status, body } = await authService.login(req.body);
  return res.status(status).send(body);
});

router.post("/verify-email", async (req, res) => {
  const { status, body } = await authService.verifyEmail(req.body);
  return res.status(status).send(body);
});

router.post("/refresh", async (req, res) => {
  const { status, body } = await authService.refresh(req.body);
  return res.status(status).send(body);
});

module.exports = router;
