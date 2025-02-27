import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextAreaResize]'
})
export class TextAreaResizeDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { 
    this.adjustHeight();
  }

  @HostListener('input') 
  onInput(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textArea = this.element.nativeElement;
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
    textArea.style.border = '2px solid black'
  }


}
