import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let fixture: ComponentFixture<EditorComponent>;
  let component: EditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EditorComponent] }).compileComponents();
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function area(): HTMLElement {
    return fixture.nativeElement.querySelector('.cw-editor__area');
  }
  function tools(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-editor__tool'));
  }

  it('renders a formatting toolbar and an editable area', () => {
    expect(tools().length).toBe(5);
    expect(area().getAttribute('contenteditable')).toBe('true');
  });

  it('shows a placeholder while empty', () => {
    fixture.componentRef.setInput('placeholder', 'Write...');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-editor__placeholder')!.textContent!.trim()).toBe('Write...');
  });

  it('writes HTML content and clears the empty state', () => {
    component.writeValue('<p>Hello</p>');
    fixture.detectChanges();
    expect(area().innerHTML).toBe('<p>Hello</p>');
    expect(component.isEmpty()).toBeFalse();
  });

  it('emits the current HTML on input', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));

    area().innerHTML = '<b>Bold</b>';
    area().dispatchEvent(new Event('input'));
    expect(emitted[emitted.length - 1]).toBe('<b>Bold</b>');
  });

  it('runs a formatting command via execCommand', () => {
    const spy = spyOn(document, 'execCommand').and.returnValue(true);
    tools()[0].click(); // Bold
    expect(spy).toHaveBeenCalledWith('bold', false, undefined);
  });

  it('disables the toolbar and editing when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(area().getAttribute('contenteditable')).toBe('false');
    expect(tools()[0].disabled).toBeTrue();
  });
});
