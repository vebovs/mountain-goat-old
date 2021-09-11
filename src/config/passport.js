require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const UserDao = require('../dao/UserDao');
const userdao = new UserDao(process.env.USER_COLLECTION);

module.exports = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {

      // Match user
      userdao.find_user_by_username(username)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That username is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    userdao.find_user_by_id(id, (err, user) => {
      done(err, user);
    });
  });
};