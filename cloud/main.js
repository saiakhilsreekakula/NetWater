    var _ = require('./include/underscore.js');


  var login = require('./login.js');
  var normaluser = require('./normaluser.js');
  var adminuser = require('./adminuser.js');
  var superadminuser = require('./superadminuser.js');

  var temp = require('./temp.js');
  var account = require('./account.js');

  var sensors = require('./sensors.js');
  var aftersave = require('./aftersave.js');
  var test = require('./test.js');
  var testsave = require('./testsave.js');

  var helperfunctions = require('./helperfunctions.js');



// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello Sensworx!");
});
 
/*----------------------------------------------- login.js ------------------------------------------------------------*/
Parse.Cloud.define("SignUp", function(request, response){
    login.SignUp(request, response);
  });

Parse.Cloud.define("Login", function(request, response){
    login.Login(request, response);
  });



Parse.Cloud.define("SendCode", function(request, response){
    login.SendCode(request, response);
  });

/*--------------------------------------------NormalUser.js----------------------------------------------------------*/
Parse.Cloud.define("GetThisMonthWaterData", function(request, response){
    normaluser.GetThisMonthWaterData(request, response);
  });

Parse.Cloud.define("GetLastMonthWaterData", function(request, response){
    normaluser.GetLastMonthWaterData(request, response);
  });

Parse.Cloud.define("GetWaterData", function(request, response){
    normaluser.GetWaterData(request, response);
  });

Parse.Cloud.define("GetWaterData2", function(request, response){
    normaluser.GetWaterData2(request, response);
  });

Parse.Cloud.define("GetWaterData3", function(request, response){
    normaluser.GetWaterData3(request, response);
  });

Parse.Cloud.define("GetWaterData4", function(request, response){
    normaluser.GetWaterData4(request, response);
  });


Parse.Cloud.define("GetWaterData5", function(request, response){
    normaluser.GetWaterData5(request, response);
  });

Parse.Cloud.define("GetWaterDataForMonth", function(request, response){
    normaluser.GetWaterDataForMonth(request, response);
  });

Parse.Cloud.define("GetWaterDataForMonth2", function(request, response){
    normaluser.GetWaterDataForMonth2(request, response);
  });

Parse.Cloud.define("GetWaterDataForMonth3", function(request, response){
    normaluser.GetWaterDataForMonth3(request, response);
  });

Parse.Cloud.define("GetWaterUsageMaximumInInterval", function(request, response){
    normaluser.GetWaterUsageMaximumInInterval(request, response);
});

//Created by Madhavi Chakkilala on 07/28
Parse.Cloud.define("GetTotalWaterConsumptionForUserForDay", function (request, response) {
    normaluser.GetTotalWaterConsumptionForUserForDay(request, response);
});

//Created by Madhavi Chakkilala on 08/08
Parse.Cloud.define("GetBatteryyUsageForDay", function (request, response) {
    normaluser.GetBatteryyUsageForDay(request, response);
});

//Created by Madhavi Chakkilala on 08/16
Parse.Cloud.define("GetUserWaterConsumptionOnADay", function (request, response) {
    normaluser.GetUserWaterConsumptionOnADay(request, response);
});

//Created by Madhavi Chakkilala on 08/16
Parse.Cloud.define("GetUserWaterConsumptionDuringPeriod", function (request, response) {
    normaluser.GetUserWaterConsumptionDuringPeriod(request, response);
});

///
Parse.Cloud.define("codeSMS", function(request, response){
    run.codeSMS(request, response);
  });
/*--------------------------------------------temp.js----------------------------------------------------------*/
Parse.Cloud.define("NumberOfSignupsBetweenTwoDates", function(request, response){
    temp.NumberOfSignupsBetweenTwoDates(request, response);
  });

/********************************sensors.js------------------------------------------------------*/

Parse.Cloud.define("ShowAllNodes", function(request, response){
    sensors.ShowAllNodes(request, response);
  });

Parse.Cloud.define("SelfRMFunction", function(request, response){
    sensors.SelfRMFunction(request, response);
  });

Parse.Cloud.define("SensorRMFunction", function(request, response){
    sensors.SensorRMFunction(request, response);
  });
  
//Created by Madhavi Chakkilala on 07/21
Parse.Cloud.define("SensorRMBFunction", function (request, response) {
    sensors.SensorRMBFunction(request, response);
});

//Created by Sharath Konda on 04/25
Parse.Cloud.define("SensorRMFunctionV3", function(request, response){
    sensors.SensorRMFunctionV3(request, response);
  });


//Created by Sharath Konda on 04/24
Parse.Cloud.define("SensorRMFunctionV2", function(request, response){
    sensors.SensorRMFunctionV2(request, response);
  });
Parse.Cloud.define("GetMySensors", function(request, response){
    sensors.GetMySensors(request, response);
  });

