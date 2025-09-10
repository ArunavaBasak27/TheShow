import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log("Middleware");
    console.log(req);
    const token = req.cookies.token;
    console.log(token);
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
