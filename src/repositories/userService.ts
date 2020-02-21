import axios from "axios";
import { injectable } from "inversify-props";
import { IUserService } from "./IUserService";

@injectable()
export class UserService implements IUserService {
  constructor() {}

  getCustomerById(id) {
    return "User Class";
  }
}
