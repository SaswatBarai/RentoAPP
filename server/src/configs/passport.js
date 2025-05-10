import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/users-model.js";
import ApiError from "../utils/ApiError.js";
import { generator } from "generate-password";

passport.use(  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const isMatch = await user.MatchPassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(new ApiError(500, "Internal Server Error"));
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ email: profile?.emails[0].value });
        if (user) {
          return done(null, user);
        }        user = await userModel.create({
          fullname: profile.displayName,
          email: profile.emails[0].value,
          password: generator.generate({
            length: 10,
            numbers: true,
          }),
          phone: "", 
          role: "user",
        });
        return done(null, user);
      } catch (error) {
        return done(new ApiError(500, "Internal Server Error"));
      }
    }
  )
);

// Serialization & Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
