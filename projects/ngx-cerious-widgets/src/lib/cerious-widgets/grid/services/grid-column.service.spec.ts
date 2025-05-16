import { TestBed } from '@angular/core/testing';
import { GridColumnService } from './grid-column.service';
import { GridRow } from '../models/grid-row';
import { ColumnDef, GridDataset, GridOptions } from '../interfaces';

describe('GridColumnService', () => {
  let service: GridColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridColumnService);
  });

  describe('flattenColumns', () => {
    it('should flatten a hierarchical array of column definitions', () => {
      const columns: ColumnDef[] = [
        { id: '1', children: [{ id: '1.1' }, { id: '1.2' }] } as ColumnDef,
        { id: '2' } as ColumnDef,
      ];
      const result = service.flattenColumns(columns);
      expect(result).toEqual([{ id: '1.1' } as ColumnDef, { id: '1.2' } as ColumnDef, { id: '2' } as ColumnDef]);
    });

    it('should return an empty array if no columns are provided', () => {
      const result = service.flattenColumns([]);
      expect(result).toEqual([]);
    });
  });

  describe('getColumnWidth', () => {
    it('should return dynamicWidth if defined', () => {
      const column: ColumnDef = { dynamicWidth: '200px' } as ColumnDef;
      const gridOptions: GridOptions = {} as GridOptions;
      expect(service.getColumnWidth(column, gridOptions)).toBe('200px');
    });

    it('should return width if dynamicWidth is not defined', () => {
      const column: ColumnDef = { width: '150px' } as ColumnDef;
      const gridOptions: GridOptions = {} as GridOptions;
      expect(service.getColumnWidth(column, gridOptions)).toBe('150px');
    });

    it('should return gridOptions.columnWidth if neither dynamicWidth nor width is defined', () => {
      const column: ColumnDef = {} as ColumnDef;
      const gridOptions: GridOptions = { columnWidth: '100px' } as GridOptions;
      expect(service.getColumnWidth(column, gridOptions)).toBe('100px');
    });

    it('should return default width of 150px if no width is defined', () => {
      const column: ColumnDef = {} as ColumnDef;
      const gridOptions: GridOptions = {} as GridOptions;
      expect(service.getColumnWidth(column, gridOptions)).toBe('150px');
    });
  });

  describe('getFeatureColumnWidth', () => {
    it('should calculate the total width of a feature column', () => {
      const gridOptions: GridOptions = { featureColumnWidth: '30' } as GridOptions;
      const result = service.getFeatureColumnWidth(3, gridOptions);
      expect(result).toBe('93px'); // (3 * 30) + 3
    });
  });

  describe('getFeatureWidth', () => {
    it('should return featureColumnWidth from gridOptions', () => {
      const gridOptions: GridOptions = { featureColumnWidth: '40' } as GridOptions;
      expect(service.getFeatureWidth(gridOptions)).toBe(40);
    });

    it('should return default value of 26 if featureColumnWidth is not defined', () => {
      const gridOptions: GridOptions = {} as GridOptions;
      expect(service.getFeatureWidth(gridOptions)).toBe(26);
    });
  });

  describe('getPinnedColumns', () => {
    it('should return an empty array if no row components are provided', () => {
      expect(service.getPinnedColumns()).toEqual([]);
    });

    it('should return pinned columns from row components', () => {
      const rowComponents = [
        {
          columnComponents: {
            toArray: () => [
              { column: { pinned: true }, el: { nativeElement: 'col1' } },
              { column: { pinned: false }, el: { nativeElement: 'col2' } },
            ],
          },
        },
      ];
      const result = service.getPinnedColumns(rowComponents);
      expect(result).toEqual(['col1']);
    });
  });

  describe('processGridDefs', () => {
    it('should process grid definitions and update gridDataset', () => {
      const gridOptions: GridOptions = {
        columnDefs: [{ id: '1' } as ColumnDef, { id: '2', width: '100px' } as ColumnDef],
        columnWidth: '150px',
      };
      const gridDataset: GridDataset = {} as GridDataset;

      service.processGridDefs(gridOptions, gridDataset);

      expect(gridDataset.headerRows.length).toBe(1);
      expect(gridDataset.footerRows.length).toBe(1);
      expect(gridDataset.fillerRows.length).toBe(1);
      expect(gridDataset.headerRows[0].columnDefs[0].width).toBe('150px');
      expect(gridDataset.headerRows[0].columnDefs[1].width).toBe('100px');
    });
  });
});