const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const hbs = require("handlebars");
const exphbs = require("express-handlebars");
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const cartRoutes = require("./routes/cart");
const coursesRoutes = require("./routes/courses");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const user = "volodymyr";
const password = "AWM49wbb36YRCk3J";
const MONGODB_URI = `mongodb+srv://${user}:${password}@cluster0.ywhhc.mongodb.net/shop`;

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

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    // const candidate = await User.findOne();

    // if (!candidate) {
    //   const user = new User({
    //     email: "vrusynov@gmail.com",
    //     name: "Volodymyr",
    //     cart: { item: [] },
    //   });

    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log("Server is running on port: ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
