const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 8080;
const bcrypt = require("bcryptjs");

// MONGODB CONNECTION
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect to Database");
  } catch (err) {
    console.log("Database connection error:", err);
  }
};
connectDB();

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: String,
  image: String,
});

// model
const userModel = mongoose.model("user", userSchema);

// API
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const data = new userModel({
        ...req.body,
        password: hashedPassword,
        confirmPassword: hashedPassword // Ensure we don't save confirmPassword in plain text either, or just remove it
      });
      await data.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error", alert: false });
  }
});

//api login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      // Compare password
      const isMatch = await bcrypt.compare(password, result.password);
      
      if (isMatch) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          image: result.image,
        };
        res.send({
          message: "Login is successful",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Invalid password",
          alert: false,
        });
      }
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error", alert: false });
  }
});

//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  try {
    const data = new productModel(req.body);
    await data.save();
    res.send({ message: "Upload successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Upload failed" });
  }
});

// get product
app.get("/product", async (req, res) => {
  const sampleData = [
    {
      _id: "sample1",
      name: "Fresh Strawberry",
      category: "fruits",
      image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=200&h=200",
      price: "120",
      description: "Freshly picked organic strawberries."
    },
    {
      _id: "sample2",
      name: "Organic Broccoli",
      category: "vegetable",
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=200&h=200",
      price: "60",
      description: "Green and healthy organic broccoli."
    },
    {
      _id: "sample3",
      name: "Vanilla Ice Cream",
      category: "icream",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?auto=format&fit=crop&w=200&h=200",
      price: "150",
      description: "Creamy vanilla ice cream."
    },
    {
      _id: "sample4",
      name: "Cheese Pizza",
      category: "pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&h=200",
      price: "299",
      description: "Hot and cheesy pizza."
    },
    {
      _id: "sample5",
      name: "Fresh Tomato",
      category: "vegetable",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=200",
      price: "40",
      description: "Red and juicy tomatoes."
    },
    {
      _id: "sample6",
      name: "Beef Burger",
      category: "burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&h=200",
      price: "180",
      description: "Juicy beef burger with cheese."
    }
  ];

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected, returning sample data");
      return res.send(JSON.stringify(sampleData));
    }
    let data = await productModel.find({}).maxTimeMS(2000);
    if (data.length === 0) {
      data = sampleData;
    }
    res.send(JSON.stringify(data));
  } catch (err) {
    console.log("Returning sample data due to error:", err.message);
    res.send(JSON.stringify(sampleData));
  }
});

/*****payment getWay */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1NBY3pSIdZYVEHlOjpjx9hLn" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

app.listen(PORT, () => console.log("Server is running at port: " + PORT));
// om12345
