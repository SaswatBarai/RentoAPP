import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/users-model.js";
import passport from "passport";

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
    if ([fullname, email, phone, password].some((val) => val?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existUser = userModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existUser) {
      throw new ApiError(400, "Something went wrong");
    }

    const newUser = await userModel({
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
    throw new ApiError(500, "Server Failed");
  }
});

//Local Strategy

const loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
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
      throw new ApiError(500, "Server Failed");
    }
  });
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
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    req.logout(function (err) {
      if (err) {
        throw new ApiError(200, "Error during logout");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
    });
  } catch (error) {
    throw new ApiError(500, "Server Failed");
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
