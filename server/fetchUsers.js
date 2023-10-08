const mongoose = require("mongoose");
mongoose.set('debug', true);

const User = require("./src/models/userModels");

mongoose.connect("mongodb://localhost:27017/area_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  const users = await User.find({});

  for (let user of users) {
    const googleServiceInfo = user.connectServices.get("google");
    console.log(`User: ${user.username}`);
    console.log("Google Connect Services Info:");
    console.log(googleServiceInfo);
    console.log('---------------------------------');
  }

  mongoose.connection.close();
});
