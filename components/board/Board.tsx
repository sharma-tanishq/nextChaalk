import { mat4 } from "gl-matrix";
import { FC, useEffect, useRef, useState } from "react";
import { addImage, addVideo } from "../../core/engine/elements/elements";
import { sampleElements } from "../../core/engine/elements/sample";
import { WorkingMode } from "../../core/engine/enums";
import {
  keepTrackOfPointer,
  getPointerDelta,
  pageCoordsToCanvas,
} from "../../core/engine/pointer";
import {
  getAllPrograms,
  Programs,
} from "../../core/engine/renderer/programs/programs";
import { renderWebGLScene } from "../../core/engine/renderer/render";
import { getWebGLScene, Scene } from "../../core/engine/scene/Scene";
import { fSetSize } from "../../core/engine/scene/webglInit";
import { Maybe } from "../../utils";
import Toolbar from "./Toolbar";

export type Slides = Scene["elements"][];

let programs: Maybe<Programs>;

const preventDefault = (ev: Event) => {
  ev.preventDefault();
};

interface BoardProps {
  initSlide: number;
  initScene: string;
}

const Board: FC<BoardProps> = () => {
  const requestRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const sceneRef = useRef<Maybe<Scene>>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setloaded] = useState(false);
  const [pointerActive, setpointerActive] = useState(false);
  const [workingMode, setworkingMode] = useState(WorkingMode.selection);
  const [multiselect, setmultiselect] = useState(false);
  const [scale, setscale] = useState(1);

  /**
   * HANDLER SECTION
   */

  const handlePointerDown = (ev: MouseEvent | TouchEvent) => {
    if (sceneRef.current)
      keepTrackOfPointer(ev, canvasRef.current, sceneRef.current.view);
    setpointerActive(true);
    if (sceneRef.current) {
      sceneRef.current.pendingPointerState.activated = true;
    }
  };

  const handlePointerUp = () => {
    setpointerActive(false);
    if (sceneRef.current) {
      sceneRef.current.pendingPointerState.released = true;
    }
  };

  /**
   * EFFECTS SECTION
   */

  /**
   * load the scene and programs
   */
  useEffect(() => {
    if (!sceneRef.current && canvasRef.current)
      sceneRef.current = getWebGLScene(canvasRef.current, sampleElements);
    if (sceneRef.current && !programs) {
      programs = getAllPrograms(sceneRef.current.gl);

      if (!programs) {
        console.error(`
            Some programs necessary for
            the functioning of this app
            couldn't be loaded
          `);
      } else {
        setloaded(true);
      }
    }
  }, []);

  /**
   * don't let the browser handle drag and drop,
   * we're doing it ourselves
   */
  useEffect(() => {
    window.addEventListener("dragover", preventDefault, false);
    window.addEventListener("drop", preventDefault, false);

    return () => {
      window.removeEventListener("dragover", preventDefault, false);
      window.removeEventListener("drop", preventDefault, false);
    };
  }, []);

  /** Keep track of cursor */
  useEffect(() => {
    const cursorTrack = (ev: MouseEvent | TouchEvent) => {
      if (sceneRef.current)
        keepTrackOfPointer(ev, canvasRef.current, sceneRef.current.view);
    };

    document.addEventListener("mousemove", cursorTrack);
    document.addEventListener("touchmove", cursorTrack);

    return () => {
      document.removeEventListener("mousemove", cursorTrack);
      document.removeEventListener("touchmove", cursorTrack);
    };
  }, []);

  /**
   * Handle touch events cuz
   * react doesn't support disabling passive
   * events the normal way
   */
  useEffect(() => {
    if (canvasRef.current) {
      /** Preventing defaults */
      const touchDown = (ev: TouchEvent) => {
        ev.preventDefault();
        handlePointerDown(ev);
      };

      const touchUp = (ev: TouchEvent) => {
        ev.preventDefault();
        handlePointerUp();
      };

      /** Cleanup */
      canvasRef.current.removeEventListener("touchstart", touchDown);
      canvasRef.current.removeEventListener("touchend", touchUp);

      /** Pointer events */
      canvasRef.current.addEventListener("touchstart", touchDown);
      canvasRef.current.addEventListener("touchend", touchUp);
    }
  }, []);

  /** Handle resizing canvas */
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current && canvasRef.current) {
        const displayWidth = canvasRef.current.clientWidth;
        const displayHeight = canvasRef.current.clientHeight;
        fSetSize(sceneRef.current.gl, displayWidth, displayHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Reset selections and active drawing elements
   * on workmode change
   */
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.activeDrawElement = undefined;
      sceneRef.current.selected = [];
    }
  }, [workingMode]);

  /**
   * Handle Panning
   */
  useEffect(() => {
    const handlePan = () => {
      if (
        workingMode === WorkingMode.pan &&
        pointerActive &&
        sceneRef.current
      ) {
        mat4.translate(sceneRef.current.view, sceneRef.current.view, [
          (getPointerDelta("x") as number) / sceneRef.current.gl.canvas.width,
          (getPointerDelta("y") as number) / sceneRef.current.gl.canvas.height,
          0,
        ]);
      }
    };

    document.addEventListener("mousemove", handlePan);
    document.addEventListener("touchmove", handlePan);

    return () => {
      document.removeEventListener("mousemove", handlePan);
      document.removeEventListener("touchmove", handlePan);
    };
  }, [pointerActive, workingMode]);

  /**
   * animation loop
   */
  useEffect(() => {
    const animate = (time: number) => {
      const deltaTime = time - (prevTimeRef.current ?? time);
      if (sceneRef.current && programs && deltaTime > 16 /** Cap @ 60 fps */) {
        renderWebGLScene(
          deltaTime,
          sceneRef.current,
          programs,
          workingMode,
          pointerActive,
          multiselect
        );
        prevTimeRef.current = time;
      }

      if (!prevTimeRef.current) prevTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    /** start the animation */
    requestRef.current = requestAnimationFrame(animate);

    /** cleanup */
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loaded, multiselect, pointerActive, workingMode]);

  /**
   * DOM SECTION
   */

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      className="App"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          backgroundColor: "#ddd",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          onDrop={(ev) => {
            const file = ev.dataTransfer.items[0].getAsFile();
            const fileUrl = file ? URL.createObjectURL(file) : null;

            if (fileUrl && sceneRef.current) {
              sceneRef.current.nextId++;

              const position = pageCoordsToCanvas(
                [ev.clientX, ev.clientY],
                sceneRef.current.gl.canvas
              );

              if (file!.type.startsWith("image"))
                addImage(sceneRef.current, fileUrl, {
                  position: [2 * position[0], 2 * position[1]],
                });
              if (file!.type.startsWith("video"))
                addVideo(sceneRef.current, fileUrl, {
                  position: [2 * position[0], 2 * position[1]],
                });
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          /** Pointer Active */
          onMouseDown={(ev) => {
            ev.stopPropagation();
            handlePointerDown(ev as unknown as MouseEvent);
          }}
          /** Pointer Inactive */
          onMouseUp={(ev) => {
            ev.stopPropagation();
            handlePointerUp();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        ></canvas>
      </div>

      {/** Toolbar */}
      <Toolbar
        setworkingMode={setworkingMode}
        sceneRef={sceneRef}
        setmultiselect={setmultiselect}
        multiselect={multiselect}
        setscale={setscale}
        scale={scale}
        workingMode={workingMode}
      />
    </div>
  );
};

export default Board;
