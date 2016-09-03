
var docUrl = "";
var running = false;
var ajaxQueue = [];
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js?onload=callbackFunction";
head.appendChild(script);
var accessToken;
var authInstance;


var CLIENT_ID = '6344508761-1uii1p3je2jnt4innp07fbk8rvq66976.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/documents'];

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
    title: 'SimpleNotes Header',
    id: "Header",
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'SimpleNotes Title',
    id: "Title",
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'SimpleNotes Subsection',
    id: "Subsection",
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'SimpleNotes Detail',
    id: "Detail",
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    title: 'SimpleNotes Url',
    id: "Url",
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // simple case working
  switch (info.menuItemId){
   case "Header":
    console.log("inputing header " + info.selectionText);
      break;
   case "Title":
    console.log("inputing title " + info.selectionText);
      break;
   case "Subsection":
    console.log("inputing subsection " + info.selectionText);
      break;
   case "Detail":
    console.log("inputing detail " + info.selectionText);
      break;
   case "Url":
   chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     docUrl = tabs[0].url;
    //  authInstance = gapi.auth2.getAuthInstance();
    //  var options = new gapi.auth2.SigninOptionsBuilder();
    //  options.setScope('drive');
    //  authInstance.signIn(options);
    //  authInstance.isSignedIn.listen(function(isCurrentlySingedIn){
    //    if (isCurrentlySingedIn === false){
    //      authInstance.signOut();
    //    }
    //  });
    checkAuth();
      //
    //   chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    //     console.log(token);
    //     accessToken = token;
    //   });
    });
       break;
  }
});



function captureCallback(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabArray){
    chrome.tabs.executeScript(tabArray[0].id, {
      code : "window.getSelection().toString()"
    }, function(results){
      console.log(results);
      callback(results[0]);
    });
  });
}

 // have function for first ajax call and then have it trigger another function that will make the next call in the queue on .ajaxComplete() then the next until queue is empty



function putInDoc(dataobj){
  // if (running === false){
  //   running = true;
  //   $.ajax({
  //      url: "https://script.google.com/macros/s/AKfycbwADtcsloxMU9h-_1Y_FXjW6JifgkWTeW-qh6fO0hd9ye8T5OTq/exec",
  //      data: dataobj,
  //      type: "GET",
  //      success: function(){
  //        running = false;
  //        if (ajaxQueue.length > 0){
  //          putInDoc(ajaxQueue.shift());
  //        }
  //      },
  //      beforeSend : function( xhr ) {
  //       xhr.setRequestHeader( 'Authorization', 'Bearer ' + accessToken );
  //      }
  //    });
  // }else{
  //   ajaxQueue.push(dataobj);
  // }

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
