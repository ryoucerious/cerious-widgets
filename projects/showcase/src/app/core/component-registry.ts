/**
 * The catalog of every cerious-widgets component shown in the showcase. Drives
 * the landing stats, the gallery grid, the docs sidebar, and the per-component
 * routes.
 *
 * `ready` marks whether a full documentation page exists yet (built in batches).
 * `complex` marks components that get a multi-section "Features" breakout
 * (à la the Grid), vs. simple primitives with a single demo.
 */
export interface ComponentDoc {
  /** URL slug under /components/:slug. */
  slug: string;
  /** Display name (e.g. "InputNumber"). */
  name: string;
  /** Sidebar/gallery group. */
  group: ComponentGroup;
  /** One-line description for gallery cards + sidebar tooltips. */
  summary: string;
  /** Emoji glyph for the gallery card. */
  icon: string;
  /** Multi-section Features breakout (complex component). */
  complex?: boolean;
  /** Uses ngx-cerious-scroll virtualization. */
  virtualized?: boolean;
  /** Documentation page is built. */
  ready?: boolean;
}

export type ComponentGroup = 'Data' | 'Form' | 'Display' | 'Navigation' | 'Overlay' | 'Utilities';

export const GROUP_ORDER: ComponentGroup[] = ['Data', 'Form', 'Display', 'Navigation', 'Overlay', 'Utilities'];

