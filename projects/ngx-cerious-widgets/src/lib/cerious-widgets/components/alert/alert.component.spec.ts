import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

@Component({
  standalone: true,
  imports: [AlertComponent],
  template: `<cw-alert severity="success" closable (closed)="closedCount = closedCount + 1">Saved!</cw-alert>`
})
class HostComponent {
  closedCount = 0;
}

describe('AlertComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertComponent, HostComponent] }).compileComponents();
  });

  it('defaults to an info alert with role=alert', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('role')).toBe('alert');
    expect(host.getAttribute('data-severity')).toBe('info');
    expect(host.querySelector('.cw-alert__close')).toBeNull();
  });

  it('projects content and reflects severity', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('cw-alert') as HTMLElement;

    expect(alert.getAttribute('data-severity')).toBe('success');
    expect(alert.querySelector('.cw-alert__content')!.textContent!.trim()).toBe('Saved!');
  });

  it('close hides the alert and emits closed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.cw-alert__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.closedCount).toBe(1);
    expect((fixture.nativeElement.querySelector('cw-alert') as HTMLElement).classList).toContain('cw-alert--hidden');
  });
});
