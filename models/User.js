import monogoose from "mongoose";

const userSchema = new monogoose.Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  imageUrl: {type: String, required: true},
  cartItems: {type: Object, default: {}},
}, {minimize: false});

const User = monogoose.models.User || monogoose.model("User", userSchema);

export default User;