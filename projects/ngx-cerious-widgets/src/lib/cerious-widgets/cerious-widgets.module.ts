import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateRegistrarDirective } from './shared/directives/template-registrar.directive';
import { WidgetsConfig } from './shared/interfaces/widgets-config.interface';
import { WIDGETS_CONFIG } from './shared/tokens/widgets-config.token';
import { GridComponent } from './grid/components/grid.component';
import { GRID_SERVICE } from './grid/tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from './grid/tokens/grid-column-service.token';
import { GRID_SCROLL_SERVICE } from './grid/tokens/grid-scroll-services.token';
import { GridColumnService, GridScrollService, GridService } from './grid/services';

@NgModule({
  declarations: [
    TemplateRegistrarDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GridComponent
  ],
  providers: [],
  exports: [
    TemplateRegistrarDirective,
    GridComponent
  ]
})
export class CeriousWidgetsModule {
  constructor() { }
  
  static forRoot(config: WidgetsConfig): ModuleWithProviders<CeriousWidgetsModule> {
    return {
      ngModule: CeriousWidgetsModule,
      providers: [
        { provide: WIDGETS_CONFIG, useValue: config },
        ...(config.plugins || []).map(plugin => ({
          provide: plugin,
          useClass: plugin
        })),
        ...(config.lazyPlugins ? Object.entries(config.lazyPlugins).map(([key]) => ({
          provide: key,
          useFactory: config.lazyPlugins![key]
        })) : []),
        { provide: GRID_SERVICE, useClass: GridService },
        { provide: GRID_COLUMN_SERVICE, useClass: GridColumnService },
        { provide: GRID_SCROLL_SERVICE, useClass: GridScrollService },
      ]
    };
  }
}
