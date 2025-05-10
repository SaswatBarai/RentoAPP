import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/users-model.js";

// Logout handler for both local and Google authentication
const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  
  // If using passport's logout
  req.logout(function(err) {
    if (err) {
      return res.status(500).json(
        new ApiResponse(500, {}, "Error during logout")
      );
    }
    
    return res.status(200).json(
      new ApiResponse(200, {}, "Logged out successfully")
    );
  });
});

export { logout };
