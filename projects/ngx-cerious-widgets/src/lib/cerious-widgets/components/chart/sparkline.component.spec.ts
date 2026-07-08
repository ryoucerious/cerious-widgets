import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparklineComponent } from './sparkline.component';

describe('SparklineComponent', () => {
  let fixture: ComponentFixture<SparklineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SparklineComponent] }).compileComponents();
    fixture = TestBed.createComponent(SparklineComponent);
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('builds a line path from the data', () => {
    fixture.componentRef.setInput('data', [1, 5, 3, 9]);
    fixture.detectChanges();
    const line = fixture.componentInstance.line();
    expect(line.startsWith('M')).toBeTrue();
    expect(line).toContain('L');
  });

  it('produces an empty path for no data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(fixture.componentInstance.area()).toBe('');
  });
});
