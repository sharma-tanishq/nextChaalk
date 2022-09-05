import { NextPageContext } from "next";

export default () => <></>;

export const getServerSideProps = async (context?: NextPageContext) => {
  return {
    redirect: {
      destination: "/dashboard/home",
      statusCode: 302,
    },
  };
};
