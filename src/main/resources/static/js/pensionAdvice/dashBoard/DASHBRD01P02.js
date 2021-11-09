/**
* 파일명 		: DASHBRD01P02.html (D-01-02)
* 업무		: 연금자문 대시보드 > 로딩창
* 설명		: 로딩창
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var DASHBRD01P02 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD01P02.variable = {
		noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
		,headType		: 'popup'
}

/* 이벤트 정의 */
DASHBRD01P02.events = {
}

DASHBRD01P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD01P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-01-02";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD01P02.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD01P02.location.pageInit = function() {
	// 3초후 닫침
	$('.current').removeClass('blocker');
	var interval = setInterval(function(){
        gfn_closePopup();
		clearInterval(interval);
    }, 4000);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수



DASHBRD01P02.init();