//Created by Sharath Konda on 04/20
Parse.Cloud.define("SaveSDiagnostics", function(request, response){
    sensors.SaveSDiagnostics(request, response);
  });

//Created by Sharath Konda on 04/20
Parse.Cloud.define("SaveSGateway", function(request, response){
    sensors.SaveSGateway(request, response);
  });

Parse.Cloud.define("SaveSGateway2", function(request, response){
    sensors.SaveSGateway2(request, response);
  });

Parse.Cloud.define("SaveSGateway3", function(request, response){
    sensors.SaveSGateway3(request, response);
  });


/********************************account.js------------------------------------------------------*/

Parse.Cloud.define("AddUser", function(request, response){
    account.AddUser(request, response);
  });

Parse.Cloud.define("UpdateUser", function(request, response){
    account.UpdateUser(request, response);
  });
Parse.Cloud.define("ShowAllUsers", function(request, response){
    account.ShowAllUsers(request, response);
  });

Parse.Cloud.define("TransferAccount", function(request, response){
    account.TransferAccount(request, response);
  });

Parse.Cloud.define("LinkAnotherAccount", function(request, response){
    account.LinkAnotherAccount(request, response);
  });

Parse.Cloud.define("LinkAnotherAccount2", function(request, response){
    account.LinkAnotherAccount2(request, response);
  });
/*****************************aftersave.js*******************************************************/
 Parse.Cloud.beforeSave("SGateway", function(request,response){
    aftersave.addDiff(request,response);
  });

 /*--------------------------------------------AdminUser.js----------------------------------------------------------*/
Parse.Cloud.define("GetWaterDataForAdmin", function(request, response){
    adminuser.GetWaterDataForAdmin(request, response);
  });

Parse.Cloud.define("GetWaterDataForAdmin2", function(request, response){
    adminuser.GetWaterDataForAdmin2(request, response);
  });

Parse.Cloud.define("GetWaterDataForAdminParticularUser1", function(request, response){
    adminuser.GetWaterDataForAdminParticularUser1(request, response);
  });

Parse.Cloud.define("GetWaterDataForAdminParticularUser2", function(request, response){
    adminuser.GetWaterDataForAdminParticularUser2(request, response);
  });

//Created by Madhavi Chakkilala on 07/16
Parse.Cloud.define("GetWaterDataForUserDuringPeriod", function (request, response) {
    adminuser.GetWaterDataForUserDuringPeriod(request, response);
});

//Created by Madhavi Chakkilala on 07/14
Parse.Cloud.define("GetWaterDataForUserPerDate", function (request, response) {
    adminuser.GetWaterDataForUserPerDate(request, response);
});

//Created by Madhavi Chakkilala on 03/08
Parse.Cloud.define("GetBatteryyUsageForUserForDay", function (request, response) {
    adminuser.GetBatteryyUsageForUserForDay(request, response);
});

//Created by Madhavi Chakkilala on 04/08
Parse.Cloud.define("GetBatteryyUsageForNodeForDay", function (request, response) {
    adminuser.GetBatteryyUsageForNodeForDay(request, response);
});

//Created by Madhavi Chakkilala on 08/16
Parse.Cloud.define("GetFlatDetails", function (request, response) {
    adminuser.GetFlatDetails(request, response);
});


 /*--------------------------------------------SuperAdminUser.js----------------------------------------------------------*/
Parse.Cloud.define("GetWaterDataForSuperAdmin", function(request, response){
    superadminuser.GetWaterDataForSuperAdmin(request, response);
  });

Parse.Cloud.define("GetWaterDataForSuperAdmin2", function(request, response){
    superadminuser.GetWaterDataForSuperAdmin2(request, response);
  });

Parse.Cloud.define("GetMyCommunities", function(request, response){
    superadminuser.GetMyCommunities(request, response);
  });

Parse.Cloud.define("GetBuildingsInParticularCommunity", function(request, response){
    superadminuser.GetBuildingsInParticularCommunity(request, response);
  });

 /*--------------------------------------------test.js----------------------------------------------------------*/
Parse.Cloud.define("test1", function(request, response){
    test.test1(request, response);
  });
  Parse.Cloud.define("test2", function(request, response){
    test.test2(request, response);
  });
  
    Parse.Cloud.define("Test3", function(request, response){
    test.Test3(request, response);
  });
   Parse.Cloud.define("Test4", function(request, response){
    test.Test4(request, response);
  });
  Parse.Cloud.define("Test5", function(request, response){
    test.Test5(request, response);
  });



 /*--------------------------------------------testsave.js----------------------------------------------------------*/
Parse.Cloud.define("TestSave", function(request, response){
    testsave.TestSave(request, response);
  });
 /*--------------------------------------------helperfunctions.js----------------------------------------------------------*/
Parse.Cloud.define("GetUserList", function(request, response){
    helperfunctions.GetUserList(request, response);
  });
