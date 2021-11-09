/**
* 파일명 		: UNTOPEN02P06.js
* 업무		: 비대면 > KB 투자성향분석 안내팝업 ( e-02-06 )
* 설명		: KB 투자성향분석 안내팝업 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.27
* 수정일/내용	: 
*/
var UNTOPEN02P06 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN02P06.variable = {
	noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
UNTOPEN02P06.events = {
	 'click #btnInpropPop'								: 'UNTOPEN02P06.event.clickBtnInpropPop'
}

UNTOPEN02P06.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN02P06');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-02-06";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN02P06.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN02P06.location.pageInit = function() {
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
UNTOPEN02P06.tran.selectDetail = function() {
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 투자성향파악 시작으로 이동
UNTOPEN02P06.event.clickBtnInpropPop = function(e) {
	e.preventDefault();
	
	// 투자자 정보확인  팝업 호출
	var sParam = {};
	sParam.url = '/untact_open/UNTOPEN02P07';
	
	gfn_callPopup(sParam, function(resultData){
		
		gfn_log('UNTOPEN02P07.callback resultData :::  ');
		gfn_log(resultData);
		
		
		if(!ComUtil.isNull(resultData.result)){
			gfn_closePopup(resultData);
		}
		else{
			gfn_log("투자자 확인사항을 체크해주셔야<br>투자성향파악이 진행 가능합니다.");
			return;
		}
		
	});
	
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


UNTOPEN02P06.init();
