const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleLogin = async (req, res) => {
   const cookies = req.cookies;

   const { user, pwd } = req.body;
   if (!user || !pwd)
      return res
         .status(400)
         .json({ message: "Username and password are required." });

   const foundUser = await User.findOne({ username: user }).exec();

   if (!foundUser) return res.status(401).json({ message: "Not autorized" });

   // evaluate password
   const match = await bcrypt.compare(pwd, foundUser.password);

   if (match) {
      const roles = Object.values(foundUser.roles).filter(Boolean);
      //create JWT
      const accessToken = jwt.sign(
         {
            UserInfo: {
               username: foundUser.username,
               roles: roles,
            },
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: "30s" }
      );
      const newRefreshToken = jwt.sign(
         { username: foundUser.username },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: "1d" }
      );

      const newRefreshTokenArray = !cookies?.jwt
         ? foundUser.refreshToken
         : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
         res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
         });
      }

      //Saing refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log(result);

      // creates secure cookie with refresh token
      //TODO secure: true
      res.cookie("jwt", newRefreshToken, {
         httpOnly: true,
         sameSite: "None",
         secure: "true",
         maxAge: 24 * 60 * 60 * 1000,
      }); // secure: "true",

      // send authorization roles and access token to user
      res.json({ success: `User ${user} is logged in.`, accessToken, roles });
   } else {
      res.status(401).json({ message: "Passord is incorrect" });
   }
};

module.exports = {
   handleLogin,
};