export const COMPONENTS: ComponentDoc[] = [
  // ---- Data ----
  { slug: 'grid', name: 'Grid', group: 'Data', icon: '▦', summary: 'Virtualized data grid — sort, group, pin, edit, export', complex: true, virtualized: true, ready: true },
  { slug: 'table', name: 'Table', group: 'Data', icon: '☷', summary: 'Lightweight semantic table with sorting & templates', complex: true, ready: true },

  // ---- Form ----
  { slug: 'input-number', name: 'InputNumber', group: 'Form', icon: '#', summary: 'Numeric input with steppers, currency & locale formatting', complex: true, ready: true },
  { slug: 'date-picker', name: 'DatePicker', group: 'Form', icon: '📅', summary: 'Calendar date input with locale & min/max', complex: true, ready: true },
  { slug: 'input-text', name: 'InputText', group: 'Form', icon: 'T', summary: 'Token-styled native text input' , ready: true },
  { slug: 'input-mask', name: 'InputMask', group: 'Form', icon: '⌗', summary: 'Pattern-masked text input' , ready: true },
  { slug: 'input-otp', name: 'InputOTP', group: 'Form', icon: '⚇', summary: 'Segmented one-time-code input' , ready: true },
  { slug: 'password', name: 'Password', group: 'Form', icon: '⚿', summary: 'Password field with strength meter' , ready: true },
  { slug: 'textarea', name: 'Textarea', group: 'Form', icon: '¶', summary: 'Auto-resizing multiline input' , ready: true },
  { slug: 'select', name: 'Select', group: 'Form', icon: '▾', summary: 'Single-select dropdown', complex: true, ready: true },
  { slug: 'multi-select', name: 'MultiSelect', group: 'Form', icon: '☑', summary: 'Multi-select with chips & virtual scroll', complex: true, virtualized: true, ready: true },
  { slug: 'autocomplete', name: 'AutoComplete', group: 'Form', icon: '⌕', summary: 'Typeahead input (virtualized)', complex: true, virtualized: true, ready: true },
  { slug: 'listbox', name: 'Listbox', group: 'Form', icon: '☰', summary: 'Inline selection list (virtualized)', virtualized: true , ready: true },
  { slug: 'checkbox', name: 'Checkbox', group: 'Form', icon: '✓', summary: 'Boolean checkbox' , ready: true },
  { slug: 'radio-button', name: 'RadioButton', group: 'Form', icon: '◉', summary: 'Single choice in a group' , ready: true },
  { slug: 'toggle-switch', name: 'ToggleSwitch', group: 'Form', icon: '⇄', summary: 'On/off switch' , ready: true },
  { slug: 'select-button', name: 'SelectButton', group: 'Form', icon: '⊟', summary: 'Segmented choice buttons' , ready: true },
  { slug: 'slider', name: 'Slider', group: 'Form', icon: '⇥', summary: 'Numeric range slider' , ready: true },
  { slug: 'rating', name: 'Rating', group: 'Form', icon: '★', summary: 'Star rating input' , ready: true },
  { slug: 'knob', name: 'Knob', group: 'Form', icon: '◔', summary: 'Circular dial input' , ready: true },
  { slug: 'color-picker', name: 'ColorPicker', group: 'Form', icon: '🎨', summary: 'Colour swatch & palette' , ready: true },
  { slug: 'button', name: 'Button', group: 'Form', icon: '⬚', summary: 'Clickable action with variants', ready: true },

  // ---- Display ----
  { slug: 'badge', name: 'Badge', group: 'Display', icon: '⬤', summary: 'Small count / status indicator' , ready: true },
  { slug: 'tag', name: 'Tag', group: 'Display', icon: '🏷', summary: 'Labelled pill' , ready: true },
  { slug: 'chip', name: 'Chip', group: 'Display', icon: '⬭', summary: 'Removable value pill' , ready: true },
  { slug: 'avatar', name: 'Avatar', group: 'Display', icon: '👤', summary: 'User / entity representation' , ready: true },
  { slug: 'card', name: 'Card', group: 'Display', icon: '▭', summary: 'Card, panel & toolbar surfaces' , ready: true },
  { slug: 'timeline', name: 'Timeline', group: 'Data', icon: '⏱', summary: 'Event sequence with markers' , ready: true },
  { slug: 'org-chart', name: 'OrgChart', group: 'Display', icon: '🌳', summary: 'Top-down hierarchy of node cards', ready: true },
  { slug: 'data-view', name: 'DataView', group: 'Data', icon: '▤', summary: 'List / grid of items (virtualized)', virtualized: true , ready: true },
  { slug: 'carousel', name: 'Carousel', group: 'Display', icon: '⟳', summary: 'Rotating content slides' , ready: true },
  { slug: 'galleria', name: 'Galleria', group: 'Display', icon: '🖼', summary: 'Image gallery with thumbnails' , ready: true },
  { slug: 'image', name: 'Image', group: 'Display', icon: '🏞', summary: 'Image with preview viewer' , ready: true },
  { slug: 'progress-bar', name: 'ProgressBar', group: 'Display', icon: '▬', summary: 'Determinate progress' , ready: true },
  { slug: 'meter-group', name: 'MeterGroup', group: 'Display', icon: '▰', summary: 'Multi-segment meter' , ready: true },
  { slug: 'skeleton', name: 'Skeleton', group: 'Display', icon: '░', summary: 'Loading placeholder' , ready: true },
  { slug: 'spinner', name: 'Spinner', group: 'Display', icon: '◌', summary: 'Indeterminate loading' , ready: true },
  { slug: 'virtual-scroller', name: 'VirtualScroller', group: 'Data', icon: '≣', summary: 'Standalone virtual list', virtualized: true , ready: true },
  { slug: 'terminal', name: 'Terminal', group: 'Display', icon: '❯', summary: 'Command-line interface' , ready: true },

  // ---- Navigation ----
  { slug: 'tabs', name: 'Tabs', group: 'Navigation', icon: '⊤', summary: 'Tabbed content container' , ready: true },
  { slug: 'accordion', name: 'Accordion', group: 'Navigation', icon: '☰', summary: 'Collapsible content panels' , ready: true },
  { slug: 'breadcrumb', name: 'Breadcrumb', group: 'Navigation', icon: '»', summary: 'Hierarchical page trail' , ready: true },
  { slug: 'steps', name: 'Steps', group: 'Navigation', icon: '➊', summary: 'Numbered progress sequence' , ready: true },
  { slug: 'stepper', name: 'Stepper', group: 'Navigation', icon: '⧗', summary: 'Multi-step wizard', complex: true, ready: true },
  { slug: 'menu', name: 'Menu', group: 'Navigation', icon: '⋮', summary: 'Action / navigation menu' , ready: true },
  { slug: 'menubar', name: 'Menubar', group: 'Navigation', icon: '☰', summary: 'Horizontal app menu bar' , ready: true },
  { slug: 'tiered-menu', name: 'TieredMenu', group: 'Navigation', icon: '⋯', summary: 'Nested submenu menu' , ready: true },
  { slug: 'mega-menu', name: 'MegaMenu', group: 'Navigation', icon: '▦', summary: 'Multi-column mega menu' , ready: true },
  { slug: 'panel-menu', name: 'PanelMenu', group: 'Navigation', icon: '☷', summary: 'Inline accordion menu' , ready: true },
  { slug: 'tree', name: 'Tree', group: 'Data', icon: '🌲', summary: 'Hierarchical tree (virtualized)', complex: true, virtualized: true, ready: true },
  { slug: 'order-list', name: 'OrderList', group: 'Data', icon: '↕', summary: 'Reorderable list (virtualized)', virtualized: true , ready: true },
  { slug: 'pick-list', name: 'PickList', group: 'Data', icon: '⇄', summary: 'Dual-list transfer (virtualized)', virtualized: true , ready: true },
  { slug: 'paginator', name: 'Paginator', group: 'Data', icon: '⏭', summary: 'Standalone pager' , ready: true },
  { slug: 'context-menu', name: 'ContextMenu', group: 'Navigation', icon: '☰', summary: 'Right-click menu' , ready: true },
  { slug: 'dock', name: 'Dock', group: 'Navigation', icon: '⚓', summary: 'Magnifying icon dock' , ready: true },

  // ---- Overlay ----
  { slug: 'dialog', name: 'Dialog', group: 'Overlay', icon: '❐', summary: 'Focus-trapped modal', complex: true, ready: true },
  { slug: 'dynamic-dialog', name: 'DynamicDialog', group: 'Overlay', icon: '❏', summary: 'Open components in a modal imperatively' , ready: true },
  { slug: 'drawer', name: 'Drawer', group: 'Overlay', icon: '▢', summary: 'Edge-sliding panel' , ready: true },
  { slug: 'popover', name: 'Popover', group: 'Overlay', icon: '◈', summary: 'Anchored overlay panel' , ready: true },
  { slug: 'tooltip', name: 'Tooltip', group: 'Overlay', icon: '💬', summary: 'Hover / focus text bubble' , ready: true },
  { slug: 'toast', name: 'Toast', group: 'Overlay', icon: '🔔', summary: 'Queued notifications' , ready: true },
  { slug: 'confirm', name: 'ConfirmDialog', group: 'Overlay', icon: '❓', summary: 'Promise-based confirmations' , ready: true },
  { slug: 'speed-dial', name: 'SpeedDial', group: 'Overlay', icon: '✦', summary: 'Radial action button' , ready: true },

  // ---- Utilities ----
  { slug: 'animate-on-scroll', name: 'AnimateOnScroll', group: 'Utilities', icon: '✧', summary: 'Reveal-on-scroll directive' , ready: true },
  { slug: 'style-class', name: 'StyleClass', group: 'Utilities', icon: '❖', summary: 'Toggle classes on a target' , ready: true },
  { slug: 'deferred-content', name: 'DeferredContent', group: 'Utilities', icon: '⧖', summary: 'Lazy-render on scroll-in' , ready: true },
  { slug: 'focus-trap', name: 'FocusTrap', group: 'Utilities', icon: '⛶', summary: 'Cycle Tab focus within a region' , ready: true },
  { slug: 'ripple', name: 'Ripple', group: 'Utilities', icon: '💧', summary: 'Click ripple directive', ready: true },
  { slug: 'alert', name: 'Alert', group: 'Display', icon: '❗', summary: 'Inline feedback message', ready: true },
  { slug: 'divider', name: 'Divider', group: 'Display', icon: '—', summary: 'Content separator line', ready: true },
  { slug: 'fieldset', name: 'Fieldset', group: 'Display', icon: '▢', summary: 'Collapsible legend group', ready: true },
  { slug: 'block-ui', name: 'BlockUI', group: 'Display', icon: '▨', summary: 'Region loading overlay', ready: true },
  { slug: 'scroll-panel', name: 'ScrollPanel', group: 'Display', icon: '▥', summary: 'Themed-scrollbar container', ready: true },
  { slug: 'scroll-top', name: 'ScrollTop', group: 'Display', icon: '⤒', summary: 'Back-to-top button', ready: true },
  { slug: 'editor', name: 'Editor', group: 'Form', icon: '✎', summary: 'Rich-text editor', ready: true },
  { slug: 'input-group', name: 'InputGroup', group: 'Form', icon: '⊞', summary: 'Input with seamed addons', ready: true },
  { slug: 'float-label', name: 'FloatLabel', group: 'Form', icon: '⌂', summary: 'Floating field label', ready: true },
  { slug: 'ifta-label', name: 'IftaLabel', group: 'Form', icon: '⌐', summary: 'In-field top label', ready: true },
  { slug: 'inplace', name: 'Inplace', group: 'Form', icon: '✐', summary: 'Click-to-edit value', ready: true },
];

export const TOTAL_COMPONENTS = COMPONENTS.length;

export function componentsByGroup(): { group: ComponentGroup; items: ComponentDoc[] }[] {
  return GROUP_ORDER.map(group => ({
    group,
    // Alphabetical within each group (case-insensitive) so the sidebar and
    // gallery are easy to scan.
    items: COMPONENTS
      .filter(c => c.group === group)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  })).filter(g => g.items.length > 0);
}

export function findComponent(slug: string): ComponentDoc | undefined {
  return COMPONENTS.find(c => c.slug === slug);
}
