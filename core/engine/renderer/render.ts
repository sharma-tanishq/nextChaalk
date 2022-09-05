import { mat3 } from "gl-matrix";
import {
  addRectangle,
  addStroke,
  defaultOnActiveDrag,
  defaultOnPointerActivated,
  defaultOnPointerReleased,
} from "../elements/elements";
import { ElementType } from "../elements/enums";
import { BoardElement, Stroke } from "../elements/interfaces";
import { resizeStick, rotateStick } from "../elements/UIElements";
import { WorkingMode } from "../enums";
import {
  getCenterOfElement,
  isElementInsideFrame,
  isPointInsideElement,
  shiftToViewMatrix,
} from "../math/utils";
import { getPointerPosition, PointerPosition } from "../pointer";
import { Scene } from "../scene/Scene";
import { endActiveDrawElement, modifyElements } from "../scene/utils";
import { fclear, setBackgroundColor } from "../scene/webglInit";
import { drawElement } from "./drawUtils/element";
import {
  drawSelectedElementUI,
  handleSelectionUIActivation,
  handleSelectionUIDrag,
} from "./drawUtils/elementUI";
import { Programs } from "./programs/programs";

export interface Uniforms {
  colorMult: [number, number, number];
  matrix: mat3;
}

let deferVideoFrame = 0;
const toDeferVideo = true;
const videoDeferLimit = 2;
let toolAction = false;
let prevPointer: PointerPosition;

export const renderWebGLScene = (
  deltaTime: number,
  scene: Scene,
  programs: Programs,
  workingMode: WorkingMode,
  pointerActive: boolean,
  multiselect: boolean
) => {
  const gl = scene.gl;
  deferVideoFrame = toDeferVideo
    ? (deferVideoFrame + 1) % Math.floor(deltaTime / 10)
    : 0;
  deferVideoFrame =
    deferVideoFrame > videoDeferLimit ? videoDeferLimit : deferVideoFrame;
  /**
   * Pre Processes
   */
  setBackgroundColor(
    scene.gl,
    scene.background.color,
    scene.background.opacity
  );
  fclear(gl);
  let selected = false;
  if (scene.selected.length > 1) multiselect = true;

  const pointer = shiftToViewMatrix(
    getPointerPosition() as PointerPosition,
    gl.canvas,
    scene.view
  );

  if (!prevPointer || scene.pendingPointerState.activated)
    prevPointer = pointer;

  const collectedPointerDelta = {
    x: pointer.x - prevPointer.x,
    y: pointer.y - prevPointer.y,
  } as PointerPosition;

  /**
   * Handle Elements Events
   */
  modifyElements(scene, scene.selected, (element) => {
    if (scene.pendingPointerState.activated) {
      isPointInsideElement([pointer.x, pointer.y], element.orientation) &&
        !toolAction &&
        defaultOnPointerActivated(element, pointer);
      /** Tool Action */
      toolAction = handleSelectionUIActivation(scene, element, pointer);
      /** We don't want to end selection if a tool was used */
      selected = toolAction ? true : selected;
    }
    if (scene.pendingPointerState.released) {
      !toolAction && defaultOnPointerReleased(element, pointer);
      /** Tool Action */
      toolAction = handleSelectionUIActivation(scene, element, pointer);
      /** We don't want to end selection if a tool was used */
      selected = toolAction ? true : selected;
    }

    if (pointerActive) {
      if (!toolAction) defaultOnActiveDrag(element, collectedPointerDelta);
      else handleSelectionUIDrag(element, collectedPointerDelta);
    }
  });

  /**
   * Draw Elements Iteratively
   */

  scene.elements
    /** render active element if present */
    .concat(scene.activeDrawElement ?? [])
    /** rendering order, most recent on top */
    .sort(
      (a: BoardElement, b: BoardElement) =>
        a.orientation.lastClickTimestamp - b.orientation.lastClickTimestamp
    )
    /** iterate over each element and render */
    .forEach((element, index) => {
      /** Skip if outside frame */
      if (!isElementInsideFrame(scene.gl.canvas, scene.view, element)) return;

      /**
       * Draw the Element
       */
      drawElement(
        scene,
        {
          ...element,
          id: element.isInitialized ? -32 : element.id,
        },
        programs,
        deferVideoFrame !== 0
      );

      /** draw selection UI of element */
      if (
        scene.selected.includes(element.id) &&
        index !== scene.elements.length
      ) {
        drawSelectedElementUI(scene, programs, element);
      }

      /**
       * Selection logic
       */
      if (workingMode === WorkingMode.selection && !toolAction) {
        if (
          scene.pendingPointerState.activated &&
          isPointInsideElement([pointer.x, pointer.y], element.orientation)
        ) {
          selected = true;
          scene.selected = multiselect
            ? Array.from(new Set([...scene.selected, element.id]))
            : [element.id];
        }

        if (
          scene.pendingPointerState.released &&
          scene.activeDrawElement &&
          workingMode === WorkingMode.selection &&
          isPointInsideElement(
            getCenterOfElement(element.orientation),
            scene.activeDrawElement.orientation
          )
        ) {
          scene.selected.push(element.id);
        }
      }
    });

  /**
   * Handle pending pointer state changes
   */

  /**
   * POINTER ACTIVATED
   */
  if (scene.pendingPointerState.activated) {
    /** activate appropriate active draw element */
    if (!scene.activeDrawElement) {
      switch (workingMode) {
        case WorkingMode.selection:
          if (!selected) {
            scene.selected = [];
            scene.activeDrawElement = addRectangle(
              scene,
              {
                position: [pointer.x, pointer.y],
                fillColor: [22 / 255, 148 / 255, 154 / 255, 0.5],
                strokeColor: [0, 0, 0, 1],
                strokeWidth: 0,
              },
              false
            );
          }
          break;
        case WorkingMode.pen:
          scene.activeDrawElement = addStroke(
            scene,
            {
              position: [pointer.x, pointer.y],
              fillColor: [22 / 255, 148 / 255, 154 / 255, 0.5],
              strokeColor: [0, 0, 0, 1],
              strokeWidth: 20,
            },
            false
          );
          break;
      }
    }
    scene.pendingPointerState.activated = false;
  }

  /**
   * POINTER ACTIVE
   */
  if (pointerActive) {
    /** update appropriate active draw element */
    if (scene.activeDrawElement) {
      switch (scene.activeDrawElement.type) {
        case ElementType.Rectangle:
          const start = scene.activeDrawElement.orientation.position;
          scene.activeDrawElement.orientation.dimensions = [
            pointer.x - start[0],
            start[1] - pointer.y,
          ];
          break;
        case ElementType.StrokeElement:
          (scene.activeDrawElement as Stroke).points.push(
            Object.values(pointer) as [number, number]
          );
          break;
      }
    }
  }

  /**
   * POINTER RELEASED
   */
  if (scene.pendingPointerState.released) {
    if (scene.activeDrawElement) {
      endActiveDrawElement(scene, workingMode === WorkingMode.selection);
    }
    resizeStick.isActive = 0;
    rotateStick.isActive = 0;
    scene.pendingPointerState.released = false;
    scene.pendingPointerState.activated = false;
    toolAction = false;
  }

  /**
   * Post Processes
   */
  prevPointer = pointer;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.flush();
};
