/*
Input->Date{Date }//as in 1st of any month and 00:01 time
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get latest data of water consumption from given month for a particular user
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
var _ = require('./include/underscore.js');

exports.GetThisMonthWaterData = function(request, response){
  var user = request.user;
  var starttime = request.params.Date;
  var sensors = user.get('SensorList');
  var query = new Parse.Query("MeterData");
  query.containedIn("SensorId", sensors);
  query.greaterThan("createdAt",starttime);
  query.limit(1000);
  query.find().then(function(Results){
    response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

/*
Input->Date{Date }//as in 1st of prev month and 00:01 time
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId,Leakage
Aim ->To get  data of water consumption from last given month for a particular user
Procedure->Find Query on SensorUserMap (optional) then on WaterData to find Object then combine them as Day 
*/
exports.GetLastMonthWaterData = function(request, response){
  var user = request.user;
  var starttime = request.params.Date;
  var endtime = starttime;
  endtime.setMonth(endtime.getMonth() + 1);
  var sensors = user.get('SensorList');
  var query = new Parse.Query("MeterData");
  query.containedIn("SensorId", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
  query.find().then(function(Results){
    response.success(Results);
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
exports.GetWaterData = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];

  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
    } 
//    var query = new Parse.Query("MeterData");
    //commeny these two
        var query = new Parse.Query("SGateway");
console.log(sensors);
       // var temparray = [408,409];
//query.containedIn("HouseNo", temparray);

  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
  query.descending("createdAt");
  query.select("NodeSno","OData")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
   response.success(Results2);

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


/*
Input->StartDate{Date} and EndDate{Date}
Output->Average per month or per day 
Aim->To get Average Consumption over a period of time
Procedure->Find Query on SensorUserMap (optional) then on WaterData to find Object then compute average
*/
exports.GetAverageWaterDataInInterval = function(request, response){

var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];
  var twodarray=[];
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  query.find().then(function(Results){
    for (var i = Results.length - 1; i >= 0; i--) { 
sensors.push(Results[i].get('SensorId'));
        twodarray.push([Results[i].get('SensorId'),0]);
    } 
    var query2 = new Parse.Query("MeterData");
  query2.containedIn("SensorId", sensors);
  query2.greaterThan("createdAt",starttime);
  query2.lessThan("createdAt",endtime);
  query2.limit(1000);
    return query2.find();
  }).then(function(Results2) {
   
        for (var i = Results.length - 1; i >= 0; i--) { 
   for (var j = sensors.length - 1; j >= 0; j--) { 
    if(Results[i].get('SensorId') == (twodarray[j][0])) {
       twodarray[j][1] += Results[i].get('WaterData');
       break;
     }
}

}
 var one_day=1000*60*60*24;
  // Convert both dates to milliseconds
  var date1_ms = starttime.getTime();
  var date2_ms = endtime.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
  var days =  (difference_ms-(difference_ms%one_day))/one_day;

  for (var i = sensors.length - 1; i >= 0; i--) { 
 twodarray[i][1]=twodarray[i][1]/days;
}
    response.success(twodarray);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
  
}

/*
Input->StartDate and EndDate

Output->json object containing Max Usage and TImeStamp of that day

Aim->To Get Maximum Usage Day and value of maximum Usage

Procedure->Find Query on SensorUserMap (optional) then on WaterData to get Max WaterConsumption Object  
*/

exports.GetWaterUsageMaximumInInterval = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  query.find().then(function(Results){
    for (var i = Results.length - 1; i >= 0; i--) { 
sensors.push(Results[i].get('SensorId'));
    } 
    var query = new Parse.Query("MeterData");
  query.containedIn("SensorId", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
    return query.find();
  }).then(function(Results2) {
    response.success(Results);
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
exports.GetWaterData2 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];

  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
    } 
//    var query = new Parse.Query("MeterData");
    //commeny these two
        var query = new Parse.Query("SGateway2");
console.log(sensors);
       // var temparray = [408,409];
//query.containedIn("HouseNo", temparray);

  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
  query.descending("createdAt");
  query.select("NodeSno","cummread","normalread")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
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
exports.GetWaterData3 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
  var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
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
tempresult["Hours"]=Results2[i].get('createdAt').getHours();
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
objectsensors->
each sensor->[{},{}]

objectsensors->
each sensor->
*/
//size ,video ask
/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterData4 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
  var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
    } 


    for (var i = sensors.length - 1; i >= 0; i--) { 
      //var objectsensor = {};
      objectsensors[sensors[i]]=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
     // objectsensors.push(objectsensor);
    } 
//    var query = new Parse.Query("MeterData");
    //commeny these two
        var query = new Parse.Query("SGateway2");
//console.log(sensors);
       // var temparray = [408,409];
//query.containedIn("HouseNo", temparray);
//console.log(objectsensors);

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

//10j 77 won kq highg card lost AK a7 lost,AK,stright wait Q8 agsnt jj
 for (var i = Results2.length - 1; i >= 0; i--) { 
//console.log(Results2[i].get('NodeSno'));

var tempresult = {};
tempresult["Hours"]=Results2[i].get('createdAt').getHours();
tempresult["NodeSno"]=Results2[i].get('NodeSno');
tempresult["cummread"]=Results2[i].get('cummread');
tempresult["normalread"]=Results2[i].get('normalread');
tempresult["createdAt"]=Results2[i].get('createdAt');
var wholeprevarray = objectsensors[Results2[i].get('NodeSno')];
//console.log(tempresult);
//console.log(objectsensors);
var prevarray =objectsensors[Results2[i].get('NodeSno')][tempresult["Hours"]];
//console.log("beofre"+prevarray);
prevarray.push(tempresult);
//console.log("aftere"+prevarray);
wholeprevarray[tempresult["Hours"]]= prevarray;
objectsensors[Results2[i].get('NodeSno')]= wholeprevarray;
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
exports.GetWaterData5 = function(request, response){
  var user = request.user;
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
  query.equalTo("UserId", user.id);
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
//for monthly function



/*
Input->StartDate{Date },EndDate{Date}//difference between both shoudlnt be greater than 1 month else it would take longer time to load in user account
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get data of water consumption for a particular interval for a particular user from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/
//3 for array fromat return
exports.GetWaterDataForMonth = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
      var objecthours =[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

 // var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    var a={};
    var b=[];
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
a.sensorId = Results1[i].get('SensorId');
a.startread = 1000000;
a.endreading =0 ;
b.push(a);
    } 
  for (var i = 31; i >= 0; i--) { 
    var temphourobject = {};
    temphourobject["day"]=i;
    temphourobject["data"]=b;

  objecthours[i]= temphourobject;    
} 



  
        var query = new Parse.Query("SGateway2");
  query.containedIn("NodeSno", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
  query.limit(1000);
  query.ascending("TStamp");
  query.select("NodeSno","cummread","normalread","TStamp")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
//Results2 contain all rows

//console.log(Results2.length);
 for (var i = Results2.length - 1; i >= 0; i--) { 
//console.log("redr"+Results2[i].get('cummread'));
//

//console.log(Results2[i].get('NodeSno'));
var tempresult = {};
var wholeprevarray = objecthours[Results2[i].get('TStamp').getDate()];
var dataobject = wholeprevarray["data"];
var currentsensor =Results2[i].get('NodeSno');
var reading = Results2[i].get('cummread');
//console.log(sensors);
//console.log(currentsensor);
//console.log(dataobject[0]);
 for (var j = sensors.length - 1; j >= 0; j--) { 


if(dataobject[j]["sensorId"]==currentsensor){
  //console.log("sensrmatch");
  //  console.log("reading"+reading);
var timehour = Results2[i].get('TStamp').getHours();
if(timehour ==0){
dataobject[j]["startread"]=reading;
}
if(timehour ==23){
  dataobject[j]["endread"]=reading;
}
/*

  if(dataobject[j]["startread"]>reading){ 
    //console.log("reading"+reading);
    dataobject[j]["startread"]=reading;}
if(dataobject[j]["endread"]<reading){
  dataobject[j]["endread"]=reading;}
  */


  
}


    } 



/*
     tempresult["Hours"]=Results2[i].get('TStamp').getDate();
tempresult["NodeSno"]=Results2[i].get('NodeSno');
tempresult["cummread"]=Results2[i].get('cummread');
tempresult["normalread"]=Results2[i].get('normalread');
tempresult["TStamp"]=Results2[i].get('TStamp');
tempresult["createdAt"]=Results2[i].get('createdAt');
*/

//dataobject.push(tempresult);
//wait for 500ms
//check read>10000

//console.log("ops"+dataobject[0]["startread"]);
objecthours[Results2[i].get('TStamp').getDate()]["data"]=dataobject;

//console.log(objecthours[Results2[i].get('TStamp').getDate()]["data"]+"date is"+Results2[i].get('TStamp').getDate());


    } 


 response.success(objecthours);
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
exports.GetWaterDataForMonth2 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var sensor = request.params.sensor;
  //comment these two
//  starttime = new Date(2001,2,2);
  //endtime = new Date();
  var sensors=[];
      var alldays=[];
      var secnd=[];
      var third=[]
      var frth=[];

      var objecthours =[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
  var result2=[];
 // var objectsensors = {};
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    var a={};
    var b=[];
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId'));
a.sensorId = Results1[i].get('SensorId');
a.startread = 1000000;
a.endreading =0 ;
b.push(a);
    } 

  for (var i = 31; i >= 0; i--) { 
    alldays.push(0);
    secnd.push(1000000);
    third.push(0);
    frth.push(0);
    var temphourobject = {};
    temphourobject["day"]=i;
    temphourobject["data"]=b;

  objecthours[i]= temphourobject;    
} 



  
        var query = new Parse.Query("SGateway2");
  //query.containedIn("NodeSno", sensors);
  query.greaterThan("TStamp",starttime);
  query.lessThan("TStamp",endtime);
  query.equalTo("NodeSno",sensor);
//console.log(sensor);
//console.log(starttime+":"+endtime);
  query.limit(1000);
 // query.ascending("TStamp");
  query.select("NodeSno","cummread","normalread","TStamp")
    return query.find();
  }).then(function(Results2) {
   // response.success(Results2.length);
//Results2 contain all rows

//console.log(Results2.length);
 for (var i = Results2.length - 1; i >= 0; i--) { 
//console.log("redr"+Results2[i].get('cummread'));
//

//console.log(Results2[i].get('NodeSno'));
var tempresult = {};
var day =Results2[i].get('TStamp').getDate();
var wholeprevarray = objecthours[day];
var dataobject = wholeprevarray["data"];
var currentsensor =Results2[i].get('NodeSno');
var reading = Results2[i].get('normalread');
var reading2 = Results2[i].get('cummread');
var timehour = Results2[i].get('TStamp').getHours();
/*
console.log(sensors);
console.log(currentsensor);
console.log(dataobject[0]);
*/
alldays[day]=alldays[day]+reading;
/*
if(frth[day]==0){
  if(reading2<secnd[day]){
  secnd[day]=reading2;
  frth[day]=1;
}
}
else{
  if(reading2>third[day]){
  third[day]=reading2;
}
}
*/
 // for (var j = sensors.length - 1; j >= 0; j--) { 
//var aobjt={};

//if(dataobject[j]["sensorId"]==currentsensor){
  /*
  console.log("sensrmatch");
    console.log("reading"+reading);
if(timehour == 0){
dataobject[0]["startread"]=reading;
aobjt.sensorId = Results1[i].get('SensorId');
aobjt.startread = reading;
a.endreading =0 ;
}
if(timehour == 23){
  dataobject[0]["endread"]=reading;
}
*/
/*
  if(dataobject[j]["startread"]>reading){ 
    //console.log("reading"+reading);
    dataobject[j]["startread"]=reading;}
if(dataobject[j]["endread"]<reading){
  dataobject[j]["endread"]=reading;}
  */
//}
  // } 



/*
     tempresult["Hours"]=Results2[i].get('TStamp').getDate();
tempresult["NodeSno"]=Results2[i].get('NodeSno');
tempresult["cummread"]=Results2[i].get('cummread');
tempresult["normalread"]=Results2[i].get('normalread');
tempresult["TStamp"]=Results2[i].get('TStamp');
tempresult["createdAt"]=Results2[i].get('createdAt');
*/

//dataobject.push(tempresult);
//wait for 500ms
//check read>10000
/*
console.log("ops"+dataobject[0]["startread"]);
objecthours[day]["data"]=dataobject;

console.log(objecthours[day]["data"]+"date is"+day);
*/

    } 
   /* var fth=[];
  for (var i = 0; i <= 31; i++) { 
    fth.push(third[i]-secnd[i]);
} 

console.log("fthr"+fth);
console.log("thierd"+third);
console.log("secdn"+secnd);
console.log("alldya"+alldays);
*/
 response.success(alldays);
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
exports.GetWaterDataForMonth3 = function(request, response){
  var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
 
  var sensors=[];
      var alldays=[];
      var sensorsobjct={};
      var s=[];

  var result2=[];
  var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  return query.find();
  }).then(function(Results1) {
    var a={};
    var b=[];
    var c={};
    for (var i = 31; i >= 0; i--) { 
    alldays.push(0);   
    s.push(0);
    c[i]=0;
} 
    for (var i = Results1.length - 1; i >= 0; i--) { 
sensors.push(Results1[i].get('SensorId').toLowerCase());
a.sensorId = Results1[i].get('SensorId');
sensorsobjct[a.sensorId.toLowerCase()]=c;
    } 

 
        var query = new Parse.Query("SGateway2");
  query.containedIn("NodeSno", sensors);
  query.greaterThan("TStamp",starttime);
  query.lessThan("TStamp",endtime);
  //query.equalTo("NodeSno",sensor);
//console.log(sensor);
//console.log(starttime+":"+endtime);
  query.limit(1000);
 // query.ascending("TStamp");
  query.select("NodeSno","cummread","normalread","TStamp")
    return query.find();
  }).then(function(Results2) {
//console.log(Results2.length);
//var xx=0;
 //for (var i = Results2.length - 1; i >= 0; i--) { 
//xx++;

_.each(Results2, function(Results){
  var node = Results.get('NodeSno');var day = Results.get('TStamp').getDate();var reading =Results.get('normalread');
          sensorsobjct[node][day]=sensorsobjct[node][day]+reading;
          s[day]=s[day]+reading;
        });
  //  }
   
console.log(s);
 
 response.success(sensorsobjct);
 }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

/*
Input->{}
Output->Objects which will contain data TimeStamp,WaterConsumption,MeterId
Aim ->To get Total water consumption for a particular user on a particular day from both readings table
Procedure->Find Query on SensorUserMap (optional) then on MeterData to find Object then combine them as Day 
*/

exports.GetTotalWaterConsumptionForUserForDay = function (request, response) {
    var userid = "ofMobeyaWW";		//request.params.UserId;
    var starttime = request.params.InputDate;

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var sensors = [];
    var objectsensors = [];
    var todayData = {}
    var normalReadTotal = 0;
    var indexReset = -1;
    var normalReadTotalAfterReset = 0;
    var houseName = '';

    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("UserId", userid);
    query.find().then(function (Results) {
        var houseno = Results[0].id;
        houseName = Results[0].get("HouseNo");
        var query = new Parse.Query("SensorHouseMap");
        query.equalTo("HouseNo", houseno);
        return query.find();
    }).then(function (Sensors) {
        var ps = _.map(Sensors, function (sensor) {
            var perDayData = {}
            var normalReadTotal = 0;
            var normalReadAfterReset = 0;
            var indexReset = -1;

            //var dateTStamp = new Date();

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
                //      normalReadTotal += results[i].get("normalread");
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
exports.GetUserWaterConsumptionOnADay = function (request, response) {
    var userId = request.params.UserId;
    var starttime = request.params.InputDate;

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    // hours/min/sec/ms cleared
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var sensors = [];
    var objectsensors = [];
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("UserId", userId);
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

                //for (var i = results.length - 1; i >= 0; i--)
                //{
                //    if (results[i].get("normalread") > 0)
                //	   normalReadTotal += results[i].get("normalread");
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
exports.GetUserWaterConsumptionDuringPeriod = function (request, response) {
    var user = request.user;
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
            promises.push(Parse.Cloud.run("GetUserWaterConsumptionOnADay", { UserId: user.id, InputDate: beginDate },
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
exports.GetBatteryyUsageForDay = function (request, response) {
    var user = request.user;
    var starttime = request.params.InputDate;

    var startDate = new Date(starttime);
    startDate.setHours(0, 0, 0, 0);
    // hours/min/sec/ms cleared
    var datePlusOne = new Date(startDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    var sensors = [];
    var diagnosticData = [];
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
    query.equalTo("UserId", user.id);
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