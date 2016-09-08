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


chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'SimpleNotes Url',
    id: "Url",
    contexts: ['all']
  });
  chrome.identity.onSignInChanged.addListener(
    function(){
      chrome.identity.removeCachedAuthToken({token: accessToken});
    }
  );
  gapi.client.setApiKey("AIzaSyARDEQ0_kd9QbWkGrJqRe4JRLrRb1Eh97s");
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "Url"){
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     docUrl = tabs[0].url + "?usp=sharing";
     console.log(docUrl);
     if (accessToken !== undefined){
       chrome.identity.removeCachedAuthToken({ 'token': accessToken }, function(){
          gapi.auth.setToken({});
       });
     }
     chrome.identity.getAuthToken({interactive: true}, function(token){
       accessToken = token;
       gapi.auth.setToken({'access_token': accessToken});
     });
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
   var request = {
      'function': 'doGet',
       'parameters': [dataobj]
   };

 // Make the request.
   var op = gapi.client.request({
        'root': 'https://script.googleapis.com',
        'path': 'v1/scripts/' + scriptId + ':run',
        'method': 'POST',
        'body': request
   });

   op.execute(function(resp) {
   if (resp.error && resp.error.status) {
     // The API encountered a problem before the script started executing.
     console.log('Error calling API: ' + JSON.stringify(resp, null, 2));
   } else if (resp.error) {
     // The API executed, but the script returned an error.
     var error = resp.error.details[0];
     console.log('Script error! Message: ' + error.errorMessage);
   } else {
     // Here, the function returns an array of strings.
     console.log(resp);
     console.log("success!");
   }
   });
}

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
