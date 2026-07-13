import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DYNAMIC_DIALOG_CONFIG } from './dynamic-dialog.config';
import { DynamicDialogRef } from './dynamic-dialog.ref';
import { DynamicDialogService } from './dynamic-dialog.service';

@Component({ standalone: true, template: `<p class="opened">{{ data }}</p>` })
class OpenedComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DYNAMIC_DIALOG_CONFIG);
  readonly data = (this.config.data as { name: string }).name;

  finish(): void {
    this.ref.close('done');
  }
}

describe('DynamicDialogService', () => {
  let service: DynamicDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicDialogService);
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => el.remove());
  });

  it('opens a component and injects config data', () => {
    service.open(OpenedComponent, { header: 'Test', data: { name: 'Ada' } });
    const opened = document.querySelector('.opened');
    expect(opened?.textContent).toBe('Ada');
    expect(document.querySelector('.cw-dialog__title')?.textContent).toContain('Test');
  });

  it('renders a close button when closable and headered', () => {
    service.open(OpenedComponent, { header: 'Test', data: { name: 'x' } });
    expect(document.querySelector('.cw-dialog__close')).toBeTruthy();
  });

  it('closes with a result via the ref', (done) => {
    const ref = service.open<string>(OpenedComponent, { data: { name: 'x' } });
    ref.closed.subscribe((result) => {
      expect(result).toBe('done');
      expect(document.querySelector('.opened')).toBeNull();
      done();
    });
    ref.close('done');
  });

  it('disposes the overlay when closed', () => {
    const ref = service.open(OpenedComponent, { data: { name: 'x' } });
    expect(document.querySelector('.cw-dynamic-dialog__panel')).toBeTruthy();
    ref.close();
    expect(document.querySelector('.cw-dynamic-dialog__panel')).toBeNull();
  });
});
