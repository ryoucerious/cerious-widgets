import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaDirective } from './textarea.directive';

@Component({
  standalone: true,
  imports: [TextareaDirective],
  template: `<textarea cwTextarea [autoResize]="autoResize"></textarea>`
})
class HostComponent {
  autoResize = false;
}

describe('TextareaDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function textarea(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea');
  }

  it('applies the token-styling classes', () => {
    expect(textarea().classList).toContain('cw-input');
    expect(textarea().classList).toContain('cw-textarea');
  });

  it('grows to fit content on input when autoResize is set', () => {
    fixture.componentInstance.autoResize = true;
    fixture.detectChanges();

    const ta = textarea();
    // jsdom/headless reports scrollHeight; the directive writes it to style.height.
    ta.value = 'line one\nline two\nline three\nline four';
    ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(ta.style.height).toMatch(/px$/);
    expect(ta.style.overflowY).toBe('hidden');
  });

  it('does not manage height without autoResize', () => {
    const ta = textarea();
    ta.value = 'lots\nof\nlines';
    ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(ta.style.height).toBe('');
  });
});
