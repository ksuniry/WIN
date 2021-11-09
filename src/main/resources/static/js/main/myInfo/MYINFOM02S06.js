/**
* 파일명 		: MYINFOM02S06.js
* 업무		: 메인 > 내정보 > 설정 (c-02-06)
* 설명		: 설정
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.20
* 수정일/내용	: 
*/
var MYINFOM02S06 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM02S06.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM02S06.events = {
	 'click a[name^="movePage"]'			: 'MYINFOM02S06.event.clickMovePage'
	 //'click div[id^="rowCntrt_"]'			: 'MYINFOM02S06.event.clickDetailCntrt'
}

MYINFOM02S06.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM02S06');
	
	$("#pTitle").text("설정");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-06";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM02S06.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM02S06.location.pageInit = function() {
	
	// 연금관리 메인 상세내역 조회 	
	//MYINFOM02S06.tran.selectDetail();
	
	
	// 앱 버전정보 조회
	gfn_getAppVersion({});
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM02S06.tran.selectDetail = function() {
	
	/*var inputParam 		= {};
	inputParam.sid 		= "customerContractList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S06.callBack; 
	
	gfn_Transaction( inputParam );*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트


// detail 링크화면 호출
MYINFOM02S06.event.clickMovePage = function(e){
	e.preventDefault();
	
	var link = $(this).data('link');
	var url = "";
	
	switch(link){
		case 'termsAgree' :
			url = '/my_info/MYINFOM03S07';
			break;
		default :
			return;
			break; 
	}
	
	ComUtil.moveLink(url);
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
MYINFOM02S06.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	/*
	if(sid == "customerContractList"){
		MYINFOM02S06.variable.detailData = result;
		
		// 
		MYINFOM02S06.location.displayDetail();
				
	}*/
}

// 네이티브 호출후 콜백함수 
MYINFOM02S06.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 앱버전 정보조회 
	if(key == 'versionInfo'){
		$('#version').html(ComUtil.null(result.version, '1.0.0'));
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM02S06.location.displayDetail = function(){
	var detailData = MYINFOM02S06.variable.detailData;
}	





MYINFOM02S06.init();
