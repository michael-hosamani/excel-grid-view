import type { Grid } from "../Grid.js";
import { hideFormulaMenu } from "../helpers/GridEditor.js";
import { getColumnIndexAtPosition, getRowIndexAtPosition } from "../helpers/GridLayout.js";
import { CELL_HEIGHT, CELL_WIDTH } from "../lib/constants.js";
import { BasePointerInteractionState } from "./BasePointerInteractionState.js";

export class CellSelectionState extends BasePointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (contentY <= CELL_HEIGHT || contentX <= CELL_WIDTH) {
      return false;
    }

    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - CELL_HEIGHT);
    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - CELL_WIDTH);

    if (rowIndex < 0 || colIndex < 0) {
      return false;
    }

    grid.isSelectingRange = true;
    grid.selectionStartRow = rowIndex;
    grid.selectionStartCol = colIndex;
    grid.selectionCurrentRow = rowIndex;
    grid.selectionCurrentCol = colIndex;
    grid.selection.selectRange(rowIndex, colIndex, rowIndex, colIndex);
    hideFormulaMenu();
    grid.render();
    return true;
  }

  pointerMoveHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (!grid.isSelectingRange) {
      return false;
    }

    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - CELL_HEIGHT);
    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - CELL_WIDTH);

    if (rowIndex < 0 || colIndex < 0) {
      return false;
    }

    grid.selectionCurrentRow = rowIndex;
    grid.selectionCurrentCol = colIndex;
    grid.selection.selectRange(grid.selectionStartRow, grid.selectionStartCol, rowIndex, colIndex);
    grid.render();
    return true;
  }

  pointerUpHandler(grid: Grid): boolean {
    if (!grid.isSelectingRange) {
      return false;
    }

    grid.selection.selectRange(grid.selectionStartRow, grid.selectionStartCol, grid.selectionCurrentRow, grid.selectionCurrentCol);
    grid.render();
    grid.isSelectingRange = false;
    grid.selectionStartRow = -1;
    grid.selectionStartCol = -1;
    grid.selectionCurrentRow = -1;
    grid.selectionCurrentCol = -1;
    return true;
  }
}