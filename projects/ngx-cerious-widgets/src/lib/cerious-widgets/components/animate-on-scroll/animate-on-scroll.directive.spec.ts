import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimateOnScrollDirective } from './animate-on-scroll.directive';

// Deterministic IntersectionObserver stub so we can drive intersection manually.
class MockIntersectionObserver {
  static last?: MockIntersectionObserver;
  callback: IntersectionObserverCallback;
  observed: Element[] = [];
  disconnected = false;

  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    MockIntersectionObserver.last = this;
  }
  observe(el: Element): void { this.observed.push(el); }
  disconnect(): void { this.disconnected = true; }
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }

  fire(isIntersecting: boolean): void {
    this.callback(
      [{ isIntersecting, target: this.observed[0] } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

@Component({
  standalone: true,
  imports: [AnimateOnScrollDirective],
  template: `<div cwAnimateOnScroll enterClass="in" leaveClass="out" [once]="once" (entered)="count = count + 1">hi</div>`
})
class HostComponent {
  once = true;
  count = 0;
}

describe('AnimateOnScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let el: HTMLElement;
  const original = window.IntersectionObserver;

  beforeEach(() => {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
    el = fixture.nativeElement.querySelector('div');
  });

  afterEach(() => {
    (window as unknown as { IntersectionObserver: typeof original }).IntersectionObserver = original;
  });

  it('adds the enter class on intersection and emits', () => {
    MockIntersectionObserver.last!.fire(true);
    expect(el.classList).toContain('in');
    expect(fixture.componentInstance.count).toBe(1);
  });

  it('disconnects after first entry when once', () => {
    MockIntersectionObserver.last!.fire(true);
    expect(MockIntersectionObserver.last!.disconnected).toBeTrue();
  });

  it('toggles leave class and re-fires when not once', () => {
    fixture.componentInstance.once = false;
    fixture.detectChanges();
    const obs = MockIntersectionObserver.last!;
    obs.fire(true);
    expect(el.classList).toContain('in');
    obs.fire(false);
    expect(el.classList).toContain('out');
    expect(el.classList).not.toContain('in');
    obs.fire(true);
    expect(fixture.componentInstance.count).toBe(2);
  });
});
