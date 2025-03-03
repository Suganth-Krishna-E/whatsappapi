import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaResizeDirective } from '../../utils/directives/text-area-resize.directive';



@NgModule({
  declarations: [TextAreaResizeDirective],
  imports: [
    CommonModule
  ],
  exports: [TextAreaResizeDirective]
})
export class SharedmodulesModule { }
