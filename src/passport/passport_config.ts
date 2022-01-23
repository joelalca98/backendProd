import passport from "passport";
import { OAuth2Strategy, Profile, VerifyFunction } from "passport-google-oauth";
import { get, identity } from "lodash";
import config from "config";
import { createUserFromGoogle } from "../services/user.service";


export function setUpPassport(){
const client_id = config.get("client_id") as string;
const client_secret = config.get("client_secret") as string;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user , done) {
    done(null,user as any);
})

const strategy = new OAuth2Strategy(
  {
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8080/",
  },
  async function (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyFunction
  ) {
      const { id, displayName} = profile; 
      const email = get(profile,'emails[0].value'); 
      console.log(id, displayName, email); 

      await createUserFromGoogle(displayName,id,email);
      
      return done(null,profile); 
  }
);

passport.use(strategy); 

}


