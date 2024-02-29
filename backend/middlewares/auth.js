const axios = require("axios");

const auth =  async(req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      const response = await axios.post(
        "https://commonapi.sanimabank.com:8091/api/verify/token",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success === true) {
        req.user = response.data;
        next();
      } else {
        res.status(401).json({ error: "Invalid token" });
      }
    } else {
      res.status(401).json({ error: "No token" });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
