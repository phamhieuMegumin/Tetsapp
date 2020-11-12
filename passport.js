const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const JwtStrategy = require("passport-jwt").Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

//authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "PhamHieu",
    },
    async (payload, done) => {
      try {
        const user = await User.findById({ _id: payload.sub });
        if (user) return done(null, user);
        else return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//autheticated local strategy using username and password

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      // something went wrong with database
      if (err) return done(err);
      // if no user exist
      if (!user) return done(null, false);
      // check if password is correct
      user.comparePassword(password, done);
    });
  })
);
