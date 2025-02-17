import jwt from "jsonwebtoken";
import { redis } from "./redis.js";

export const handleTokens = async (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

  const secureFlag = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
