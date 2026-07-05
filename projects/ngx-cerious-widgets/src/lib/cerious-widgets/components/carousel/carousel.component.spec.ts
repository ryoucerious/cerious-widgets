import { Component } from '@angular/core';
import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { CarouselComponent, CarouselItemDirective } from './carousel.component';

@Component({
  standalone: true,
  imports: [CarouselComponent, CarouselItemDirective],
  template: `
    <cw-carousel [autoplay]="auto" [circular]="circular" (activeIndexChange)="active = $event">
      <ng-template cwCarouselItem>Slide A</ng-template>
      <ng-template cwCarouselItem>Slide B</ng-template>
      <ng-template cwCarouselItem>Slide C</ng-template>
    </cw-carousel>
  `
})
class HostComponent {
  auto = 0;
  circular = true;
  active = 0;
}

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function stage(): string {
    return (fixture.nativeElement.querySelector('.cw-carousel__stage') as HTMLElement).textContent!.trim();
  }
  function dots(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-carousel__dot'));
  }
  function next(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-carousel__nav--next');
  }
  function prev(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-carousel__nav--prev');
  }

  it('shows the first slide and one indicator per slide', () => {
    expect(stage()).toBe('Slide A');
    expect(dots().length).toBe(3);
    expect(dots()[0].classList).toContain('cw-carousel__dot--active');
  });

  it('advances and goes back with the navigators', () => {
    next().click();
    fixture.detectChanges();
    expect(stage()).toBe('Slide B');
    expect(fixture.componentInstance.active).toBe(1);

    prev().click();
    fixture.detectChanges();
    expect(stage()).toBe('Slide A');
  });

  it('wraps around when circular', () => {
    prev().click(); // from 0 wraps to last
    fixture.detectChanges();
    expect(stage()).toBe('Slide C');
  });

  it('jumps to a slide via its indicator', () => {
    dots()[2].click();
    fixture.detectChanges();
    expect(stage()).toBe('Slide C');
  });

  it('autoplays through slides on an interval', fakeAsync(() => {
    fixture.componentInstance.auto = 1000;
    fixture.detectChanges();

    tick(1000);
    fixture.detectChanges();
    expect(stage()).toBe('Slide B');

    tick(1000);
    fixture.detectChanges();
    expect(stage()).toBe('Slide C');

    fixture.componentInstance.auto = 0; // stop the timer
    fixture.detectChanges();
  }));
});
