import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickListComponent } from './pick-list.component';

describe('PickListComponent', () => {
  let fixture: ComponentFixture<PickListComponent>;
  let component: PickListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PickListComponent] }).compileComponents();
    fixture = TestBed.createComponent(PickListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', ['A', 'B', 'C', 'D']);
    fixture.detectChanges();
  });

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-pick-list__panel'));
  }
  function sourceItems(): HTMLButtonElement[] {
    return Array.from(panels()[0].querySelectorAll('.cw-pick-list__item'));
  }
  function targetItems(): HTMLButtonElement[] {
    return Array.from(panels()[1].querySelectorAll('.cw-pick-list__item'));
  }
  function ctrl(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`.cw-pick-list__ctrl[aria-label="${label}"]`);
  }

  it('starts with all items in the source and none in the target', () => {
    expect(sourceItems().map(i => i.textContent!.trim())).toEqual(['A', 'B', 'C', 'D']);
    expect(targetItems().length).toBe(0);
  });

  it('moves highlighted items to the target and emits', () => {
    const emitted: unknown[][] = [];
    component.registerOnChange(v => emitted.push(v));

    sourceItems()[1].click(); // highlight B
    fixture.detectChanges();
    ctrl('Move selected to target').click();
    fixture.detectChanges();

    expect(targetItems().map(i => i.textContent!.trim())).toEqual(['B']);
    expect(sourceItems().map(i => i.textContent!.trim())).toEqual(['A', 'C', 'D']);
    expect(emitted[0]).toEqual(['B']);
  });

  it('moves all and moves back', () => {
    ctrl('Move all to target').click();
    fixture.detectChanges();
    expect(targetItems().length).toBe(4);
    expect(sourceItems().length).toBe(0);

    ctrl('Move all to source').click();
    fixture.detectChanges();
    expect(targetItems().length).toBe(0);
    expect(sourceItems().length).toBe(4);
  });

  it('reflects a written target value', () => {
    component.writeValue(['C', 'A']);
    fixture.detectChanges();
    expect(targetItems().map(i => i.textContent!.trim())).toEqual(['C', 'A']);
    expect(sourceItems().map(i => i.textContent!.trim())).toEqual(['B', 'D']);
  });

  it('virtualizes large lists', async () => {
    const many = Array.from({ length: 300 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('options', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    expect(panels()[0].querySelector('.cw-pick-list__list--virtual cerious-scroll')).toBeTruthy();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = sourceItems().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});
