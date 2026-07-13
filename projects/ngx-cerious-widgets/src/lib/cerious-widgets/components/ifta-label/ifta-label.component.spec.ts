import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IftaLabelComponent } from './ifta-label.component';

@Component({
  standalone: true,
  imports: [IftaLabelComponent],
  template: `
    <cw-ifta-label label="Email">
      <input class="field" />
    </cw-ifta-label>
  `
})
class HostComponent {}

describe('IftaLabelComponent', () => {
  it('renders a fixed top-aligned label and projects the control', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('cw-ifta-label') as HTMLElement;

    expect(wrapper.querySelector('.cw-ifta-label__label')!.textContent!.trim()).toBe('Email');
    expect(wrapper.querySelector('.field')).toBeTruthy();
  });

  it('reflects the label input', async () => {
    await TestBed.configureTestingModule({ imports: [IftaLabelComponent] }).compileComponents();
    const fixture: ComponentFixture<IftaLabelComponent> = TestBed.createComponent(IftaLabelComponent);
    fixture.componentRef.setInput('label', 'Full name');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-ifta-label__label').textContent.trim()).toBe('Full name');
  });

  it('associates the label with the projected control via for/id', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('cw-ifta-label') as HTMLElement;
    const label = wrapper.querySelector('.cw-ifta-label__label') as HTMLLabelElement;
    const input = wrapper.querySelector('.field') as HTMLInputElement;

    expect(input.id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
