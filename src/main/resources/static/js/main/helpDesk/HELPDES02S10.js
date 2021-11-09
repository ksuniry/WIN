/**
* 파일명 		: HELPDES02S10.js
* 업무		: 메인 > 라이센스 (c-02-10)
* 설명		: 라이센스
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.21
* 수정일/내용	: 
*/
var HELPDES02S10 = CommonPageObject.clone();

/* 화면내 변수  */
HELPDES02S10.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
HELPDES02S10.events = {
	 //'click #btnQuestKakao'							: 'HELPDES02S10.event.clickBtnQuestKakao'
}

HELPDES02S10.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('HELPDES02S10');
	
	$("#pTitle").text("오픈소스 라이센스");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-10";
	gfn_azureAnalytics(inputParam);
	
	HELPDES02S10.location.pageInit();
}


// 화면내 초기화 부분
HELPDES02S10.location.pageInit = function() {
	// 간단한 이벤트 셋팅
	var osType = gfn_checkMobile();
	if('ios' == osType){
		$('#divIOS').show();
		$('#divAND').hide();
	}
	else if('android' == osType){
		$('#divIOS').hide();
		$('#divAND').show();
	}
	else{
		$('#divIOS').hide();
		$('#divAND').show();
	} 
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
HELPDES02S10.tran.selectDetail = function() {
	
	/*var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= HELPDES02S10.callBack; 
	
	gfn_Transaction( inputParam );*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 링크화면 호출
HELPDES02S10.event.clickBtnQuestKakao = function(e) {
 	e.preventDefault();

	// 카카오 호출하기 
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
HELPDES02S10.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수





HELPDES02S10.init();
