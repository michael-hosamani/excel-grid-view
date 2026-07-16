import type { Grid } from "../Grid.js";
import { applyEdit, hideEditInput } from "./GridEditor.js";
import { MouseMoveEventControllers } from "./MouseMoveEventControllers.js";
import { MouseDownEventControllers } from "./MouseDownEventControllers.js";
import { MouseUpEventControllers } from "./MouseUpEventControllers.js";

// this function handles all the actions to be done when the mouse-down event is triggered
export function handleMouseDown(grid: Grid, event: PointerEvent): void {
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

  const mouseController = new MouseDownEventControllers()

  mouseController.handlePointerOnColHeaders(grid, contentX, contentY, event)

  mouseController.handlePointerOnRowHeaders(grid, contentX, contentY, event)

  mouseController.selectCell(grid, contentX, contentY)
}


// this function handles all the actions to be done when the mouse-move event is triggered
export function handleMouseMove(grid: Grid, event: PointerEvent): void {
  const contentX = event.offsetX + window.pageXOffset;
  const contentY = event.offsetY + window.pageYOffset;

  const mouseController = new MouseMoveEventControllers()

  mouseController.updateCursorOnColHeaders(grid, contentX, contentY)

  mouseController.updateCursorOnRowHeaders(grid, contentX, contentY)

  mouseController.handleColResizing(grid, event)

  mouseController.handleRowResizing(grid, event)

  mouseController.handleRangeSelection(grid, contentX, contentY)
}

// this function handles all the actions to be done when the mouse-up event is triggered
export function handleMouseUp(grid: Grid): void {
  const mouseController = new MouseUpEventControllers()

  mouseController.handleFinalColSize(grid);

  mouseController.handleFinalRowSize(grid);

  mouseController.highlightSelectedCellRange(grid)

  mouseController.resetState(grid);
}
