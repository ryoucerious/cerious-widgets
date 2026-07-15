import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent, AutoCompleteComponent, AvatarComponent, BadgeComponent, BreadcrumbComponent,
  ButtonComponent, CheckboxComponent, ChipComponent, ColorPickerComponent, CwToastService,
  DatePickerComponent, DividerComponent, EditorComponent, FieldsetComponent, FloatLabelComponent,
  IftaLabelComponent, InputGroupComponent, InputMaskComponent, InputOtpComponent, InputTextDirective,
  KnobComponent, MultiSelectComponent, PasswordComponent, RadioButtonComponent, RatingComponent,
  SelectButtonComponent, SelectComponent, SliderComponent, TabComponent, TabsComponent,
  TagComponent, TextareaDirective, ToggleSwitchComponent
} from 'ngx-cerious-widgets';
import { COUNTRIES, SKILLS } from './demo-data';

@Component({
  selector: 'app-demo-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, BreadcrumbComponent, AvatarComponent, BadgeComponent, TagComponent, ButtonComponent,
    TabsComponent, TabComponent, FieldsetComponent, DividerComponent, AlertComponent, ChipComponent,
    InputGroupComponent, InputTextDirective, TextareaDirective, SelectComponent, MultiSelectComponent,
    DatePickerComponent, AutoCompleteComponent, RatingComponent, ToggleSwitchComponent, CheckboxComponent,
    RadioButtonComponent, SelectButtonComponent, ColorPickerComponent, KnobComponent, SliderComponent,
    PasswordComponent, InputMaskComponent, InputOtpComponent, EditorComponent, FloatLabelComponent,
    IftaLabelComponent
  ],
  template: `
    <cw-breadcrumb [items]="crumbs" />

    <!-- Profile header -->
    <div class="profile-head">
      <div class="profile-head__cover"></div>
      <div class="profile-head__row">
        <cw-avatar label="JD" size="large" />
        <div class="profile-head__meta">
          <div class="profile-head__name">
            {{ name }}
            <cw-tag value="Enterprise" severity="success" rounded />
            <cw-badge value="PRO" />
          </div>
          <div class="profile-head__sub">{{ handle }} · {{ country }}</div>
        </div>
        <div class="profile-head__actions">
          <button cwButton severity="secondary" variant="outlined" (click)="reset()">Discard</button>
          <button cwButton (click)="save()">Save changes</button>
        </div>
      </div>
    </div>

    <cw-tabs>
      <!-- ============ PROFILE ============ -->
      <cw-tab label="Profile">
        <div class="grid2">
          <cw-fieldset legend="Personal information">
            <div class="form">
              <label class="field"><span class="field__label">Full name</span>
                <input cwInput [(ngModel)]="name" placeholder="Your name" />
              </label>
              <label class="field"><span class="field__label">Email</span>
                <cw-input-group>
                  <span cwInputAddon>&#64;</span>
                  <input cwInput [(ngModel)]="email" placeholder="you&#64;example.com" />
                </cw-input-group>
              </label>
              <div class="form__row">
                <label class="field"><span class="field__label">Country</span>
                  <cw-select [options]="countries" [(ngModel)]="country" placeholder="Country" aria-label="Country" />
                </label>
                <label class="field"><span class="field__label">Birthday</span>
                  <cw-date-picker [(ngModel)]="birthday" aria-label="Birthday" />
                </label>
              </div>
              <label class="field"><span class="field__label">Bio</span>
                <textarea cwTextarea rows="3" [(ngModel)]="bio" placeholder="A short bio…"></textarea>
              </label>
            </div>
          </cw-fieldset>

          <cw-fieldset legend="Skills & expertise">
            <div class="form">
              <label class="field"><span class="field__label">Skills</span>
                <cw-multi-select [options]="skills" [(ngModel)]="selectedSkills" placeholder="Add skills" aria-label="Skills" />
              </label>
              <div class="chips">
                @for (s of selectedSkills; track s) { <cw-chip [label]="s" /> }
              </div>
              <label class="field"><span class="field__label">Primary city</span>
                <cw-autocomplete [options]="countries" [(ngModel)]="city" placeholder="Search…" aria-label="City" />
              </label>
              <div class="field">
                <span class="field__label">Proficiency</span>
                <cw-rating [(ngModel)]="proficiency" aria-label="Proficiency" />
              </div>
            </div>
          </cw-fieldset>
        </div>

        <cw-fieldset legend="About you" style="margin-top: 1rem;">
          <cw-editor [(ngModel)]="about" placeholder="Tell the team about yourself…" ariaLabel="About you" />
        </cw-fieldset>
      </cw-tab>

      <!-- ============ ACCOUNT ============ -->
      <cw-tab label="Account">
        <div class="grid2">
          <cw-fieldset legend="Contact">
            <div class="form">
              <cw-float-label label="Display name">
                <input cwInput [(ngModel)]="handle" />
              </cw-float-label>
              <cw-ifta-label label="Phone">
                <cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />
              </cw-ifta-label>
              <label class="field"><span class="field__label">Website</span>
                <cw-input-group>
                  <span cwInputAddon>https://</span>
                  <input cwInput [(ngModel)]="website" placeholder="mysite.com" />
                </cw-input-group>
              </label>
            </div>
          </cw-fieldset>

          <cw-fieldset legend="Preferences">
            <div class="form">
              <label class="field"><span class="field__label">Interests</span>
                <cw-multi-select [options]="skills" [(ngModel)]="interests" placeholder="Pick interests" aria-label="Interests" />
              </label>
              <div class="field">
                <span class="field__label">Plan</span>
                <cw-select-button [options]="plans" [(ngModel)]="plan" />
              </div>
              <div class="field">
                <span class="field__label">Monthly budget: {{ '$' + budget }}</span>
                <cw-slider [min]="0" [max]="500" [step]="10" [(ngModel)]="budget" ariaLabel="Monthly budget" />
              </div>
            </div>
          </cw-fieldset>
        </div>
      </cw-tab>

      <!-- ============ NOTIFICATIONS ============ -->
      <cw-tab label="Notifications">
        <cw-fieldset legend="Channels">
          <div class="toggle-list">
            <cw-toggle-switch label="Email notifications" [(ngModel)]="notifyEmail" />
            <cw-toggle-switch label="Push notifications" [(ngModel)]="notifyPush" />
            <cw-toggle-switch label="SMS notifications" [(ngModel)]="notifySms" />
          </div>
        </cw-fieldset>

        <div class="grid2" style="margin-top: 1rem;">
          <cw-fieldset legend="Subscribe to">
            <div class="check-list">
              <cw-checkbox label="Product updates" [(ngModel)]="subUpdates" />
              <cw-checkbox label="Weekly newsletter" [(ngModel)]="subNews" />
              <cw-checkbox label="Security alerts" [(ngModel)]="subSecurity" />
            </div>
          </cw-fieldset>
          <cw-fieldset legend="Digest frequency">
            <div class="check-list">
              <cw-radio-button name="freq" value="realtime" label="Real-time" [(ngModel)]="frequency" />
              <cw-radio-button name="freq" value="daily" label="Daily digest" [(ngModel)]="frequency" />
              <cw-radio-button name="freq" value="weekly" label="Weekly digest" [(ngModel)]="frequency" />
            </div>
          </cw-fieldset>
        </div>
      </cw-tab>

      <!-- ============ APPEARANCE ============ -->
      <cw-tab label="Appearance">
        <div class="grid2">
          <cw-fieldset legend="Theme">
            <div class="form">
              <div class="field">
                <span class="field__label">Mode</span>
                <cw-select-button [options]="themes" [(ngModel)]="themeMode" />
              </div>
              <div class="inline">
                <div class="field">
                  <span class="field__label">Accent colour</span>
                  <cw-color-picker [(ngModel)]="accent" />
                </div>
                <cw-toggle-switch label="Reduce motion" [(ngModel)]="reduceMotion" />
              </div>
            </div>
          </cw-fieldset>

          <cw-fieldset legend="Density">
            <div class="inline inline--center">
              <div class="field field--center">
                <span class="field__label">UI scale</span>
                <cw-knob [(ngModel)]="uiScale" [min]="80" [max]="120" valueTemplate="{value}%" aria-label="UI scale" />
              </div>
              <div class="field" style="flex: 1;">
                <span class="field__label">Font size: {{ fontSize }}px</span>
                <cw-slider [min]="12" [max]="20" [(ngModel)]="fontSize" ariaLabel="Font size" />
              </div>
            </div>
          </cw-fieldset>
        </div>
      </cw-tab>

      <!-- ============ SECURITY ============ -->
      <cw-tab label="Security">
        <cw-alert severity="info">Two-factor authentication adds an extra layer of protection to your account.</cw-alert>

        <div class="grid2" style="margin-top: 1rem;">
          <cw-fieldset legend="Change password">
            <div class="form">
              <label class="field"><span class="field__label">New password</span>
                <cw-password [(ngModel)]="newPassword" placeholder="Enter a password" />
              </label>
              <cw-divider />
              <div class="field">
                <span class="field__label">Session timeout: {{ sessionTimeout }} min</span>
                <cw-slider [min]="5" [max]="120" [step]="5" [(ngModel)]="sessionTimeout" ariaLabel="Session timeout" />
              </div>
            </div>
          </cw-fieldset>

          <cw-fieldset legend="Two-factor authentication">
            <div class="form">
              <cw-toggle-switch label="Enable 2FA" [(ngModel)]="twoFactor" />
              @if (twoFactor) {
                <div class="field">
                  <span class="field__label">Enter the 6-digit code from your authenticator</span>
                  <cw-input-otp [length]="6" integerOnly [(ngModel)]="otp" />
                </div>
              }
            </div>
          </cw-fieldset>
        </div>
      </cw-tab>
    </cw-tabs>
  `,
  styles: [`
    :host { display: block; }
    .profile-head { border: 1px solid var(--cw-border); border-radius: var(--cw-radius-md, var(--cw-radius)); overflow: hidden; background: var(--cw-surface); margin: 1rem 0 1.5rem; }
    .profile-head__cover { height: 88px; background: linear-gradient(120deg, var(--cw-primary), #8b5cf6); }
    .profile-head__row { display: flex; align-items: center; gap: 1rem; padding: 0 1.5rem 1.25rem; margin-top: -28px; }
    .profile-head__row cw-avatar { --cw-avatar-size: 72px; border: 3px solid var(--cw-surface); border-radius: 50%; }
    .profile-head__meta { flex: 1 1 auto; padding-top: 32px; }
    .profile-head__name { display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem; font-weight: 700; color: var(--cw-text); }
    .profile-head__sub { color: var(--cw-text-muted, var(--cw-text-secondary)); margin-top: 0.15rem; }
    .profile-head__actions { display: flex; gap: 0.5rem; align-self: flex-end; }

    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: start; }
    .form { display: flex; flex-direction: column; gap: 1rem; }
    .form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.35rem; }
    .field--center { align-items: center; }
    .field__label { font-size: 0.85rem; font-weight: 600; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .field input[cwInput], .field cw-select, .field cw-multi-select, .field cw-autocomplete, .field textarea, .field cw-date-picker { width: 100%; }
    .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .toggle-list, .check-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .inline { display: flex; gap: 1.5rem; align-items: flex-start; }
    .inline--center { align-items: center; }
    cw-tabs { display: block; margin-top: 0.5rem; }
    cw-fieldset { display: block; }

    @media (max-width: 900px) {
      .grid2, .form__row { grid-template-columns: 1fr; }
      .inline { flex-direction: column; }
    }

    @media (max-width: 640px) {
      /* Stack the avatar/name above the action buttons; side by side they ran
         off the right edge on a phone. */
      .profile-head__row {
        flex-direction: column; align-items: flex-start; gap: 0.75rem;
        padding: 0 1rem 1rem;
      }
      .profile-head__meta { padding-top: 0; }
      .profile-head__actions { align-self: stretch; flex-wrap: wrap; }
      .profile-head__name { font-size: 1.15rem; }
    }
  `]
})
export class DemoProfileComponent {
  private readonly toast = inject(CwToastService);

