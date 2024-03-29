import UserService from "../../modules/User/User.service";
import * as LocalStrategy from "passport-local";

export default new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done) => {
    try {
      // find user with email
      const userService = new UserService();
      // console.log("Localstrat") -> ok
      const user = await userService.findByEmailWithPassword(email);
      // console.log(user) -> ok
      if (user) {

        // If found, check if password matches
        const check = await user.checkPassword(password);
        if (check) {
          // Correct email anc password conbination. Pass user to request
          const user = await userService.findOneBy({
            email: email,
          });
          // console.log(user) -> ok
          return done(null, user);
        }
      }
      // Wrong email and password combination. Not allowed
      return done(null, null);
    } catch (e) {
      return done(e, null);
    }
  }
);
