import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, ColumnDef, ColumnType, CwConfirmService, CwToastService, DialogComponent,
  DividerComponent, DrawerComponent, GridComponent, GridOptions, InputNumberComponent,
  InputTextDirective, PluginOptions, RowEvent, SelectButtonComponent, SelectComponent, TagComponent
} from 'ngx-cerious-widgets';
import { CATEGORIES, PRODUCT_STATUSES, Product, productSeverity, seedProducts } from './demo-data';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-demo-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, CurrencyPipe, GridComponent, TagComponent, ButtonComponent, DialogComponent,
    SelectComponent, SelectButtonComponent, InputNumberComponent, InputTextDirective, DrawerComponent, DividerComponent,
    IconComponent
  ],
  template: `
    <header class="page-head">
      <div>
        <h1 class="page-head__title">Products</h1>
        <p class="page-head__sub">{{ filtered().length }} of {{ products().length }} products · the whole toolbar lives in the grid's menu bar</p>
      </div>
    </header>

    <div class="grid-card">
      @if (gridVisible()) {
        <cw-grid [data]="filtered()" [gridOptions]="gridOptions" [pluginOptions]="pluginOptions"
                 (rowClick)="onRowClick($event)">
          <!-- Full toolbar in the grid's menu-bar (headerTemplate slot).
               NOTE: the grid renders with encapsulation None, so this content is
               styled with :host ::ng-deep below rather than scoped classes.
               (Inline styles can't be made responsive, hence the classes.) -->
          <ng-template #menuTpl>
            <div class="demo-toolbar">
              <button cwButton (click)="openCreate()">+ New</button>
              <input cwInput type="search" placeholder="Search…" aria-label="Search products"
                     class="demo-toolbar__search"
                     [ngModel]="search()" (ngModelChange)="onFilter('search', $event)" />
              <cw-select class="demo-toolbar__category" [options]="categoryOptions" [ngModel]="category()"
                         (ngModelChange)="onFilter('category', $event)" aria-label="Filter by category" />
              <!-- spacer pushes the status filter + reset to the right, like the table's toolbar -->
              <span class="demo-toolbar__spacer"></span>
              <cw-select-button [options]="statusOptions" [ngModel]="statusFilter()" (ngModelChange)="onFilter('status', $event)" />
              <button cwButton severity="secondary" variant="outlined" (click)="reset()">Reset</button>
            </div>
          </ng-template>

          <ng-template #statusTpl let-value="value">
            <cw-tag [value]="value" [severity]="severity(value)" />
          </ng-template>
          <ng-template #actionsTpl let-row="row">
            <div style="display:flex; gap:0.15rem;">
              <button cwButton size="small" variant="text" (click)="openEdit(row); $event.stopPropagation()" aria-label="Edit"><app-icon name="edit" style="width:16px;height:16px;display:block"></app-icon></button>
              <button cwButton size="small" variant="text" severity="danger" (click)="remove(row); $event.stopPropagation()" aria-label="Delete"><app-icon name="trash" style="width:16px;height:16px;display:block"></app-icon></button>
            </div>
          </ng-template>
        </cw-grid>
      }
    </div>

    <!-- Create / edit dialog -->
    <cw-dialog [header]="editingId() ? 'Edit product' : 'New product'"
               [visible]="dialogVisible()" (visibleChange)="dialogVisible.set($event)" width="30rem">
      <div class="form">
        <label class="field"><span class="field__label">Name</span>
          <input cwInput [(ngModel)]="form.name" placeholder="Product name" />
        </label>
        <label class="field"><span class="field__label">Category</span>
          <cw-select [options]="categories" [(ngModel)]="form.category" placeholder="Select a category" />
        </label>
        <div class="form__row">
          <label class="field"><span class="field__label">Price</span>
            <cw-input-number [(ngModel)]="form.price" mode="currency" currency="USD" ariaLabel="Price" />
          </label>
          <label class="field"><span class="field__label">Stock</span>
            <cw-input-number [(ngModel)]="form.stock" [min]="0" ariaLabel="Stock" />
          </label>
        </div>
        <label class="field"><span class="field__label">Status</span>
          <cw-select [options]="statuses" [(ngModel)]="form.status" placeholder="Select a status" />
        </label>
      </div>
      <div cwDialogFooter>
        <button cwButton severity="secondary" variant="outlined" (click)="dialogVisible.set(false)">Cancel</button>
        <button cwButton (click)="save()">{{ editingId() ? 'Save changes' : 'Create product' }}</button>
      </div>
    </cw-dialog>

    <!-- Details drawer (row click) -->
    <cw-drawer header="Product details" position="right"
               [visible]="detailsVisible()" (visibleChange)="detailsVisible.set($event)">
      @if (selected(); as p) {
        <div class="details">
          <div class="details__name">{{ p.name }}</div>
          <cw-tag [value]="p.status" [severity]="severity(p.status)" rounded />
          <cw-divider />
          <div class="details__row"><span>Category</span><strong>{{ p.category }}</strong></div>
          <div class="details__row"><span>Price</span><strong>{{ p.price | currency }}</strong></div>
          <div class="details__row"><span>In stock</span><strong>{{ p.stock }} units</strong></div>
          <cw-divider />
          <div class="details__actions">
            <button cwButton variant="outlined" (click)="openEdit(p); detailsVisible.set(false)">Edit</button>
            <button cwButton severity="danger" (click)="remove(p); detailsVisible.set(false)">Delete</button>
          </div>
        </div>
      }
    </cw-drawer>
  `,
  styles: [`
    :host { display: block; }
    .page-head { margin-bottom: 1.25rem; }
    .page-head__title { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--cw-text); }
    .page-head__sub { margin: 0.25rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .grid-card { min-height: 200px; }
    .row-actions { display: flex; gap: 0.15rem; }

    /* The menu-bar toolbar renders inside the grid (encapsulation None), so it is
       reached with ::ng-deep. The child selectors are deliberately nested under
       .demo-toolbar: the library's global rule for .cw-grid search inputs scores
       (0,2,1) with its element+attribute, so a flat [_nghost] .demo-toolbar__search
       (0,2,0) would lose and the search would stretch to fill the row. */
    :host ::ng-deep .demo-toolbar {
      display: flex; gap: 0.5rem; align-items: center; flex-wrap: nowrap;
      flex: 1 1 auto; min-width: 0;
    }
    :host ::ng-deep .demo-toolbar .demo-toolbar__search { width: 13rem; flex: none; min-width: 0; }
    :host ::ng-deep .demo-toolbar .demo-toolbar__category { min-width: 10.5rem; flex: none; }
    :host ::ng-deep .demo-toolbar .demo-toolbar__spacer { flex: 1 1 auto; }

    .form { display: flex; flex-direction: column; gap: 1rem; padding: 0.25rem 0 0.5rem; }
    .form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.35rem; }
    .field__label { font-size: 0.85rem; font-weight: 600; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .field input[cwInput], .field cw-select, .field cw-input-number { width: 100%; }

    .details { display: flex; flex-direction: column; gap: 0.75rem; padding: 0.5rem 0; }
    .details__name { font-size: 1.15rem; font-weight: 700; color: var(--cw-text); }
    .details__row { display: flex; align-items: center; justify-content: space-between; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .details__row strong { color: var(--cw-text); }
    .details__actions { display: flex; gap: 0.5rem; }

    @media (max-width: 640px) {
      .page-head__title { font-size: 1.35rem; }
      .form__row { grid-template-columns: 1fr; }

      /* Let the menu-bar toolbar wrap onto multiple lines on a phone instead of
         running off the side of the card. */
      :host ::ng-deep .demo-toolbar { flex-wrap: wrap; }
      :host ::ng-deep .demo-toolbar .demo-toolbar__search { width: auto; flex: 1 1 8rem; }
      :host ::ng-deep .demo-toolbar .demo-toolbar__category { min-width: 0; flex: 1 1 8rem; }
      :host ::ng-deep .demo-toolbar .demo-toolbar__spacer { display: none; }
    }
  `]
})
export class DemoProductsComponent implements AfterViewInit {
  private readonly toast = inject(CwToastService);
  private readonly confirm = inject(CwConfirmService);
  private readonly appRef = inject(ApplicationRef);

