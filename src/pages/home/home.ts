import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    constructor(
      public navCtrl: NavController,
      private storage: Storage,
      private alertCtrl: AlertController) {

    }

    settingsAlert(alertMessage) {
      let alert = this.alertCtrl.create({
        title: 'Registration',
        subTitle: alertMessage,
        buttons: ['Dismiss']
      });
      alert.present();
    }

    GetRegistrationID(){
      return this.storage.get('RegistrationID');
  
    }

    SaveRegistrationID(RegistrationID) {
      if(RegistrationID==null){
         this.settingsAlert("Phone No is required!");
      } else{
      this.storage.set('RegistrationID', RegistrationID);
    //  this.settingsAlert("Registration ID saved!");
      this.navCtrl.push('page-tabhome');
      }
  
    }

    ionViewDidLoad() {
      this.GetRegistrationID().then((val) => {
        if(val!=null){
          this.navCtrl.push('page-tabhome');
        }

      },(err) => { 
        console.log(err) 
      })
    }

}