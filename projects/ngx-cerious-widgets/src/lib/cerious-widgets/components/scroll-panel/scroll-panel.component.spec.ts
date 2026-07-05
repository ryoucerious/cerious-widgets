import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollPanelComponent } from './scroll-panel.component';

@Component({
  standalone: true,
  imports: [ScrollPanelComponent],
  template: `<cw-scroll-panel [height]="height"><p class="content">Body</p></cw-scroll-panel>`
})
class HostComponent {
  height = '10rem';
}

describe('ScrollPanelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function viewport(): HTMLElement {
    return fixture.nativeElement.querySelector('.cw-scroll-panel__viewport');
  }

  it('projects content into a scrolling viewport', () => {
    expect(viewport()).toBeTruthy();
    expect(viewport().querySelector('.content')!.textContent!.trim()).toBe('Body');
    expect(getComputedStyle(viewport()).overflow).toBe('auto');
  });

  it('applies the height input', () => {
    expect(viewport().style.height).toBe('10rem');
  });

  it('applies max-height when set instead of height', () => {
    fixture.componentInstance.height = '';
    fixture.detectChanges();
    expect(viewport().style.height).toBe('');
  });
});
