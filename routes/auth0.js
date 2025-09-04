import express from "express";
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import User from "../models/user.js";
import jwtSign from "jsonwebtoken";

const router = express.Router();

// JWT middleware to verify Auth0 token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE, // ← audience applied here
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

// Auth0 Google login endpoint
router.post("/auth0", checkJwt, async (req, res) => {
  try {

    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized: No token data" });
    }
    
    const { sub, name, email, picture } = req.auth;

    // Sync user in database
    const user = await User.findOneAndUpdate(
      { auth0Id: sub },
      { name, email, picture },
      { upsert: true, new: true }
    );

    // Optionally, generate your own JWT for frontend
    /*const token = jwtSign.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );*/

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
