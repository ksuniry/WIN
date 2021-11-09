/**
* 파일명 		: CMMPINN01P01.html 
* 업무		: 깃플상탐 공통팝업 
* 설명		: 깃플상탐 호출
* 작성자		: 배수한
* 최초 작성일자	: 2021.06.09
* 수정일/내용	: 
*/
var CMMPINN01P01 = CommonPageObject.clone();

/* 화면내 변수  */
CMMPINN01P01.variable = {
	sendData		: {
						'pin' : '000000'
	}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
CMMPINN01P01.events = {
	 //'click li[id^="liPrdt"]'							: 'CMMPINN01P01.event.clickDetailView'
	 'click #btnCheckPin'							: 'CMMPINN01P01.event.clickbtnCheckPin'
}

CMMPINN01P01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('CMMPINN01P01');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	CMMPINN01P01.location.pageInit();
}


// 화면내 초기화 부분
CMMPINN01P01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("CMMPINN01P01Params");
	if(!ComUtil.isNull(sParams)){
		sStorage.setItem("CMMPINN01P01Params", '');
		//$('#pTitle', $('#PC01-content')).text(sParams.title); 
		$('#pTitle', $('#PC01-content')).html(sParams.title); 
	}
	
	//CMMPINN01P01.tran.selectDetail();
	// 네이티브 키패드 호출 
	$('#pin_keypad').trigger("click");
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

CMMPINN01P01.event.clickbtnCheckPin = function(e) {
 	e.preventDefault();

	var pin = ComUtil.null($('#pin').val(), '');
	if(pin.length != 6){
		gfn_alertMsgBox("핀번호 6자리를 입력해 주세요");
		return;
	}
	
	CMMPINN01P01.variable.sendData.pin = JsEncrptObject.encrypt(SHA256(pin));
	CMMPINN01P01.tran.selectDetail();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 사용자 핀번호 조회 
CMMPINN01P01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserPinInfo";
	inputParam.target 	= "auth";
	inputParam.url 		= "/cert/select_user_pin_info";
	inputParam.data 	= CMMPINN01P01.variable.sendData;
	inputParam.callback	= CMMPINN01P01.callBack;
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

CMMPINN01P01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "selectUserPinInfo"){
		gfn_log("callBack selectUserPinInfo");
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			$('#pin').val('');
			return;
		}
		
		var resultData = {};
		resultData.result = true;
		resultData.pin = CMMPINN01P01.variable.sendData.pin;
		gfn_log("CMMPINN01P01   gfn_closePopup!!!!!" + sStorage.getItem("gCurPopupId"));
		gfn_closePopup(resultData);
	}
}


// 네이티브 호출후 콜백함수 
/*CMMPINN01P01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 키보드 입력 호출시 
	if(key == 'keyPad'){
		alert(111);
	}
}*/

CMMPINN01P01.callBack.pinComplate = function(resultData){
	gfn_log("pinComplate!!");
	var pin = ComUtil.null($('#pin').val(), '');
	
	if(pin.length != 6){
		gfn_alertMsgBox("핀번호 6자리를 입력해 주세요");
		return;
	}
	
	CMMPINN01P01.variable.sendData.pin = JsEncrptObject.encrypt(SHA256(pin));
	CMMPINN01P01.tran.selectDetail();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


CMMPINN01P01.init();
