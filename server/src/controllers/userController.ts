import { Request, Response } from "express";
import UserModel, {
  IUser,
  IUserResponse,
  IProfilePictureResponse,
} from "../models/User";

export async function getUserByEmail(req: Request, res: Response) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const user = await UserModel.findOne({
      email: email.toString().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function checkEmailExists(req: Request, res: Response) {
  try {
    const { email } = req.query;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({
      email: email.toString().toLowerCase(),
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: "User not found with this email",
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      message: "User exists",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking user existence",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Failed to reset password", error });
  }
}

const userToResponse = (user: IUser): IUserResponse => {
  const userObj = user.toObject();
  const response: IUserResponse = {
    _id: userObj._id.toString(),
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    role: userObj.role,
    isActive: userObj.isActive,
    createdAt: userObj.createdAt,
    updatedAt: userObj.updatedAt,
  };

  if (userObj.profilePicture) {
    response.profilePicture = {
      contentType: userObj.profilePicture.contentType,
      hasImage: true,
    };
  }

  return response;
};

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userToResponse(user));
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const updateCurrentUser = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    if (req.file) {
      user.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else if (req.body.removeProfilePicture === "true") {
      user.profilePicture = undefined;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: userToResponse(updatedUser),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ message: "Failed to update profile", error });
  }
};

export async function updateUser(
  req: Request & { file?: Express.Multer.File },
  res: Response
) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    if (req.file) {
      user.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else if (req.body.removeProfilePicture === "true") {
      user.profilePicture = undefined;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: userToResponse(updatedUser),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Failed to update user", error });
  }
}

export async function toggleUserActiveStatus(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: userToResponse(user),
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Failed to update user status", error });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });

    const safeUsers = users.map((user) => userToResponse(user));

    res.status(200).json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = userToResponse(user);

    if (user.profilePicture && user.profilePicture.data) {
      userResponse.profilePicture = {
        contentType: user.profilePicture.contentType,
        hasImage: true,
        dataUrl: `data:${
          user.profilePicture.contentType
        };base64,${user.profilePicture.data.toString("base64")}`,
      };
    }

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user", error });
  }
}

export async function createUser(
  req: Request & { file?: Express.Multer.File },
  res: Response
) {
  try {
    const userData: Partial<IUser> = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    if (req.file) {
      userData.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const newUser = new UserModel(userData);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: userToResponse(newUser),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Failed to create user", error });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: userToResponse(deletedUser),
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
}

export async function updateUserPassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password", error });
  }
}

export async function getUserProfilePicture(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user || !user.profilePicture || !user.profilePicture.data) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", user.profilePicture.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.set("Access-Control-Allow-Origin", "*");

    return res.send(user.profilePicture.data);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Failed to fetch profile picture", error });
  }
}
