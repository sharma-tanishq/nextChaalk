import { mat4 } from "gl-matrix";
import { FC, MutableRefObject } from "react";
import { WorkingMode } from "../../core/engine/enums";
import { Scene } from "../../core/engine/scene/Scene";
import AppBar from "@mui/material/AppBar";
import {
  Avatar,
  IconButton,
  Slider,
  Toolbar as TB,
  Tooltip,
  Zoom,
} from "@mui/material";
import Image from "next/image";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
  setworkingMode: (arg: WorkingMode) => void;
  sceneRef: MutableRefObject<Scene>;
  setmultiselect: (arg: boolean) => void;
  multiselect: boolean;
  workingMode: WorkingMode;
  setscale: (arg: number) => void;
  scale: number;
}

const workingModeTools = [
  {
    alt: "Selection Tool",
    src: "/assets/svg/cursor.svg",
    workingMode: WorkingMode.selection,
  },
  {
    alt: "Pen Tool",
    src: "/assets/svg/brush.svg",
    workingMode: WorkingMode.pen,
  },
  {
    alt: "Pan Tool",
    src: "/assets/svg/hand-paper-regular.svg",
    workingMode: WorkingMode.pan,
  },
  {
    alt: "Highlighter Tool",
    src: "/assets/svg/highlighter-solid.svg",
    workingMode: WorkingMode.highlighter,
  },
  {
    alt: "Eraser Tool",
    src: "/assets/svg/eraser.svg",
    workingMode: WorkingMode.eraser,
  },
  {
    alt: "Rectangle Tool",
    src: "/assets/svg/square.svg",
    workingMode: WorkingMode.rectangle,
  },
  {
    alt: "Ellipse Tool",
    src: "/assets/svg/circle.svg",
    workingMode: WorkingMode.ellipse,
  },
];

const Toolbar: FC<ToolbarProps> = ({
  setworkingMode,
  sceneRef,
  setmultiselect,
  multiselect,
  setscale,
  scale,
  workingMode,
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        position: "fixed",
        justifyContent: "center",
        bottom: 0,
        left: 0,
        height: "4rem",
      }}
    >
      <AppBar className={`${styles.appBar}`}>
        <TB>
          {workingModeTools.map((entry) => (
            <Tooltip
              TransitionComponent={Zoom}
              title={
                <span className={`${styles.toolTip}`}>{`${
                  entry.alt.split(" ")[0]
                }`}</span>
              }
              arrow
            >
              <IconButton
                key={entry.alt}
                onClick={() => {
                  setworkingMode(entry.workingMode);
                }}
                className={`${styles.icon} ${
                  workingMode === entry.workingMode && styles.iconActive
                }`}
                color="inherit"
                size="medium"
              >
                <Image
                  width={"26px"}
                  height={"26px"}
                  layout="fixed"
                  src={entry.src}
                  alt={entry.alt}
                />
              </IconButton>
            </Tooltip>
          ))}

          {/* Multiselect */}
          <Tooltip
            TransitionComponent={Zoom}
            title={<span className={`${styles.toolTip}`}>Multiselect</span>}
            arrow
          >
            <IconButton
              onClick={() => {
                setmultiselect(!multiselect);
              }}
              className={`${styles.icon} ${multiselect && styles.iconActive}`}
              color="inherit"
              size="medium"
            >
              <Image
                width={"26px"}
                height={"26px"}
                layout="fixed"
                src="/assets/svg/multiselect.svg"
                alt="Multiselect Toggle"
              />
            </IconButton>
          </Tooltip>

          {/* Recenter */}
          <Tooltip
            TransitionComponent={Zoom}
            title={<span className={`${styles.toolTip}`}>Recenter</span>}
            arrow
          >
            <IconButton
              onClick={() => {
                if (sceneRef.current) sceneRef.current.view = mat4.create();
              }}
              className={`${styles.icon}`}
              color="inherit"
              size="medium"
            >
              <Image
                width={"26px"}
                height={"26px"}
                layout="fixed"
                src="/assets/svg/arrow-left-short.svg"
                alt="Recenter"
              />
            </IconButton>
          </Tooltip>
        </TB>
      </AppBar>
      <Slider
        className={`${styles.scaleSlider}`}
        onChange={(_, value) => {
          setscale(+value / 100);
          if (sceneRef.current)
            mat4.scale(sceneRef.current.view, sceneRef.current.view, [
              scale / mat4.getScaling([0, 0, 0], sceneRef.current.view)[0],
              scale / mat4.getScaling([0, 0, 0], sceneRef.current.view)[1],
              1,
            ]);
        }}
        min={10}
        max={190}
        orientation="vertical"
        value={scale * 100}
        defaultValue={scale * 100}
        aria-label="Default"
        valueLabelDisplay="auto"
      />
    </div>
  );
};

export default Toolbar;
