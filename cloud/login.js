var run = require('./run.js');


/*
Function to genrate OTP 
  Input => 
    number: String // 10 digit phone no
  Output => 
    <Success>
      <Valid Number>
        flag: true
      <Invalid Number>
        flag: false
    <Error>
      error: String
  Procedure =>
    Process generates random code, save entry in new table and send code via sms
*/
exports.SendCode = function(request, response){
  var number = request.params.number;
  var code = Math.floor(Math.random() * 9000 + 1000);
  var Temp = Parse.Object.extend("Temp");
  var temp = new Temp();
  temp.save({
    phoneNumber: number,
    code: code
  }).then(function(temp){
    var msg = "Your One Time Password (OTP) to access NetWater App is: "+code+"."+"\n"+"Don't share it with anyone.";
    return run.codeSMS({
      "msg": msg,
      "number": number
    });
  }).then(function(text){
    console.log(text);
    if(text.substr(0,3) == 'err')
      return Parse.Promise.as(false);
    else
      return Parse.Promise.as(true);
  }).then(function(text){
    response.success(text);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });  
}


/*
Input->Username{String},code{number}
Output->SessionToken{String}
Aim->To Login User(normal/user)
Procedure->use parse login and get session token by querying
Timeout of OTP is 1 day
*/
exports.Login = function(request, response){
 var number = request.params.number;
    var code = request.params.code;
    var d = new Date();
    var token ;

    var e = new Date(d.getTime() - 864000000);
    var query = new Parse.Query("Temp"); 
    query.equalTo("code", code);
    query.equalTo("phoneNumber", number);
    query.greaterThan("createdAt", e);
    query.descending("createdAt");
    query.first({
success:function(temp) {
      if(typeof temp != 'undefined'){

var username = number;
  var password = "password";
Parse.User.logIn(username,password ,{
  success: function(user) {
    var sessionToken = user.getSessionToken();
    console.log(sessionToken);
    Parse.Cloud.httpRequest({
  method: 'POST',
  url: "https://api.parse.com/1/upgradeToRevocableSession",
  headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-Parse-Application-Id': 'TQ6885hAEX6JG1p2rYPTQjaHw5ixCCqMlvSr1tZb',
      'X-Parse-REST-API-Key': 'WkIPbQPi99yfEBdCFn6MJtUlv8kZHmxCnBezrwNC', 
      'X-Parse-Session-Token': sessionToken
    }
}).then(function(httpResponse) {
  //response.success(httpResponse.data.sessionToken);
token = httpResponse.data.sessionToken;
 var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  return query.find();
  }).then(function(Results1) {

    var resultreturn={"Token":token,"objects":Results1}
  response.success(resultreturn);



}, function(httpResponse) {
  console.log(httpResponse.data);
  response.error('Request failed with response code ' + httpResponse.status);
});
  },
  error: function(user, error) {
    response.error("Error: " + error.code + " " + error.message);
  }
});
}

else{
      response.error("too late ReTry");
}
},
  error: function(error) {
    response.error("Error: " + error.code + " " + error.message);
  }
});
}
/*
Input->Username{String},role{String},HouseNo{String},BuildingNo{String},CommunityName{String},SensorArray{Array}
Username string as 10 digit Phone no
SensorArray is Array where each element is a json object which has key value pair  sensorId{String}(unique serial No) and sensorName{String} (as kids bathroom etc)
Output->SessionToken{String}
Aim->To Creat User(normal/user) Account
Procedure->use parse Signup and then save entry in UserHouseBuildingCommunityMap and then save all sensor in SensorHouseMap User and then get session token by querying
*/


exports.SignUp = function(request, response){
  var username = request.params.username;
  var role = request.params.role;
  var HouseNo = request.params.HouseNo;
  var BuildingNo = request.params.BuildingNo;
  var CommunityName = request.params.CommunityName;
  var name = request.params.accountname;


var user = new Parse.User();
user.set("username", username);
user.set("password", "password");
user.set("role",role);
user.set("name",name);

user.signUp(null, {
  success: function(user) {
    var sessionToken = user.getSessionToken();
    console.log(sessionToken);
    Parse.Cloud.httpRequest({
  method: 'POST',
  url: "https://api.parse.com/1/upgradeToRevocableSession",
  headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-Parse-Application-Id': 'FvXnMN5gREnCdaSqloHmq1Xvg0DTECBwiL8uaP2C',
      'X-Parse-REST-API-Key': 'OWLxP1Hmpc8i9OyiS3qBRN3yFmQIIZM9U6HKVbaJ',
      'X-Parse-Session-Token': sessionToken
    }
}).then(function(httpResponse) {

var UserHouseBuildingCommunityMap = Parse.Object.extend("UserHouseBuildingCommunityMap");
      var userhousebuildingcommunitymap = new UserHouseBuildingCommunityMap();
      userhousebuildingcommunitymap.set("HouseNo", HouseNo);
      userhousebuildingcommunitymap.set("BuildingNo", BuildingNo);
      userhousebuildingcommunitymap.set("CommunityName", CommunityName);
      userhousebuildingcommunitymap.set("UserId", user.id);
      return userhousebuildingcommunitymap.save();
}).then(function(result) {

  var SensorArray = request.params.SensorArray;
  /*
  var SensorArray = [];
  var a={};
  var b ={};
  a.sensorId = "testsensor1";
  a.sensorName ="bathroom";
  b.sensorId = "testsensor2";
  b.sensorName = " kitchen";
  SensorArray.push(a);
  SensorArray.push(b);
*/
  var SensorHouseMap = Parse.Object.extend("SensorHouseMap");
  var sensors = [];
    for (var i = SensorArray.length - 1; i >= 0; i--) {  
  var sensorhousemap = new SensorHouseMap();
  var SensorId = SensorArray[i].sensorId;
  var SensorName= SensorArray[i].sensorName;
  var HouseNo= result.id; 
  sensorhousemap.set("SensorId",SensorId);
  sensorhousemap.set("SensorName",SensorName);
  sensorhousemap.set("HouseNo",HouseNo);
  sensors.push(sensorhousemap);
 }
  return Parse.Object.saveAll(sensors);
}).then(function(Results){
//    response.success(Results);
  response.success(true);


}, function(error) {
    //response.error("Error: " + error.code + " " + error.message);
    response.error("Got an Error: " + JSON.stringify(error));
});



//end successs
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    //response.error("Error: " + error.code + " " + error.message);
    response.error("Got an Error: " + JSON.stringify(error));
  }
});
  
}

