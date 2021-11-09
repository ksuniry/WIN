/**
* 파일명 		: UNTOPEN07P02.js ( e-07-02 )
* 업무		: 비대면계좌개설 > 오류팝업 (한도조정안내) 
* 설명		: 오류팝업 (한도조정안내)
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.11
* 수정일/내용	: 
*/
var UNTOPEN07P02 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN07P02.variable = {
	detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
UNTOPEN07P02.events = {
	 //'click li[id^="liPrdt"]'							: 'UNTOPEN07P02.event.clickDetailView'
}

UNTOPEN07P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN07P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-07-02";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN07P02.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN07P02.location.pageInit = function() {
	var sParams = sStorage.getItem("UNTOPENParams");
	if(!ComUtil.isNull(sParams)){
		UNTOPEN07P02.variable.initParamData = sParams;
		UNTOPEN07P02.variable.detailData = sParams;
	//	sStorage.clear();
	
		$('#' + sParams.msgType).show();
		gfn_setDetails(UNTOPEN07P02.variable.detailData, $('#P02-content'));
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
UNTOPEN07P02.tran.selectDetail = function() {
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


UNTOPEN07P02.init();
