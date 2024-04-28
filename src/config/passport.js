import passport from 'passport';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import UserModel from '../models/userModel.js';


const initializePassport = () => {

    passport.use(new LocalStrategy({ usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
          }
    
          const match = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
        };
          if (!match) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
          }
    
          return done(null, user);
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
            user = await UserModel.create({ email: profile.emails[0].value, name: profile.displayName, lastname: ' ', password: crypto.randomBytes(10).toString('hex') });
          }
          return done(null, user);
        } catch (error) {
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
        done(error, null);
      }
    });
};

export default initializePassport;
