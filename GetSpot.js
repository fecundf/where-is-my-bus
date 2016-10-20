// import the scriptr.io http module to issue calls to remote APIs
var callResult, r, tok;
var http = require("http");

// Get token. Do we need to authorize?
var now = Date.now() / 1000 | 0;
if (now < storage.local.exp) {
  tok = storage.local.tok;
}
else {
  callResult = http.request({
    "url": "https://api.pitneybowes.com/oauth/token",
    "authCreds":["nYj...","YXg..."],
    "params": {"grant_type":"client_credentials"},
    "method": "POST"
  });
  
  if (callResult.status != "200")
    return "Remote API returned an error " + callResult.status + "\n<p>\n" + callResult;
  
  r=JSON.parse(callResult.body);
  
  // Store the expiration time, with a few seconds of leeway
  storage.local.exp = r.expiresIn + now - 10;
  storage.local.tok = tok = r.access_token; 
}

// retrieve the location parameter from the request
var x = request.parameters.x;
var y = request.parameters.y;

// Using "GET" lets you retrieve a single address for a location
// Could use "POST" to retrive up to 1000 addresses in a call
// Don't need to add coord system, EPSG is the default already. Same with distance=150 & distanceUnits=METERS
var geoService = "https://api.pitneybowes.com/location-intelligence/geocode-service/v1/transient/premium/reverseGeocode?x="+x+"&y="+y;
callResult = http.request({
  "url":geoService,
  "headers":{"Authorization": "Bearer "+tok}
});

// parse the result of the call using regular JSON object
var r = JSON.parse(callResult.body);
// Now you can use "r" object to get the results from Pitney however needed 

// return the raw response for debugging
return callResult;
