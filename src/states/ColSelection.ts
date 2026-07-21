import type { Grid } from "../Grid.js";
import { hideFormulaMenu } from "../helpers/GridEditor.js";
import { autoResizeColumn, getColumnIndexAtPosition, getColumnOffset } from "../helpers/GridLayout.js";
import { CELL_HEIGHT, CELL_WIDTH, MIN_DISTANCE } from "../lib/constants.js";
import { BasePointerInteractionState } from "./BasePointerInteractionState.js";

export class ColSelectionState extends BasePointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (contentY > CELL_HEIGHT || contentX <= CELL_WIDTH) {
      return false;
    }

    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - CELL_WIDTH);
    if (colIndex < 0) {
      return false;
    }

    const columnStartCanvasX = CELL_WIDTH + getColumnOffset(grid.columnDefinitions, colIndex) - grid.scrollLeft;
    const localX = event.offsetX - columnStartCanvasX;
    const width = grid.columnDefinitions[colIndex]!.width;
    const nearEdge = Math.abs(localX - width) <= MIN_DISTANCE;

    if (nearEdge) {
      autoResizeColumn(grid, colIndex);
      return true;
    }

    grid.selection.selectColumn(colIndex);
    hideFormulaMenu();
    grid.render();
    return true;
  }
}