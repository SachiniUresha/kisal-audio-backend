// index.js
/*import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import cors from "cors";
import orderRouter from "./routes/orderRouter.js";
import messageRouter from "./routes/messageRouter.js";
import helmet from 'helmet';
import User from './models/user.js';

// ✅ Fix for express-openid-connect
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// ✅ Auth0 configuration
const config = {
  authRequired: false,          // don't force auth on every route
  auth0Logout: true,            // log out of Auth0 on logout
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  secret: process.env.SESSION_SECRET, // used to sign the session cookie
  routes: {
    login: '/auth/login',
    callback: '/auth/callback',
    logout: '/auth/logout'
  }
};

app.use(auth(config)); // adds /auth/login, /auth/logout, req.oidc

// ✅ Protected route example + DB linking
app.get('/profile', requiresAuth(), async (req, res) => {
  try {
    const auth0Id = req.oidc.user.sub;
    const email = req.oidc.user.email;

    // Link or create user in MongoDB
    let user = await User.findOne({ auth0Id });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.auth0Id = auth0Id;
        user.name = user.name || req.oidc.user.name;
        user.picture = user.picture || req.oidc.user.picture;
        await user.save();
      } else {
        user = await User.create({
          email,
          name: req.oidc.user.name,
          picture: req.oidc.user.picture,
          auth0Id
        });
      }
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ JWT middleware for API requests
app.use((req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) req.user = decoded;
    });
  }
  next();
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully...");
});

// ✅ API routes
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", messageRouter);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

// index.js
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import helmet from "helmet";
import User from "./models/user.js";
import auth0Routes from "./routes/auth0.js";

// Routes
import userRouter from "./routes/userRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import messageRouter from "./routes/messageRouter.js";

// Auth0
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// ✅ Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.SESSION_SECRET,
  routes: {
    login: "/auth/login",
    callback: "/auth/callback",
    logout: "/auth/logout"
  },
  authorizationParams: {
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email"
  }
};

app.use(auth(config));

// ✅ OIDC protected route
app.get("/profile", requiresAuth(), async (req, res) => {
  try {
    const auth0Id = req.oidc.user.sub;
    const email = req.oidc.user.email;

    let user = await User.findOne({ auth0Id });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.auth0Id = auth0Id;
        user.name = user.name || req.oidc.user.name;
        user.picture = user.picture || req.oidc.user.picture;
        await user.save();
      } else {
        user = await User.create({
          email,
          name: req.oidc.user.name,
          picture: req.oidc.user.picture,
          auth0Id
        });
      }
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// JWT middleware for API routes
app.use((req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) req.user = decoded;
    });
  }
  next();
});

// MongoDB
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully...");
});

// API routes
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", auth0Routes); // Auth0 routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
