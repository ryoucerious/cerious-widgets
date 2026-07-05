import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwSpeedDialItem, SpeedDialComponent } from './speed-dial.component';

describe('SpeedDialComponent', () => {
  let fixture: ComponentFixture<SpeedDialComponent>;
  let component: SpeedDialComponent;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SpeedDialComponent] }).compileComponents();
    fixture = TestBed.createComponent(SpeedDialComponent);
    component = fixture.componentInstance;
    commanded = [];
    const items: CwSpeedDialItem[] = [
      { label: 'New', command: () => commanded.push('new') },
      { label: 'Share', command: () => commanded.push('share') },
      { label: 'Delete', disabled: true }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-speed-dial__trigger');
  }
  function actions(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-speed-dial__action'));
  }

  it('renders an action per item', () => {
    expect(actions().length).toBe(3);
  });

  it('opens and closes on trigger click', () => {
    expect(component.isOpen()).toBeFalse();
    trigger().click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).classList).toContain('cw-speed-dial--open');

    trigger().click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
  });

  it('runs a command and closes on action click', () => {
    const clicked: CwSpeedDialItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    trigger().click();
    fixture.detectChanges();
    actions()[0].click();
    fixture.detectChanges();

    expect(commanded).toEqual(['new']);
    expect(clicked[0].label).toBe('New');
    expect(component.isOpen()).toBeFalse();
  });

  it('offsets actions by direction when open', () => {
    fixture.componentRef.setInput('direction', 'up');
    fixture.componentRef.setInput('gap', 50);
    trigger().click();
    fixture.detectChanges();

    expect(actions()[0].style.transform).toBe('translateY(-50px)');
    expect(actions()[1].style.transform).toBe('translateY(-100px)');
  });

  it('closes on outside click', () => {
    trigger().click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();

    document.body.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
  });
});
