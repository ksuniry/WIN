/**
* 파일명 		: INVPROP04P02.js
* 업무		: 투자자성향분석 > 투자자 정보확인 화면 (d-04-02)
* 설명		: 투자자 정보확인 팝업
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.27
* 수정일/내용	: 
*/
var INVPROP04P02 = CommonPageObject.clone();

/* 화면내 변수  */
INVPROP04P02.variable = {
	sendData		: {
						recommend_invest : 'Y'					// 투자권유 희망여부
						,provide_investor_info : 'Y'			// 투자자정보 제공 여부
	}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
INVPROP04P02.events = {
	'click #btnConfirm'									: 'INVPROP04P02.event.clickBtnConfirm'	// 확인
	,'change input:checkbox[id="chAnswer1"]'			: 'INVPROP04P02.event.changeAnswer1'	// 투자권유 희망여부
	,'change input:checkbox[id="chAnswer2"]'			: 'INVPROP04P02.event.changeAnswer2'	// 투자자정보 제공 여부
	,'click #btnPopCancel'								: 'INVPROP04P02.event.clickBtnPopCancel'	// 서비스 다음에 받기
	,'click #btnPopOk'									: 'INVPROP04P02.event.clickBtnPopOk'		// 제공하고 서비스 받기
}

INVPROP04P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INVPROP04P02');
	
	//$("#pTitle").text("매수완료");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-04-02";
	gfn_azureAnalytics(inputParam);
	
	
	INVPROP04P02.location.pageInit();
}


// 화면내 초기화 부분
INVPROP04P02.location.pageInit = function() {
	{
		$('.modal-page-btn button, .dim').on("click",INVPROP04P02.location.modalClose);
	}
	
	// 상세조회 
	INVPROP04P02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 투자자정보 조회 
INVPROP04P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectInvestorInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/select_investor_info";
	inputParam.data 	= INVPROP04P02.variable.sendData;
	inputParam.callback	= INVPROP04P02.callBack;
	
	gfn_Transaction( inputParam );
}

// 투자자 정보확인 항목 저장하기 
INVPROP04P02.tran.updateInvestorInfo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateInvestorInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/update_investor_info";
	inputParam.data 	= INVPROP04P02.variable.sendData;
	inputParam.callback	= INVPROP04P02.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 확인 버튼 클릭시
INVPROP04P02.event.clickBtnConfirm = function(e) {
 	e.preventDefault();	
	
	// 둘중 하나만 물어보자.
	
	// 투자자정보 제공 여부
	if(INVPROP04P02.variable.sendData.provide_investor_info == 'N'){
		gfn_confirmMsgBox("투자자정보 제공을 희망하지 않으시면 자문서비스를 진행할수 없습니다.<br>그래도 진행하시겠습니까?", '', function(returnData){
			if(returnData.result == 'N'){
				return;
			}
		});
	}
	

	// 투자자 정보확인 항목 저장하기 
	INVPROP04P02.tran.updateInvestorInfo();
}

// 투자권유 희망여부 클릭시
INVPROP04P02.event.changeAnswer1 = function(e) {
 	e.preventDefault();
	INVPROP04P02.variable.sendData.recommend_invest = $('input:checkbox[id="chAnswer1"]').is(':checked') ? 'N' : 'Y';
	
	// 투자권유 희망여부
	if(INVPROP04P02.variable.sendData.recommend_invest == 'N'){
		$('#popDivD0402').show();
	}
	
	if(INVPROP04P02.variable.sendData.recommend_invest == 'Y' && INVPROP04P02.variable.sendData.provide_investor_info == 'Y'){
		$('#btnConfirm').attr('disabled', false);
	}
	else{
		$('#btnConfirm').attr('disabled', true);
	}
}

