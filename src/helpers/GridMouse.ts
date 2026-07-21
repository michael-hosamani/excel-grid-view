import type { Grid } from "../Grid.js";
import { applyEdit, hideEditInput } from "./GridEditor.js";
import { CELL_HEIGHT, CELL_WIDTH } from "../lib/constants.js";
import type { PointerInteractionState } from "../interfaces/MouseInteractionState.js";
import { ColResizeState } from "../states/ColResizing.js";
import { RowResizeState } from "../states/RowResizing.js";
import { ColSelectionState } from "../states/ColSelection.js";
import { RowSelectionState } from "../states/RowSelection.js";
import { CellSelectionState } from "../states/CellSelection.js";

export class GridMouse{
  private PointerInteractionStates: PointerInteractionState[] = [
    new ColResizeState(),
    new RowResizeState(),
    new ColSelectionState(),
    new RowSelectionState(),
    new CellSelectionState(),
  ];

  // this function handles all the actions to be done when the Pointer-down event is triggered
  handlePointerDown(grid: Grid, event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    if (grid.editInput.style.display === "block") {
      applyEdit(grid, grid.editInput.value);
      hideEditInput(grid);
    }

    const contentX = event.offsetX + window.pageXOffset;
    const contentY = event.offsetY + window.pageYOffset;

    if (contentX <= CELL_WIDTH && contentY <= CELL_HEIGHT) { // when pointer coordinates are not inside of the canvas
      return;
    }

    for (const state of this.PointerInteractionStates) {
      if (state.pointerDownHandler(grid, event, contentX, contentY)) {
        return;
      }
    }
  }

  // this function handles all the actions to be done when the Pointer-move event is triggered
  handlePointerMove(grid: Grid, event: PointerEvent): void {
    const contentX = event.offsetX + window.pageXOffset;
    const contentY = event.offsetY + window.pageYOffset;

    for (const state of this.PointerInteractionStates) {
      if (state.pointerMoveHandler(grid, event, contentX, contentY)) {
        return;
      }
    }
  }

  // this function handles all the actions to be done when the Pointer-up event is triggered
  handlePointerUp(grid: Grid): void {
    for (const state of this.PointerInteractionStates) {
      if (state.pointerUpHandler(grid)) {
        return;
      }
    }
  }
}