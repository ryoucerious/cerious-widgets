import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';
import { IGridFooterFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-footer-feature-column.interface';
import { SectionClassConfig } from '../../interfaces';

@Component({
  selector: 'cw-grid-footer-feature-column',
  standalone: true,
  templateUrl: './grid-footer-feature-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridFooterFeatureColumnComponent extends ZonelessCompatibleComponent implements IGridFooterFeatureColumnComponent {

  @Input() classes: SectionClassConfig = {};

  constructor(
    public el: ElementRef,
  ) {
    super();
  }
}
