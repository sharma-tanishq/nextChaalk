import { FC } from "react";
import Board from "../../components/board/Board";

interface BoardPageProps {}

const BoardPage: FC<BoardPageProps> = () => {
  return <><Board initSlide={0} initScene={""} /></>;
};

export default BoardPage;
