/**
* 파일명 		: DASHBRD01S00.js
* 업무		: 연금데이터 연결화면       d-01-01
* 설명		: 연금데이터 연결화면
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.24
* 수정일/내용	: 
*/
var DASHBRD01S00 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD01S00.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chart 			: {}								// 차트 변수값 저장소
	//,noHead			: true							// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'dash'							// 해더영역 디자인
}

/* 이벤트 정의 */
DASHBRD01S00.events = {
	 'click #btnNext'		 						: 'DASHBRD01S00.event.clickBtnNext'
}

DASHBRD01S00.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD01S00');
	
	//$("#pTitle").text("투자성향분석");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-01-01";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD01S00.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD01S00.location.pageInit = function() {
	var sParams = sStorage.getItem("DASHBRD01S00Params");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		DASHBRD01S00.variable.initParamData = sParams;
		DASHBRD01S00.variable.detailData = sParams;
	}
	//sStorage.setItem('homeUrl', location.pathname);
	//sStorage.clear();
	
	DASHBRD01S00.location.displayDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD01S00.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPension";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/my_pension";
	//inputParam.url 		= "/pension/my_pension";
	inputParam.data 	= DASHBRD01S00.variable.sendData;
	inputParam.callback	= DASHBRD01S00.callBack; 
	
	gfn_Transaction( inputParam );*/
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
DASHBRD01S00.event.clickBtnNext = function() {
	// 메뉴 > 내정보 > 연금포털 연결하기 로그인 화면
	gfn_movePageLifePlanFirst();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD01S00.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자성향 저장 
	if(sid == "myPension"){
		if(ComUtil.isNull(result.user_nm)){
			gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
			return;
		}
		
		// 알람조회
		gfn_reloadAlarm();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 화면 셋팅
DASHBRD01S00.location.displayDetail = function(){
	var detailData = DASHBRD01S00.variable.detailData;
	
	DASHBRD01S00.variable.detailData.user_nm = gfn_getUserInfo('userNm');
	DASHBRD01S00.variable.detailData.use_prd = gfn_getUserInfo('usePrd', false);
	
	gfn_setDetails(DASHBRD01S00.variable.detailData, $('#f-content'));
	
	// 통합연금 가입이 필요한 경우
	//if(ComUtil.null(detailData.data_sync_term, "0") == "0" || ComUtil.null(detailData.data_sync_term, "0") == '-1'){
	if(ComUtil.null(detailData.data_sync_yn, "N") == "N"){
		$('div[id^="divResult1"]').show();
		$('div[id^="divResult2"]').hide();
	}
	// 통합연금 가입 대기중인 경우
	else{
		$('div[id^="divResult1"]').hide();
		$('div[id^="divResult2"]').show();
		
	}
}




DASHBRD01S00.init();
