
/*
Function to send OTP
  Input =>
    msg: String
    number: String 
  Output =>
    httpResponse: Parse.Promise
  Procedure =>
    Sending a HTTPRequest to smsgupshup API
*/
exports.codeSMS = function(request){
  var msg = request.msg;
  var number = request.number;
  return Parse.Cloud.httpRequest({
    url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      method: 'sendMessage',
      send_to: number,
      msg: msg,
      msg_type: 'Text',
      userid: '2000155089',
      auth_scheme: 'plain',
      password: '1YLI8Bfoj',
      v: '1.1',
      format: 'text'
//      mask: 'myKnit'
    }
  }).then(function(httpResponse){
    return Parse.Promise.as(httpResponse.text);
  }, function(httpResponse){
    var error = {
      "code": httpResponse.data.code,
      "message": httpResponse.data.error
    };
    return Parse.Promise.error(error);
  });
}