  readonly categories = CATEGORIES;
  readonly statuses = PRODUCT_STATUSES;
  readonly categoryOptions = ['All categories', ...CATEGORIES];
  readonly statusOptions = ['All', ...PRODUCT_STATUSES];
  readonly severity = productSeverity;

  readonly products = signal<Product[]>(seedProducts());
  readonly search = signal('');
  readonly category = signal('All categories');
  readonly statusFilter = signal('All');
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const cat = this.category();
    const st = this.statusFilter();
    return this.products().filter(p => {
      const text = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = cat === 'All categories' || p.category === cat;
      const matchStatus = st === 'All' || p.status === st;
      return text && matchCat && matchStatus;
    });
  });

  readonly gridVisible = signal(false);
  readonly gridOptions: GridOptions = {
    columnDefs: [
      { id: 'name', field: 'name', label: 'Product', type: ColumnType.String, sortable: true, resizable: true, draggable: true },
      { id: 'category', field: 'category', label: 'Category', type: ColumnType.String, sortable: true, resizable: true },
      { id: 'price', field: 'price', label: 'Price', type: ColumnType.Number, format: 'currency' as any, sortable: true, resizable: true },
      { id: 'stock', field: 'stock', label: 'Stock', type: ColumnType.Number, sortable: true, resizable: true },
      { id: 'status', field: 'status', label: 'Status', type: ColumnType.String, cellTemplate: 'statusTpl', sortable: true, resizable: true },
      { id: 'actions', field: '', label: '', cellTemplate: 'actionsTpl', width: '96px' }
    ] as ColumnDef[],
    showMenuBar: true,
    headerTemplate: 'menuTpl',
    showFooter: false,
    showPager: false,
    enableVirtualScroll: false,
    noDataMessage: 'No products match your filters.'
  };
  readonly pluginOptions: PluginOptions = {
    MultiSort: { enableMultiSort: true }
  } as PluginOptions;

  readonly dialogVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  form: Partial<Product> = {};

  readonly detailsVisible = signal(false);
  readonly selected = signal<Product | null>(null);

  @ViewChild(GridComponent) private grid?: GridComponent;

  ngAfterViewInit(): void {
    setTimeout(() => { this.gridVisible.set(true); this.pushData(); });
  }

  /** Push the current filtered dataset straight into the grid and flush the render.
   *  (Zoneless: the grid's nested-setTimeout render needs a few ticks to reach the DOM.) */
  private pushData(): void {
    this.grid?.gridApi?.setData(this.filtered());
    for (const d of [0, 120, 300]) { setTimeout(() => this.appRef.tick(), d); }
  }

  onFilter(kind: 'search' | 'category' | 'status', value: string): void {
    if (kind === 'search') { this.search.set(value); }
    else if (kind === 'category') { this.category.set(value); }
    else { this.statusFilter.set(value); }
    this.pushData();
  }

  onRowClick(event: RowEvent<unknown> | null): void {
    if (event?.row) {
      this.selected.set(event.row as Product);
      this.detailsVisible.set(true);
    }
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = { name: '', category: CATEGORIES[0], price: 0, stock: 0, status: 'In stock' };
    this.dialogVisible.set(true);
  }

  openEdit(product: Product): void {
    this.editingId.set(product.id);
    this.form = { ...product };
    this.dialogVisible.set(true);
  }

  save(): void {
    const draft = this.form;
    if (!draft.name?.trim()) {
      this.toast.show({ severity: 'warn', summary: 'Name required', detail: 'Give the product a name.' });
      return;
    }
    const id = this.editingId();
    if (id != null) {
      this.products.update(list => list.map(p => (p.id === id ? { ...p, ...draft } as Product : p)));
      this.toast.show({ severity: 'success', summary: 'Product updated', detail: `${draft.name} was saved.` });
    } else {
      const nextId = Math.max(0, ...this.products().map(p => p.id)) + 1;
      this.products.update(list => [{ ...draft, id: nextId } as Product, ...list]);
      this.toast.show({ severity: 'success', summary: 'Product created', detail: `${draft.name} was added.` });
    }
    this.dialogVisible.set(false);
    this.pushData();
  }

  async remove(product: Product): Promise<void> {
    const ok = await this.confirm.confirm({
      header: 'Delete product',
      message: `Delete “${product.name}”? This cannot be undone.`,
      acceptLabel: 'Delete',
      danger: true
    });
    if (!ok) { return; }
    this.products.update(list => list.filter(p => p.id !== product.id));
    this.toast.show({ severity: 'danger', summary: 'Product deleted', detail: `${product.name} was removed.` });
    this.pushData();
  }

  reset(): void {
    this.products.set(seedProducts());
    this.search.set('');
    this.category.set('All categories');
    this.statusFilter.set('All');
    this.toast.show({ severity: 'info', summary: 'Data reset', detail: 'Sample products restored.' });
    this.pushData();
  }
}
