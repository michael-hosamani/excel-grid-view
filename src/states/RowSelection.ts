import type { Grid } from "../Grid.js";
import { hideFormulaMenu } from "../helpers/GridEditor.js";
import { autoResizeRow, getRowIndexAtPosition, getRowOffset } from "../helpers/GridLayout.js";
import { CELL_HEIGHT, CELL_WIDTH } from "../lib/constants.js";
import { BasePointerInteractionState } from "./BasePointerInteractionState.js";

export class RowSelectionState extends BasePointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (contentX > CELL_WIDTH || contentY <= CELL_HEIGHT) {
      return false;
    }

    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - CELL_HEIGHT);
    if (rowIndex < 0) {
      return false;
    }

    const rowStartCanvasY = CELL_HEIGHT + getRowOffset(grid.rowDefinitions, rowIndex) - grid.scrollTop;
    const localY = event.offsetY - rowStartCanvasY;
    const height = grid.rowDefinitions[rowIndex]!.height;
    const nearEdge = Math.abs(localY - height) <= 6;

    if (nearEdge) {
      autoResizeRow(grid, rowIndex);
      return true;
    }

    grid.selection.selectRow(rowIndex);
    hideFormulaMenu();
    grid.render();
    return true;
  }
}