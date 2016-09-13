//Number of signups in last 30 days
//Input is number of days n ({nval:n})
//Output is an array(Px3 array) in which allresults[i][0] contains teacher count,allresults[i][1] contains student count, allresults[i][2] contains parent count, in the ith day   
  exports.NumberOfSignupsBetweenTwoDates = function(request, response){

  //var d1 = request.params.date1;
  //var d2 = request.params.date2; 

   var user = request.user;
  var starttime = request.params.StartDate;
  var endtime = request.params.EndDate;
  var houseno = user.get('HouseNo');
  var sensors=[];

  var allresults = [];
  var processCallback = function(res) {
      allresults = allresults.concat(res);
      if (res.length == 1000) {
        process(res[res.length-1].id);
        return;
      } 
      return allresults;    

      //



      }
  
  var process = function(skip) {
     var query = new Parse.Query("MeterData");
    
    if (skip) {
      //~ console.log("in if");
      query.greaterThan("objectId", skip);
    }
    //query.lessThanOrEqualTo("createdAt",d1);
    //query.greaterThan("createdAt",d2);
    //query.select("role");
  query.containedIn("SensorId", sensors);
  query.greaterThan("createdAt",starttime);
  query.lessThan("createdAt",endtime);
    query.limit(1000);
    query.ascending("objectId");
    query.find().then(function querySuccess(res) {
      processCallback(res);
    }, function queryFailed(error) {
      response.error("query unsuccessful, length of result " + allresults.length + ", error:" + error.code + " " + error.message);
    });
    }



  var query = new Parse.Query("SensorHouseMap");
  query.equalTo("HouseNo", houseno);
  query.find().then(function(Results){
    for (var i = Results.length - 1; i >= 0; i--) { 
sensors.push(Results[i].get('SensorId'));
    }    
    process(false);  
  }).then(function(Results2) {
    response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });



}
