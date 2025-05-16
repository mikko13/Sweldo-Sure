import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

interface IProfilePicture {
  data: Buffer;
  contentType: string;
}

export interface IProfilePictureResponse {
  contentType: string;
  hasImage: boolean;
  dataUrl?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: IProfilePicture;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: IProfilePictureResponse;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
