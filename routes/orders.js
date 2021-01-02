const { Router, request } = require("express");
const Order = require("../models/order.js");
const authMiddleware = require("../middleware/auth");
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );

    res.render("orders", {
      isOrder: true,
      title: "Order",
      orders: orders.map((order) => ({
        ...order._doc,
        price: order.courses.reduce((total, course) => {
          return (total += course.count * course.course.price);
        }, 0),
      })),
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = user.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
