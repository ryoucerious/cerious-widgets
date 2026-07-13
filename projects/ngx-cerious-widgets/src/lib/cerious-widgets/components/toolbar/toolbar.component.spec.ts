import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';

@Component({
  standalone: true,
  imports: [ToolbarComponent],
  template: `
    <cw-toolbar>
      <div cwToolbarStart><button class="start-btn">New</button></div>
      <div cwToolbarCenter><span class="center-txt">Title</span></div>
      <div cwToolbarEnd><button class="end-btn">Export</button></div>
    </cw-toolbar>
  `
})
class HostComponent {}

describe('ToolbarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function toolbar(): HTMLElement {
    return fixture.nativeElement.querySelector('cw-toolbar');
  }

  it('exposes the toolbar role for assistive tech', () => {
    expect(toolbar().getAttribute('role')).toBe('toolbar');
  });

  it('projects content into the start, center and end slots', () => {
    expect(toolbar().querySelector('.cw-toolbar__start .start-btn')!.textContent).toContain('New');
    expect(toolbar().querySelector('.cw-toolbar__center .center-txt')!.textContent).toContain('Title');
    expect(toolbar().querySelector('.cw-toolbar__end .end-btn')!.textContent).toContain('Export');
  });
});
