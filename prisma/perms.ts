import { UserType } from "./enums";

export const isCreator = (userType: UserType) => {
  return [UserType.admin, UserType.owner, UserType.designer].includes(userType);
};

export const canDeEscalateClient = (userType: UserType) => {
  return [UserType.admin, UserType.owner, UserType.designer].includes(userType);
};
