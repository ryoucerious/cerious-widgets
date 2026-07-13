import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminalComponent } from './terminal.component';

describe('TerminalComponent', () => {
  let fixture: ComponentFixture<TerminalComponent>;
  let component: TerminalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TerminalComponent] }).compileComponents();
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-terminal__input');
  }
  function enter(cmd: string): void {
    input().value = cmd;
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
  }
  function lines(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-terminal__line'), (el: any) => el.textContent.trim());
  }

  it('emits entered commands and echoes them to the log', () => {
    const emitted: string[] = [];
    component.command.subscribe(c => emitted.push(c));

    enter('help');
    expect(emitted).toEqual(['help']);
    expect(lines()[0]).toContain('help');
    expect(input().value).toBe('');
  });

  it('ignores empty commands', () => {
    enter('   ');
    expect(component.lines().length).toBe(0);
  });

  it('appends the handler response as a line', () => {
    fixture.componentRef.setInput('handler', (cmd: string) => (cmd === 'ping' ? 'pong' : 'unknown'));
    fixture.detectChanges();

    enter('ping');
    expect(component.lines().map(l => l.text)).toEqual(['ping', 'pong']);
  });

  it('write() and clear() manage the log', () => {
    component.write('output line');
    fixture.detectChanges();
    expect(component.lines()[0]).toEqual({ kind: 'response', text: 'output line' });

    component.clear();
    fixture.detectChanges();
    expect(component.lines().length).toBe(0);
  });
});
