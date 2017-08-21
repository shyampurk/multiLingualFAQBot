$(document).ready(function () {

// Initializing Variables

	var PublishChannel = 'faqbot_req_resp',
		SubscribeChannel = 'faqbot_req_resp',
	    
	    faqList = $('#faq-list'),
	    languageList = $('#language-list'),
	    inputQuestionSubmit = $("#inputQuestionSubmit"),
	    documentList = $("#document-list"),
	    queryResultList = $("#queryResultList"),
	    queryAsked = $("#queryAsked"),
	    loading = $("#loading"),

	    pub_key = 'pub-c-6fb88cac-23f3-4e4c-b653-fbb367989a80',
	    sub_key = 'sub-c-42edd51c-7c05-11e7-9d24-02ee2ddab7fe';


// Init pubnub with keys
	var pubnub = new PubNub({
	    subscribeKey: sub_key,
	    publishKey: pub_key,
	    ssl: true
	})

// Subscribes and Listens to the retrieve and rank query messages

	pubnub.subscribe({
		channels: [SubscribeChannel],
	})

	pubnub.addListener({
	    message: function(m) {
	        console.log(m.message)
	        var msg = m.message;
	        if(msg.messagecode == '0' && msg.messagetype == "resp") {
	        	updateManualList(msg.userManual)
	        }else if(msg.messagecode == '1' && msg.messagetype == "resp") {
	        	console.log(msg.ltApiResp)
	        	queryAsked.text("Search Query : "+msg.userQuery);
				updateQueryAnswer(msg.ltApiResp)
	        }else if(msg.messagecode == '1' && msg.messagetype == "err"){
	        	alert("Error : "+msg.errHandler.errType)
	        }
	    }
	})

	var queryManualList = {
        					"messagecode":"0",
        					"messagetype":"req",
        					"command":"query-list"
        				}
    console.log(queryManualList)
	pub_publish(queryManualList);


// Trigger click event on Enter Keypress 
	inputQuestionSubmit.keypress(function (e) {
	 	var key = e.which;
	 	if(key == 13){
	    	inputQuestionSubmit.click();
	    	return false;  
	  	}
	});


/******************************************************************
    Function    : Input Query message
    Channel     : 'faqbot_req_resp'
    Description : Publishes the user query data to pubnub block
*******************************************************************/
	inputQuestionSubmit.click(function (event) {
		loading.text("Querying Results ... ");
		queryAsked.text("Search Query : "+faqList.val());
		queryResultList.empty();
        var queryMessage = {
        					"messagecode":"1",
        					"messagetype":"req",
        					"command":"query-req",
        					"manual":documentList.val(),
        					"userQuery":faqList.val(),
        					"targetLanguage":languageList.val()
        				}
        console.log(queryMessage)
        console.log(faqList.val(),documentList.val(),languageList.val())
        if(faqList.val() == "" && documentList.val() == "" && languageList.val() == ""){
        	alert("Invalid Input Value or Empty ")
        }else{
        	pub_publish(queryMessage);
        }
    });

/******************************************************************
    Function    : pub_publish()
    Channel     : 'faqbot_req_resp'
    Description : Publishes the user query to R&R Watson Service
*******************************************************************/
	function pub_publish(pub_msg){
		pubnub.publish({
		        message: pub_msg,
		        channel: PublishChannel,
		        sendByPost: false, // true to send via post
		        storeInHistory: true, //override default storage options
		    },
		    function (status, response) {
		    	// console.log(response)
		        // handle status, response
		    }
		);
	};

/***************************************************************************
    Function    : updateManualList()
    Parameters  : 'userManual' - list from solr collection
    Description : Fetches the usermanual list from block and displays in UI
****************************************************************************/
	function updateManualList(userManual){
	   	console.log(userManual)

	   	if (userManual.model.length != 0) {
			document.getElementById("document-list").innerHTML = "<option>"+userManual.model+"</option>";
		}
		if (userManual.defaultUserQuery.length != 0) {
			var catOptions = "";
			for (var i = 0; i < userManual.defaultUserQuery.length; i++) {
				catOptions += "<option>" + userManual.defaultUserQuery[i] + "</option>";
			};
			document.getElementById("faq-list").innerHTML = catOptions;
		}
	};

/***********************************************************************************
    Function    : updateQueryAnswer()
    Parameters  : 'ltApiResp' - QueryAnswer list from R&R service
    Description : Fetches the Query Answer list from R&R Service and displays in UI
************************************************************************************/
	function updateQueryAnswer(ltApiResp){
	    loading.empty();		
		console.log(ltApiResp)
		if("error_code" in ltApiResp){
			alert("Error : "+ltApiResp.error_message)
		}else{
			for (var i = 0; i < ltApiResp.translations.length; i+=2) {
				console.log(ltApiResp.translations.length)
				
				var userData = {
						QueryTitle : ltApiResp.translations[i].translation.replace(/["[\]]+/g,''),
						QueryAnswer : ltApiResp.translations[i+1].translation.replace(/["[\]]+/g,'')
				}	
				var userTemplate = [   '<div id="mainContainer" class="col-sm-10 col-md-10 col-lg-10 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">',
			                                '<fieldset class="majorpoints">',
			                                '<legend class="majorpointslegend">{{QueryTitle}}</legend>',
			                                '<div id="ansContainer" class="hiders" style="display:none">',
			                                    '<div class="media-body" >',
			                                        '<small class="text-muted" >{{QueryAnswer}}</small>',
			                                    '</div>',
			                                '</div>',
			                                '</br>',
			                            '</div>',
			                            '</br>'].join("\n");
				
					var userQueryResultList = Mustache.render(userTemplate, userData);
				queryResultList.append(userQueryResultList);
			};
			// Expand and close the Query Answer Div 
			$('.majorpoints').click(function(){
			    $(this).find('.hiders').toggle();
			});
		}
	};

});