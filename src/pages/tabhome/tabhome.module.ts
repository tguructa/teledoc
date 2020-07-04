import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabhomePage } from './tabhome';

@NgModule({
  declarations: [
    TabhomePage,
  ],
  imports: [
    IonicPageModule.forChild(TabhomePage),
  ],
  exports: [
    TabhomePage
  ]
})
export class TabhomePageModule {}
