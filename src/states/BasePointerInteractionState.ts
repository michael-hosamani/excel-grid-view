import type { Grid } from "../Grid.js";
import type { PointerInteractionState } from "../interfaces/MouseInteractionState.js";

export class BasePointerInteractionState implements PointerInteractionState {
  pointerDownHandler(_grid: Grid, _event: PointerEvent, _contentX: number, _contentY: number): boolean {
    return false;
  }

  pointerMoveHandler(_grid: Grid, _event: PointerEvent, _contentX: number, _contentY: number): boolean {
    return false;
  }

  pointerUpHandler(_grid: Grid): boolean {
    return false;
  }
}