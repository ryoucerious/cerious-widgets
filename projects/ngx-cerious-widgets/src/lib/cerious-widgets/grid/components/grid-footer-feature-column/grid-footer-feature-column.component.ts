import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { IGridFooterFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-footer-feature-column.interface';

@Component({
  selector: 'cw-grid-footer-feature-column',
  templateUrl: './grid-footer-feature-column.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GridFooterFeatureColumnComponent implements IGridFooterFeatureColumnComponent {

  constructor(
    public el: ElementRef,
  ) { }
}
