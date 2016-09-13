/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->json object wiht keys as houses'id and value as water consumption in that time duration
Aim ->To get data of water consumption for superadmin all houses
Procedure->Find Query on to write here 
*/
//comment are not proper will change them
//find tofirst in amdin serach 
//or arrayy complex thn api typoe would change 1 community atr a time
exports.GetWaterDataForSuperAdmin = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];
  var houses= [];
  var communities= [];
  var returndata = {};
  var sensorhouse = {};
var query = new Parse.Query("SuperAdminCommunitMap");
  query.equalTo("SuperAdminUserId", user.id);
  query.find().then(function(Result){
console.log(Result.length);
for (var i = Result.length - 1; i >= 0; i--) { 
communities.push(Result[i].get("CommunityName"));
    } 
var query = new Parse.Query("UserHouseBuildingCommunityMap");
  //query.equalTo("BuildingNo", Result[0].get("BuildingNo"));
  query.containedIn("CommunityName", communities);
  return query.find();
  }).then(function(Results) {
console.log(Results[0].id);
 for (var i = Results.length - 1; i >= 0; i--) { 
houses.push(Results[i].id);
//fill return data also 
returndata[Results[i].id] = 0;
//returndata[i].house=Results[i].id;
//returndata[i].waterdata=0;
    } 
   // console.log(houses);
    //
    //console.log(returndata);
  var query = new Parse.Query("SensorHouseMap");
  query.containedIn("HouseNo", houses);
  return query.find();
  }).then(function(Results3) {
    for (var i = Results3.length - 1; i >= 0; i--) { 
sensors.push(Results3[i].get('SensorId'));
//make sensor and house json
sensorhouse[Results3[i].get('SensorId')]=Results3[i].get('HouseNo');
    } 
    //console.log(sensors);
    //console.log(sensorhouse);
    var query = new Parse.Query("SGateway2");
  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
    return query.find();
  }).then(function(Results2) {
//    response.success(Results2);
//

 for (var i = Results2.length - 1; i >= 0; i--) { 
  //console.log(Results2[i].get('NodeSno'));
  //console.log(sensorhouse[Results2[i].get('NodeSno')]);
 // var s = sensorhouse[Results2[i].get('NodeSno')];
//  console.log(returndata[s]);

returndata[sensorhouse[Results2[i].get('NodeSno')]]+=Results2[i].get('normalread');
    } 

console.log(returndata);
response.success(Results2.length);

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Output->json object wiht keys as houses
Aim ->To get data of water consumption for a particular interval for a particular user
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/

//find tofirst in amdin serach 
//or arrayy complex thn api typoe would change 1 community atr a time
exports.GetWaterDataForSuperAdmin2 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];
  var houses= [];
  var communities= [];
var query = new Parse.Query("SuperAdminCommunitMap");
  query.equalTo("SuperAdminUserId", user.id);
  query.find().then(function(Result){
console.log(Result.length);
for (var i = Result.length - 1; i >= 0; i--) { 
communities.push(Result[i].get("CommunityName"));
    } 
var query = new Parse.Query("UserHouseBuildingCommunityMap");
  //query.equalTo("BuildingNo", Result[0].get("BuildingNo"));
  query.containedIn("CommunityName", communities);
  return query.find();
  }).then(function(Results) {
console.log(Results[0].id);
 for (var i = Results.length - 1; i >= 0; i--) { 
houses.push(Results[i].id);
    } 
    console.log(houses);
    //
  var query = new Parse.Query("SensorHouseMap");
  query.containedIn("HouseNo", houses);
  return query.find();
  }).then(function(Results3) {

    for (var i = Results3.length - 1; i >= 0; i--) { 
sensors.push(Results3[i].get('SensorId'));
    } 
    console.log(sensors);
    var query = new Parse.Query("SGateway");
  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
    return query.find();
  }).then(function(Results2) {
    response.success(Results2);
//response.success(Results2.length);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}



/*
Input->{}
Output->Objects which will contain data of communities
Aim ->To get all communities lying under a superadmin
Procedure->Find Query on SuperAdminCommunitMap 
*/
exports.GetMyCommunities = function(request, response){
  var user = request.user;
  var query = new Parse.Query("SuperAdminCommunitMap");
  query.equalTo("SuperAdminUserId", user.id);
  query.find().then(function(Results){
   response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

/*
Input->{}
Output->Objects which will contain data of building
Aim ->To get all building under a community
Procedure->Find Query on AdminUserBuildingMap  
*/
exports.GetBuildingsInParticularCommunity = function(request, response){
  var community = request.params.community;
  var query = new Parse.Query("AdminUserBuildingMap");
  query.equalTo("CommunityName", community);
  query.find().then(function(Results){
   response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}