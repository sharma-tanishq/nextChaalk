import { NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { FC } from "react";
import BoardCard from "../../components/dashboard/BoardCard";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { isCreator } from "../../prisma/perms";
import { getUser } from "../signin/authUtils";
import defaultGetSSProps from "./defaultGetSSProps";
import styles from "./home.module.css";

interface DashboardHomeProps {
  session: Session;
}

const DashboardHome: FC<DashboardHomeProps> = ({ session }) => {
  const user = getUser(session);
  return (
    <DashboardShell session={session}>
      <span className={`${styles.header}`}>Templates:</span>
      <div className={`${styles.templateWrapper}`}>
        <BoardCard
          imageUrl={"/assets/blankboard.svg"}
          name={`${
            isCreator(user?.type ?? 0) ? "Create Template" : "Start Blank"
          }`}
        />
        <BoardCard imageUrl={""} name={"some name1"} />
        <BoardCard imageUrl={""} name={"some name2"} />
        <BoardCard imageUrl={""} name={"some name3"} />
        <BoardCard imageUrl={""} name={"some name4"} />
        <BoardCard imageUrl={""} name={"some name5"} />
      </div>
      <span className={`${styles.header}`}>Boards:</span>
      <div className={`${styles.templateWrapper}`}>
        <BoardCard imageUrl={""} name={"."} />
        <BoardCard imageUrl={""} name={"some other name1"} />
        <BoardCard imageUrl={""} name={"some other name2"} />
        <BoardCard imageUrl={""} name={"some other name3"} />
        <BoardCard imageUrl={""} name={"some other name4"} />
        <BoardCard imageUrl={""} name={"some other name5"} />
      </div>
    </DashboardShell>
  );
};

export const getServerSideProps = defaultGetSSProps;

export default DashboardHome;
