import workerServiceRepository from "./repositories/workerService";
import customerServiceRepository from "./repositories/customerService";

// This is the place where you set up all
// of your dependencies. You can switch
// repositories or change the implementation
// details of a repository without having to
// touch all of the components which use it.
export default {
  workerServiceRepository,
  customerServiceRepository
};
