// passport config
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from '../utils/db.server';
import bcrypt from 'bcrypt'; 


passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
  }, async (email, password, done) => {
    // find user in database
    const user = await db.user.findUnique({
      where: {
        email
      }
    });
    // if user not found
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    // if password is incorrect
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // if user found and password is correct
      return done(null, user);
    }
    );
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await db.user.findUnique({
    where: {
      id
    }
  });
  done(null, user);
});

export default passport;




