import { IUserService } from "./IUserService";
import { injectable } from "inversify-props";

@injectable()
export class TUserService implements IUserService {
  getCustomerById(id) {
    return "test Class";
  }
}
