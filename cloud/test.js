
exports.Test5 = function(request, response){
   //var starttime = request.params.StartDate;
  //var endtime = request.params.EndDate;
  //comment these two
  //starttime = new Date(2001,2,2);
  //endtime = new Date();
  //var sensors=[];

  var query = new Parse.Query("User");
  //query.equalTo("UserId", user.id);
  query.find().then(function(Results){
      response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}




exports.Test4 = function(request, response){
      var query = new Parse.Query("TimeProfile");
  query.equalTo("Flag", 1);
    query.find().then(function(Results2) {
    /*------------------------------------------------------------------------------------------*/
    var newObject= JSON.parse(JSON.stringify(Results2));
    var returnVal;
     returnVal= 0;
    // for (var i = Results2.length - 1; i >= 0; i--) { 
      for (var i = 0; i < Results2.length; i++) {
            returnVal += Math.pow(2,Results2[i].get('Hour')); 
            newObject[i].newElement = Results2[i].get('Flag');
            newObject[i].returnValue = returnVal;
        }
        // newObject.newElement = returnVal;
        // newObject.AnotherElement = "{AnotherElelement:SharathKonda}";
    response.success(newObject);
/*------------------------------------------------------------------------------------------*/

  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

exports.Test3 = function(request, response){
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
/*------------------------------------------------------------------------------------------*/
var newObject = JSON.parse(JSON.stringify(result));
// newObject.NewElement="SharathKonda";
newObject.newElement = Parse.Config("BatteryPushIntervalHrs")
newObject.NwID=100;
response.success(newObject);
/*------------------------------------------------------------------------------------------*/
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
  
}







exports.test1 = function(request, response){
   //var starttime = request.params.StartDate;
  //var endtime = request.params.EndDate;
  //comment these two
  //starttime = new Date(2001,2,2);
  //endtime = new Date();
  //var sensors=[];

  var query = new Parse.Query("User");
  //query.equalTo("UserId", user.id);
  query.find().then(function(Results){
      response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}

/*
admin super admin n all

agrigate n all

array json thign 

2 prl cl

hrs,ppr,
*/


exports.test2 = function(request, response){
   //var starttime = request.params.StartDate;
  //var endtime = request.params.EndDate;
  //comment these two
  //starttime = new Date(2001,2,2);
  //endtime = new Date();
  //var sensors=[];

  var query = new Parse.Query("SharTest");
  //query.equalTo("UserId", user.id);
  query.find().then(function(Results){
    /*-----------------------------------------------------------------------------------------------------*/
    var scores = [];
     for (var i = 0; i < Results.length; i++) {
       scores.push(Results[i]); 
       scores.push({'score':100+i, 'playername':'Sharath'});
  }
  
  
   response.success(scores);
    
  /*-----------------------------------------------------------------------------------------------------*/
    //    for(var i = 0; i<Results.length; i++)
    //             {
    //                 Results[i].("newField", 'SharathKonda');
    //                 Results[i].save();
    //             }
    //  response.success(Results);
    /*-----------------------------------------------------------------------------------------------------*/
    // var scores = [];
    //  for (var i = 0; i < results.length; i++) { 
    //    scores.push({'score':results[i].get('score'), 'playername':results[i].get('playername')});
    //  }
    //    response.success(Results);
       /*-----------------------------------------------------------------------------------------------------*/
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}