  readonly crumbs = [{ label: 'Home', url: '#' }, { label: 'Account', url: '#' }, { label: 'Profile' }];
  readonly countries = COUNTRIES;
  readonly skills = SKILLS;
  readonly plans = ['Free', 'Pro', 'Enterprise'];
  readonly themes = ['Light', 'Frost', 'Dark'];

  // Profile
  name = 'Jane Doe';
  handle = '@janedoe';
  email = 'jane.doe';
  country = 'United States';
  birthday: Date | null = new Date(1992, 4, 17);
  bio = 'Store manager · coffee enthusiast · building delightful commerce experiences.';
  selectedSkills = ['Angular', 'TypeScript', 'Design systems'];
  city = 'United States';
  proficiency = 4;
  about = '<p>I lead the storefront team and care deeply about accessible, fast UIs.</p>';

  // Account
  phone = '';
  website = 'janedoe.dev';
  interests = ['CSS', 'Accessibility'];
  plan = 'Pro';
  budget = 250;

  // Notifications
  notifyEmail = true;
  notifyPush = true;
  notifySms = false;
  subUpdates = true;
  subNews = false;
  subSecurity = true;
  frequency = 'daily';

  // Appearance
  themeMode = 'Light';
  accent = '#6c63ff';
  reduceMotion = false;
  uiScale = 100;
  fontSize = 14;

  // Security
  newPassword = '';
  sessionTimeout = 30;
  twoFactor = false;
  otp = '';

  save(): void {
    this.toast.show({ severity: 'success', summary: 'Profile saved', detail: 'Your changes have been stored.' });
  }

  reset(): void {
    this.toast.show({ severity: 'info', summary: 'Changes discarded', detail: 'No changes were saved.' });
  }
}
