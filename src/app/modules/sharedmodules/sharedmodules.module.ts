import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaResizeDirective } from '../../utils/directives/text-area-resize.directive';
import { RouterLink } from '@angular/router';




@NgModule({
  declarations: [TextAreaResizeDirective],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [TextAreaResizeDirective]
})
export class SharedmodulesModule { }
