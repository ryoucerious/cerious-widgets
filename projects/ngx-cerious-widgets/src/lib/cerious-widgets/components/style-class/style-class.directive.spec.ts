import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StyleClassDirective } from './style-class.directive';

@Component({
  standalone: true,
  imports: [StyleClassDirective],
  template: `
    <button class="trigger" [cwStyleClass]="target" [toggleClass]="toggle" [enterClass]="enter" [leaveClass]="leave">
      go
    </button>
    <ul class="panel">list</ul>
  `
})
class HostComponent {
  target = '@next';
  toggle = 'open';
  enter = '';
  leave = '';
}

describe('StyleClassDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let button: HTMLButtonElement;
  let panel: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('.trigger');
    panel = fixture.nativeElement.querySelector('.panel');
  });

  it('toggles a class on the next sibling', () => {
    button.click();
    expect(panel.classList).toContain('open');
    button.click();
    expect(panel.classList).not.toContain('open');
  });

  it('resolves @parent targets', () => {
    fixture.componentInstance.target = '@parent';
    fixture.detectChanges();
    button.click();
    expect(button.parentElement!.classList).toContain('open');
  });

  it('resolves CSS-selector targets', () => {
    fixture.componentInstance.target = '.panel';
    fixture.detectChanges();
    button.click();
    expect(panel.classList).toContain('open');
  });

  it('alternates enter/leave classes when no toggleClass', () => {
    fixture.componentInstance.toggle = '';
    fixture.componentInstance.enter = 'in';
    fixture.componentInstance.leave = 'out';
    fixture.detectChanges();

    button.click();
    expect(panel.classList).toContain('in');
    button.click();
    expect(panel.classList).toContain('out');
    expect(panel.classList).not.toContain('in');
  });
});
