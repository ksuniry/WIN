/**
* 파일명 		: INVPROP03S01.js (D-03-01)
* 업무		: 자문계약안내
* 설명		: 자문계약안내
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.13
* 수정일/내용	: ==> 삭제된 화면
*/
var INVPROP03S01 = CommonPageObject.clone();

/* 화면내 변수  */
INVPROP03S01.variable = {
	detailData		: {}								// 조회 결과값	
	,headType		: 'dash'							// 해더영역 디자인
	,showMenu		: false								//
}

/* 이벤트 정의 */
INVPROP03S01.events = {
	'click #btnContract' 							: 'INVPROP03S01.event.clickBtnContract'
}

INVPROP03S01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INVPROP03S01');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-03-01";
	gfn_azureAnalytics(inputParam);
	
	INVPROP03S01.location.pageInit();
}


// 화면내 초기화 부분
INVPROP03S01.location.pageInit = function() {
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 투자성향분석 완료 및 투자자문계약 정보 조회한다 
INVPROP03S01.tran.selectInvestPropensity = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectInvestPropensity";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/select_invest_propensity";
	inputParam.data 	= {};
	inputParam.callback	= INVPROP03S01.callBack; 
	
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트
INVPROP03S01.event.clickBtnContract = function(e) {
	e.preventDefault();
	
	// 투자성향분석 완료 및 투자자문계약 정보 조회한다 
	INVPROP03S01.tran.selectInvestPropensity();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
INVPROP03S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자성향 조회
	if(sid == "selectInvestPropensity"){
		INVPROP03S01.variable.detailData = result;
		
		// 화면내 이동
		INVPROP03S01.location.callNextPage();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

INVPROP03S01.location.callNextPage = function(){
	var detailData = INVPROP03S01.variable.detailData;
	
	// 투자성향분석 내용 저장
	sStorage.setItem('INVESTPROPParams', detailData);
	// 0 : 미진행(직접), 1 : 진행(분석)
	if(detailData.use_analysis == '0'){
		// 투자성향 시작 화면 이동
		ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01');
	}
	else if(detailData.use_analysis == '1'){
		// 투자성향 결과 화면 이동
		ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP06S01');
	}
}


INVPROP03S01.init();
