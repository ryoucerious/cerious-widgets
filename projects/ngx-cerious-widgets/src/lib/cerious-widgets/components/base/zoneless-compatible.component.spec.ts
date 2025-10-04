import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ZonelessCompatibleComponent } from './zoneless-compatible.component';
import { ZonelessCompatService } from '../../shared/services/zoneless-compat.service';

@Component({
  template: '<div>Test Component</div>',
  standalone: true
})
class TestComponent extends ZonelessCompatibleComponent {
  public testMarkForCheck() {
    this.markForCheck();
  }

  public testDetectChanges() {
    this.detectChanges();
  }

  public testRunOutsideAngular<T>(fn: () => T): T {
    return this.runOutsideAngular(fn);
  }

  public testRunInZone<T>(fn: () => T): T {
    return this.runInZone(fn);
  }

  public testScheduleTask(fn: () => void, delay?: number) {
    this.scheduleTask(fn, delay);
  }

  public async testSafeAsync<T>(operation: () => Promise<T>): Promise<T> {
    return this.safeAsync(operation);
  }

  public get testIsZoneless(): boolean {
    return this.isZoneless;
  }
}

describe('ZonelessCompatibleComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let zonelessCompatService: jasmine.SpyObj<ZonelessCompatService>;

  beforeEach(async () => {
    const zonelessCompatSpy = jasmine.createSpyObj('ZonelessCompatService', [
      'runOutsideAngular',
      'run',
      'markForCheck',
      'detectChanges',
      'scheduleTask'
    ], {
      'isZonelessMode': false
    });

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: ZonelessCompatService, useValue: zonelessCompatSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    zonelessCompatService = TestBed.inject(ZonelessCompatService) as jasmine.SpyObj<ZonelessCompatService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose isZoneless property', () => {
    (Object.getOwnPropertyDescriptor(zonelessCompatService, 'isZonelessMode')!.get as jasmine.Spy).and.returnValue(true);
    
    expect(component.testIsZoneless).toBe(true);
  });

  it('should delegate runOutsideAngular to service', () => {
    const testFn = jasmine.createSpy('testFn').and.returnValue('result');
    zonelessCompatService.runOutsideAngular.and.returnValue('result');

    const result = component.testRunOutsideAngular(testFn);

    expect(zonelessCompatService.runOutsideAngular).toHaveBeenCalledWith(testFn);
    expect(result).toBe('result');
  });

  it('should delegate runInZone to service', () => {
    const testFn = jasmine.createSpy('testFn').and.returnValue('result');
    zonelessCompatService.run.and.returnValue('result');

    const result = component.testRunInZone(testFn);

    expect(zonelessCompatService.run).toHaveBeenCalledWith(testFn);
    expect(result).toBe('result');
  });

  it('should delegate markForCheck to service with cdr', () => {
    component.testMarkForCheck();

    expect(zonelessCompatService.markForCheck).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should delegate detectChanges to service with cdr', () => {
    component.testDetectChanges();

    expect(zonelessCompatService.detectChanges).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should delegate scheduleTask to service and call markForCheck', () => {
    const testFn = jasmine.createSpy('testFn');
    zonelessCompatService.scheduleTask.and.callFake((wrappedFn: () => void) => {
      wrappedFn(); // Simulate task execution
    });

    component.testScheduleTask(testFn, 100);

    expect(zonelessCompatService.scheduleTask).toHaveBeenCalled();
    expect(testFn).toHaveBeenCalled();
    expect(zonelessCompatService.markForCheck).toHaveBeenCalled();
  });

  it('should handle safeAsync successfully', async () => {
    const testOperation = jasmine.createSpy('testOperation').and.returnValue(Promise.resolve('success'));

    const result = await component.testSafeAsync(testOperation);

    expect(testOperation).toHaveBeenCalled();
    expect(result).toBe('success');
    expect(zonelessCompatService.markForCheck).toHaveBeenCalled();
  });

  it('should handle safeAsync with error', async () => {
    const testError = new Error('Test error');
    const testOperation = jasmine.createSpy('testOperation').and.returnValue(Promise.reject(testError));

    try {
      await component.testSafeAsync(testOperation);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBe(testError);
      expect(zonelessCompatService.markForCheck).toHaveBeenCalled();
    }
  });

  it('should call markForCheck in ngOnDestroy when in zoneless mode', () => {
    (Object.getOwnPropertyDescriptor(zonelessCompatService, 'isZonelessMode')!.get as jasmine.Spy).and.returnValue(true);

    component.ngOnDestroy();

    expect(zonelessCompatService.markForCheck).toHaveBeenCalled();
  });

  it('should not call markForCheck in ngOnDestroy when in zoned mode', () => {
    (Object.getOwnPropertyDescriptor(zonelessCompatService, 'isZonelessMode')!.get as jasmine.Spy).and.returnValue(false);

    component.ngOnDestroy();

    expect(zonelessCompatService.markForCheck).not.toHaveBeenCalled();
  });
});