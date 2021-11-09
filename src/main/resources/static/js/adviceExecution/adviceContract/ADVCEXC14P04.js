/**
* 파일명 		: ADVCEXC14P04.js ( e-14-04 )
* 업무		: 자문실행 > 계좌이전신청  유의사항
* 설명		: 유의사항
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.29
* 수정일/내용	: 
*/
var ADVCEXC14P04 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC14P04.variable = {
	noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
ADVCEXC14P04.events = {
	 //'click li[id^="liPrdt"]'							: 'ADVCEXC14P04.event.clickDetailView'
	 'click #btnClosePop'								: 'ADVCEXC14P04.event.clickBtnClosePop'
}

ADVCEXC14P04.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC14P04');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-14-04";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC14P04.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC14P04.location.pageInit = function() {
	debugger;
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
ADVCEXC14P04.tran.selectDetail = function() {
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
ADVCEXC14P04.event.clickBtnClosePop = function(e) {
	gfn_closePopup('ok');
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


ADVCEXC14P04.init();
