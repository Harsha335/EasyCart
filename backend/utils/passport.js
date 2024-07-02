const passport = require("passport");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    },process.env.JWT_SECRET,{expiresIn: "5s"});
}
const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    },process.env.JWT_REFRESH_SECRET,{expiresIn: "7d"});
}

//GOOGLE OAUTH
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    passReqToCallback: true,
    scope: [ 'profile' ],
    state: true
  },
  async (req, accessToken, refreshToken, profile, cb) => {
    try {
      // Find or create user in the database
      console.log(profile);
      // for profile image --> profile.photos[0].value
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        const encryptedPassword = CryptoJS.AES.encrypt("pass@demo",process.env.SECRET_KEY).toString();
        user = new User({
          user_name: profile.displayName,
          email: profile.emails[0].value,
          password: encryptedPassword,
        });
        await user.save();
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Send tokens to the client
      return cb(null, { user, accessToken, refreshToken });
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = passport;