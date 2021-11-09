/**
* 파일명 		: DASHBRD03P06.html (D-03-06) D-08-04
* 업무		: 마이머플러플랜 2단계 >> 기대수익률 위함산출기준 팝업
* 설명		: 기대수익률 위함산출기준 팝업
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.21
* 수정일/내용	: 
*/
var DASHBRD03P06 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD03P06.variable = {
		noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
		,headType		: 'popup'
}

/* 이벤트 정의 */
DASHBRD03P06.events = {
}

DASHBRD03P06.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD03P06');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-03-06";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD03P06.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD03P06.location.pageInit = function() {
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수



DASHBRD03P06.init();
