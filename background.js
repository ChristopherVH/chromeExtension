var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js?onload=callbackFunction";
head.appendChild(script);
var accessToken;
var docUrl;
var manifest = chrome.runtime.getManifest();

var CLIENT_ID = manifest.oauth2.client_id;
var SCOPES = manifest.oauth2.scopes;

function checkAuth() {
 gapi.auth.authorize(
   {
     'client_id': CLIENT_ID,
     'scope': SCOPES,
     'immediate': true
   }, makeSureAuthorized);
}
function makeSureAuthorized(authResult) {
  if (authResult.error) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false});
      return false;
    }
  accessToken = gapi.auth.getToken().access_token;
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'SimpleNotes Url',
    id: "Url",
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // simple case working
  if (info.menuItemId === "Url"){
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     docUrl = tabs[0].url;
     checkAuth();
    });
  }
});



function captureCallback(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabArray){
    chrome.tabs.executeScript(tabArray[0].id, {
      code : "window.getSelection().toString()"
    }, function(results){
      callback(results[0]);
    });
  });
}


function putInDoc(dataobj){

  var scriptId = "1pXWyWWSV05dJyloHFHRORnn9yrZxXqYu6AI8Md9UjCC_PSRUAGK1Kh67";

 // Create execution request.
   var request = {
      'function': 'doGet',
       'parameters': [dataobj],
        "devMode": true
   };

 // Make the request.
   var op = gapi.client.request({
        'root': 'https://script.googleapis.com',
        'path': 'v1/scripts/' + scriptId + ':run',
        'method': 'POST',
        'body': request
   });
 //
  op.execute();
}

chrome.identity.onSignInChanged.addListener(
  function(){
    chrome.identity.removeCachedAuthToken(accessToken);
  }
);

chrome.commands.onCommand.addListener(function (command){
  var obj = {};
  switch (command){
   case "setHeader":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 0};
        putInDoc(obj);
     });
      break;
   case "setTitle":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 1};
        putInDoc(obj);
     });
      break;
   case "setSubsection":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 2};
        putInDoc(obj);
     });
      break;
   case "setDetail":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 3};
        putInDoc(obj);
     });
       break;
  }
});
