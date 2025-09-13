export const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw new Error("user not logged in");
      }

      if (!roles.includes(user.role)) {
        throw new Error("You are not authorized to proceed");
      }
      next();
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
};
