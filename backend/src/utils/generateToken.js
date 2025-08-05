import jwt from "jsonwebtoken";

const generateToken = (res, userId, userRole) => {
  const token = jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token akan berlaku selama 30 hari
  });

  return token;
};

export default generateToken;
