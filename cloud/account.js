exports.AddUser = function(request, response){
  var Name = request.params.name;
  var UserName = request.params.username;
  

var User = Parse.Object.extend("User");
      var user = new User();
      user.set("name", Name);
      user.set("username", UserName);
      user.set("password", "password");
      user.set("Status",true)
      
user.save({}, {
  success: function(result) {
response.success(result);
  },
  error: function(result, error) {
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}


exports.UpdateUser = function(request, response){
  var Name = request.params.name;
  var UserName = request.params.username;



var query = new Parse.Query("User");
    query.equalTo("objectId", request.params.objectId);
    query.first({
      success: function(object) {
        if (object) {

              object.set("name", request.params.name);
              object.set("username", request.params.username);
              
              Parse.Cloud.useMasterKey();
              object.save(
                {}, {
  success: function(result) {
response.success(result);
  },
  error: function(result, error) {
    response.error("Error: " + error.code + " " + error.message);
  }
}
              ); 
          } 
          
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this Id object.");
      }
    });
}


exports.ShowAllUsers = function(request, response){
  
  var query = new Parse.Query("User");
  query.equalTo("Status", true);
  query.find().then(function(Results){
      response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


/*
exports.ShowAllNodes = function(request, response){
  
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("Status", true);
  query.find().then(function(Results){

var houses=[];
var housesensormap={};
usersensormap={};
//[]; put for all houses
 for (var i = Results.length - 1; i >= 0; i--) {  
  if(housesensormap[Results.get('HouseNo')] == undefined){housesensormap[Results.get('HouseNo')]=[];}
  var arr =housesensormap[Results.get('HouseNo')];
  houses.push(Results.get('HouseNo'));
  housesensormap[Results.get('HouseNo')]=arr.push(Results.get('SensorId'));
 }

 var query = new Parse.Query("SensorHouseMap");
  query.equalTo("Status", true);
  query.find().then(function(Results2){
    //
for (var i = Results.length - 1; i >= 0; i--) {  
  //[]];put
usersensormap[Results2.get('UserId')]=
}
      response.success(Results);



       }, function(error){
    response.error(error.code + ": " + error.message);
  });
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}
*/
/*
Input->number{String},username{String}
Output->flag{bool}
Aim->to link secondpry accoutn to same house
Procedure take primary accoutn detail and add them to new account
*/
exports.LinkAnotherAccount = function(request, response){

var number = request.params.number;
var name = request.params.username;

  var oldaccount = request.user.id;
  var username = number;
 // var password = request.params.password;
 // var email = request.params.username;
 //as only admin role is limited to this feature
  var role = "normal";
  var HouseNo = request.params.HouseNo;
  var BuildingNo = request.params.BuildingNo;
  var CommunityName = request.params.CommunityName;

var idneeded,idneeded2;
var user = new Parse.User();
user.set("username", username);
user.set("password", "password");
//user.set("email", email);
user.set("name",name);

user.set("role",role);
user.signUp(null, {
  success: function(user) {

//find from id of user
//add simliar entry
    var query = new Parse.Query("UserHouseBuildingCommunityMap");

  query.equalTo("UserId", oldaccount);
  query.first().then(function(Result){
    idneeded = Result.id;
   var UserHouseBuildingCommunityMap = Parse.Object.extend("UserHouseBuildingCommunityMap");
      var userhousebuildingcommunitymap = new UserHouseBuildingCommunityMap();
      userhousebuildingcommunitymap.set("HouseNo", Result.get("HouseNo"));
      userhousebuildingcommunitymap.set("BuildingNo", Result.get("BuildingNo"));
      userhousebuildingcommunitymap.set("CommunityName", Result.get("CommunityName"));
      userhousebuildingcommunitymap.set("UserId", user.id);
      return userhousebuildingcommunitymap.save();
}).then(function(result) {
//  response.success(true);
idneeded2 = result.id
 var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", idneeded);
  return query.find()
}).then(function(Results) {

 var SensorHouseMap = Parse.Object.extend("SensorHouseMap");
  var sensors = [];
    for (var i = Results.length - 1; i >= 0; i--) {  
  var sensorhousemap = new SensorHouseMap();
  var SensorId = Results[i].get("SensorId");
  var SensorName= Results[i].get("SensorName");
  var HouseNo= idneeded2; 
  sensorhousemap.set("SensorId",SensorId);
  sensorhousemap.set("SensorName",SensorName);
  sensorhousemap.set("HouseNo",HouseNo);
  sensors.push(sensorhousemap);
 }
  return Parse.Object.saveAll(sensors);
}).then(function(Results2){
//    response.success(Results);
  response.success(true);



  }, function(error){
    response.error(error.code + ": " + error.message);
  });

//end successs
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}

//transfer accoutn

exports.TransferAccount = function(request, response){

var oldnumber = request.params.oldnumber;
var newnumber = request.params.newnumber;

  var oldaccount = request.user.id;
  var username = number;
 // var password = request.params.password;
 // var email = request.params.username;
 //as only admin role is limited to this feature
  var role = "Admin";
  var HouseNo = request.params.HouseNo;
  var BuildingNo = request.params.BuildingNo;
  var CommunityName = request.params.CommunityName;


var user = new Parse.User();
user.set("username", username);
user.set("password", "test");
//user.set("email", email);
user.set("role",role);
user.signUp(null, {
  success: function(user) {

//find from id of user
//add simliar entry
  

//end successs
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}


/*
Input->number{String},username{String},UserId{String}
Output->flag{bool}
Aim->to link secondpry accoutn to same house
Procedure take primary accoutn detail and add them to new account
*/
exports.LinkAnotherAccount2 = function(request, response){

var number = request.params.number;
var name = request.params.username;

  var oldaccount = request.params.UserId;
  var username = number;
 // var password = request.params.password;
 // var email = request.params.username;
 //as only admin role is limited to this feature
  var role = "normal";
  var HouseNo = request.params.HouseNo;
  var BuildingNo = request.params.BuildingNo;
  var CommunityName = request.params.CommunityName;

var idneeded,idneeded2;
var user = new Parse.User();
user.set("username", username);
user.set("password", "password");
//user.set("email", email);
user.set("name",name);

user.set("role",role);
user.signUp(null, {
  success: function(user) {

//find from id of user
//add simliar entry
    var query = new Parse.Query("UserHouseBuildingCommunityMap");

  query.equalTo("UserId", oldaccount);
  query.first().then(function(Result){
    idneeded = Result.id;
   var UserHouseBuildingCommunityMap = Parse.Object.extend("UserHouseBuildingCommunityMap");
      var userhousebuildingcommunitymap = new UserHouseBuildingCommunityMap();
      userhousebuildingcommunitymap.set("HouseNo", Result.get("HouseNo"));
      userhousebuildingcommunitymap.set("BuildingNo", Result.get("BuildingNo"));
      userhousebuildingcommunitymap.set("CommunityName", Result.get("CommunityName"));
      userhousebuildingcommunitymap.set("UserId", user.id);
      return userhousebuildingcommunitymap.save();
}).then(function(result) {
//  response.success(true);
idneeded2 = result.id
 var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", idneeded);
  return query.find()
}).then(function(Results) {

 var SensorHouseMap = Parse.Object.extend("SensorHouseMap");
  var sensors = [];
    for (var i = Results.length - 1; i >= 0; i--) {  
  var sensorhousemap = new SensorHouseMap();
  var SensorId = Results[i].get("SensorId");
  var SensorName= Results[i].get("SensorName");
  var HouseNo= idneeded2; 
  sensorhousemap.set("SensorId",SensorId);
  sensorhousemap.set("SensorName",SensorName);
  sensorhousemap.set("HouseNo",HouseNo);
  sensors.push(sensorhousemap);
 }
  return Parse.Object.saveAll(sensors);
}).then(function(Results2){
//    response.success(Results);
  response.success(true);



  }, function(error){
    response.error(error.code + ": " + error.message);
  });

//end successs
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}





exports.SignUp = function(request, response){
  var username = request.params.username;
 // var password = request.params.password;
 // var email = request.params.username;

  var role = request.params.role;
  var HouseNo = request.params.HouseNo;
  var BuildingNo = request.params.BuildingNo;
  var CommunityName = request.params.CommunityName;


var user = new Parse.User();
user.set("username", username);
user.set("password", "test");
//user.set("email", email);
user.set("role",role);
user.signUp(null, {
  success: function(user) {
 

//end successs
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}

