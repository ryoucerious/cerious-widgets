import { Directive, Input, OnInit, TemplateRef } from "@angular/core";
import { TemplateRegistryService } from "../services/template-registry.service";

@Directive({
    selector: '[cwTemplate]'
  })
  export class TemplateRegistrarDirective implements OnInit {
    @Input('cwTemplate') templateName!: string;
  
    constructor(
      private templateRef: TemplateRef<any>,
      private registry: TemplateRegistryService
    ) {}
  
    ngOnInit(): void {
      if (this.templateName) {
        this.registry.registerTemplate(this.templateName, this.templateRef);
      }
    }
  }
  