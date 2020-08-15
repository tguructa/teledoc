import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Contact } from '../../model/contact';
import { ToastController } from 'ionic-angular';
import * as Constants from '../../constants/constant';
/**
 * Generated class for the CallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var easyrtc: any;

@IonicPage()
@Component({
  selector: 'page-call',
  templateUrl: 'call.html',
})
export class CallPage {
  showCall: boolean = true;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;
  localStream;
  currentCamera: boolean = true; // front or rear

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;
  calleeName;
  RegistrationID = "";
  isRegistered: boolean = false;
  AnswerCallAlert;
  occupants: any;
  contacts: Contact[] = [];
  contact: Contact = { name: "", phone: "" };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeAudio: NativeAudio,
    public modalController: ModalController,
    private storage: Storage,
    public platform: Platform,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
   
  ) {

  }

  ionViewDidLoad() {
    // this.TestControls();
    this.platform.ready().then(() => {
      this.Ringtone("LOAD");
      this.RegisterUser();
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  CallAlert(alertMessage) {
    let alert = this.alertCtrl.create({
      title: 'Call',
      subTitle: alertMessage,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  async openModal() {
 
    const contactModel = await this.modalController.create('ContactsPage', { contacts: this.contacts });
    contactModel.onDidDismiss(data => {
      if (data) {
        this.calleeName = data.name
        this.calleeId = data.phone;
      }
    });
    return await contactModel.present();
  }

  GetRegistrationID() {
    return this.storage.get('RegistrationID');
  }

  RegisterUser() {
    this.GetRegistrationID().then((val) => {
      this.RegistrationID = val;
      console.log('RegistrationID', this.RegistrationID);
      this.InitializeApiRTC(this.RegistrationID);
      this.isRegistered = true;
    }, (err) => {
      console.log(err)
    })
  }

  InitializeApiRTC(RegistrationID) {
	easyrtc.enableAudio(true);
    easyrtc.enableVideo(true);
	
	  	   if (navigator.userAgent.match(/android/i)) {
  	var remote_filter= easyrtc.buildRemoteSdpFilter({audioSendCodec: 'ISAC/16000'});
  	console.log(remote_filter);
  	var local_filter= easyrtc.buildLocalSdpFilter({audioRecvCodec: 'opus/48000/2'});
  	console.log(local_filter);
  	easyrtc.setSdpFilters(local_filter,remote_filter);
  }

    easyrtc.setUsername(RegistrationID);
    easyrtc.setSocketUrl(Constants.API_ENDPOINT);
   //easyrtc.setVideoDims(256, 144);
    easyrtc.setVideoDims(1280,720);
    easyrtc.enableDebug(false);
    easyrtc.enableDataChannels(true);
    easyrtc.setUseFreshIceEachPeerConnection(true);
    this.InitializeControls();
    this.AddEventListeners();
    easyrtc.connect("telemd.teledoc", (easyrtcid) => {
      this.myCallId = easyrtc.idToName(easyrtc.cleanId(easyrtcid));;

      easyrtc.initMediaSource(
        (mediastream) => {
          this.localStream = mediastream;
        },
        (errorCode, errorText) => {
          easyrtc.showError(errorCode, errorText);
        });
    }, this.loginFailure);
  }

  loginSuccess(easyrtcid) {
    this.myCallId = easyrtc.idToName(easyrtc.cleanId(easyrtcid));
    this.InitializeControls();
  }

  loginFailure(errorCode, message) {
    //easyrtc.showError(errorCode, message);
    //alert("loginFailure: " + message)
  }

  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }

  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;
    this.Ringtone("INCOMING");
  }

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  InitializeControlsForPerformCall() {
    this.showCall = false;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
  }

  UpdateControlsOnAnswer() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
    this.showCall = false;
  }

  UpdateControlsOnReject() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
    this.showCall = true;
  }

  AddEventListeners() {

    easyrtc.setRoomOccupantListener( (roomName, occupants, isPrimary) =>{
      this.contacts = [];
      for (var key in occupants) {
        this.contact.name = easyrtc.idToName(key);
        this.contact.phone = key;
        this.contacts.push(this.contact);
      }
  }); 

    easyrtc.setAcceptChecker((easyrtcid, callback) => {
      console.log("answer call");
      this.InitializeControlsForIncomingCall();

      this.AnswerCallAlert = this.alertCtrl.create({
        title: 'Call',
        subTitle: 'Incoming call from ' + easyrtc.idToName(easyrtcid),
        buttons: [
          {
            text: 'Reject',
            handler: () => {
              if (easyrtc.getConnectionCount() > 0) {
                easyrtc.hangupAll();
               }
              this.UpdateControlsOnReject();
              this.Ringtone("STOP");
              callback(false);
            }
          },
          {
            text: 'Accept',
            handler: () => {
              this.Ringtone("STOP");
              this.UpdateControlsOnAnswer();
              callback(true);
            }
          }
        ]
      });
      this.AnswerCallAlert.present();
    }); //END

    easyrtc.setStreamAcceptor((easyrtcid, stream) => {
      var video = document.getElementById("callerVideo");
      easyrtc.setVideoObjectSrc(video, stream);
       

      var selfVideo = document.getElementById("selfVideo");
      easyrtc.setVideoObjectSrc(selfVideo, this.localStream);
      this.Ringtone("STOP");
      this.UpdateControlsOnAnswer();
    });

    easyrtc.setCallCancelled((easyrtcid, explicitlyCancelled) => {
      if (explicitlyCancelled) {
        this.Ringtone("STOP");
        this.InitializeControls();
        this.AnswerCallAlert.dismiss();
      }
    });

    easyrtc.setOnStreamClosed((easyrtcid) => {
      easyrtc.setVideoObjectSrc(document.getElementById("callerVideo"), "");
      easyrtc.setVideoObjectSrc(document.getElementById("selfVideo"), "");
      this.InitializeControlsForHangup();
    });
  }

  MakeCall(otherEasyrtcid) {
    easyrtc.hangupAll();
    var successCB = () => {
      if (this.localStream) {
        var selfVideo = document.getElementById("selfVideo");
        easyrtc.setVideoObjectSrc(selfVideo, this.localStream);
      }
    };
    var failureCB = function () { };
    var acceptedCB = (accepted, easyrtcid) => {
      if (!accepted) {
        this.presentToast("Your call to " + easyrtc.idToName(easyrtcid) + " was rejected") ;
        this.InitializeControls();
      }
    };
    this.InitializeControlsForPerformCall();
    this.incomingCallId = easyrtc.idToName(otherEasyrtcid);
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
  }

  HangUp() {
    easyrtc.hangupAll();
    this.InitializeControlsForHangup();
    this.Ringtone("STOP");
  }

   Ringtone(state) {
    if (state == "LOAD") {
      this.nativeAudio.preloadComplex('uniqueI1', 'assets/audio/tone.mp3', 1, 1, 0).then((succ) => {
        console.log("suu", succ)
      }, (err) => {
        console.log("err", err)
      });
    } else if (state == "INCOMING") {
      this.nativeAudio.loop('uniqueI1').then((succ) => {
        console.log("succ", succ)
      }, (err) => {
        console.log("err", err)
      });
    } else if (state == "STOP") {
      this.nativeAudio.stop('uniqueI1').then(() => { }, () => { });
    }
  }

  SwitchCamera() {
    easyrtc.getVideoSourceList((list) => {
      var i;
      if (this.currentCamera) {
        easyrtc.setVideoSource(list[0].deviceid);
        this.currentCamera = false;
      }
      else {
        easyrtc.setVideoSource(list[1].deviceid);
        this.currentCamera = true;
      }
    });
  }

}
