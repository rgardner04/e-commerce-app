const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const wrap = require("../utils/asyncWrapper");

router.get(
  "/page-data",
  wrap(async (_req, res) => {
    try {
      const { status, body } = authService.getAuthPageData();
      return res.status(status).send(body);
    } catch (error) {
      return res.status(500).send({});
    }
  }),
);

router.post(
  "/register",
  wrap(async (req, res) => {
    try {
      const { status, body } = await authService.register(req.body);
      return res.status(status).send(body);
    } catch (error) {
      return res.status(500).send({});
    }
  }),
);

router.post(
  "/login",
  wrap(async (req, res) => {
    const { status, body } = await authService.login(req.body);
    return res.status(status).send(body);
  }),
);

router.post(
  "/verify-email",
  wrap(async (req, res) => {
    const { status, body } = await authService.verifyEmail(req.body);
    return res.status(status).send(body);
  }),
);

router.post(
  "/resend-verification",
  wrap(async (req, res) => {
    const { status, body } = await authService.resendVerification(req.body);
    return res.status(status).send(body);
  }),
);

router.post(
  "/refresh",
  wrap(async (req, res) => {
    const { status, body } = await authService.refresh(req.body);
    return res.status(status).send(body);
  }),
);

module.exports = router;
