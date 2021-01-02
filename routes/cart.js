const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");

function mapCartItems(cart) {
  return cart.items.map((course) => {
    return {
      ...course.courseId._doc,
      count: course.count,
      id: course.courseId.id,
    };
  });
}

function computePrice(courses) {
  return courses.reduce((accumulator, course) => {
    return (accumulator += course.price * course.count);
  }, 0);
}

const router = Router();

router.post("/add", authMiddleware, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

router.get("/", authMiddleware, async (req, res) => {
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCartItems(user.cart);

  res.render("cart", {
    title: "Cart",
    isCard: true,
    courses: courses,
    price: computePrice(courses),
  });
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCartItems(user.cart);

  const cart = {
    courses,
    price: computePrice(courses),
  };

  res.status(200).json(cart);
});

module.exports = router;
