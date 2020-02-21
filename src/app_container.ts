import { IUserService } from "./repositories/IUserService";
import { UserService } from "./repositories/userService";
import { TUserService } from "./repositories/TuserService";
import { container } from "inversify-props";

export function containerBuilder() {
  container.addSingleton<IUserService>(UserService);
  container.addSingleton<IUserService>(TUserService);
}
