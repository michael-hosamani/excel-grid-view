import type { Grid } from "../Grid.js";

export interface PointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean;
  pointerMoveHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean;
  pointerUpHandler(grid: Grid): boolean;
}