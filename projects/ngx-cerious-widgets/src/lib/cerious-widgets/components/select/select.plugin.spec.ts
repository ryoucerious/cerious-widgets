import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';
import { SelectComponent } from './select.component';
import { SelectApi, SelectPlugin } from './select.api';

/** A custom plugin a consumer might write against the Select's public API. */
@Injectable()
class RecordingSelectPlugin implements SelectPlugin {
  static lastApi: SelectApi | null = null;
  static inited = false;
  static afterInited = false;
  static destroyed = false;

  onInit(api: SelectApi): void {
    RecordingSelectPlugin.lastApi = api;
    RecordingSelectPlugin.inited = true;
  }
  afterInit(): void { RecordingSelectPlugin.afterInited = true; }
  onDestroy(): void { RecordingSelectPlugin.destroyed = true; }
}

describe('SelectComponent plugin host', () => {
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    RecordingSelectPlugin.lastApi = null;
    RecordingSelectPlugin.inited = false;
    RecordingSelectPlugin.afterInited = false;
    RecordingSelectPlugin.destroyed = false;

    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [
        RecordingSelectPlugin,
        { provide: WIDGETS_CONFIG, useValue: { select: { plugins: [RecordingSelectPlugin] } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('options', [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 }
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('initializes a configured plugin against the component API (onInit + afterInit)', () => {
    expect(RecordingSelectPlugin.inited).toBe(true);
    expect(RecordingSelectPlugin.afterInited).toBe(true);
    expect(RecordingSelectPlugin.lastApi).toBeTruthy();
    expect(RecordingSelectPlugin.lastApi!.getHost()).toBe(fixture.nativeElement);
  });

  it('exposes a working API the plugin can drive', () => {
    const api = RecordingSelectPlugin.lastApi!;
    expect(api.getOptions().length).toBe(2);

    api.setValue(2);
    fixture.detectChanges();
    expect(api.getValue()).toBe(2);

    api.open();
    fixture.detectChanges();
    expect(api.isOpen()).toBe(true);
    api.close();
    fixture.detectChanges();
    expect(api.isOpen()).toBe(false);
  });

  it('tears the plugin down when the component is destroyed', () => {
    fixture.destroy();
    expect(RecordingSelectPlugin.destroyed).toBe(true);
  });
});
