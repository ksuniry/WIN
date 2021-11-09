/**
* 파일명 		: testMain.js
* 업무		: 연금관리 > 추가저축 
* 설명		: 저축 대비 연금수령액 시뷸레이션 결과를 보여준다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/
var TESTMAIN = CommonPageObject.clone();

/* 화면내 변수  */
TESTMAIN.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: {}								// 팝업에서 결과값 리턴시 사용
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
}

/* 이벤트 정의 */
TESTMAIN.events = {
	 'click #btnNext' 					: 'TESTMAIN.event.clickBtnNext'
	 ,'click #btnNext0' 				: 'TESTMAIN.event.clickBtnNext0'
	 ,'click #btnNext2' 				: 'TESTMAIN.event.clickBtnNext2'
	 ,'click #btnNext3' 				: 'TESTMAIN.event.clickBtnNext3'
	 ,'click #btnNext4' 				: 'TESTMAIN.event.clickBtnNext4'
	 ,'click #btnIndex' 				: 'TESTMAIN.event.clickBtnIndex'
	 ,'click #btnFundPdf' 				: 'TESTMAIN.event.clickBtnFundPdf'
	 ,'click #btnSetToken' 				: 'TESTMAIN.event.clickbtnSetToken'
	 ,'click #btnResetToken'			: 'TESTMAIN.event.clickbtnResetToken'
	 ,'click #btnPinPop' 				: 'TESTMAIN.event.clickBtnPinPop'
	 ,'click #btnOpenApiTestG' 			: 'TESTMAIN.event.clickBtnOpenApiTestG'
	 ,'click #btnOpenApiTestP' 			: 'TESTMAIN.event.clickBtnOpenApiTestP'
	 ,'click #btnOpenApiTest' 			: 'TESTMAIN.event.clickBtnOpenApiTest'
	 ,'click #btnOauthBankTest,#btnOauthInvestTest,#btnOauthInsuTest ' : 'TESTMAIN.event.clickBtnOauthTest'
	 ,'click #btnMydataTest' 			: 'TESTMAIN.event.clickBtnMydataTest'
}

TESTMAIN.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('TESTMAIN');
	
	$("#pTitle").text("set Token!!");
	gfn_OnLoad();
	
	
	gfn_log("location.hostname :: " +location.hostname);
	
	if(!gfn_isLocal()){
		$('.btn_box').remove();
		gfn_historyBack();
	}
	else{
		$('.btn_box').show();
	}
	
	//gfn_setTokenInit();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
TESTMAIN.tran.callOpenApi = function(uri) {
	
	
	var inputParam 		= {};
	inputParam.sid 		= "testOApi";
	inputParam.target 	= "oapi";
	inputParam.url 		= uri;
	inputParam.data 	= TESTMAIN.variable.sendData;
	inputParam.callback	= TESTMAIN.callBack; 
	
	gfn_Transaction( inputParam );
}


TESTMAIN.event.clickBtnPinPop = function() {
	var sParam = {};
	sParam.url = '/popup/CMMPINN01P01';
	sParam.title = $("#pTitle").text();
	sStorage.setItem("CMMPINN01P01Params", sParam);
	
	gfn_callPopup(sParam, function(resultData){
		if(!ComUtil.isNull(resultData)){
			if(ComUtil.isNull(resultData.result)){
				return;
			}
			
		}
		
	});
}

TESTMAIN.event.clickbtnSetToken = function(e) {
	var type = ComUtil.null($('#uid').val(), 'h').toLowerCase();
	gfn_setTokenInit(type);
	
	gfn_setUInfoInit();

	var serviceId = ComUtil.null($('#serviceId').val(), 'muffler');
    sStorage.setItem('serviceId', serviceId);
}

TESTMAIN.event.clickbtnResetToken = function() {
	gfn_resetTokenInit();
}

TESTMAIN.event.clickBtnNext = function() {
	ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01', false);
}
TESTMAIN.event.clickBtnNext0 = function() {
	ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S00', false);
}
TESTMAIN.event.clickBtnNext2 = function() {
	ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC13S01', false);
}
TESTMAIN.event.clickBtnNext3 = function() {
	ComUtil.moveLink('/pension_mng/PENSION11M01', false);
}
TESTMAIN.event.clickBtnNext4 = function() {
	gfn_openMenu();
}
TESTMAIN.event.clickBtnIndex = function() {
	ComUtil.moveLink('/index', false);
}
TESTMAIN.event.clickBtnFundPdf = function() {
	debugger;
	var url = gfn_getDownloadUrl() + "?prd_cd=K55105D50468";
		
	var inputParam = {};
	inputParam.url 			= url;
	inputParam.screenId 	= "TESTMAIN";
	inputParam.objId	 	= '11';
	inputParam.inYn		 	= "Y";
	inputParam.type		 	= "pdf";
	
	gfn_otherLinkOpen(inputParam);
}

TESTMAIN.event.clickBtnOpenApiTestG = function() {
	TESTMAIN.variable.sendData.ORG_CODE = "2";
	TESTMAIN.variable.sendData.method = $(this).data("method");
	TESTMAIN.tran.callOpenApi("/oapiSend/test/authorize");
}

