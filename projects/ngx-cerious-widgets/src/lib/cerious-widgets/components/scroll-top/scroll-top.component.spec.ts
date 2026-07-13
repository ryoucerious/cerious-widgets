import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollTopComponent } from './scroll-top.component';

@Component({
  standalone: true,
  imports: [ScrollTopComponent],
  template: `
    <div #box class="box" style="height: 100px; overflow: auto;">
      <div style="height: 2000px;"></div>
    </div>
    <cw-scroll-top [target]="box" [threshold]="150" />
  `
})
class HostComponent {}

describe('ScrollTopComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function box(): HTMLElement {
    return fixture.nativeElement.querySelector('.box');
  }
  function button(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cw-scroll-top__btn');
  }

  it('is hidden until the target is scrolled past the threshold', () => {
    expect(button()).toBeNull();

    box().scrollTop = 300;
    box().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(button()).toBeTruthy();
  });

  it('hides again when scrolled back above the threshold', () => {
    box().scrollTop = 300;
    box().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(button()).toBeTruthy();

    box().scrollTop = 50;
    box().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(button()).toBeNull();
  });

  it('scrolls the target back to top on click', () => {
    box().scrollTop = 300;
    box().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const scrollSpy = spyOn(box(), 'scrollTo');
    button()!.click();
    expect(scrollSpy).toHaveBeenCalled();
    expect((scrollSpy.calls.mostRecent().args[0] as ScrollToOptions).top).toBe(0);
  });
});
