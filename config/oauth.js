import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/index.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "838195822163-pm2sfkao6ljk3ss64sous14e3rkbikva.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4500/auth/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cari atau buat user berdasarkan email dari profile Google
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
