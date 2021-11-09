/**
* 파일명 		: MYINFOM03S22.js
* 업무		: 메인 > 내정보 > 통합연금 가입화면2 (c-03-22)
* 설명		: 통합연금 가입화면2
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.24
* 수정일/내용	: 
*/
var MYINFOM03S22 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S22.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S22.events = {
	 'click #btnJoinPage3'					: 'MYINFOM03S22.event.clickBtnJoinPage3'
}

MYINFOM03S22.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S22');
	
	$("#pTitle").text("통합연금포털 가입하기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-22";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S22.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S22.location.pageInit = function() {

	// 통합연금포털 아이디 조회 	
	//MYINFOM03S22.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM03S22.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S22.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 회원가입 페이지로 이동
MYINFOM03S22.event.clickBtnJoinPage3 = function(e) {
 	e.preventDefault();
	
	ComUtil.moveLink('/my_info/MYINFOM03S23', true);
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S22.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세조회
	if(sid == "myPnsnList"){
		
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S22.location.displayDetail = function(){
	var detailData = MYINFOM03S22.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
}



MYINFOM03S22.init();
