import { TestBed } from '@angular/core/testing';
import { TemplateRef } from '@angular/core';
import { TemplateRegistryService } from './template-registry.service';

describe('TemplateRegistryService', () => {
  let service: TemplateRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and retrieve a template', () => {
    const mockTemplateRef = {} as TemplateRef<any>;
    const templateName = 'testTemplate';

    service.registerTemplate(templateName, mockTemplateRef);
    const retrievedTemplate = service.getTemplate(templateName);

    expect(retrievedTemplate).toBe(mockTemplateRef);
  });

  it('should return undefined for a non-existent template', () => {
    const retrievedTemplate = service.getTemplate('nonExistentTemplate');
    expect(retrievedTemplate).toBeUndefined();
  });

  it('should clear all templates', () => {
    const mockTemplateRef1 = {} as TemplateRef<any>;
    const mockTemplateRef2 = {} as TemplateRef<any>;

    service.registerTemplate('template1', mockTemplateRef1);
    service.registerTemplate('template2', mockTemplateRef2);

    service.clearTemplates();

    expect(service.getTemplate('template1')).toBeUndefined();
    expect(service.getTemplate('template2')).toBeUndefined();
  });

  it('should overwrite an existing template with the same name', () => {
    const mockTemplateRef1 = {} as TemplateRef<any>;
    const mockTemplateRef2 = {} as TemplateRef<any>;
    const templateName = 'testTemplate';

    service.registerTemplate(templateName, mockTemplateRef1);
    service.registerTemplate(templateName, mockTemplateRef2);

    const retrievedTemplate = service.getTemplate(templateName);
    expect(retrievedTemplate).toBe(mockTemplateRef2);
  });
});