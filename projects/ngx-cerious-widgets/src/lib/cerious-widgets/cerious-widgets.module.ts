import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridComponentsModule } from './grid/components/grid-components.module';
import { GridComponent } from './grid/components/grid.component';
import { TemplateRegistrarDirective } from './shared/directives/template-registrar.directive';
import { WidgetsConfig } from './shared/interfaces/widgets-config.interface';
import { WIDGETS_CONFIG } from './shared/tokens/widgets-config.token';
import { GridService } from './grid/services/grid.service';
import { GridColumnService } from './grid/services/grid-column.service';
import { GridScrollService } from './grid/services/grid-scroll.service';

@NgModule({
  declarations: [
    GridComponent,
    TemplateRegistrarDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GridComponentsModule
  ],
  providers: [],
  exports: [
    GridComponent,
    TemplateRegistrarDirective
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
        })) : [])
      ]
    };
  }
}
