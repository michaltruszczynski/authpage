const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      const respond = await mongoose.connect(process.env.DATABASE_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log("DB connected");
   } catch (err) {
      console.log(err);
   }
};

module.exports = connectDB;
