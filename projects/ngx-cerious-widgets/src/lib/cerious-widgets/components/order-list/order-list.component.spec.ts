import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;
  let component: OrderListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrderListComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', ['One', 'Two', 'Three', 'Four']);
    fixture.detectChanges();
  });

  function rows(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-order-list__item'));
  }
  function labels(): string[] {
    return rows().map(r => r.textContent!.trim());
  }
  function ctrl(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`.cw-order-list__ctrl[aria-label="${label}"]`);
  }

  it('renders items in the options order', () => {
    expect(labels()).toEqual(['One', 'Two', 'Three', 'Four']);
  });

  it('moves the selected item up and emits the new order', () => {
    const emitted: unknown[][] = [];
    component.registerOnChange(v => emitted.push(v));

    rows()[2].click(); // select "Three"
    fixture.detectChanges();
    ctrl('Move up').click();
    fixture.detectChanges();

    expect(labels()).toEqual(['One', 'Three', 'Two', 'Four']);
    expect(emitted[0]).toEqual(['One', 'Three', 'Two', 'Four']);
  });

  it('moves down, to top and to bottom', () => {
    rows()[1].click(); // select "Two"
    fixture.detectChanges();

    ctrl('Move down').click();
    fixture.detectChanges();
    expect(labels()).toEqual(['One', 'Three', 'Two', 'Four']);

    ctrl('Move to top').click();
    fixture.detectChanges();
    expect(labels()).toEqual(['Two', 'One', 'Three', 'Four']);

    ctrl('Move to bottom').click();
    fixture.detectChanges();
    expect(labels()).toEqual(['One', 'Three', 'Four', 'Two']);
  });

  it('disables the controls at the boundaries', () => {
    rows()[0].click(); // first item
    fixture.detectChanges();
    expect(ctrl('Move up').disabled).toBeTrue();
    expect(ctrl('Move down').disabled).toBeFalse();

    rows()[3].click(); // last item
    fixture.detectChanges();
    expect(ctrl('Move down').disabled).toBeTrue();
  });

  it('virtualizes a large list', async () => {
    const many = Array.from({ length: 300 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('options', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-order-list__list--virtual cerious-scroll')).toBeTruthy();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = rows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});
