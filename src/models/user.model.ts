import { Service } from './service.model';
import { Document, Schema, model, SchemaTypes } from "mongoose";
import log from "../logging/logger";
import bcrypt from "bcrypt";
import config from "config";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  googleId: string; 
  services: Service['_id'][]; 
  time : number,
  createdAt : Date; 
  updatedAt : Date; 
  comparePasswords(candidatePassword : string ) : Promise<boolean>; 
}

const userSchema = new Schema<IUser>(
  {

    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: false, unique: true},
    services : [{ type : SchemaTypes.ObjectId, ref: 'Service'}],
    time: { type : Number, default: 0},
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next) {
  const user = this as IUser;
  const saltFactor = config.get<number>("saltFactor");

  if (!user.isModified("password")) {
    next();
  }

  const hash: string = bcrypt.hashSync(user.password, saltFactor);
  this.password = hash;
  this.time = 24; 
  next();
});

userSchema.method(
  "comparePasswords",
  async function (candidatePassword: string) {
    const user = this as IUser;
    return await bcrypt
      .compare(candidatePassword, user.password)
      .catch((error: any) => log.error("Error comparing passwords"));
  }
);

export const User = model("User", userSchema);
