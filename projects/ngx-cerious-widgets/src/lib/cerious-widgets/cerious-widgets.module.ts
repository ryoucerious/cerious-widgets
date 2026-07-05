import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateRegistrarDirective } from './shared/directives/template-registrar.directive';
import { resolveGridConfig, WidgetsConfig } from './shared/interfaces/widgets-config.interface';
import { WIDGETS_CONFIG } from './shared/tokens/widgets-config.token';
import { GridComponent } from './grid/components/grid.component';
import { GRID_SERVICE } from './grid/tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from './grid/tokens/grid-column-service.token';
import { GRID_SCROLL_SERVICE } from './grid/tokens/grid-scroll-services.token';
import { GridColumnService, GridScrollService, GridService } from './grid/services';
import { ZonelessCompatService } from './shared/services/zoneless-compat.service';

@NgModule({
  declarations: [
    TemplateRegistrarDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GridComponent
  ],
  providers: [
    ZonelessCompatService
  ],
  exports: [
    TemplateRegistrarDirective,
    GridComponent
  ]
})
export class CeriousWidgetsModule {
  constructor() { }
  
  static forRoot(config: WidgetsConfig): ModuleWithProviders<CeriousWidgetsModule> {
    // Merge the deprecated top-level keys with the per-component `grid` block so
    // both old and new config shapes register the same providers.
    const gridConfig = resolveGridConfig(config);
    return {
      ngModule: CeriousWidgetsModule,
      providers: [
        { provide: WIDGETS_CONFIG, useValue: config },
        ...(gridConfig.plugins || []).map(plugin => ({
          provide: plugin,
          useClass: plugin
        })),
        ...Object.entries(gridConfig.lazyPlugins || {}).map(([key, factory]) => ({
          provide: key,
          useFactory: factory
        })),
        { provide: GRID_SERVICE, useClass: GridService },
        { provide: GRID_COLUMN_SERVICE, useClass: GridColumnService },
        { provide: GRID_SCROLL_SERVICE, useClass: GridScrollService },
        ZonelessCompatService
      ]
    };
  }
}
