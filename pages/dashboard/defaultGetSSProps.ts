import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

export default async (context: NextPageContext) => {
  const { req } = context;
  const session = await getSession({ req });
  if (!session)
    return {
      redirect: {
        destination: "/signin",
        statusCode: 302,
      },
    };

  return {
    props: {
      session: session,
    },
  };
};
