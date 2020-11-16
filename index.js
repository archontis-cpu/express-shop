const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const hbs = require("handlebars");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const cartRoutes = require("./routes/cart");
const coursesRoutes = require("./routes/courses");

const User = require("./models/user");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

app.engine(
  "hbs",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(hbs),
    defaultLayout: "main",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5f9561b1ec3d43337c9486e3");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const user = "volodymyr";
    const password = "AWM49wbb36YRCk3J";
    const url = `mongodb+srv://${user}:${password}@cluster0.ywhhc.mongodb.net/shop`;

    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: "vrusynov@gmail.com",
        name: "Volodymyr",
        cart: { item: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log("Server is running on port: ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
