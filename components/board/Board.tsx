import { FC } from "react";
import { Scene } from "../../core/engine/scene/Scene";

export type Slides = Scene["elements"][];

interface BoardProps {
  initSlide: number;
  initScene: string;
}

const Board: FC<BoardProps> = () => {
  return <div></div>;
};

export default Board;
