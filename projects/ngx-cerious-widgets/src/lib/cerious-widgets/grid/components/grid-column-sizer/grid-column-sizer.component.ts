import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';
import { ColumnDef } from '../../interfaces/column-def';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnSizerComponent } from '../../interfaces/component-interfaces/grid-column-sizer.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';

@Component({
  selector: 'cw-grid-column-sizer',
  standalone: true,
  templateUrl: './grid-column-sizer.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridColumnSizerComponent extends ZonelessCompatibleComponent implements IGridColumnSizerComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  /** Current column width in px, for the resize handle's `aria-valuenow`. */
  get widthPx(): number {
    const parsed = parseInt(this.columnSignal()?.width ?? '', 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
  ) {
    super();
  }

  /** aria-valuemin / aria-valuemax bounds (kept in sync with the template). */
  private static readonly MIN_WIDTH = 40;
  private static readonly MAX_WIDTH = 800;

  onPointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Capture the pointer on the resize handle so it receives *every* move/up
    // event for the duration of the drag — regardless of what the cursor is
    // physically over (grid body, page, etc.). This is what makes the resize
    // track the cursor when it "gets ahead" of the handle.
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    this.gridService.initColumnResizing(this.column, e, this.getStartWidth());
  }

  /**
   * Keyboard resizing for the focused handle (WCAG: the `role="separator"` handle
   * advertises `aria-valuenow`, so it must be adjustable from the keyboard, not
   * just the pointer). Left/Right nudge the width (Shift for a larger step);
   * Home/End jump to the min/max.
   */
  onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 40 : 10;
    const current = this.getStartWidth() ?? this.widthPx;
    let target: number;
    switch (e.key) {
      case 'ArrowLeft':  target = current - step; break;
      case 'ArrowRight': target = current + step; break;
      case 'Home':       target = GridColumnSizerComponent.MIN_WIDTH; break;
      case 'End':        target = GridColumnSizerComponent.MAX_WIDTH; break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();

    target = Math.max(GridColumnSizerComponent.MIN_WIDTH, Math.min(GridColumnSizerComponent.MAX_WIDTH, target));

    // Reuse the pointer resize pipeline with a synthesized 1-D delta: anchor at
    // the current width (pageX 0) then "move" by (target - current).
    this.gridService.initColumnResizing(this.column, { pageX: 0 } as MouseEvent, current);
    this.gridService.resizeColumn({ pageX: target - current } as MouseEvent);
    this.gridService.endColumnResizing();
  }

  /**
   * The column's exact current width in px: prefer the declared `column.width`
   * (what the grid applies), else measure the header cell. Shared by pointer and
   * keyboard resizing so neither snaps on the first move.
   */
  private getStartWidth(): number | undefined {
    const declared = parseInt(this.column?.width ?? '', 10);
    if (Number.isFinite(declared) && declared > 0) { return declared; }
    const cell = (this.el.nativeElement as HTMLElement).closest('[role="columnheader"]') as HTMLElement | null;
    return cell ? Math.round(cell.getBoundingClientRect().width) : undefined;
  }

  onPointerMove(e: PointerEvent) {
    // Only acts while a resize is in progress. Because the pointer is captured,
    // this fires for the whole drag; the template binding runs change detection
    // afterwards so the new width renders immediately.
    this.gridService.resizeColumn(e);
  }

  onPointerUp(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    this.gridService.endColumnResizing();
  }

  /**
   * Swallow the synthesized `click` that follows a pointerdown/up on the handle.
   * The multi-sort plugin listens for `click` on the header cell, so without this
   * a click (or the click at the end of a resize drag) would bubble up and toggle
   * the column sort. `stopPropagation` on pointer events does not stop `click`.
   */
  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}
