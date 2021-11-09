/**
* 파일명 		: DASHBRD03P07.js (D-03-07)
* 업무		: 마이머플러플랜 3단계 >> 연금자산관리 기본정책 팝업
* 설명		: 마이머플러 연금자산관리 기본정책  팝업
* 작성자		: 배수한
* 최초 작성일자	: 2021.03.17
* 수정일/내용	: 
*/
var DASHBRD03P07 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD03P07.variable = {
		noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
		,headType		: 'popup'
}

/* 이벤트 정의 */
DASHBRD03P07.events = {
}

DASHBRD03P07.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD03P07');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-03-07";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD03P07.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD03P07.location.pageInit = function() {
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수



DASHBRD03P07.init();
