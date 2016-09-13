var _ = require('./include/underscore.js');

/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/

//find tofirst in amdin serach 
//or arrayy complex thn api typoe would change 1 community atr a time
exports.GetWaterDataForAdmin = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
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
  query.equalTo("BuildingNo", Result[0].get("BuildingNo"));
  query.equalTo("CommunityName", Result[0].get("CommunityNo"));
  return query.find();
  }).then(function(Results) {
console.log(Results[0].id);
 for (var i = Results.length - 1; i >= 0; i--) { 
houses.push(Results[i].id);
returndata[Results[i].id] = 0;

    } 
    console.log(houses);
  var query = new Parse.Query("SensorHouseMap");
  query.containedIn("HouseNo", houses);
  return query.find();
  }).then(function(Results3) {

    for (var i = Results3.length - 1; i >= 0; i--) { 
sensors.push(Results3[i].get('SensorId'));
sensorhouse[Results3[i].get('SensorId')]=Results3[i].get('HouseNo');

    } 
    console.log(sensors);
    var query = new Parse.Query("SGateway2");
  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
    return query.find();
  }).then(function(Results2) {

     for (var i = Results2.length - 1; i >= 0; i--) { 
  //console.log(Results2[i].get('NodeSno'));
  //console.log(sensorhouse[Results2[i].get('NodeSno')]);
 // var s = sensorhouse[Results2[i].get('NodeSno')];
//  console.log(returndata[s]);

returndata[sensorhouse[Results2[i].get('NodeSno')]]+=Results2[i].get('normalread');
    } 
//        response.success(Results2);
    response.success(returndata);

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/

//find tofirst in amdin serach 
//or arrayy complex thn api typoe would change 1 community atr a time
exports.GetWaterDataForAdmin2 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];
  var houses= [];

var query = new Parse.Query("AdminUserBuildingMap");
  query.equalTo("AdminUserId", user.id);
  query.find().then(function(Result){
console.log(Result[0].id);
var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("BuildingNo", Result[0].get("BuildingNo"));
  query.equalTo("CommunityName", Result[0].get("CommunityNo"));
  return query.find();
  }).then(function(Results) {
console.log(Results[0].id);
 for (var i = Results.length - 1; i >= 0; i--) { 
houses.push(Results[i].id);
    } 
    console.log(houses);
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
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}





/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterDataForAdminParticularUser1 = function(request, response){
  var userid = request.params.UserId;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
  var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", userid);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId').toLowerCase());
    } 

    for (var i = sensors.length - 1; i >= 0; i--) { 
      //var objectsensor = {};
      objectsensors[sensors[i]]=[];
     // objectsensors.push(objectsensor);
    } 
//    var query = new Parse.Query("MeterData");
    //commeny these two
        var query = new Parse.Query("SGateway2");
//console.log(sensors);
       // var temparray = [408,409];
//query.containedIn("HouseNo", temparray);

  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
  //limit chnage it
  query.select("NodeSno","cummread","normalread")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
//Results2 contain all rows


 for (var i = Results2.length - 1; i >= 0; i--) { 
//console.log(Results2[i].get('NodeSno'));

var tempresult = {};
tempresult["NodeSno"]=Results2[i].get('NodeSno');
tempresult["cummread"]=Results2[i].get('cummread');
tempresult["normalread"]=Results2[i].get('normalread');
tempresult["createdAt"]=Results2[i].get('createdAt');

var prevarray =objectsensors[Results2[i].get('NodeSno')];
//console.log("beofre"+prevarray);
prevarray.push(tempresult);
//console.log("aftere"+prevarray);
objectsensors[Results2[i].get('NodeSno')]= prevarray;

    } 
//console.log(objectsensors);
  // response.success(Results2);
 response.success(objectsensors);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}



/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterDataForAdminParticularUser2 = function(request, response){
  var userId = request.params.UserId;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
  var objecthours =[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
  for (var i = 23; i >= 0; i--) { 
    var temphourobject = {};
    temphourobject["hours"]=i;
    temphourobject["data"]=[];
  objecthours[i]= temphourobject;    
} 

 // var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", userId);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push((Results1[i].get('SensorId')).toLowerCase());
    } 


   // for (var i = sensors.length - 1; i >= 0; i--) { 
      //var objectsensor = {};
      //objectsensors[sensors[i]]=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
     // objectsensors.push(objectsensor);
   // } 
//    var query = new Parse.Query("MeterData");
    //commeny these two
        var query = new Parse.Query("SGateway2");
//console.log(sensors);
       // var temparray = [408,409];
//query.containedIn("HouseNo", temparray);
//console.log(objectsensors);

  query.containedIn("NodeSno", sensors);
  query.greaterThan("TStamp",starttime);
  query.lessThan("TStamp",endtime);
  query.limit(1000);
  //limit chnage it
  query.select("NodeSno","cummread","normalread","TStamp")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
//Results2 contain all rows


 for (var i = Results2.length - 1; i >= 0; i--) { 
//console.log(Results2[i].get('NodeSno'));
var tempresult = {};
var wholeprevarray = objecthours[Results2[i].get('TStamp').getHours()];
var dataobject = wholeprevarray["data"];
//console.log(dataobject);
//console.log(tempresult["TStamp"]);
//console.log(tempresult["createdAt"]);

// for (var i = dataobject.length - 1; i >= 0; i--) { 
 // console.log(dataobject[i]["NodeSno"]);
 // console.log(tempresult["NodeSno"]);
      //var objectsensor = {};
      //objectsensors[sensors[i]]=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
     // objectsensors.push(objectsensor);
     //newarray.push(dataobject[i]);
     tempresult["Hours"]=Results2[i].get('TStamp').getHours();
tempresult["NodeSno"]=Results2[i].get('NodeSno');
tempresult["cummread"]=Results2[i].get('cummread');
tempresult["normalread"]=Results2[i].get('normalread');
tempresult["TStamp"]=Results2[i].get('TStamp');
tempresult["createdAt"]=Results2[i].get('createdAt');

/*
if(dataobject[i]["NodeSno"]==tempresult["NodeSno"]){
//flag=1;
//console.log(flag);
//newarray.push(dataobject[i]);
//break;
tempresult={};
break;
   } 
   */
 //}
  // console.log("nwe");
//console.log(newarray);
   
//dataobject = newarray;
dataobject.push(tempresult);
//console.log(dataobject);
objecthours[tempresult["Hours"]]["data"]=dataobject;
//console.log(objecthours);




//console.log(tempresult);
//console.log(objectsensors);
//var prevarray =objectsensors[Results2[i].get('NodeSno')][tempresult["Hours"]];
//console.log("beofre"+prevarray);
//console.log("aftere"+prevarray);
//wholeprevarray[tempresult["Hours"]]= prevarray;
//objectsensors[Results2[i].get('NodeSno')]= wholeprevarray;
    } 
  //console.log(objectsensors);
  // response.success(Results2);77
  //kjq8
  //a10
  //23 ttripe

 response.success(objecthours);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


/*
Input->InputDate{Date }//Date on which the consumption data is required
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular date for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterDataForUserPerDate = function (request, response) {
    var userid = request.params.UserId;
    var starttime = request.params.InputDate;

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    // hours/min/sec/ms cleared
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var sensors = [];
    var objectsensors = [];
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("UserId", userid);
    query.find().then(function (Results) {
        var houseno = Results[0].id;
        var query = new Parse.Query("SensorHouseMap");
        query.equalTo("HouseNo", houseno);
        return query.find();
    }).then(function (Sensors) {
        var ps = _.map(Sensors, function (sensor) {
            var perDayData = {}
            var normalReadTotal = 0;

            var query = new Parse.Query("SGateway2");
            query.equalTo("NodeSno", sensor.get('SensorId').toLowerCase());
            query.greaterThanOrEqualTo('TStamp', startDate);
            query.lessThan('TStamp', datePlusOne);
            query.limit(1000);
            query.select("NodeSno", "cummread", "normalread", "TStamp");

            return query.find().then(function (results) {
                if (results.length == 1) {
                    if (results[0].get("normalread") > 0)
                        normalReadTotal += results[0].get("normalread");
                }
                else if (results.length > 1) {
                    var dateTStamp = new Date(results[results.length - 1].get("TStamp"));

                    if (results[results.length - 1].get("normalread") > 0)
                        normalReadTotal += results[results.length - 1].get("normalread");
                    for (var i = results.length - 2; i >= 0; i--) {
                        if (dateTStamp.getTime() === results[i].get("TStamp").getTime()) {
                            continue;
                        }
                        if (results[i].get("normalread") > 0)
                            normalReadTotal += results[i].get("normalread");

                        dateTStamp = new Date(results[i].get("TStamp"));
                    }
                }

                //for (var i = results.length - 1; i >= 0; i--) {
                //    if (results[i].get("normalread") > 0)
                //        normalReadTotal += results[i].get("normalread");
                //}
                perDayData["NodeSno"] = sensor.get('SensorId').toLowerCase();
                perDayData["SensorName"] = sensor.get('SensorName').toLowerCase();
                perDayData["createdAt"] = starttime;
                perDayData["Normalread"] = normalReadTotal;

                objectsensors.push(perDayData);
            },
                function (error) {
                    response.error(JSON.stringify(error));
                }
        )
        });
        return Parse.Promise.when(ps);
    }).then(function (results) {

        response.success(objectsensors);

    }, function (error) {
        response.error(error.code + ": " + error.message);
    });
}



/*
Input->InputDate{Date }//Date on which the consumption data is required
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular date for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterDataForUserDuringPeriod = function (request, response) {
    var userId = request.params.UserId;
    var startTime = request.params.StartDate;
    var endTime = request.params.EndDate;

    console.log("Start Date : " + startTime);
    console.log("End Date : " + endTime);

    var beginDate = new Date(startTime);
    var lastDate = new Date(endTime);

    console.log("After Conversion, Start Date : " + beginDate);
    console.log("After Conversion, End Date : " + lastDate);

    beginDate.setHours(0, 0, 0, 0);
    lastDate.setHours(23, 59, 59, 59);

    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = beginDate.getTime();
    var date2_ms = lastDate.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    var numOfDays = Math.round(difference_ms / one_day);

    if (numOfDays > 31) {
        response.error("Duration cannot be more than 31 days. Please enter valid Date Range");
    }

    var totalConsumptionData = [];

    Parse.Promise.as().then(function () {
        var promises = [];

        while (beginDate <= lastDate) {
            promises.push(Parse.Cloud.run("GetWaterDataForUserPerDate", { UserId: userId, InputDate: beginDate },
             {
                 success: function (results) {
                     totalConsumptionData = _.union(totalConsumptionData, results);
                 }
             },
             {
                 error: function (error) {
                     console.log(error);
                 }
             }));
            beginDate.setDate(beginDate.getDate() + 1);
        }

        return Parse.Promise.when(promises);

    }).then(function () {

        totalConsumptionData.sort(function (a, b) {
            var dateA = new Date(a.createdAt);
            var dateB = new Date(b.createdAt);
            return dateA - dateB;
        })
        response.success(totalConsumptionData);
    }, function (error) {
        response.error(error);
    });

}

/*
Input->InputDate{Date }//Date on which the consumption data is required
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of Battery usage for a particular date for a particular user from SDiagnotics class
Procedure->Find Query on SensorUserMap (optional) then on SDiagnostics 
*/
//3 for array fromat return
exports.GetBatteryyUsageForUserForDay = function (request, response) {
    var userid = request.params.UserId;
    var starttime = request.params.InputDate;

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    // hours/min/sec/ms cleared
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var sensors = [];
    var diagnosticData = [];
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("UserId", userid);
    query.find().then(function (Results) {
        var houseno = Results[0].id;
        var query = new Parse.Query("SensorHouseMap");
        query.equalTo("HouseNo", houseno);
        return query.find();
    }).then(function (Sensors) {
        var ps = _.map(Sensors, function (sensor) {

            var query = new Parse.Query("SDiagnostics");
            query.equalTo("NodeSno", sensor.get('SensorId').toLowerCase());
            query.greaterThanOrEqualTo('createdAt', startDate);
            query.lessThan('createdAt', datePlusOne);
            query.limit(1000);
            query.select("NodeSno", "createdAt", "MDData");

            return query.find().then(function (results) {
                console.log("results : " + results);
                for (var i = results.length - 1; i >= 0; i--) {
                    var specificDayData = {};

                    specificDayData["NodeSno"] = sensor.get('SensorId').toLowerCase();
                    specificDayData["createdAt"] = results[i].get('createdAt');
                    console.log("MDData : " + results[i].get('MDData'));
                    specificDayData["MDData"] = results[i].get('MDData');
                    specificDayData["MDDataAfterCalculation"] = results[i].get('MDData') * 0.0091;

                    diagnosticData.push(specificDayData);
                }

            },
                function (error) {
                    response.error(JSON.stringify(error));
                }
        )
        });
        return Parse.Promise.when(ps);
    }).then(function (results) {

        response.success(diagnosticData);

    }, function (error) {
        response.error(error.code + ": " + error.message);
    });
}


/*
Input->InputDate{Date }//Date on which the consumption data is required
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of Battery usage for a particular date for a particular user for a particular node from SDiagnotics class
Procedure->Find Query on SensorUserMap (optional) then on SDiagnostics 
*/
//3 for array fromat return
exports.GetBatteryyUsageForNodeForDay = function (request, response) {
    var node = request.params.NodeSno;
    var starttime = request.params.InputDate;

    var diagnosticData = [];

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    // hours/min/sec/ms cleared
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var query = new Parse.Query("SDiagnostics");
    query.equalTo("NodeSno", node.toLowerCase());
    console.log("Node : " + node.toLowerCase());
    query.greaterThanOrEqualTo('createdAt', startDate);
    query.lessThan('createdAt', datePlusOne);
    query.limit(1000);
    query.select("NodeSno", "createdAt", "MDData");

    query.find().then(function (results) {
        for (var i = results.length - 1; i >= 0; i--) {
            var specificDayData = {};

            specificDayData["NodeSno"] = node.toLowerCase();
            specificDayData["createdAt"] = results[i].get('createdAt');
            console.log("MDData : " + results[i].get('MDData'));
            specificDayData["MDData"] = results[i].get('MDData');
            specificDayData["MDDataAfterCalculation"] = results[i].get('MDData') * 0.0091;

            diagnosticData.push(specificDayData);
        }

        response.success(diagnosticData);
    }, function (error) {
        response.error(error.code + ": " + error.message);
    });
}


exports.GetFlatDetails = function (request, response) {
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("IsPrimaryResidant", true);
    query.find().then(function (Results) {
        console.log("got results : " + Results.length);
        response.success(Results);
    }, function (error) {
        response.error(error.code + ": " + error.message);
    });
}