TESTMAIN.event.clickBtnOpenApiTestP = function() {
	TESTMAIN.variable.sendData.ORG_CODE = "2";
	TESTMAIN.variable.sendData.method = $(this).data("method");
	TESTMAIN.tran.callOpenApi("/oapiSend/test/token");
}

TESTMAIN.event.clickBtnOpenApiTest = function() {
	TESTMAIN.variable.sendData.org_code = "2";
	TESTMAIN.variable.sendData.method = $(this).data("method");
	TESTMAIN.tran.callOpenApi("/oapiSend/test/authorizeDto");
}

TESTMAIN.event.clickBtnMydataTest = function() {
	gfn_callMyData();
}



TESTMAIN.event.clickBtnOauthTest_ajax = function() {
	var url = "";
	if(gfn_isDev()){
		url = "https://my.wealthguide.co.kr/ma/oauth/auth";  // apim 
	}
	else{
		if(gfn_isMobile){
			url = "https://my.wealthguide.co.kr/ma/oauth/auth";  // apim
		}
		else{
			url = "https://my.wealthguide.co.kr/ma/oauth/auth";  // apim
			//url = "http://localhost:8104/ma/oauth/auth";  // md-ma
		}
		//url = "http://localhost:8101/mdapi/oauth/2.0/token/001";  // md-api
	}
	debugger;
	var orgCode = $(this).data('industry') + '_001';
	
	$.ajax({
            type : 'POST',
            url : url,
            //headers : {
            //    Authorization : 'Bearer ' + sStorage.getItem('accessToken')
            //},
            contentType : 'application/x-www-form-urlencoded',
			//contentType: "application/json; charset=UTF-8",
            //Add form data
            data : JSON.stringify({orgCodeMap : orgCode}),
			beforeSend: function (xhr) {
	            xhr.setRequestHeader("Content-type","application/json");
	            xhr.setRequestHeader("Authorization", "Bearer " + gfn_readToken());
	        },
            success : function(data, textStatus) {
				debugger;
                if (data.redirect) {
		            // data.redirect contains the string URL to redirect to
		            window.location.href = data.redirect;
		        } else {
		            // data.form contains the HTML for the replacement form
		            $("#myform").replaceWith(data.form);
		        }
            },
            error : function(xhr, status, error) {
				debugger;
                // var err = eval("(" + xhr.responseText + ")");
                //console.log(err);
            }
        }); //End of Ajax
}


TESTMAIN.event.clickBtnOauthTest = function() {
	var orgCode = $(this).data('industry') + '_001';
	
	sStorage.setItem('user_ci', TESTMAIN.variable.sendData.user_ci);
	
	debugger;
	
	if(!gfn_isMobile() && gfn_isLocal()){
		var url = "";
		if(gfn_isDev()){ 
			url = "https://ma.wealthguide.co.kr:8443/ma/oauth/auth";  // apim 
		}
		else{
			//url = "http://localhost:8101/mdapi/oauth/2.0/token/001";  // md-api
			//url = "http://localhost:8104/ma/oauth/auth";  // md-ma
			url = "https://ma.wealthguide.co.kr:8443/ma/oauth/auth";  // apim 
		}
		
		
		TESTMAIN.variable.sendData.org_code = orgCode;
		TESTMAIN.variable.sendData.access_token = gfn_readToken();
		TESTMAIN.variable.sendData.state = "12312313";
		TESTMAIN.variable.sendData.user_ci = $('#user_ci').val();
	
		var newForm = $('<form></form>');
		//newForm.attr("charset", "UTF-8");
		//newForm.attr('contentType', 'application/x-www-form-urlencoded');
		newForm.attr('contentType', 'application/json;');
		newForm.attr("dataType", "json");
		newForm.attr("name", "moveApi");
		newForm.attr("method", "get");
		newForm.attr("action", url);
		//newForm.attr('enctype', 'application/json;');
		//newForm.attr("target", "_blank");
		
		//JSON.stringify(inputParam.data);
		
		
		paParam = ComUtil.null(TESTMAIN.variable.sendData, {});
		for(_paParam in paParam){
	    	newForm.append($('<input type="hidden" value="'+paParam[_paParam]+'" name="'+_paParam+'">'));
	    }
		
		newForm.appendTo('body');
		newForm.submit();
		
		/*
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, true);
	    xhttp.setRequestHeader("Content-type","application/json");
	    xhttp.setRequestHeader("Authorization", "Bearer " + gfn_readToken());
	    xhttp.send(JSON.stringify({orgCodeMap : '1'}));
		*/
		
		var now = gfn_getScreenId();
		window[now] = null;		// 이전화면 정보 삭제
	}
	else{
		var sParamData = {};
		sParamData.org_code = orgCode;
		sParamData.screenId = "TESTMAIN";
		gfn_myDataAuthScreen(sParamData);
	}

}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
TESTMAIN.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자성향 저장 
	if(sid == "testOApi"){
		debugger;
	}
}

// 네이티브 호출후 콜백함수 
TESTMAIN.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'myDataAuth'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			gfn_okMsgBox("토큰발급성공!!");
		}
		else{
			gfn_alertMsgBox("토큰발급실패!!" + result.msg);
		}
	}
}





TESTMAIN.init();
