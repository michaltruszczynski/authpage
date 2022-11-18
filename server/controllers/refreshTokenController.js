const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(401);
   console.log('cookies: ', cookies)

   const refreshToken = cookies.jwt;
   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // we send new refreshToken cookie with every request for new token, "old" refresh token is removed from coookie
   const foundUser = await User.findOne({ refreshToken }).exec();

   //Detected refresh token reuse! Refresh tokens can only be used once. When refresh token is used it is deleted.
   //Code below deals with situations when refreshtoken is used but it has already been deleted.
   // not included but you can also store tokens send to client and delete them as well when refresh token is compromized.
   if (!foundUser) {
      jwt.verify(
         refreshToken,
         process.env.REFRESH_TOKEN_SECRET,
         async (err, decoded) => {
            if (err) {
               console.log('dupa1')
               return res.sendStatus(403); // Forbiden
            }
            // find user which refresh token was compromized and delete all refresh tokens just in case
            const hackedUser = await User.findOne({
               username: decoded.username,
            }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
            console.log(result);
         }
      );
      console.log('dupa2')
      return res.sendStatus(403); // Forbidden
   }

   const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
   );

   // ewaluate JWT
   jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
         // case for expired refresh token
         if (err) {
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
         }
         if (err || foundUser.username !== decoded.username){
            console.log('dupa3')
            return res.sendStatus(403); //Forbiden
         }
           
         // refresh token was still valid
         const roles = Object.values(foundUser.roles).filter(Boolean);
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

         //Saing refreshToken with current user
         foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
         const result = await foundUser.save();
         //TODO secure: true
         res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: "true",
            maxAge: 24 * 60 * 60 * 1000,
         }); // secure: "true",
         res.json({ accessToken, roles });
      }
   );
};

module.exports = {
   handleRefreshToken,
};
