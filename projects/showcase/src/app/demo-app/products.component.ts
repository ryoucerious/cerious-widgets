import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, CwConfirmService, CwTableColumn, CwToastService, DialogComponent,
  DividerComponent, DrawerComponent, InputNumberComponent, InputTextDirective, SelectButtonComponent,
  SelectComponent, TableColumnDirective, TableComponent, TagComponent, ToolbarComponent
} from 'ngx-cerious-widgets';
import { CATEGORIES, PRODUCT_STATUSES, Product, productSeverity, seedProducts } from './demo-data';

@Component({
  selector: 'app-demo-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, CurrencyPipe, TableComponent, TableColumnDirective, TagComponent,
    ButtonComponent, ToolbarComponent, DialogComponent, SelectComponent, SelectButtonComponent,
    InputNumberComponent, InputTextDirective, DrawerComponent, DividerComponent
  ],
  template: `
    <header class="page-head">
      <div>
        <h1 class="page-head__title">Products</h1>
        <p class="page-head__sub">{{ filtered().length }} of {{ products().length }} products</p>
      </div>
      <button cwButton (click)="openCreate()">+ New product</button>
    </header>

    <cw-toolbar>
      <div cwToolbarStart>
        <input cwInput type="search" placeholder="Search products…" aria-label="Search products"
               [ngModel]="search()" (ngModelChange)="search.set($event)" style="min-width: 15rem;" />
        <cw-select [options]="categoryOptions" [ngModel]="category()" (ngModelChange)="category.set($event)"
                   aria-label="Filter by category" style="min-width: 12rem; margin-left: 0.5rem;" />
      </div>
      <div cwToolbarEnd>
        <cw-select-button [options]="statusOptions" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" />
        <button cwButton severity="secondary" variant="outlined" (click)="reset()" style="margin-left: 0.5rem;">Reset</button>
      </div>
    </cw-toolbar>

    <div class="table-card">
      <cw-table [columns]="columns" [value]="filtered()" hoverable emptyMessage="No products match your filters."
                (rowClick)="openDetails($event)">
        <ng-template cwColumn="price" let-value="value">{{ value | currency }}</ng-template>
        <ng-template cwColumn="status" let-value="value">
          <cw-tag [value]="value" [severity]="severity(value)" />
        </ng-template>
        <ng-template cwColumn="actions" let-row>
          <div class="row-actions">
            <button cwButton size="small" variant="text" (click)="openEdit(row); $event.stopPropagation()" aria-label="Edit">✎</button>
            <button cwButton size="small" variant="text" severity="danger" (click)="remove(row); $event.stopPropagation()" aria-label="Delete">🗑</button>
          </div>
        </ng-template>
      </cw-table>
    </div>

    <!-- Product details drawer (opens on row click). -->
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

    <cw-dialog [header]="editingId() ? 'Edit product' : 'New product'"
               [visible]="dialogVisible()" (visibleChange)="dialogVisible.set($event)" width="30rem">
      <div class="form">
        <label class="field">
          <span class="field__label">Name</span>
          <input cwInput [(ngModel)]="form.name" placeholder="Product name" />
        </label>

        <label class="field">
          <span class="field__label">Category</span>
          <cw-select [options]="categories" [(ngModel)]="form.category" placeholder="Select a category" />
        </label>

        <div class="form__row">
          <label class="field">
            <span class="field__label">Price</span>
            <cw-input-number [(ngModel)]="form.price" mode="currency" currency="USD" ariaLabel="Price" />
          </label>
          <label class="field">
            <span class="field__label">Stock</span>
            <cw-input-number [(ngModel)]="form.stock" [min]="0" ariaLabel="Stock" />
          </label>
        </div>

        <label class="field">
          <span class="field__label">Status</span>
          <cw-select [options]="statuses" [(ngModel)]="form.status" placeholder="Select a status" />
        </label>
      </div>

      <div cwDialogFooter>
        <button cwButton severity="secondary" variant="outlined" (click)="dialogVisible.set(false)">Cancel</button>
        <button cwButton (click)="save()">{{ editingId() ? 'Save changes' : 'Create product' }}</button>
      </div>
    </cw-dialog>
  `,
  styles: [`
    :host { display: block; }
    .page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
    .page-head__title { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--cw-text); }
    .page-head__sub { margin: 0.25rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .table-card { margin-top: 1rem; }
    .row-actions { display: flex; gap: 0.15rem; }

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
  `]
})
export class DemoProductsComponent {
  private readonly toast = inject(CwToastService);
  private readonly confirm = inject(CwConfirmService);

  readonly categories = CATEGORIES;
  readonly statuses = PRODUCT_STATUSES;
  readonly severity = productSeverity;

  readonly categoryOptions = ['All categories', ...CATEGORIES];
  readonly statusOptions = ['All', ...PRODUCT_STATUSES];

  readonly products = signal<Product[]>(seedProducts());
  readonly search = signal('');
  readonly category = signal('All categories');
  readonly statusFilter = signal('All');
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const cat = this.category();
    const status = this.statusFilter();
    return this.products().filter(p => {
      const matchesText = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesCat = cat === 'All categories' || p.category === cat;
      const matchesStatus = status === 'All' || p.status === status;
      return matchesText && matchesCat && matchesStatus;
    });
  });

  readonly dialogVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  form: Partial<Product> = {};

  // Details drawer (opens on row click).
  readonly detailsVisible = signal(false);
  readonly selected = signal<Product | null>(null);
  openDetails(product: Product): void {
    this.selected.set(product);
    this.detailsVisible.set(true);
  }

  readonly columns: CwTableColumn[] = [
    { field: 'name', header: 'Product', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    { field: 'price', header: 'Price', align: 'right', sortable: true },
    { field: 'stock', header: 'Stock', align: 'right', sortable: true },
    { field: 'status', header: 'Status' },
    { field: 'actions', header: '', align: 'right' }
  ];

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
  }

  reset(): void {
    this.products.set(seedProducts());
    this.search.set('');
    this.category.set('All categories');
    this.statusFilter.set('All');
    this.toast.show({ severity: 'info', summary: 'Data reset', detail: 'Sample products restored.' });
  }
}
