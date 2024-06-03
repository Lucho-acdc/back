import passport from 'passport';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import UserModel from '../models/userModel.js';

const initializePassport = () => {
  
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          console.log('Usuario no encontrado.');
          return done(null, false, { message: 'Usuario no encontrado.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return done(err);
          }
          console.log('Password match:', isMatch);

          if (!isMatch) {
            console.log('Contraseña incorrecta.');
            return done(null, false, { message: 'Contraseña incorrecta.' });
          }

          return done(null, user); 
        });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/users/githubSession"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await UserModel.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          lastname: ' ',
          password: crypto.randomBytes(10).toString('hex')
        });
        console.log('New user created:', user);
      } else {
        console.log('User found:', user);
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in GitHub auth callback:', error);
      return done(error);
    }
  }
));


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error, null);
    }
  });
};

export default initializePassport;
