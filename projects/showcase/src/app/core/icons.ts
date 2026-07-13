/**
 * Uniform line icons for every component, keyed by slug. Each value is the
 * INNER markup of a shared 24×24 `<svg>` (stroke, currentColor, round caps —
 * see {@link IconComponent}). Designed as a coherent single-weight set so the
 * gallery reads as one system.
 */
export const COMPONENT_ICONS: Record<string, string> = {
  // ---- Data ----
  grid: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14.5h18M9 4v16M15 4v16"/>',
  table: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 10h18M11 10v9"/>',
  chart: '<path d="M4 4v16h16"/><path d="M7 14l3-4 3 2 4-6"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8 3v4M16 3v4"/>',
  timeline: '<path d="M7 4v16"/><circle cx="7" cy="8" r="2"/><circle cx="7" cy="16" r="2"/><path d="M11 8h8M11 16h6"/>',
  'org-chart': '<rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v3M6 17v-3h12v3"/>',
  'data-view': '<rect x="3.5" y="4" width="7.5" height="7" rx="1.2"/><rect x="13" y="4" width="7.5" height="7" rx="1.2"/><rect x="3.5" y="13" width="7.5" height="7" rx="1.2"/><rect x="13" y="13" width="7.5" height="7" rx="1.2"/>',
  'virtual-scroller': '<rect x="4" y="4" width="12" height="16" rx="2"/><path d="M7 8.5h6M7 12h6M7 15.5h6"/><rect x="18.5" y="6" width="2" height="8" rx="1" fill="currentColor" stroke="none"/>',
  tree: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h4a2 2 0 0 1 2 2v0M8 18h4a2 2 0 0 0 2-2v0"/>',
  'order-list': '<path d="M4 7h9M4 12h9M4 17h9"/><path d="M18 6v12M18 6l-2 2M18 6l2 2"/>',
  'pick-list': '<rect x="3" y="5" width="6" height="14" rx="1.5"/><rect x="15" y="5" width="6" height="14" rx="1.5"/><path d="M10 9l3 3-3 3M14 15l-3-3 3-3"/>',
  paginator: '<path d="M6 12h12"/><path d="M9 9l-3 3 3 3M15 9l3 3-3 3"/>',

  // ---- Form ----
  'input-number': '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h4"/><path d="M17.5 10l1.5-1.5 1.5 1.5M17.5 14l1.5 1.5 1.5-1.5"/>',
  'date-picker': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8 3v4M16 3v4"/><circle cx="12" cy="14.5" r="1.4" fill="currentColor" stroke="none"/>',
  'input-text': '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 10v4"/><path d="M6 10h2M6 14h2"/>',
  'input-mask': '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h2M11 12h2M15 12h2"/>',
  'input-otp': '<rect x="3.5" y="8" width="3.6" height="8" rx="1"/><rect x="10.2" y="8" width="3.6" height="8" rx="1"/><rect x="16.9" y="8" width="3.6" height="8" rx="1"/>',
  password: '<rect x="3" y="8" width="18" height="8" rx="2"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r="1" fill="currentColor" stroke="none"/>',
  textarea: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 12.5h10M7 16h6"/><path d="M17 16l2 2"/>',
  select: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M14.5 11l2 2 2-2"/><path d="M7 12h4"/>',
  'multi-select': '<rect x="3" y="7" width="18" height="10" rx="2"/><rect x="6" y="10" width="4" height="4" rx="1"/><path d="M15 11l2 2 2-2"/>',
  autocomplete: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="15" cy="11.5" r="2"/><path d="M16.6 13.1l1.4 1.4M7 12h4"/>',
  listbox: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8.5h7M9 12h7M9 15.5h5"/><circle cx="6.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="15.5" r="1" fill="currentColor" stroke="none"/>',
  checkbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  'radio-button': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  'toggle-switch': '<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none"/>',
  'select-button': '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M9 8v8M15 8v8"/>',
  slider: '<path d="M4 12h16"/><circle cx="10" cy="12" r="3"/>',
  rating: '<path d="M12 4.5l2.2 4.5 4.9.7-3.5 3.5.8 4.9-4.4-2.3-4.4 2.3.8-4.9L5.9 9.7l4.9-.7z"/>',
  knob: '<circle cx="12" cy="12" r="8"/><path d="M12 12l3.2-3.2"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  'color-picker': '<path d="M12 3c-4.5 0-8 3.2-8 7.3 0 3 2 4.7 4 4.7 1.3 0 1.8.8 1.8 1.7 0 1.2.9 2.3 2.2 2.3 4.5 0 8-3.6 8-8C20 6.3 16.5 3 12 3z"/><circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none"/>',
  button: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 12h8"/>',
  editor: '<path d="M4 20h16"/><path d="M8 8h5M8 12h8"/><path d="M15.5 5.5l3 3-6 6H9.5v-3z"/>',
  'input-group': '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M9 8v8"/><path d="M6 12h.01"/>',
  'float-label': '<rect x="3" y="9" width="18" height="8" rx="2"/><rect x="6" y="6.5" width="6" height="3" rx="1.2" fill="var(--cw-surface)"/>',
  'ifta-label': '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 9.5h6"/><path d="M7 13.5h10"/>',
  inplace: '<path d="M4 18h16"/><path d="M6 14h6"/><path d="M14.5 7.5l3 3-4 4H10.5v-3z"/>',

  // ---- Display ----
  badge: '<rect x="4" y="6" width="12" height="12" rx="2.5"/><circle cx="18" cy="6" r="3" fill="currentColor" stroke="none"/>',
  tag: '<path d="M4 11.5l7-7h6a1.5 1.5 0 0 1 1.5 1.5v6l-7 7a1.5 1.5 0 0 1-2 0l-5.5-5.5a1.5 1.5 0 0 1 0-2z"/><circle cx="14.5" cy="9.5" r="1.2"/>',
  chip: '<rect x="3" y="8" width="15" height="8" rx="4"/><path d="M12.5 10.5l3 3M15.5 10.5l-3 3"/>',
  avatar: '<circle cx="12" cy="9" r="3.5"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/>',
  card: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 15h8M8 12h5"/>',
  carousel: '<rect x="7" y="6" width="10" height="12" rx="2"/><path d="M4 9v6M20 9v6"/>',
  galleria: '<rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="M4 15l4-4 3 3 4-4 5 5"/><path d="M7 19h10"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
  'progress-bar': '<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M5 12h8" stroke-width="4"/>',
  'meter-group': '<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M9 10v4M14 10v4"/>',
  skeleton: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  spinner: '<path d="M12 4a8 8 0 1 0 8 8"/>',
  terminal: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2-3 2M12.5 14h4"/>',
  alert: '<path d="M12 4l8.5 15h-17z"/><path d="M12 10v4"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none"/>',
  divider: '<path d="M4 12h16"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  fieldset: '<path d="M4 8v11h16V8"/><path d="M4 8h5M15 8h5"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  'block-ui': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/><path d="M3 5l18 14" opacity="0"/>',
  'scroll-panel': '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M7 8h7M7 12h7M7 16h5"/><rect x="17" y="6" width="2" height="7" rx="1" fill="currentColor" stroke="none"/>',
  'scroll-top': '<path d="M12 20V8"/><path d="M7 12l5-5 5 5"/><path d="M7 4h10"/>',

  // ---- Navigation ----
  tabs: '<rect x="3" y="8" width="18" height="11" rx="1.5"/><path d="M3 8l1-2h5l1 2"/>',
  accordion: '<rect x="3" y="4.5" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="15.5" width="18" height="4" rx="1"/><path d="M16.5 6l1 1 1-1"/>',
  breadcrumb: '<path d="M5 8l3 4-3 4M12 8l3 4-3 4"/><path d="M18 12h1.5"/>',
  steps: '<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 12h3M14 12h3"/>',
  stepper: '<circle cx="6" cy="12" r="3"/><path d="M4.8 12l1 1 1.6-1.8"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  menubar: '<rect x="3" y="6.5" width="18" height="4" rx="1"/><path d="M6 8.5h2M11 8.5h2M16 8.5h2"/><path d="M6 14h5M6 17h8"/>',
  'tiered-menu': '<path d="M4 7h7M4 12h7M4 17h7"/><path d="M9 12l2 0M13 9h7M13 15h7"/>',
  'mega-menu': '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 12h5M5 15.5h5M5 19h4M14 12h5M14 15.5h5M14 19h4"/>',
  'panel-menu': '<path d="M4 6h16"/><path d="M4 11h16M18 9.5l1 1.5-1 1.5" opacity="0"/><path d="M4 11h13"/><path d="M6 16h11"/><path d="M20 10l-1.5 1.5L20 13"/>',
  'context-menu': '<path d="M4 4l7 3 3 7 2-4 4-2z"/><rect x="12" y="12" width="9" height="8" rx="1.5"/><path d="M15 15h3M15 18h3"/>',
  dock: '<rect x="3" y="14" width="18" height="6" rx="3"/><circle cx="7" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="17" r="1.2" fill="currentColor" stroke="none"/>',

  // ---- Overlay ----
  dialog: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><circle cx="6" cy="7" r="0.6" fill="currentColor" stroke="none"/><circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none"/>',
  'dynamic-dialog': '<rect x="6" y="7" width="15" height="12" rx="2"/><path d="M3 5h12v3"/>',
  drawer: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill="currentColor" fill-opacity="0.12"/>',
  popover: '<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M9 15l3 4 3-4"/>',
  tooltip: '<rect x="3" y="5" width="18" height="10" rx="2"/><path d="M9 15l3 3 3-3"/><path d="M8 10h8"/>',
  toast: '<path d="M12 4a5 5 0 0 0-5 5v3l-1.5 3h13L17 12V9a5 5 0 0 0-5-5z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  confirm: '<circle cx="12" cy="12" r="8"/><path d="M9.5 10a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5"/><circle cx="12" cy="16" r="0.7" fill="currentColor" stroke="none"/>',
  'speed-dial': '<circle cx="12" cy="18" r="2.5"/><path d="M12 15V8"/><path d="M9 11l3-3 3 3"/><circle cx="6" cy="8" r="1.2"/><circle cx="18" cy="8" r="1.2"/>',

  // ---- Utilities ----
  'animate-on-scroll': '<path d="M12 4v10"/><path d="M8 10l4 4 4-4"/><path d="M6 19h12"/>',
  'style-class': '<path d="M9 4l-2 16M17 4l-2 16M5 9h14M4 15h14"/>',
  'deferred-content': '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8" stroke-dasharray="2 2"/><path d="M8 15h5" stroke-dasharray="2 2"/>',
  'focus-trap': '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M5 9V7a2 2 0 0 1 2-2h2M15 5h2a2 2 0 0 1 2 2v2M19 15v2a2 2 0 0 1-2 2h-2M9 19H7a2 2 0 0 1-2-2v-2"/>',
  ripple: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="8"/>'
};

/** Generic glyph for any slug without a bespoke icon. */
export const FALLBACK_ICON = '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>';
