/**
* 파일명 		: PENSEXE02S02.js
* 업무		: 거래 (연금실행)> 주요내용확인 (t-02-02)
* 설명		: 머플러 자문안
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.12
* 수정일/내용	: 
*/
var PENSEXE02S02 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE02S02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
PENSEXE02S02.events = {
	 'change #ckOk'											: 'PENSEXE02S02.event.changeCkOk'
	,'click #btnNext'										: 'PENSEXE02S02.event.clickBtnNext'
	,'click #btnErrorClase'									: 'PENSEXE02S02.event.clickBtnErrorClase'
}

PENSEXE02S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE02S02');
	
	$("#pTitle").text("펀드매수 한 번에 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-02-02";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE02S02.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE02S02.location.pageInit = function() {
	var detailData = sStorage.getItem("PENSEXEDATA");
	
	if(ComUtil.isNull(detailData)){
		// noData how to??  	
		
	} 
	else{
		PENSEXE02S02.variable.detailData = detailData;
	}
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSEXE02S02.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "portfolioAccountList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/portfolio_account_list";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE02S02.callBack; 
	
	gfn_Transaction( inputParam );*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 주요내용체크박스 클릭시
PENSEXE02S02.event.changeCkOk = function(e) {
 	e.preventDefault();

	if($(this).is(':checked')){
		PENSEXE02S02.variable.detailData.import_content_check_yn = 'Y';
	}
	else{
		PENSEXE02S02.variable.detailData.import_content_check_yn = 'N';
	}
}


// 다음 버튼 클릭시
PENSEXE02S02.event.clickBtnNext = function(e) {
 	e.preventDefault();
	// 주요확인 내용 체크
	if($('input:checkbox[id="ckOk"]').is(':checked') == false){
		$('#divError').show();
		return;
	}
	
	sStorage.setItem("PENSEXEDATA", PENSEXE02S02.variable.detailData);
	ComUtil.moveLink('/pension_execution/PENSEXE03S01');	// 자산배분승인 화면으로 이동
}

// 에러확인 버튼 클릭시
PENSEXE02S02.event.clickBtnErrorClase = function(e) {
 	e.preventDefault();
	
	$('#divError').hide();
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSEXE02S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	/*if(sid == "portfolioAccountList"){
		PENSEXE02S02.variable.detailData = result;
		sStorage.setItem("PENSEXEDATA", result);
	}*/
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅




PENSEXE02S02.init();
