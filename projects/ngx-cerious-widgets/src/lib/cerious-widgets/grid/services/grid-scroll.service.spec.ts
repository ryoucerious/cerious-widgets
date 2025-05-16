import { TestBed } from "@angular/core/testing";
import { NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { GridScrollService } from "./grid-scroll.service";
import { GRID_COLUMN_SERVICE } from "../tokens/grid-column-service.token";
import {

GridOptions,
IGridBodyComponent,
IGridColumnService,
IGridFooterComponent,
IGridHeaderComponent,
IGridScrollerComponent,
ScrollDelta,
} from "../interfaces";

describe("GridScrollService", () => {
let service: GridScrollService;
let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;
let mockNgZone: NgZone;

beforeEach(() => {
  mockGridColumnService = jasmine.createSpyObj("IGridColumnService", ["updatePinnedColumnPos"]);
  mockNgZone = new NgZone({ enableLongStackTrace: false });

  TestBed.configureTestingModule({
    providers: [
      GridScrollService,
      { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
      { provide: NgZone, useValue: mockNgZone },
    ],
  });

  service = TestBed.inject(GridScrollService);
});

it("should be created", () => {
  expect(service).toBeTruthy();
});

it("should initialize afterScroll as a Subject", () => {
  expect(service.afterScroll).toBeInstanceOf(Subject);
});

it("should initialize scrollDelta with default values", () => {
  expect(service.scrollDelta).toEqual({ top: 0, left: 0 });
});

describe("scrollGrid", () => {
  let mockEvent: Event;
  let mockDelta: ScrollDelta;
  let mockGridOptions: GridOptions;
  let mockGridHeader: jasmine.SpyObj<IGridHeaderComponent>;
  let mockGridBody: jasmine.SpyObj<IGridBodyComponent>;
  let mockGridScroller: jasmine.SpyObj<IGridScrollerComponent>;
  let mockGridFooter: jasmine.SpyObj<IGridFooterComponent>;

  beforeEach(() => {
    mockEvent = new Event("scroll");
    mockDelta = { top: 50, left: 100 };
    mockGridOptions = {} as GridOptions;

    mockGridHeader = jasmine.createSpyObj("IGridHeaderComponent", [], {
      tableHead: { nativeElement: { scrollLeft: 0 } },
    });
    mockGridBody = jasmine.createSpyObj("IGridBodyComponent", [], {
      tableBody: {
        nativeElement: {
          scrollHeight: 500,
          clientHeight: 400,
          scrollWidth: 800,
          clientWidth: 700,
          scrollTop: 0,
          scrollLeft: 0,
        },
      },
    });
    mockGridScroller = jasmine.createSpyObj("IGridScrollerComponent", [], {
      el: { nativeElement: {} },
    });
    mockGridFooter = jasmine.createSpyObj("IGridFooterComponent", [], {
      tableFooter: { nativeElement: { scrollLeft: 0 } },
    });
  });

  it("should return early if gridBodyElement is not available", () => {
    mockGridBody.tableBody.nativeElement = null;
    service.scrollGrid(
      mockEvent,
      mockDelta,
      mockGridOptions,
      mockGridHeader,
      mockGridBody,
      mockGridScroller,
      mockGridFooter,
      true,
      10
    );
    expect(mockGridColumnService.updatePinnedColumnPos).not.toHaveBeenCalled();
  });

  it("should clamp scrollDelta values within valid bounds", () => {
    service.scrollGrid(
      mockEvent,
      { top: 600, left: 900 },
      mockGridOptions,
      mockGridHeader,
      mockGridBody,
      mockGridScroller,
      mockGridFooter,
      true,
      10
    );
    expect(service.scrollDelta).toEqual({ top: 100, left: 90 });
  });

  it("should update scroll positions of grid elements", () => {
    service.scrollGrid(
      mockEvent,
      mockDelta,
      mockGridOptions,
      mockGridHeader,
      mockGridBody,
      mockGridScroller,
      mockGridFooter,
      true,
      10
    );

    expect(mockGridBody.tableBody.nativeElement.scrollLeft).toBe(90);
    expect(mockGridBody.tableBody.nativeElement.scrollTop).toBe(50);
    expect(mockGridHeader.tableHead.nativeElement.scrollLeft).toBe(90);
    expect(mockGridFooter.tableFooter.nativeElement.scrollLeft).toBe(90);
  });

  it("should call updatePinnedColumnPos with correct arguments", () => {
    service.scrollGrid(
      mockEvent,
      mockDelta,
      mockGridOptions,
      mockGridHeader,
      mockGridBody,
      mockGridScroller,
      mockGridFooter,
      true,
      10
    );

    expect(mockGridColumnService.updatePinnedColumnPos).toHaveBeenCalledWith(
      mockGridHeader,
      mockGridBody,
      mockGridFooter,
      mockGridOptions,
      mockDelta
    );
  });

  it("should emit afterScroll event", (done) => {
    service.afterScroll.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });

    service.scrollGrid(
      mockEvent,
      mockDelta,
      mockGridOptions,
      mockGridHeader,
      mockGridBody,
      mockGridScroller,
      mockGridFooter,
      true,
      10
    );
  });
});
});