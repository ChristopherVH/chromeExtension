
var docUrl = "";

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
    });
       break;
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

// chrome.tabs.query({active: true, currentWindow: true}, function(tabArray){
//   chrome.tabs.executeScript(tabArray[0].id, {
//     code : "window.getSelection().toString()"
//   }, function(results){
//     console.log("inputing header " + results[0]);
//   });
// });
// var serialize = function(obj) {
//   var str = [];
//   for(var p in obj)
//     if (obj.hasOwnProperty(p)) {
//       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//     }
//   return str.join("&");
// };
//
// var sendRequest = function(params){
//   var http = new XMLHttpRequest();
//   var url = "https://script.google.com/macros/s/AKfycbzeeUL07OcUG7kBJiKwKPuabnAPYL_tSmlDEtRUy6eyw_nhz2A/exec";
//   var params = serialize(params);
//   http.open("POST", url, true);
//
//   //Send the proper header information along with the request
//   http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//
//   http.onreadystatechange = function() {
//       if(http.readyState == 4 && http.status == 200) {
//           console.log("request made");
//       }
//   }
//   http.send(params);
// };

function putInDoc(dataobj){
  $(document).ready(function () {
   $.ajax({
     url: "https://script.google.com/macros/s/AKfycbwADtcsloxMU9h-_1Y_FXjW6JifgkWTeW-qh6fO0hd9ye8T5OTq/exec",
     data: dataobj,
     type: "GET"
   });
  });
}


chrome.commands.onCommand.addListener(function (command){
  var obj = "";
  switch (command){
   case "setHeader":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 1};
        putInDoc(obj);
     });
      break;
   case "setTitle":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 2};
        putInDoc(obj);
     });
      break;
   case "setSubsection":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 3};
        putInDoc(obj);
     });
      break;
   case "setDetail":
     captureCallback(function(capturedString){
        obj= {"docUrl": docUrl, "capturedText": capturedString, "nestNumber": 4};
        putInDoc(obj);
     });
       break;
  }
});
