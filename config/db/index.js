const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost/UsersList", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect faile");
  }
}
module.exports = { connect };
