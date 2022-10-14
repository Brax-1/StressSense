const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mongo_url: process.env.MONGO_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET
};
