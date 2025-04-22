import mongoose from "mongoose";
import { Schema, model, Document } from "mongoose";
import { User } from "../types/interface";

// Define the schema
const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      minlength: 6,
      validate: {
        validator: function (value) {
          return (
            this.provider !== "google" || (this.provider === "google" && value)
          );
        },
      },
    },
    provider: { type: String, enum: ["google", "github"], default: "local" },
    confirmPassword: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// Export the model
const User = model<User>("User", userSchema);
export default User;
