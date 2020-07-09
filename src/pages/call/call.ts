import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Contact } from '../../model/contact';
import { Base64 } from 'base64-string';
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
  enc = new Base64();
  AnswerCallAlert ;
  occupants: any;
  contacts:  Contact[]=[];
  contact: Contact = {name:"",phone:""};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeAudio: NativeAudio,
    public modalController: ModalController,
    private storage: Storage,
    public platform: Platform,
    private alertCtrl: AlertController

  ) {
   
  }

  ionViewDidLoad() {
   // this.TestControls();
    this.platform.ready().then(() => {
      this.Ringtone("LOAD");
      this.RegisterUser();
    });
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
    this.contacts=[]; 
       this.occupants=easyrtc.getRoomOccupantsAsArray("default");

       for(let key of this.occupants) {
       // console.log(key);
         //let contact= new Contact();
        this.contact.name=easyrtc.idToName(key);
        this.contact.phone=key;
        
        this.contacts.push(this.contact);
      }
      console.log(this.contacts);
     const contactModel = await this.modalController.create('ContactsPage',{ contacts: this.contacts});
    contactModel.onDidDismiss(data => {
      console.log(data);
    this.calleeName= data.name
    this.calleeId =data.phone;
    console.log(this.calleeId);
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
    easyrtc.setUsername(RegistrationID);
    easyrtc.setSocketUrl("https://www.telemd.xyz:8443");
    easyrtc.setVideoDims(256, 144);
    easyrtc.enableDebug(false);
    easyrtc.enableDataChannels(true);
    easyrtc.setUseFreshIceEachPeerConnection(true);
   // easyrtc.setRoomOccupantListener(this.LoadOccupants);
    this.InitializeControls();
    easyrtc.enableAudio(true);
    easyrtc.enableVideo(true);
   this. AddEventListeners();
    easyrtc.connect("easyrtc.audioVideo", (easyrtcid) => {
      this.myCallId = easyrtcid;

      try {
        //alert(easyrtc.idToName(easyrtcid));
      }
      catch (err) {
        alert("try, catch (): " + err)
      }
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
    this.myCallId =easyrtc.idToName( easyrtc.cleanId(easyrtcid));
    this.InitializeControls();
  //  this.AddEventListeners();
   
    
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

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

/*   AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;
    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }
    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;
    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);
    this.webRTCClient.attachMediaStream(mediaElt, stream);
  } */

  AddEventListeners() {
    easyrtc.setAcceptChecker((easyrtcid, callback) => {
      console.log("answer call");
      this.InitializeControlsForIncomingCall();
  
        this.AnswerCallAlert = this.alertCtrl.create({
        title: 'Call',
        subTitle: 'Incoming call from' + easyrtc.idToName(easyrtcid) ,
        buttons: [
          {
            text: 'Reject',
            handler: () => {
              if (easyrtc.getConnectionCount() > 0) {
                easyrtc.hangupAll();
                this.Ringtone("STOP");
              this.UpdateControlsOnReject();
              }
              
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
      console.log("saw video from " + easyrtcid);
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
   
    easyrtc.setOnStreamClosed( (easyrtcid) => {
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
        alert("CALL-REJECTEd: Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
        this.InitializeControls();
        //enable("otherClients");
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

  LoadOccupants (roomName, occupants, isPrimary) {
    for(var easyrtcid in occupants) {
      let contact :Contact;
      console.log(easyrtc.idToName(easyrtcid));
      contact.name=easyrtc.idToName(easyrtcid);
      contact.phone=easyrtcid;
      this.contacts.push()
      this.contacts.push(contact);
    }
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
      this.nativeAudio.stop('uniqueI1').then(() => {}, () => {});
    }
  }

  SwitchCamera() {
    easyrtc.getVideoSourceList((list) => {
      var i;
      //alert(JSON.stringify(this.localStream) + ', ' + JSON.stringify(list[i]))
     // console.log(JSON.stringify(this.localStream) + ', ' + JSON.stringify(list[i]));
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
