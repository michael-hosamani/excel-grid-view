import type { Grid } from "../Grid.js";
import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";
import { getRowIndexAtPosition, getRowOffset, updateSpacerSize } from "../helpers/GridLayout.js";
import { CELL_HEIGHT, CELL_WIDTH, MIN_CELL_HEIGHT, MIN_DISTANCE } from "../lib/constants.js";
import { BasePointerInteractionState } from "./BasePointerInteractionState.js";

export class RowResizeState extends BasePointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (contentX > CELL_WIDTH) {
      return false;
    }

    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - CELL_HEIGHT);
    if (rowIndex < 0) {
      return false;
    }

    const rowStartCanvasY = CELL_HEIGHT + getRowOffset(grid.rowDefinitions, rowIndex) - grid.scrollTop;
    const localY = event.offsetY - rowStartCanvasY;
    const height = grid.rowDefinitions[rowIndex]!.height;
    const nearEdge = Math.abs(localY - height) <= MIN_DISTANCE;

    if (!nearEdge) {
      return false;
    }

    grid.isDraggingRow = true;
    grid.activeResizeIndex = rowIndex;
    grid.startDragPosition = event.offsetY;
    grid.startSize = grid.rowDefinitions[rowIndex]!.height;
    return true;
  }

  pointerMoveHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (grid.isDraggingRow && grid.activeResizeIndex >= 0) {
      const delta = event.offsetY - grid.startDragPosition;
      const newHeight = Math.max(MIN_CELL_HEIGHT, grid.startSize + delta);
      grid.rowDefinitions[grid.activeResizeIndex]!.height = newHeight;
      updateSpacerSize(grid);
      grid.render();
      return true;
    }

    const rowIndex = getRowIndexAtPosition(grid.rowDefinitions, contentY - CELL_HEIGHT);
    if (contentX <= CELL_WIDTH && rowIndex >= 0) {
      const rowStartCanvasY = CELL_HEIGHT + getRowOffset(grid.rowDefinitions, rowIndex) - grid.scrollTop;
      const localY = event.offsetY - rowStartCanvasY;
      const height = grid.rowDefinitions[rowIndex]!.height;
      const nearEdge = Math.abs(localY - height) <= MIN_DISTANCE;
      grid.canvas.style.cursor = nearEdge ? "row-resize" : "default";
      return false;
    }

    grid.canvas.style.cursor = "default";
    return false;
  }

  pointerUpHandler(grid: Grid): boolean {
    if (!grid.isDraggingRow || grid.activeResizeIndex < 0) {
      return false;
    }

    const finalHeight = grid.rowDefinitions[grid.activeResizeIndex]!.height;
    if (finalHeight !== grid.startSize) {
      grid.commandManager.execute(new ResizeRowCommand(grid.rowDefinitions[grid.activeResizeIndex]!, grid.startSize, finalHeight));
    }

    grid.isDraggingRow = false;
    grid.activeResizeIndex = -1;
    grid.startDragPosition = 0;
    grid.startSize = 0;
    return true;
  }
}