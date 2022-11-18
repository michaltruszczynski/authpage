const User = require("../model/User");

const handleLogout = async (req, res) => {
   // on client also delete the accessToken
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(204); // No content
   const refreshToken = cookies.jwt;

   // Check if refreshtoken is in DB

   const foundUser = await User.findOne({ refreshToken }).exec();

   // we have cookie we do not have user
   if (!foundUser) {
      res.clearCookie("jwt", {
         httpOnly: true,
         sameSite: "None",
         secure: true,
      });
      return res.sendStatus(204);
   }
   // we have cookie we have coresponding user
   // we need to delete refreshtoken in DB
   foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
   );
   const result = await foundUser.save();
   console.log(result);

   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // in production secure true - only serve on https
   res.sendStatus(204);
};

module.exports = {
   handleLogout,
};
