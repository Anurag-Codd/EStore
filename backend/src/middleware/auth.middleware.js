import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { redis } from "../utilities/redis.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      let decodedAccess;
      try {
        decodedAccess = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          const decoded = jwt.decode(accessToken);
          if (!decoded?.userId) {
            return res.status(403).json({ message: "Invalid token structure" });
          }

          const refreshToken = await redis.get(
            `refresh_token:${decoded.userId}`
          );
          if (!refreshToken) {
            return res
              .status(403)
              .json({ message: "Session expired - please log in again" });
          }

          const verified = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );

          const newAccessToken = jwt.sign(
            { userId: verified.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            path: "/",
            maxAge: 18 * 60 * 1000,
          });

          decodedAccess = verified;
        } else {
          throw error;
        }
      }

      const user = await User.findById(decodedAccess.userId).select(
        "-password"
      );

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("protectRoute error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
