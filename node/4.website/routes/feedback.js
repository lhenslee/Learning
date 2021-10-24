const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const validations = [
  check("name").trim().isLength({ min: 3, max: 30 }).escape().withMessage("A name is required"),
  check("email").trim().isEmail().normalizeEmail().withMessage("A normal email is required"),
  check("title").trim().isLength({ min: 3, max: 40 }).escape().withMessage("A title is required"),
  check("message")
    .trim()
    .isLength({ min: 5, max: 255 })
    .escape()
    .withMessage("A message is required"),
];

module.exports = params => {
  const { feedbackService } = params;

  router.get("/", async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback ? req.session.feedback.message : false;
      req.session.feedback = {};

      return res.render("layout", {
        pageTitle: "Feedback",
        template: "feedback",
        feedback,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post("/", validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect("/feedback");
      }

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: "Thank you for your feedback",
      };
      return res.redirect("/feedback");
    } catch (err) {
      return next(err);
    }
  });

  router.get("/api", async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();
      return res.json(feedback);
    } catch (err) {
      return next(err);
    }
  });

  router.post("/api", validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors);
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json(feedback);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
