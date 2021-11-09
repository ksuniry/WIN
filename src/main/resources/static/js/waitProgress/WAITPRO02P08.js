/**
* 파일명 		: WAITPRO02P08.js (W-02-08)
* 업무		: 연금대기 > 입금대기 > 납입한도 조정안내 팝업 
* 설명		: 납입한도 조정안내 
* 작성자		: 배수한
* 최초 작성일자	: 2021.06.09
* 수정일/내용	: 
*/
var WAITPRO02P08 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO02P08.variable = {
	noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
WAITPRO02P08.events = {
	 //'click li[id^="liPrdt"]'							: 'WAITPRO02P08.event.clickDetailView'
}

WAITPRO02P08.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO02P08');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-08";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO02P08.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO02P08.location.pageInit = function() {
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
WAITPRO02P08.tran.selectDetail = function() {
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


WAITPRO02P08.init();
