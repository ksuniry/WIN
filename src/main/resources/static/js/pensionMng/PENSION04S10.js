/**
* 파일명 		: PENSION04S10.js (c-04-10)
* 업무		: 웰컴보드 > 자산배분 > 계좌 > 자문 계좌 해지 화면
* 설명		: 계좌 자문계약해지 한다.
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.17
* 수정일/내용	: 
*/
var PENSION04S10 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION04S10.variable = {
	sendData		: {
						acnt_uid : ""			// 계좌 UID
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,headType		: 'normal'					// 해더영역 디자인    default 는 normal
	,showMenu		: false						// default : true
}

/* 이벤트 정의 */
PENSION04S10.events = {
	 'click #btnAcntEnd'	 						: 'PENSION04S10.event.clickBtnAcntEnd'
	 ,'click #btnCancel'	 						: 'PENSION04S10.event.clickBtnCancel'
	 ,'click #btnConfirm'	 						: 'PENSION04S10.event.clickBtnConfirm'
}

PENSION04S10.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION04S10');
	
	$("#pTitle").text("자문계약해지");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-04-10";
	gfn_azureAnalytics(inputParam);
	
	PENSION04S10.location.pageInit();
}


// 화면내 초기화 부분
PENSION04S10.location.pageInit = function() {
	
	var sParams = sStorage.getItem("PENSION04S10Params");
	gfn_log(sParams);
	PENSION04S10.variable.sendData.acnt_uid = sParams.acnt_uid;	// 계좌 UID
	PENSION04S10.variable.initParamData = sParams;
	//sStorage.clear();
	
	// header light
	//$('#header_' + PENSION04S10.variable.headType).addClass('light');

	// 자문 계좌 상세정보
	gfn_setDetails(PENSION04S10.variable.initParamData, $('#f-content'));
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 계좌해지
PENSION04S10.tran.updateAcntTerminate = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "acntTerminate";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/acnt_terminate";
	inputParam.data 	= PENSION04S10.variable.sendData;
	inputParam.callback	= PENSION04S10.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트


// 계좌해지 
PENSION04S10.event.clickBtnAcntEnd = function(e) {
	e.preventDefault();
	
	// confirm msg call
	$('#divConfirm').show();
}

PENSION04S10.event.clickBtnCancel = function(e) {
	e.preventDefault();
	
	// confirm msg call
	$('#divConfirm').hide();
}

PENSION04S10.event.clickBtnConfirm = function(e) {
	e.preventDefault();
	
	$('#divConfirm').hide();
	
	var inputParam = {};
	inputParam.callback = PENSION04S10.callBack.popPassword;
	inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
	gfn_callPwdPopup(inputParam);
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION04S10.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 자문계약해지				
	if(sid == "acntTerminate"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		// 이전 화면으로 이동
		gfn_alertMsgBox(ComUtil.null(result.message, '정상적으로 해지되었습니다.'), '', function(){
			gfn_historyBack();
		});
	}
}

// 비밀번호 입력후 팝업 콜백함수 
PENSION04S10.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		PENSION04S10.variable.sendData.pwd = returnParam.pwd;
		  
		// 계좌해지 요청
		PENSION04S10.tran.updateAcntTerminate();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수




PENSION04S10.init();
