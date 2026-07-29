import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";
import type { Grid } from "../Grid.js";
import { getColumnIndexAtPosition, getColumnOffset, updateSpacerSize } from "../helpers/GridLayout.js";
import { CELL_HEIGHT, CELL_WIDTH, MIN_CELL_WIDTH, MIN_DISTANCE } from "../lib/constants.js";
import { BasePointerInteractionState } from "./BasePointerInteractionState.js";

export class ColResizeState extends BasePointerInteractionState {
  pointerDownHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (contentY > CELL_HEIGHT) {
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

    if (!nearEdge) {
      return false;
    }

    grid.isDraggingColumn = true;
    grid.activeResizeIndex = colIndex;
    grid.startDragPosition = event.offsetX;
    grid.startSize = grid.columnDefinitions[colIndex]!.width;
    return true;
  }

  pointerMoveHandler(grid: Grid, event: PointerEvent, contentX: number, contentY: number): boolean {
    if (grid.isDraggingColumn && grid.activeResizeIndex >= 0) {
      const delta = event.offsetX - grid.startDragPosition;
      const newWidth = Math.max(MIN_CELL_WIDTH, grid.startSize + delta);
      grid.columnDefinitions[grid.activeResizeIndex]!.width = newWidth;
      updateSpacerSize(grid);
      grid.render();
      return true;
    }

    const colIndex = getColumnIndexAtPosition(grid.columnDefinitions, contentX - CELL_WIDTH);
    if (contentY <= CELL_HEIGHT && colIndex >= 0) {
      const columnStartCanvasX = CELL_WIDTH + getColumnOffset(grid.columnDefinitions, colIndex) - grid.scrollLeft;
      const localX = event.offsetX - columnStartCanvasX;
      const width = grid.columnDefinitions[colIndex]!.width;
      const nearEdge = Math.abs(localX - width) <= MIN_DISTANCE;
      grid.canvas.style.cursor = nea
      rEdge ? "col-resize" : "default";
      return true;
    }

    grid.canvas.style.cursor = "default";
    return false;
  }

  pointerUpHandler(grid: Grid): boolean {
    if (!grid.isDraggingColumn || grid.activeResizeIndex < 0) {
      return false;
    }

    const finalWidth = grid.columnDefinitions[grid.activeResizeIndex]!.width;
    if (finalWidth !== grid.startSize) {
      grid.commandManager.execute(new ResizeColumnCommand(grid.columnDefinitions[grid.activeResizeIndex]!, grid.startSize, finalWidth));
    }

    grid.isDraggingColumn = false;
    grid.activeResizeIndex = -1;
    grid.startDragPosition = 0;
    grid.startSize = 0;
    return true;
  }
}