/**
* 파일명 		: MYINFOM03S25.js
* 업무		: 메인 > 내정보 > 통합포털회원가입 완료 (c-03-25)
* 설명		: 통합포털회원가입 입력
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.13
* 수정일/내용	: 
*/
var MYINFOM03S25 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S25.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,sidoData		: {}									// 통합연금포털 전용 시도 코드
	,gunguData		: {}									// 통합연금포털 전용 시군구 코드
}
/* 이벤트 정의 */
MYINFOM03S25.events = {
	 'click #btnMove'						: 'MYINFOM03S25.event.clickBtnMove'
	 ,'change #addressSido'					: 'MYINFOM03S25.event.changeSido'
}

MYINFOM03S25.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S25');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-25";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S25.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S25.location.pageInit = function() {

	// 통합연금포털 아이디 조회 	
	//MYINFOM03S25.tran.selectDetail();
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM03S25.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S25.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 연결하기 페이지로 이동
MYINFOM03S25.event.clickBtnMove = function(e) {
 	e.preventDefault();
	ComUtil.moveLink('/my_info/MYINFOM03S20'); // 상세 화면이동
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S25.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	/*// 상세조회
	if(sid == "myPnsnList"){
		
	}*/
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S25.location.displayDetail = function(){
	var detailData = MYINFOM03S25.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
}



MYINFOM03S25.init();
