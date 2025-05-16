import { TemplateRegistrarDirective } from './template-registrar.directive';
import { TemplateRef } from '@angular/core';
import { TemplateRegistryService } from '../services/template-registry.service';
import { TestBed } from '@angular/core/testing';

describe('TemplateRegistrarDirective', () => {
  let directive: TemplateRegistrarDirective;
  let mockTemplateRef: jasmine.SpyObj<TemplateRef<any>>;
  let mockRegistry: jasmine.SpyObj<TemplateRegistryService>;

  beforeEach(() => {
    mockTemplateRef = jasmine.createSpyObj('TemplateRef', ['']);
    mockRegistry = jasmine.createSpyObj('TemplateRegistryService', ['registerTemplate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TemplateRef, useValue: mockTemplateRef },
        { provide: TemplateRegistryService, useValue: mockRegistry },
        TemplateRegistrarDirective,
      ],
    });

    directive = TestBed.inject(TemplateRegistrarDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should register the template with the registry on ngOnInit if templateName is provided', () => {
    directive.templateName = 'testTemplate';
    directive.ngOnInit();
    expect(mockRegistry.registerTemplate).toHaveBeenCalledWith('testTemplate', mockTemplateRef);
  });

  it('should not register the template with the registry on ngOnInit if templateName is not provided', () => {
    directive.templateName = '';
    directive.ngOnInit();
    expect(mockRegistry.registerTemplate).not.toHaveBeenCalled();
  });
});