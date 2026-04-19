const express = require("express");
const router = express.Router();
const landingPageService = require("../services/landingPageService");
const wrap = require("../utils/asyncWrapper");

router.get(
  "/",
  wrap(async (_req, res) => {
    const { status, body } = await landingPageService.getLandingPage();
    return res.status(status).send(body);
  }),
);

module.exports = router;
