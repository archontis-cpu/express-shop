const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/", authMiddleware, async (req, res) => {
  const { title, price, img } = req.body;
  const course = new Course({ title, price, img, userId: req.user });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
