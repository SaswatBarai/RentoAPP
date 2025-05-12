import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/users-model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import axios from "axios";
import genrator from "generate-password";
import { oauth2Client } from "../configs/googleConfig.js";

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

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    
    if ([email, password].some((val) => val.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiResponse(401, "Invalid Credentials");
    }
  
    let isMatch = await user.MatchPassword(password);
    if (!isMatch) {
      throw new ApiResponse(401, "Invalid Credentials");
    }
    console.log(isMatch);
    
  
    const { accessToken, refreshToken } = await generateTokens(user._id);
    const loggedInUser = await userModel
      .findById(user._id)
      .select("-password -createdAt -updatedAt");
  
    if (!loggedInUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "User authentication failed"));
    }
  
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
          "Successfully logged in with Google"
        )
      );
  } catch (error) {
    throw new ApiError(500,"Server Error");
  }
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  try {
    const accessToken = req.query.code;
    console.log(accessToken);

    if (!accessToken) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Access token not found"));
    }
    try {
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      console.log(userRes.data);

      if (!userRes || !userRes.data) {
        console.error("Failed to fetch Google user data");
        return res
          .status(400)
          .json(
            new ApiResponse(400, null, "Failed to fetch user data from Google")
          );
      }

      const { name, email, picture } = userRes.data;
      if (!email) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Invalid user data from Google"));
      }

      let user = await userModel.findOne({ email });
      if (!user) {
        // Create a new user if doesn't exist
        user = await userModel.create({
          fullname: name || "Google User",
          email,
          password: genrator.generate({
            length: 12,
            numbers: true,
            symbols: true,
          }),
          profilePicture: picture || "",
        });
      }

      const { acToken, refreshToken } = await generateTokens(user._id);
      const loggedInUser = await userModel
        .findById(user._id)
        .select("-password -createdAt -updatedAt");

      if (!loggedInUser) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "User authentication failed"));
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", acToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "Successfully logged in with Google"
          )
        );
    } catch (googleError) {
      console.error("Google API error:", googleError.message);
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Error communicating with Google API")
        );
    }
  } catch (error) {
    console.error("Server error in Google login:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Server error during login"));
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
      await userModel.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: null },
      });
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

export { register, loginUser, logout, refreshAccessToken, loginWithGoogle };
