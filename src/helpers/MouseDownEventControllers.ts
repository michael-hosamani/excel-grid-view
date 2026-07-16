import type { Grid } from "../Grid.js";
import { hideFormulaMenu } from "./GridEditor.js";
import { getColumnIndexAtPosition, getColumnOffset, getRowIndexAtPosition, getRowOffset } from "./GridLayout.js";

export class MouseDownEventControllers{

    // this function handles the condition when mouse pointer is on the column headers
    handlePointerOnColHeaders(grid: Grid, contentX: number, contentY: number, event: PointerEvent){
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
    }

    // this function handles the condition when the mouse pointer is on the row headers
    handlePointerOnRowHeaders(grid: Grid, contentX: number, contentY: number, event: PointerEvent){
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
    }

    // this function handles cell selection
    selectCell(grid: Grid, contentX: number, contentY: number){
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
            hideFormulaMenu();
            grid.render();
        }
    }
}