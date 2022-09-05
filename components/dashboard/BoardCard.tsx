import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import { getRandomHex } from "../../utils";
import styles from "./BoardCard.module.css";

interface BoardCardProps {
  imageUrl: string;
  name: string;
  id?: string;
}

const genBoardId = () => (+Date.now()).toString(36) + getRandomHex(8);

const defaultUrl =
  "https://mui.com/static/images/cards/contemplative-reptile.jpg";

const BoardCard: FC<BoardCardProps> = ({ imageUrl, name, id }) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        const boardId = id ?? genBoardId();
        router.push("/board/" + boardId);
      }}
      className={`${styles.wrapper}`}
      sx={{ width: 345 }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl ? imageUrl : defaultUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BoardCard;
