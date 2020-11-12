const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todos" }], // ref : doi chieu den model nao
  },
  {
    collection: "Users",
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.comparePassword = async function (password, cb) {
  try {
    if (await bcrypt.compare(password, this.password)) cb(null, this);
    else return cb(null, false);
  } catch (error) {
    return cb(error);
  }
};

module.exports = mongoose.model("Users", UserSchema);
