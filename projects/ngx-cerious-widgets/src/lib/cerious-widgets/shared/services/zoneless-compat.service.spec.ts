import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ZonelessCompatService } from './zoneless-compat.service';

describe('ZonelessCompatService', () => {
  let service: ZonelessCompatService;
  let ngZone: NgZone;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);

    TestBed.configureTestingModule({
      providers: [ZonelessCompatService]
    });

    service = TestBed.inject(ZonelessCompatService);
    ngZone = TestBed.inject(NgZone);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isZonelessMode', () => {
    it('should return a boolean value', () => {
      expect(typeof service.isZonelessMode).toBe('boolean');
    });

    it('should detect normal Angular zone by default in test environment', () => {
      // In test environment, we expect normal zones
      expect(service.isZonelessMode).toBe(false);
    });
  });

  describe('runOutsideAngular', () => {
    it('should run function outside Angular zone when zones are enabled', () => {
      spyOn(ngZone, 'runOutsideAngular').and.callFake((fn: any) => fn());
      const testFn = jasmine.createSpy('testFn').and.returnValue('result');

      const result = service.runOutsideAngular(testFn);

      expect(ngZone.runOutsideAngular).toHaveBeenCalledWith(testFn);
      expect(testFn).toHaveBeenCalled();
      expect(result).toBe('result');
    });
  });

  describe('run', () => {
    it('should run function inside Angular zone when zones are enabled', () => {
      spyOn(ngZone, 'run').and.callFake((fn: any) => fn());
      const testFn = jasmine.createSpy('testFn').and.returnValue('result');

      const result = service.run(testFn);

      expect(ngZone.run).toHaveBeenCalledWith(testFn);
      expect(testFn).toHaveBeenCalled();
      expect(result).toBe('result');
    });
  });

  describe('markForCheck', () => {
    it('should call markForCheck on ChangeDetectorRef in zoneless mode', () => {
      // Force the service to think it's in zoneless mode
      (service as any).isZoneless = true;

      service.markForCheck(mockChangeDetectorRef);

      expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
    });

    it('should not call markForCheck on ChangeDetectorRef in zoned mode', () => {
      // Force the service to think it's in zoned mode
      (service as any).isZoneless = false;

      service.markForCheck(mockChangeDetectorRef);

      expect(mockChangeDetectorRef.markForCheck).not.toHaveBeenCalled();
    });
  });

  describe('detectChanges', () => {
    it('should call detectChanges on ChangeDetectorRef in zoneless mode', () => {
      // Force the service to think it's in zoneless mode
      (service as any).isZoneless = true;

      service.detectChanges(mockChangeDetectorRef);

      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
    });

    it('should not call detectChanges on ChangeDetectorRef in zoned mode', () => {
      // Force the service to think it's in zoned mode
      (service as any).isZoneless = false;

      service.detectChanges(mockChangeDetectorRef);

      expect(mockChangeDetectorRef.detectChanges).not.toHaveBeenCalled();
    });
  });

  describe('scheduleTask', () => {
    it('should use setTimeout to schedule tasks', (done) => {
      const testFn = jasmine.createSpy('testFn').and.callFake(() => {
        expect(testFn).toHaveBeenCalled();
        done();
      });
      
      service.scheduleTask(testFn, 10);
    });

    it('should schedule task with minimal delay when no delay provided', (done) => {
      const testFn = jasmine.createSpy('testFn').and.callFake(() => {
        expect(testFn).toHaveBeenCalled();
        done();
      });
      
      service.scheduleTask(testFn);
    });
  });
});