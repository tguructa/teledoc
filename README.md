# teledoc v1

### App details
- Ionic v3
- cordova 8

### Setup
- type `git clone https://github.com/tguructa/teledoc.git` in the console
- change directory to teledoc
- run `npm install`
- add android platform
   `ionic cordova platform add android`
- run all the cordova plugin 
`ionic  cordova plugin add cordova-plugin-console`
`ionic cordova plugin add cordova-custom-config`
`ionic cordova plugin add cordova-plugin-device`
`ionic cordova plugin add cordova-plugin-media`
`ionic cordova plugin add android-camera-permission`
`ionic cordova plugin add cordova-plugin-android-permissions@0.10.0`
`ionic cordova plugin add cordova-plugin-ionic-webview@latest`

`npm install --save @ionic/storage`
`ionic cordova plugin add cordova-sqlite-storage`
   
`ionic cordova plugin add cordova-plugin-nativeaudio`
`npm install --save @ionic-native/native-audio@4`
### Please add the following preferances to `config.xml`
`<preference name="android-minSdkVersion" value="22" />`
`<preference name="android:targetSdkVersion" value="28" />`
`<preference name="Scheme" value="https" />` 
   
### Server Config
Change the api end point in **src/constants/constant.ts** to your server address: ```https://***.***.***.***:8443"```
``
### To build debug apk
run `ionic cordova run android`

### To run or build your app for production
run `ionic cordova run android --prod --release`
### Sign Android APK
run `keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias`
### To sign the unsigned APK
run `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks app-release-unsigned.apk my-alias`
### To optimize the APK
run `zipalign -v 4 app-release-unsigned.apk teledoc1.0.apk`
### To verify that the apk
run `apksigner verify teledoc1.0.apk`



