/**
* 파일명 		: INVPROP06S01.js (d-06-01)
* 업무		: 투자성향분석 결과
* 설명		: 투자성향분석 결과 조회
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.17
* 수정일/내용	: 
*/
var INVPROP06S01 = CommonPageObject.clone();

/* 화면내 변수  */
INVPROP06S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,initParamData	: {}						// 이전화면에서 받은 파라미터
	,showMenu		: false								//
	,screenType		: 'preference_analysis'				// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
INVPROP06S01.events = {
	 'click #btnReInvestProp'		 				: 'INVPROP06S01.event.clickBtnReInvestProp'
	,'click #btnContract'							: 'INVPROP06S01.event.clickBtnContract'
	//,'click li[id^="fundInfo_"]'					: 'INVPROP06S01.event.goFundDetail'
}

INVPROP06S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INVPROP06S01');
	
	$("#pTitle").text("투자성향분석");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-06-01";
	gfn_azureAnalytics(inputParam);
	
	INVPROP06S01.location.pageInit();
}


// 화면내 초기화 부분
INVPROP06S01.location.pageInit = function() {
    // 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("INVESTPROPParams");
	if(!ComUtil.isNull(sParams)){
		INVPROP06S01.variable.initParamData = sParams;
		 
		sParams.invest_term2 = ComUtil.string.replaceAll(sParams.invest_term, '년', '');
		sParams.section_1_invest_term = ComUtil.string.replaceAll(sParams.section_1_invest_term, '년', '');
		sParams.section_2_invest_term = ComUtil.string.replaceAll(sParams.section_2_invest_term, '년', '');
		sParams.section_3_invest_term = ComUtil.string.replaceAll(sParams.section_3_invest_term, '년', '');
		
		INVPROP06S01.variable.detailData = sParams;
	}
	else{
		gfn_alertMsgBox('투자성향 내용이 조회 되지 않았습니다. 다시 진행하도록 하겠습니다.', '', function(){
			// 투자성향 시작 화면 이동
			ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01', false);
			return;
		});
	}
	
	// 결과값으로 화면 적용
	INVPROP06S01.location.dispalyDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 투자성향분석 페이지로 이동
INVPROP06S01.event.clickBtnReInvestProp = function(e) {
	e.preventDefault();
	
	// 투자성향분석 화면으로 이동
	INVPROP06S01.variable.initParamData.reInvestPropensity = true;
	sStorage.setItem("INVESTPROPParams", INVPROP06S01.variable.initParamData);
	ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP04S01");
}


// 투자자문계약 페이지로 이동
INVPROP06S01.event.clickBtnContract = function(e) {
	e.preventDefault();
	
	if(!ComUtil.validate.check($('#f-content')))
	{
		return false;
	}
	
	// 동의여부 체크
	if(!$("input:checkbox[id='agree']").is(":checked")){
		gfn_alertMsgBox("유의사항에 동의하셔야 합니다.");
		return;
	}
	
	// 투자자문계약페이지 이동 (비대면 계좌개설)
	ComUtil.moveLink("/untact_open/UNTOPEN01S01");
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
INVPROP06S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		gfn_historyBack();
		return;
	}
	
	// 연금수령계획 상세내역 조회 
	if(sid == "adviceAcntDetailInfo"){
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 투자분석성향 결과 뿌려주기
INVPROP06S01.location.dispalyDetail = function(){
	var investInfo = INVPROP06S01.location.getInvestInfo(INVPROP06S01.variable.initParamData.invest_propensity);
	$('#divContainer').addClass(investInfo.addBoxClass);	// 박스형 클래스
	$('#' + investInfo.lineId).addClass('active');			// 투자성향 프로그래스바 표시
	
	gfn_setDetails(INVPROP06S01.variable.initParamData, $('#f-content'));
	
	if(!ComUtil.isNull(INVPROP06S01.variable.detailData.section_1_invest_term)){
		$('#divAge_1').show();
	}
	if(!ComUtil.isNull(INVPROP06S01.variable.detailData.section_2_invest_term)){
		$('#divAge_2').show();
	}
	if(!ComUtil.isNull(INVPROP06S01.variable.detailData.section_3_invest_term)){
		$('#divAge_3').show();
	}
}

// 투자성향에 맞는 정보 셋팅
INVPROP06S01.location.getInvestInfo = function(invest_propensity){
	var investInfo = {};
	
	switch(invest_propensity+''){
		case '1' : investInfo.statusText 	= "";
		           investInfo.addClass		= "";
		           investInfo.addBoxClass	= "type01";
		           investInfo.lineId		= "sr_1";
			break; 
		case '2' : investInfo.statusText 	= "";
		           investInfo.addClass		= "";
		           investInfo.addBoxClass	= "type02";
		           investInfo.lineId		= "sr_2";
			break; 
		case '3' : investInfo.statusText 	= "";
		           investInfo.addClass		= "";
		           investInfo.addBoxClass	= "type03";
		           investInfo.lineId		= "sr_3";
			break; 
		case '4' : investInfo.statusText 	= "";
		           investInfo.addClass		= "";
		           investInfo.addBoxClass	= "type04";
		           investInfo.lineId		= "sr_4";
			break; 
		case '5' : investInfo.statusText 	= "";
		           investInfo.addClass		= "";
		           investInfo.addBoxClass	= "type05";
		           investInfo.lineId		= "sr_5";
			break; 
		default	 : 
			break;
	}
	
	return investInfo;
}


INVPROP06S01.init();
