import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginManagerService } from '../../shared/services/plugin-manager.service';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';
import { MultiSelectApi, MultiSelectPlugin } from './multi-select.api';
import { MultiSelectComponent } from './multi-select.component';

@Injectable({ providedIn: 'root' })
class RecordingPlugin implements MultiSelectPlugin {
  events: string[] = [];
  api?: MultiSelectApi;

  onInit(api: MultiSelectApi): void {
    this.api = api;
    this.events.push('init');
  }
  onOpen(): void {
    this.events.push('open');
  }
  onClose(): void {
    this.events.push('close');
  }
  onDestroy(): void {
    this.events.push('destroy');
  }
}

describe('MultiSelectComponent', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let component: MultiSelectComponent;
  let overlayContainer: OverlayContainer;

  const cities = [
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'ld' },
    { label: 'Tokyo', value: 'tk' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent],
      providers: [{ provide: WIDGETS_CONFIG, useValue: { multiSelect: { plugins: [RecordingPlugin] } } }]
    }).compileComponents();
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.componentRef.setInput('options', cities);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function panel(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-multi-select__panel-inner');
  }
  function optionRows(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-multi-select__option'));
  }

  it('opens the panel and toggles options into the value', () => {
    const emitted: unknown[][] = [];
    component.registerOnChange(v => emitted.push(v));

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();

    optionRows()[0].click();
    fixture.detectChanges();
    optionRows()[2].click();
    fixture.detectChanges();

    expect(emitted).toEqual([['ny'], ['ny', 'tk']]);
    expect(component.selectedOptions().map(o => o.label)).toEqual(['New York', 'Tokyo']);
  });

  it('renders chips for selections and removes via the chip ✕', () => {
    component.writeValue(['ny', 'ld']);
    fixture.detectChanges();

    const chips = Array.from(fixture.nativeElement.querySelectorAll('.cw-multi-select__chip')) as HTMLElement[];
    expect(chips.length).toBe(2);

    (chips[0].querySelector('.cw-multi-select__chip-remove') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.selectedOptions().map(o => o.value)).toEqual(['ld']);
  });

  it('filters the option list', () => {
    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();

    const filter = panel()!.querySelector('.cw-multi-select__filter') as HTMLInputElement;
    filter.value = 'tok';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(optionRows().map(r => r.textContent!.trim())).toEqual(['Tokyo']);
  });

  it('virtualizes with cerious-scroll above the threshold', async () => {
    const many = Array.from({ length: 300 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('options', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();

    const virtualList = overlayContainer.getContainerElement().querySelector('.cw-multi-select__list--virtual');
    expect(virtualList).toBeTruthy();
    expect(virtualList!.querySelector('cerious-scroll')).toBeTruthy();

    // The panel render is nudged on the next animation frame.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    // Rows actually render, but far fewer than the 300 items.
    const rows = optionRows().length;
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThan(100);
  });

  it('wires plugins through the manager with the typed API', () => {
    const plugin = TestBed.inject(RecordingPlugin);
    expect(plugin.events).toContain('init');

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();
    expect(plugin.events).toContain('open');

    plugin.api!.setValue(['ld']);
    expect(component.selectedOptions().map(o => o.value)).toEqual(['ld']);

    component.close();
    expect(plugin.events).toContain('close');

    const pluginManager = TestBed.inject(PluginManagerService);
    fixture.destroy();
    expect(plugin.events).toContain('destroy');
    expect(pluginManager).toBeTruthy();
  });
});
