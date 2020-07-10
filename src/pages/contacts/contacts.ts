import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform } from 'ionic-angular';
import { Contact } from '../../model/contact';

/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  character;
  contactList=[];
  selectedRadioItem;

  contacts: Contact[];
  contact: Contact;
  show = true;  

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
   
     }

  ionViewDidLoad() {
  //  this.getContacts();
  this.contacts=this.params.get('contacts');
    console.log(this.contacts);
  }
  radioSelect(value) {
    console.log("radioSelect",value);
    this.contact=value;
      this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss( this.contact);
  }

}
