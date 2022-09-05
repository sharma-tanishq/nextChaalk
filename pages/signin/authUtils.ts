import { Session } from "next-auth";
import { useSettingsContext } from "../../contexts/settings";
import { UserType } from "../../prisma/enums";
import { canDeEscalateClient } from "../../prisma/perms";

export interface ClientUserData {
  createdAt: string;
  email: string;
  emailVerified: Boolean | null;
  image: string;
  name: string;
  type: UserType;
  updatedAt: string;
}

export const getDeEscalatedUser = (
  user: ClientUserData,
  userType: UserType
) => {
  if (!canDeEscalateClient(user.type) || userType > user.type) return user;
  return {
    ...user,
    type: userType,
  };
};

export const getUser = (session: Session) => {
  const { settings } = useSettingsContext();
  let user = session.user as ClientUserData;
  user = getDeEscalatedUser(user, settings.clientDeEscalation);
  return user;
};
