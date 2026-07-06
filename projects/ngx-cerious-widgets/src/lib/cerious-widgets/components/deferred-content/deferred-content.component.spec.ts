import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeferredContentComponent } from './deferred-content.component';

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
  imports: [DeferredContentComponent],
  template: `<cw-deferred-content (loaded)="loads = loads + 1"><p class="inner">deferred</p></cw-deferred-content>`
})
class HostComponent {
  loads = 0;
}

describe('DeferredContentComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  const original = window.IntersectionObserver;

  beforeEach(() => {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    (window as unknown as { IntersectionObserver: typeof original }).IntersectionObserver = original;
  });

  it('does not render content until intersecting', () => {
    expect(fixture.nativeElement.querySelector('.inner')).toBeNull();
  });

  it('renders content and emits loaded on intersection', () => {
    MockIntersectionObserver.last!.fire(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.inner')).toBeTruthy();
    expect(fixture.componentInstance.loads).toBe(1);
    expect(MockIntersectionObserver.last!.disconnected).toBeTrue();
  });

  it('emits loaded only once', () => {
    MockIntersectionObserver.last!.fire(true);
    MockIntersectionObserver.last!.fire(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.loads).toBe(1);
  });
});
