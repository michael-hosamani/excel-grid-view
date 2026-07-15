import type { Grid } from "../Grid.js";
import { updateSpacerSize } from "./GridLayout.js";

export class MouseEventControllers{

    // handles column resizing
    handleColResizing(grid: Grid, event: MouseEvent){
        if (grid.isDraggingColumn && grid.activeResizeIndex >= 0) {
            const delta = event.offsetX - grid.startDragPosition;
            const newWidth = Math.max(40, grid.startSize + delta);
            grid.columnDefinitions[grid.activeResizeIndex]!.width = newWidth;
            updateSpacerSize(grid);
            grid.render();
            return;
        }
    }

    // handles row resizing
    handleRowResizing(grid: Grid, event: MouseEvent){
        if (grid.isDraggingRow && grid.activeResizeIndex >= 0) {
            const delta = event.offsetY - grid.startDragPosition;
            const newHeight = Math.max(24, grid.startSize + delta);
            grid.rowDefinitions[grid.activeResizeIndex]!.height = newHeight;
            updateSpacerSize(grid);
            grid.render();
            return;
        }
    }
}