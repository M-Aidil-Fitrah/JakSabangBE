const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}, 
async (accessToken, refreshToken, profile, done) => {
  try {
    // Cari user berdasarkan Google ID
    let user = await User.findOne({ email: profile.emails[0].value });

    // Kalau belum ada, buat user baru
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: "-", // dummy, karena login via Google
        role: "buyer", // default
        no_hp: "-",
        alamat: "-"
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize & deserialize user (kalau pakai session, optional)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
