//get flat list
//get sensor lisst

//or arrayy complex thn api typoe would change 1 community atr a time
exports.GetUserList = function(request, response){
  var user = request.user;

  var houseno = user.get('HouseNo');
  var sensors=[];
  var houses= [];
  var returndata = {};
  var sensorhouse = {};
var query = new Parse.Query("AdminUserBuildingMap");
  query.equalTo("AdminUserId", user.id);
  query.find().then(function(Result){
console.log(Result[0].id);
var query = new Parse.Query("UserHouseBuildingCommunityMap");
console.log(Result[0].get("BuildingNo"));

console.log(Result[0].get("CommunityName"));

  query.equalTo("BuildingNo", Result[0].get("BuildingNo"));
  query.equalTo("CommunityName", Result[0].get("CommunityName"));
  return query.find();
  }).then(function(Results) {
console.log(Results[0].id);
 for (var i = Results.length - 1; i >= 0; i--) { 
//houses.push(Results[i].id);
houses.push(Results[i]);
returndata[Results[i].id] = 0;

    } 
    console.log(houses);

//        response.success(Results2);
    response.success(houses);

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}
