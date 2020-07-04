import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeAudio } from '@ionic-native/native-audio';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomeModule } from '../pages/home/home.module';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ContactsProvider } from '../providers/contacts/contacts';
import { HttpClientModule, HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{ preloadModules: true }),
    HomeModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__f2fdb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AndroidPermissions,
    NativeAudio,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContactsProvider,
    HttpClientModule
  ]
})
export class AppModule {}
