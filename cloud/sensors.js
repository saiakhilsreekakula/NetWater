    var _ = require('./include/underscore.js');

exports.ShowAllNodes = function(request, response){
  var query = new Parse.Query("SensorHouseMap");
  query.find().then(function(Results){
      response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

/*
Input->{}
Output->Objects which will contain data of sensors
Aim ->To get sensors of particular user
Procedure->Find Query on UserHouseBuildingCommunityMap then on SensorHouseMap to find sensors 
*/
exports.GetMySensors = function(request, response){
  var user = request.user;
    var query = new Parse.Query("UserHouseBuildingCommunityMap");
  query.equalTo("UserId", user.id);
  query.find().then(function(Results){
  var houseno = Results[0].id;
  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
     return query.find();
  }).then(function(Results2) {
//    response.success(Results2.length);
   response.success(Results2);

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}



exports.SelfRMFunction = function(request, response){
  var MType = request.params.MType;
  var NwID = request.params.NwID;
  var SNo = request.params.SNo;
  var DID = request.params.DID;

var SelfRM = Parse.Object.extend("SelfRM");
      var selfrm = new SelfRM();
      selfrm.set("MType", MType);
      selfrm.set("NwID", NwID);
      selfrm.set("SNo", SNo);
      selfrm.set("DID", DID);

selfrm.save({}, {
  success: function(result) {
response.success(result);
//end successs
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}


exports.SensorRMFunction = function(request, response){
  var MType = request.params.MType;
  var NwID = request.params.NwID;
  var SNo = request.params.SNo;
  var DID = request.params.DID;
  var NodeSno = request.params.NodeSno;


var SensorRM = Parse.Object.extend("SensorRM");
      var sensorrm = new SensorRM();
      sensorrm.set("MType", MType);
      sensorrm.set("NwID", NwID);
      sensorrm.set("SNo", SNo);
      sensorrm.set("DID", DID);
      sensorrm.set("NodeSno", NodeSno);
sensorrm.save({}, {
  success: function(result) {
response.success(result);
//end successs
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}



exports.SensorRMBFunction = function(request, response){
  var MType = request.params.MType;
  var NwID = request.params.NwID;
  var SNo = request.params.SNo;
  var DID = request.params.DID;
  var NodeSno = request.params.NodeSno;
  var errorStatus = request.params.ErrorStatus;
  var swVersion = request.params.SoftwareVersion;


var SensorRMB = Parse.Object.extend("SensorRMB");
      var sensorrmb = new SensorRMB();
      sensorrmb.set("MType", MType);
      sensorrmb.set("NwID", NwID);
      sensorrmb.set("SNo", SNo);
      sensorrmb.set("DID", DID);
      sensorrmb.set("NodeSno", NodeSno);
      sensorrmb.set("ErrorStatus", errorStatus);
      sensorrmb.set("SoftwareVersion", swVersion);
      sensorrmb.save({}, {
  	success: function(result) {
		response.success(result);
  	},
  	error: function(result, error) {
    		// Show the error message somewhere and let the user try again.
    		response.error("Error: " + error.code + " " + error.message);
  	}
   });
}




// function getTimeProfile(){
//   var returnVal;
//      returnVal= 0;
    
//     /*------------------------------------------------------------------------------------------*/
//     var query = new Parse.Query("TimeProfile");
//     query.equalTo("Flag", 1);
//     // newObject.FieldBefore="--";
    
//     query.find().then(function(Results2) {
//       // newObject.BeforeCalc=Results2.length;
//       for (var i = 0; i < Results2.length; i++) {
//             returnVal += Math.pow(2,Results2[i].get('Hour')); 
//         }
//   return returnVal;
//         // newObject.AfterCalc=Results2.length;
//     }, function(error){
//     response.error(error.code + ": " + error.message);
//   });
// }


/* ------------------------------------------------------------------------------------------------*/ 
/*SensorRMFunctionV3: Enhanced the function to send the customized success-response*/
/* Written by Sharath Konda on 4/25
/* ------------------------------------------------------------------------------------------------*/


exports.SensorRMFunctionV3 = function(request, response){
  var MType = request.params.MType;
  var NwID = request.params.NwID;
  var SNo = request.params.SNo;
  var DID = request.params.DID;
  var NodeSno = request.params.NodeSno;


var SensorRM = Parse.Object.extend("SensorRM");
      var sensorrm = new SensorRM();
      sensorrm.set("MType", MType);
      sensorrm.set("NwID", NwID);
      sensorrm.set("SNo", SNo);
      sensorrm.set("DID", DID);
      sensorrm.set("NodeSno", NodeSno);
      sensorrm.save({}, {
      success: function(result) {
    var newObject = JSON.parse(JSON.stringify(result));
    var returnVal;
      returnVal=0;
      // returnVal=getTimeProfile();
    /*------------------------------------------------------------------------------------------*/
      var query = new Parse.Query("BatteryTimeProfile");
      query.equalTo("Flag", true);
      query.find().then(function(Results2) {
        for (var i = 0; i < Results2.length; i++) {
              returnVal += Math.pow(2,Results2[i].get('Hour')); 
          }
          newObject.MDTimeProfile=returnVal;
          response.success(newObject);
      /*------------------------------------------------------------------------------------------*/
    }, function(error){
    response.error(error.code + ": " + error.message);
  });
    
//end successs
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}

/* ------------------------------------------------------------------------------------------------*/ 
/*SensorRMFunctionV2: Enhanced the function to send the customized success-response*/
/* Written by Sharath Konda on 4/23
/* ------------------------------------------------------------------------------------------------*/
exports.SensorRMFunctionV2 = function(request, response){
  var MType = request.params.MType;
  var NwID = request.params.NwID;
  var SNo = request.params.SNo;
  var DID = request.params.DID;
  var NodeSno = request.params.NodeSno;


var SensorRM = Parse.Object.extend("SensorRM");
      var sensorrm = new SensorRM();
      sensorrm.set("MType", MType);
      sensorrm.set("NwID", NwID);
      sensorrm.set("SNo", SNo);
      sensorrm.set("DID", DID);
      sensorrm.set("NodeSno", NodeSno);
sensorrm.save({}, {
  success: function(result) {
    var newObject = JSON.parse(JSON.stringify(result));
    newObject.BtryDtPushIntvlHrs="01071319";

response.success(newObject);
//end successs
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}



/*
Input-> Array of json objects->InputList{Array}
Ex: 
Output->Whole Object rows
*/

exports.SaveSDiagnostics = function(request, response){

  var InputList = request.params.InputList;
  var SDiagnostics = Parse.Object.extend("SDiagnostics");
  var inputs = [];
    for (var i = InputList.length - 1; i >= 0; i--) {  
  var test = new SDiagnostics();
  var row1 = InputList[i].MDData;
  var row2  = InputList[i].NwID;
   var row3 = InputList[i].MType;
  var  row4  = InputList[i].TStamp;
   var row5 = InputList[i].NodeSno;
  var row6  = InputList[i].SNo;
  test.set("MDData",row1);
  test.set("NwID",row2);
  test.set("MType",row3);
  test.set("TStamp",row4);
  test.set("NodeSno",row5);
  test.set("SNo",row6);
  inputs.push(test);
 }
  Parse.Object.saveAll(inputs).then(function(Results){
    response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}



/*
Input-> Array of json objects->InputList{Array}
Ex: 
Output->Whole Object rows
*/

exports.SaveSGateway2 = function(request, response){

  var InputList = request.params.InputList;
  var SGateway = Parse.Object.extend("SGateway");
  var inputs = [];
    for (var i = InputList.length - 1; i >= 0; i--) {  
  var test = new SGateway();
  var row1  = InputList[i].NwID;
  var row2 = InputList[i].MType;
  var  row3  = InputList[i].TStamp;
  var row4 = InputList[i].NodeSno;
  var row5  = InputList[i].SNo;
  var row6 = InputList[i].OData;
  test.set("NwID",row1);
  test.set("MType",row2);
  test.set("TStamp",row3);
  test.set("NodeSno",row4);
  test.set("SNo",row5);
  test.set("OData",row6);
  inputs.push(test);
 }
  Parse.Object.saveAll(inputs).then(function(Results){
    response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}


//sencind functions

exports.SaveSGateway = function(request, response){

  var InputList = request.params.InputList;
  var SGateway = Parse.Object.extend("SGateway");
  var inputs = [];
  var returnresults=[];
    for (var i = InputList.length - 1; i >= 0; i--) {  
  var test = new SGateway();
  var row1  = InputList[i].NwID;
  var row2 = InputList[i].MType;
  var  row3  = InputList[i].TStamp;
  var row4 = InputList[i].NodeSno;
  var row5  = InputList[i].SNo;
  var row6 = InputList[i].OData;
  test.set("NwID",row1);
  test.set("MType",row2);
  test.set("TStamp",row3);
  test.set("NodeSno",row4);
  test.set("SNo",row5);
  test.set("OData",row6);
  inputs.push(test);
 }
 var size = InputList.length;
 if(size==1){
  console.log("here");

  inputs[0].save().then(function(Results){
returnresults.push(Results);

 var query = new Parse.Query("SGateway2");
    query.equalTo("NodeSno", inputs[0].get("NodeSno"));
    query.ascending("TStamp");
    query.greaterThan("TStamp",inputs[0].get("TStamp"));
    console.log(inputs[0].get("NodeSno"));
    console.log(inputs[0].get("TStamp"));
    return query.first();
}).then(function(result) {
      if(typeof result != 'undefined'){
        console.log("here or no")
var newdiff = result.get("cummread")-inputs[0].get("OData");
result.set("normalread",newdiff);
}

return result.save();
}).then(function(Result) {
 response.success(returnresults);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
 }

 else if(size==2){
  console.log("here");

  inputs[1].save().then(function(Results){
returnresults.push(Results);
return inputs[0].save();
}).then(function(Results) {
returnresults.push(Results);
 response.success(returnresults);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
 }
 else if(size==3){
  console.log("here");

  inputs[2].save().then(function(Results){
returnresults.push(Results);
return inputs[1].save();
}).then(function(Results) {
returnresults.push(Results);
return inputs[0].save();
}).then(function(Results) {

returnresults.push(Results);
 response.success(returnresults);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
 }
  else if(size==4){
  console.log("here");

  inputs[3].save().then(function(Results){
returnresults.push(Results);
return inputs[2].save();
}).then(function(Results) {
returnresults.push(Results);
return inputs[1].save();
}).then(function(Results) {
returnresults.push(Results);
  return inputs[0].save();
}).then(function(Results) {
returnresults.push(Results);
 response.success(returnresults);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
 }

  else{
  inputs[4].save().then(function(Results){
returnresults.push(Results);
return inputs[3].save();
}).then(function(Results) {
returnresults.push(Results);
return inputs[2].save();
}).then(function(Results) {
returnresults.push(Results);
  return inputs[1].save();
}).then(function(Results) {

returnresults.push(Results);
  return inputs[0].save();
}).then(function(Results) {

returnresults.push(Results);
//  return inputs[5].save();
//}).then(function(Results) {

//returnresults.push(Results);
    response.success(returnresults);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}
}


/*
exports.SaveSGateway3 = function(request, response){

  var InputList = request.params.InputList;
  var SGateway = Parse.Object.extend("SGateway");
  var inputs = [];
  var returnresults=[];
    for (var i = InputList.length - 1; i >= 0; i--) {  
  var test = new SGateway();
  var row1  = InputList[i].NwID;
  var row2 = InputList[i].MType;
  var  row3  = InputList[i].TStamp;
  var row4 = InputList[i].NodeSno;
  var row5  = InputList[i].SNo;
  var row6 = InputList[i].OData;
  test.set("NwID",row1);
  test.set("MType",row2);
  test.set("TStamp",row3);
  test.set("NodeSno",row4);
  test.set("SNo",row5);
  test.set("OData",row6);
  inputs.push(test);
 }

var promise =  new Parse.Promise();
    for (var i = InputList.length - 1; i >= 0; i--) {  
promise = promise.then(onFulfilled, onRejected);
promise = promise.then(function() {
      // Return a promise that will be resolved when the delete is finished.
      return result.destroy();
    });

var seriesPromise = new Parse.Promise.as();
$.each(items, function (i) {
    
    // Series Promise: The code to be executed in sequence being placed within the 
    // then() the existing promise
    seriesPromise = seriesPromise.then(function() {
       return Parse.Cloud.run('sampleCloudFuction', itemsArray);
//     ^^^^^^
    });
  
});
seriesPromise.then(function () {
    //Fetch the approval state of the disabled button
    alert("load remaining items");
}, function (error) {
    alert("Error " + error.code + "::");
    console.log("error callback in JS");
});
//promise.resolve("done")


}

*/