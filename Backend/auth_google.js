const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('./models/users');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.obtenerPorId(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const googleId = profile.id;
      const email = profile.emails[0].value;
      const username = profile.displayName || email.split('@')[0];
      const avatar = profile.photos[0]?.value || null;
      const email_verified = profile.emails[0].verified;

      let user = await userModel.buscarPorProveedorId('google', googleId);

      if (!user) {
        user = await userModel.buscarPorEmail(email);
        
        if (user) {
          return done(null, false, { message: 'Email ya registrado con otro método' });
        }

        const userId = await userModel.crearDesdeOAuth({
          email,
          provider: 'google',
          provider_id: googleId,
          username,
          avatar,
          email_verified
        });

        user = await userModel.obtenerPorId(userId);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));