// 투자정보제공 여부 클릭시
INVPROP04P02.event.changeAnswer2 = function(e) {
 	e.preventDefault();

	if($('input:checkbox[id="chAnswer2"]').is(':checked')){
		INVPROP04P02.variable.sendData.provide_investor_info = 'Y';
		$('#btnConfirm').attr('disabled', false);
	}
	else{
		INVPROP04P02.variable.sendData.provide_investor_info = 'N';
		$('#btnConfirm').attr('disabled', true);
	}
}

// 서비스 다음에 받기 클릭시
INVPROP04P02.event.clickBtnPopCancel = function(e) {
 	e.preventDefault();

	var resultData = {};
	resultData.result = false;
	gfn_closePopup(resultData);
}


// 제공하고 서비스  받기 클릭시
INVPROP04P02.event.clickBtnPopOk = function(e) {
 	e.preventDefault();

	$('input:checkbox[id="chAnswer1"]').attr("checked", false);
	$('#popDivD0402').hide();
	

	INVPROP04P02.variable.sendData.recommend_invest = 'Y';
	
	if(INVPROP04P02.variable.sendData.recommend_invest == 'Y' && INVPROP04P02.variable.sendData.provide_investor_info == 'Y'){
		$('#btnConfirm').attr('disabled', false);
	}
	else{
		$('#btnConfirm').attr('disabled', true);
	}
}




////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
INVPROP04P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자자정보 조회
	if(sid == "selectInvestorInfo"){
		INVPROP04P02.variable.detailData = result;
		
		INVPROP04P02.variable.sendData.recommend_invest = INVPROP04P02.variable.detailData.recommend_invest;
		INVPROP04P02.variable.sendData.provide_investor_info = INVPROP04P02.variable.detailData.provide_investor_info;
		
		// 상세 셋팅 
		INVPROP04P02.location.displayDetail();
		return;
	}
	
	
	// 투자자정보 수정
	if(sid == "updateInvestorInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		var resultData = {};
		resultData.result = true;
		// 투자권유 희망여부
		if(INVPROP04P02.variable.sendData.recommend_invest == 'N'){
			resultData.result = false;
		}
		// 투자자정보 제공 여부
		else if(INVPROP04P02.variable.sendData.provide_investor_info == 'N'){
			resultData.result = false;
		}
		gfn_closePopup(resultData);
	}
}

// 비밀번호 입력후 팝업 콜백함수 
INVPROP04P02.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		INVPROP04P02.variable.sendData.acnt_order_list = INVPROP04P02.variable.detailData.acnt_order_list;
		INVPROP04P02.variable.sendData.pwd = returnParam.pwd;
		  
		// 주문요청
		INVPROP04P02.tran.updateAcntOrderInfo();
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수
// 상세 셋팅
INVPROP04P02.location.displayDetail = function(){
	var detailData = INVPROP04P02.variable.detailData;
	
	if(INVPROP04P02.variable.sendData.recommend_invest == 'N'){
		$('input:checkbox[id="chAnswer1"]').attr("checked", true);
	}
	
	if(INVPROP04P02.variable.sendData.provide_investor_info == 'Y'){
		$('input:checkbox[id="chAnswer2"]').attr("checked", true);
	}
	
	
	if(INVPROP04P02.variable.sendData.recommend_invest == 'Y' && INVPROP04P02.variable.sendData.provide_investor_info == 'Y'){
		$('#btnConfirm').attr('disabled', false);
	}
	else{
		$('#btnConfirm').attr('disabled', true);
	}
}


INVPROP04P02.location.modalClose = function(){
    //$('.modal-page-wrap').hide();
	$('input:checkbox[id="chAnswer1"]').attr("checked", false);
	INVPROP04P02.variable.sendData.recommend_invest = 'Y';
	
	if(INVPROP04P02.variable.sendData.recommend_invest == 'Y' && INVPROP04P02.variable.sendData.provide_investor_info == 'Y'){
		$('#btnConfirm').attr('disabled', false);
	}
	else{
		$('#btnConfirm').attr('disabled', true);
	}
	
	
	$('#popDivD0402').hide();
}

INVPROP04P02.init();
