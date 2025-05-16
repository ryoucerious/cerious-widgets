import { Injectable, TemplateRef } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TemplateRegistryService {
  private templates: Map<string, TemplateRef<any>> = new Map();

  /**
   * Clears all registered templates from the template registry.
   * This method removes all entries from the internal template storage.
   */
  clearTemplates(): void {
    this.templates.clear();
  }

  /**
   * Retrieves a template by its name from the template registry.
   *
   * @param name - The name of the template to retrieve.
   * @returns The template associated with the given name, or `undefined` if no template is found.
   */
  getTemplate(name: string): any {
    return this.templates.get(name);
  }

  /**
   * Registers a template with a specified name in the template registry.
   *
   * @param name - The unique name to associate with the template.
   * @param template - The `TemplateRef` instance to be registered.
   * 
   * @remarks
   * This method stores the provided template in an internal map, allowing it to be
   * retrieved later by its associated name. Ensure that the `name` parameter is unique
   * to avoid overwriting existing templates.
   */
  registerTemplate(name: string, template: TemplateRef<any>): void {
    this.templates.set(name, template);
  }
}