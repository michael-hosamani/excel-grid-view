import type { Grid } from "../Grid.js";
import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";
import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";
import { getColumnIndexAtPosition, getRowIndexAtPosition, getColumnOffset, getRowOffset, updateSpacerSize } from "./GridLayout.js";
import { hideFormulaMenu, applyEdit, hideEditInput } from "./GridEditor.js";
import { MouseEventControllers } from "./MouseEventControllers.js";

// this function handles all the actions to be done when the mouse-down event is triggered
export function handleMouseDown(grid: Grid, event: MouseEvent): void {
  if (event.button !== 0) {
    return;
  }

  if (grid.editInput.style.display === "block") {
    applyEdit(grid, grid.editInput.value);
    hideEditInput(grid);
  }

  const contentX = event.offsetX + window.pageXOffset;
  const contentY = event.offsetY + window.pageYOffset;

  if (contentX <= 60 && contentY <= 32) {
    return;
  }

  // this condition is satisfied when mouse pointer is on the column headers
  if (contentY <= 32) {
    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - 60);
    if (colIndex >= 0) {
      const columnStartCanvasX = 60 + getColumnOffset(grid.columnDefinitions, colIndex) - grid.scrollLeft;
      const localX = event.offsetX - columnStartCanvasX;
      const width = grid.columnDefinitions[colIndex]!.width;
      const nearEdge = Math.abs(localX - width) <= 6;
      if (nearEdge) {
        grid.isDraggingColumn = true;
        grid.activeResizeIndex = colIndex;
        grid.startDragPosition = event.offsetX;
        grid.startSize = grid.columnDefinitions[colIndex]!.width;
      }
    }
    return;
  }

  // this condition is satisfied when the mouse pointer is on the row headers
  if (contentX <= 60) {
    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - 32);
    if (rowIndex >= 0) {
      const rowStartCanvasY = 32 + getRowOffset(grid.rowDefinitions, rowIndex) - grid.scrollTop;
      const localY = event.offsetY - rowStartCanvasY;
      const height = grid.rowDefinitions[rowIndex]!.height;
      const nearEdge = Math.abs(localY - height) <= 6;
      if (nearEdge) {
        grid.isDraggingRow = true;
        grid.activeResizeIndex = rowIndex;
        grid.startDragPosition = event.offsetY;
        grid.startSize = grid.rowDefinitions[rowIndex]!.height;
      }
    }
    return;
  }

  const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - 32);
  const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - 60);
  // mark a cell as selected on mouse down event when rowIndex and colIndex are both >= 0
  if (rowIndex >= 0 && colIndex >= 0) {
    grid.isSelectingRange = true;
    grid.selectionStartRow = rowIndex;
    grid.selectionStartCol = colIndex;
    grid.selectionCurrentRow = rowIndex;
    grid.selectionCurrentCol = colIndex;
    grid.selection.selectRange(rowIndex, colIndex, rowIndex, colIndex);
    hideFormulaMenu(grid);
    grid.render();
  }
}


// this function handles all the actions to be done when the mouse-move event is triggered
export function handleMouseMove(grid: Grid, event: MouseEvent): void {
  const contentX = event.offsetX + window.pageXOffset;
  const contentY = event.offsetY + window.pageYOffset;

  const mouseController = new MouseEventControllers()

  mouseController.handleColResizing(grid, event)

  mouseController.handleRowResizing(grid, event)

  // handles grid selection
  if (grid.isSelectingRange) {
    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - 32);
    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - 60);
    if (rowIndex >= 0 && colIndex >= 0) {
      grid.selectionCurrentRow = rowIndex;
      grid.selectionCurrentCol = colIndex;
      grid.selection.selectRange(grid.selectionStartRow, grid.selectionStartCol, rowIndex, colIndex);
      grid.render();
    }
    return;
  }

  // update cursor style when mouse pointer is over the column headers
  if (contentY <= 32) {
    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - 60);
    grid.canvas.style.cursor = colIndex >= 0 ? "col-resize" : "default";
    return;
  }

  // update cursor style when mouse pointer is over the row headers
  if (contentX <= 60) {
    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - 32);
    grid.canvas.style.cursor = rowIndex >= 0 ? "row-resize" : "default";
    return;
  }

  grid.canvas.style.cursor = "default";
}

// this function handles all the actions to be done when the mouse-up event is triggered
export function handleMouseUp(grid: Grid): void {
  // handles the final size of column after resizing 
  if (grid.isDraggingColumn && grid.activeResizeIndex >= 0) {
    const finalWidth = grid.columnDefinitions[grid.activeResizeIndex]!.width;
    if (finalWidth !== grid.startSize) {
      grid.commandManager.execute(new ResizeColumnCommand(grid.columnDefinitions[grid.activeResizeIndex]!, grid.startSize, finalWidth));
    }
  }

  // handles the final size of row after resizing
  if (grid.isDraggingRow && grid.activeResizeIndex >= 0) {
    const finalHeight = grid.rowDefinitions[grid.activeResizeIndex]!.height;
    if (finalHeight !== grid.startSize) {
      grid.commandManager.execute(new ResizeRowCommand(grid.rowDefinitions[grid.activeResizeIndex]!, grid.startSize, finalHeight));
    }
  }

  // used to highlight the selected range in a grid
  if (grid.isSelectingRange) {
    grid.selection.selectRange(grid.selectionStartRow, grid.selectionStartCol, grid.selectionCurrentRow, grid.selectionCurrentCol);
    grid.render();
  }

  // reset state
  grid.isDraggingColumn = false;
  grid.isDraggingRow = false;
  grid.isSelectingRange = false;
  grid.activeResizeIndex = -1;
  grid.startDragPosition = 0;
  grid.startSize = 0;
  grid.selectionStartRow = -1;
  grid.selectionStartCol = -1;
  grid.selectionCurrentRow = -1;
  grid.selectionCurrentCol = -1;
}
