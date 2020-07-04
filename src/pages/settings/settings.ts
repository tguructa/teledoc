import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  RegistrationID;
  apiRTCKey;
  ContactList = [];
  ContactName;
  ContactPhone;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController) {
    this.GetRegistrationID().then((val) => {
      if (val != null) {
        this.RegistrationID=val;
      } 
    });
  }

  clearContactFields() {
    this.ContactName = "";
    this.ContactPhone = "";
  }

  settingsAlert(alertMessage) {
    let alert = this.alertCtrl.create({
      title: 'Settings',
      subTitle: alertMessage,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  GetContacts() {
    return this.storage.get('Contacts');
  }

  GetRegistrationID() {
    return this.storage.get('RegistrationID');
  }

  SaveContacts(contactName, contactPhone) {
    if (contactName == null || contactPhone == null) {
      this.settingsAlert("Error - Name and Phone No are required!");
    } else {
      this.GetContacts().then((val) => {
        if (val == null) {
          this.ContactList.push({
            "contactName": contactName,
            "contactPhone": contactPhone
          });
          this.storage.set('Contacts', this.ContactList);
        } else {
          this.ContactList = val;
          this.ContactList.push({
            "contactName": contactName,
            "contactPhone": contactPhone
          });
          this.storage.set('Contacts', this.ContactList);
        };
        this.settingsAlert("Contacts saved!");
      });
    }
  }

  SaveRegistrationID(RegistrationID) {
    if (RegistrationID == null) {
      this.settingsAlert("Error - Phone No is required!");
    } else {
      this.storage.set('RegistrationID', RegistrationID);
      this.settingsAlert("Registration ID saved!. Please restart the app to use the new ID");
    //  this.clearContactFields();
    }
  }

  SaveapiRTCKey(apiRTCKey) {
    if (apiRTCKey == null) {
      this.settingsAlert("Error - apiRTCKey is required!");
    } else {
      this.storage.set('apiRTCKey', apiRTCKey);
      this.settingsAlert("apiRTCKey saved!. Please restart the app to use the new apiRTC Key");
      this.clearContactFields();
    }
  }

}
