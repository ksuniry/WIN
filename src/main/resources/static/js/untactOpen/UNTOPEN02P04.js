/**
* 파일명 		: UNTOPEN02P04.js ( e-02-04 )
* 업무		: 비대면계좌개설 > 오류팝업 (영업시간 오버) 
* 설명		: 오류팝업 (영업시간 오버) 
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN02P04 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN02P04.variable = {
	noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
UNTOPEN02P04.events = {
	 //'click li[id^="liPrdt"]'							: 'UNTOPEN02P04.event.clickDetailView'
}

UNTOPEN02P04.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN02P04');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-02-04";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN02P04.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN02P04.location.pageInit = function() {
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
UNTOPEN02P04.tran.selectDetail = function() {
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


UNTOPEN02P04.init();
