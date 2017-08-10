export default (request) => { 
    // Required modules
    const db = require('kvstore'); // Database module
    const xhr = require('xhr'); // xmlHTTP request module
    const basicAuth = require('codec/auth');

    var rrUsername = 'f851cbdf-69a3-4d97-86f6-e79f6fab1bf9';
    var rrPassword = 'p3lF7i2rwbwC';
    var ltUsername = 'de85999c-dc25-41f7-afad-ed6abb9fe264';
    var ltPassword = '0lUPliTKkHgV';
    
    var clusterID = 'sc72dd28f2_faec_449e_87c6_45467d94fcb0';
    var solrCollection = 'EOS550D';
    
    var userQuery = request.message.userQuery
    var targetLanguage = request.message.targetLanguage

    var rrAuth = basicAuth.basic(rrUsername,rrPassword);
    var ltAuth = basicAuth.basic(ltUsername,ltPassword);

    var kvstoreCameraList = "cameraManualList";
    var cameraListData = {  "collectionName":"EOS550D",
                            "model":"Cannon EOS 550D",
                            "defaultUserQuery":[
                                "Introduction to eos550d",
                                "how to connect camera to a printer?",
                                "how do i clean the sensor?",
                                "LCD monitor precautions?",
                                "explain about automatic self-cleaning sensor"]
                        };

    var ltUrl = 'https://watson-api-explorer.mybluemix.net/language-translator/api/v2/translate'
    var rrUrl = 'https://watson-api-explorer.mybluemix.net/retrieve-and-rank/api/v1/solr_clusters/'+clusterID+'/solr/'+solrCollection+'/select';
     // http options for the rest call.
    const rr_http_options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":rrAuth
        },
        "body":"q="+userQuery+"&wt=json&fl=title,body"
    }; 

    function dbget()
    {
          return db.get(kvstoreCameraList).then((database_value)=>{
            console.log(database_value);
                if(database_value){
                    request.userManual = database_value;     
                }
                else{
                    request.userManual = null;   
                }
            
            return request;
        });
    } 

    function lengthInUtf8Bytes(str) {
        var m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
    } 

    // Checking for operation selected in the UI
    // 0 - Query for camera manual list from kv store
    if(request.message.messagecode === "0"){
        console.log("In message code 0 - fetch manual list");
        // db.set(kvstoreCameraList,cameraListData);

        return dbget().then((x)=>{
            request.message.userManual = x.userManual;
            request.message.messagetype = "resp";
            return request;
        });
    }
    // Checking for operation selected in the UI
    // 1 - Query for user questions from the camera manual 
    else if(request.message.messagecode === "1"){
        console.log("In message code 1 - answer query");

        return xhr.fetch(rrUrl, rr_http_options).then((x) => {
            var rr_resp = JSON.parse(x.body);
            var inputLanguageText = [];
            var inputEnglishLanguageText = [];

            if (request.message.targetLanguage == "en") {
                for (var i = 0; i < rr_resp.response.docs.length; i++) {
                    inputEnglishLanguageText.push({"translation":rr_resp.response.docs[i].title})
                    inputEnglishLanguageText.push({"translation":rr_resp.response.docs[i].body})
                    if(i > 2){
                        break;
                    }
                }
                var en_resp = {"translations":inputEnglishLanguageText};
                console.log(en_resp)
                var respSize = lengthInUtf8Bytes(JSON.stringify(en_resp))
                if(respSize == 31000){
                    console.log("resp size :",respSize)
                    var errResp = {"errType":"Exceeded 32K message size Limitation"}
                    request.message.messagetype = "err";
                    request.message.errHandler = errResp;
                    inputEnglishLanguageText = [];
                    return request;
                }else{
                    request.message.ltApiResp = en_resp;
                    request.message.messagetype = "resp";
                    inputEnglishLanguageText = [];
                    return request;
                }
            }else{
                for (var j = 0; j < rr_resp.response.docs.length; j++) {
                    inputLanguageText.push(JSON.stringify(rr_resp.response.docs[j].title))
                    inputLanguageText.push(JSON.stringify(rr_resp.response.docs[j].body))
                    if(j > 2){
                        break;
                    }
                }

                var lt_http_options = {
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization":ltAuth
                        },
                        "body":{
                            "source":"en",
                            "target":targetLanguage,
                            "text":inputLanguageText
                        }
                    };
                return xhr.fetch(ltUrl, lt_http_options).then((y) => {
                    var ltResp = JSON.parse(y.body)
                    console.log(ltResp)
                    var respSize = lengthInUtf8Bytes(JSON.stringify(ltResp))
                    if(respSize == 31000){
                        console.log("resp size :",respSize)
                        var errResp = {"errType":"Exceeded 32K message size Limitation"}
                        request.message.messagetype = "err";
                        request.message.errHandler = errResp;
                        inputLanguageText = [];
                        return request;
                    }else{
                        request.message.ltApiResp = ltResp;
                        request.message.messagetype = "resp";
                        inputLanguageText = [];
                        return request;
                    }
                    
                });
            }
        });
    }
    return request.ok();
};