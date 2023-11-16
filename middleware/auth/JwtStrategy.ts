import UserService from "../../modules/User/User.service";
import { ExtractJwt, Strategy } from "passport-jwt";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// This strategy will be used to check if the user is authenticated for the API
export default new Strategy(jwtOptions, async (payload, done) => {
  try {
    const { email, id } = payload;

    // Check if user with id and email exists
    const userService = new UserService();
    const user = await userService.findOneBy({ email, id });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});
