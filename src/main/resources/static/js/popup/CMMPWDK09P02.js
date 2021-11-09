/**
* 파일명 		: CMMPWDK09P02.html ( E-09-02 )
* 업무		: KB증권 비밀번호 확인 공통팝업 
* 설명		: KB증권 비밀번호입력후 호출 화면에 결과값 전달 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.17
* 수정일/내용	: 
*/
var CMMPWDK09P02 = CommonPageObject.clone();

/* 화면내 변수  */
CMMPWDK09P02.variable = {
	sendData		: {
						'pin' : '000000'
	}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
CMMPWDK09P02.events = {
	 //'click li[id^="liPrdt"]'							: 'CMMPWDK09P02.event.clickDetailView'
	 'click #btnCheckPin'							: 'CMMPWDK09P02.event.clickbtnCheckPin'
}

CMMPWDK09P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('CMMPWDK09P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	CMMPWDK09P02.location.pageInit();
}


// 화면내 초기화 부분
CMMPWDK09P02.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("CMMPWDK09P02Params");
	if(!ComUtil.isNull(sParams)){
		sStorage.setItem("CMMPWDK09P02Params", '');
		$('#pTitle', $('#PC01-content')).text(sParams.title); 
		if(!ComUtil.isNull(sParams.pwdMsg)){
			$('#pwdMsg', $('#PC01-content')).html(sParams.pwdMsg); 
		}
	}
	
	
	{
		gfn_scrollDisable();
	}
	
	
	
	
	
	
	// keypad 셋팅 
	if(ComUtil.isNull(vKeypadAPI.url)){
		var reloadCnt = ComUtil.null(sStorage.getItem("reloadCnt"), 0);
		if(reloadCnt > 5){
			gfn_alertMsgBox('보안키패드 초기화를 하지 못했습니다.', '', function(){
				sStorage.setItem("reloadCnt", 0);
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false);
			});
			return;
		}
		sStorage.setItem("reloadCnt", reloadCnt+1);
		location.reload();
	}
	else{
		sStorage.setItem("reloadCnt", 0);
	}
	//$.getScript('https://viewapi.kbsec.com/js/plugins/kings/vKeypadAPI.js?_tm='+tm, function() { 
	var interval = setInterval(function(){
		if(ComUtil.isNull(vKeypadAPI)){
			gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
			});
		}
		else{
			vKeypadAPI.errorPage = "/untact_open/UNTOPEN01S01";
			vKeypadAPI.initVKPad({
				"onloadCallback" : function() {
					gfn_log("--onloadCallback--");
					CMMPWDK09P02.variable.bKeypad = true;
					//vKeypadAPI.imagePath = "/js/plugins/kings/images_WG/";
					//vKeypadAPI.kncGubun = "NUMBERPAD_WG";
				},
				"showCallback" : function() {
					gfn_log("--showCallback--");
					$('#divKeyPad').addClass('focus');
					$('#vkpad_acntPw').attr('style', '');
					//$('#vkpad_vkpad_acntPw_num').attr('style', 'position: fixed;');
					//$('#vkpad_vkpad_acntPw_num').attr('style', 'position: absolute;');
					$('#vkpad_vkpad_acntPw_num').addClass('index09');
					$('#vkpad_vkpad_acntPw_num').css('top', 'auto');
					$('#vkpad_vkpad_acntPw_num').css('bottom', '0');
				},
				"hideCallback" : function() {
					gfn_log("--hideCallback--");
				},
				"doneCallback" : function(data) {
					
					var dataObj = (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody;
					
					gfn_log(dataObj);
					for(_key in dataObj){
						gfn_log("key :: " + _key);
						//_key = ComUtil.string.replaceAll(_key, "vkpad_", "");
						if($("#"+_key).val().length < 4){
							gfn_alertMsgBox("비밀번호 4자리를 입력해 주세요");
							return;
						}
						
						var newPwd 	= dataObj[_key];
						
						if(!ComUtil.isNull(newPwd)){
							var resultData = {};
							resultData.pwd = newPwd;
							gfn_closePopup(resultData);
						}
					}
				}
			});
		}
	
		clearInterval(interval);
    }, 300);
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

CMMPWDK09P02.event.clickbtnCheckPin = function(e) {
 	e.preventDefault();

	var pin = ComUtil.null($('#pin').val(), '');
	if(pin.length != 6){
		gfn_alertMsgBox("핀번호 6자리를 입력해 주세요");
		return;
	}
	
	CMMPWDK09P02.variable.sendData.pin = JsEncrptObject.encrypt(SHA256(pin));
	CMMPWDK09P02.tran.selectDetail();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
CMMPWDK09P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserPinInfo";
	inputParam.target 	= "auth";
	inputParam.url 		= "/cert/select_user_pin_info";
	inputParam.data 	= CMMPWDK09P02.variable.sendData;
	inputParam.callback	= CMMPWDK09P02.callBack;
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

CMMPWDK09P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "selectUserPinInfo"){
		
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			$('#pin').val('');
			return;
		}
		
		var resultData = {};
		resultData.result = true;
		gfn_closePopup(resultData);
	}
}

CMMPWDK09P02.callBack.pinComplate = function(resultData){
	gfn_log("pinComplate!!");
	var pin = ComUtil.null($('#pin').val(), '');
	
	if(pin.length != 6){
		gfn_alertMsgBox("핀번호 6자리를 입력해 주세요");
		return;
	}
	
	CMMPWDK09P02.variable.sendData.pin = JsEncrptObject.encrypt(SHA256(pin));
	CMMPWDK09P02.tran.selectDetail();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


CMMPWDK09P02.init();
