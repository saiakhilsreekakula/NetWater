
  exports.addDiff = function(request,response){
  var WData = request.object;
  var nodesno = WData.get("NodeSno");
  var cummread = WData.get("OData");


    var NwID = WData.get("NwID");
  var MType = WData.get("MType");
  var TStamp = WData.get("TStamp");
  var SNo = WData.get("SNo");

    var query = new Parse.Query("SGateway");
    query.equalTo("NodeSno", nodesno);
    query.descending("TStamp");
    query.lessThan("TStamp",TStamp);
    query.first().then(function(result){
      if(typeof result != 'undefined'){
        var prevread = result.get("OData");
        var diff = cummread - prevread;
        console.log(prevread);
        console.log(cummread);
        console.log(diff);
console.log(result.id);
        var SGateway2 = Parse.Object.extend("SGateway2");
      var sgateway2 = new SGateway2();
      sgateway2.set("MType", MType);
      sgateway2.set("NwID", NwID);
      sgateway2.set("SNo", SNo);
      sgateway2.set("NodeSno", nodesno);
      sgateway2.set("TStamp", TStamp);
      sgateway2.set("cummread", cummread);
      sgateway2.set("normalread",diff );
sgateway2.save({}, {
  success: function(result) {
response.success();
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
      }
      else{    
      response.success();
}
    });
}



  exports.addDiff2 = function(request,response){
  var WData = request.object;
  var nodesno = WData.get("NodeSno");
  var cummread = WData.get("OData");


    var NwID = WData.get("NwID");
  var MType = WData.get("MType");
  var TStamp = WData.get("TStamp");
  var TStamp2 = TStamp;
  var SNo = WData.get("SNo");

    var query = new Parse.Query("SGateway");
    query.equalTo("NodeSno", nodesno);
    query.descending("createdAt");
    query.first().then(function(result){
      if(typeof result != 'undefined'){
        var prevread = result.get("OData");
        var diff = cummread - prevread;
        console.log(prevread);
        console.log(cummread);
        console.log(diff);
console.log(result.id);
if(TStamp.getMinutes()>49){
  TStamp2=TStamp2.setTime(TStamp.getTime()+3600000);
  TStamp2 = new Date(TStamp2);
  TStamp2.setMinutes(0);
  TStamp2.setSeconds(0);
  TStamp2.setMilliseconds(0);
}
else if(TStamp.getMinutes()<10){
  TStamp2.setMinutes(0);
  TStamp2.setSeconds(0);
  TStamp2.setMilliseconds(0);
}


        var SGateway2 = Parse.Object.extend("SGateway2");
      var sgateway2 = new SGateway2();
      sgateway2.set("MType", MType);
      sgateway2.set("NwID", NwID);
      sgateway2.set("SNo", SNo);
      sgateway2.set("NodeSno", nodesno);
      sgateway2.set("TStamp", TStamp);
      sgateway2.set("TStamp2", TStamp2);
      sgateway2.set("cummread", cummread);
      sgateway2.set("normalread",diff );
sgateway2.save({}, {
  success: function(result) {
response.success();
  },
  error: function(result, error) {
    // Show the error message somewhere and let the user try again.
    response.error("Error: " + error.code + " " + error.message);
  }
});
      }
      else{    
      response.success();
}
    });
}
