import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { CwConfirmService } from './confirm.service';

describe('ConfirmDialogComponent & CwConfirmService', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let service: CwConfirmService;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmDialogComponent] }).compileComponents();
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    service = TestBed.inject(CwConfirmService);
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.settle(false);
    overlayContainer.ngOnDestroy();
  });

  function panel(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-dialog__panel');
  }
  function footerButtons(): HTMLButtonElement[] {
    return Array.from(panel()!.querySelectorAll('[cwDialogFooter] button, .cw-dialog__footer button'));
  }

  it('opens on confirm() and resolves true on accept', async () => {
    const promise = service.confirm({ message: 'Delete this row?', header: 'Confirm Action', danger: true });
    fixture.detectChanges();

    expect(panel()).toBeTruthy();
    expect(panel()!.textContent).toContain('Delete this row?');
    expect(panel()!.textContent).toContain('Confirm Action');

    const accept = footerButtons().find(b => b.textContent!.includes('Confirm'))!;
    accept.click();
    fixture.detectChanges();

    await expectAsync(promise).toBeResolvedTo(true);
    expect(panel()).toBeNull();
  });

  it('resolves false on reject', async () => {
    const promise = service.confirm({ message: 'Proceed?', rejectLabel: 'No', acceptLabel: 'Yes' });
    fixture.detectChanges();

    const reject = footerButtons().find(b => b.textContent!.includes('No'))!;
    reject.click();
    fixture.detectChanges();

    await expectAsync(promise).toBeResolvedTo(false);
  });

  it('resolves false when dismissed via Escape', async () => {
    const promise = service.confirm({ message: 'Proceed?' });
    fixture.detectChanges();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    await expectAsync(promise).toBeResolvedTo(false);
    expect(panel()).toBeNull();
  });
});
