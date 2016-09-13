/*
Input-> json objects->InputList{Array}
then Array of jsons following 
row1{int},row2{int}
Output->Whole Object rows
*/

exports.TestSave = function(request, response){

  var InputList = request.params.InputList;
  var Test = Parse.Object.extend("Test");
  var inputs = [];
    for (var i = InputList.length - 1; i >= 0; i--) {  
  var test = new Test();
  var row1 = InputList[i].row1;
  var row2  = InputList[i].row2;
  test.set("Row1",row1);
  test.set("Row2",row2);
  inputs.push(test);
 }
  Parse.Object.saveAll(inputs).then(function(Results){
    response.success(Results);
  }, function(error){
    response.error(error.code + ": " + error.message);
  });
}
