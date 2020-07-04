import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TabhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:"page-tabhome"
})
@Component({
  selector: 'page-tabhome',
  templateUrl: 'tabhome.html',
})
export class TabhomePage {

  tab1Root: any = 'CallPage';
  tab2Root: any = 'SettingsPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabhomePage');
  }

}
