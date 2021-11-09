/**
* 파일명 		: INVPROP04S01.js (D-04-01)
* 업무		: 투자성햔분석시작하기
* 설명		: 투자성햔분석시작하기
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.13
* 수정일/내용	: 
*/
var INVPROP04S01 = CommonPageObject.clone();

/* 화면내 변수  */
INVPROP04S01.variable = {
	showMenu		: false								//
	//,headType		: 'dash'							// 해더영역 디자인
}

/* 이벤트 정의 */
INVPROP04S01.events = {
	'click #btnInprop'								: 'INVPROP04S01.event.clickBtnInprop'
	,'click #btnGoDash'								: 'INVPROP04S01.event.clickBtnGoDash'
	
}

INVPROP04S01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INVPROP04S01');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-04-01";
	gfn_azureAnalytics(inputParam);
	
	INVPROP04S01.location.pageInit();
}


// 화면내 초기화 부분
INVPROP04S01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("INVESTPROPParams");
	if(!ComUtil.isNull(sParams)){
		INVPROP04S01.variable.detailData = sParams;
		INVPROP04S01.variable.initParamData = sParams;
		//INVPROP04S01.variable.initParamData.reInvestPropensity = sParams.reInvestPropensity; 
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 투자성향파악 시작으로 이동
INVPROP04S01.event.clickBtnInprop = function(e) {
	e.preventDefault();
	
	// 투자자 정보확인  팝업 호출
	var sParam = {};
	sParam.url = '/pension_advice/invest_propensity/INVPROP04P02';
	
	$(this).attr('diabled', true);
	
	
	gfn_callPopup(sParam, function(resultData){
		
		gfn_log('INVPROP04P02.callback resultData :::  ');
		gfn_log(resultData);
		
		if(!ComUtil.isNull(resultData)){
			if(resultData.result){
				ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP05S01');
				return;
			}
		}
		else{
			gfn_alertMsgBox("투자자 확인사항을 체크해주셔야<br>투자성향파악이 진행 가능합니다.");
			return;
		}
		
		$(this).attr('diabled', false);
	});
	
}

// 연금대시보드로 돌아가기
INVPROP04S01.event.clickBtnGoDash = function(e) {
	e.preventDefault();
	
	ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01');
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수



INVPROP04S01.init();
