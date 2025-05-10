import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/users-model.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAcessToken();
    const refreshToken = await user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const register = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;
    console.log(req.body);
    
    if ([fullname, email, phone, password].some((val) => val?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existUser = await userModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existUser) {
      throw new ApiError(400, "User with this email or phone already exists");
    }

    const newUser = await userModel.create({
      fullname,
      email,
      phone,
      password,
    });

    const createdUser = await userModel
      .findById(newUser._id)
      .select("-password -createdAt -updatedAt -refreshToken");

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user try again"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User register successfully"));
  } catch (error) {
    console.error("Registration error:", error);
    throw new ApiError(500, "Server Failed");
  }
});

//Local Strategy

const loginUser = asyncHandler(async (req, res, next) => {
  // Execute passport.authenticate with req, res, next
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new ApiError(401, "Invalid credentials");
      }

      const { accessToken, refreshToken } = await generateTokens(user._id);

      const loggedInUser = await userModel
        .findById(user._id)
        .select("-password -createdAt -updatedAt");

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "Successfully Login"
          )
        );
    } catch (error) {
      console.error("Login error:", error);
      throw new ApiError(500, "Server Failed");
    }
  })(req, res, next); 
});

const googleCallback = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await userModel
      .findById(user._id)
      .select("-password -createdAt -updatedAt");

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "Successfully Login"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error during Google authentication");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };
    
    // Clear the cookies with the JWT tokens
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    // If using JWT, update the user's refresh token in the database to invalidate it
    // This step is optional but recommended for security
    if (req.user?._id) {
      await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: { refreshToken: null }
        }
      );
    }

    // Send success response
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
      
  } catch (error) {
    console.error("Logout error:", error);
    throw new ApiError(500, "Error during logout");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
    

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await userModel.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});


export {register,loginUser,googleCallback,logout,refreshAccessToken}
