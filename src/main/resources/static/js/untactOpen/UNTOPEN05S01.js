/**
* 파일명 		: UNTOPEN05S01.js (E-04-01)  미사용
* 업무		: 비대면계좌개설 > 세번째 화면
* 설명		: 세번째 화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN05S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN05S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,noBack			: true						// 상단 백버튼 존재유무
	,showMenu		: false								//
}

/* 이벤트 정의 */
UNTOPEN05S01.events = {
	 'click #btnNext' 							: 'UNTOPEN05S01.event.clickBtnNext'
	,'click button[id^="btnCk_"]'				: 'UNTOPEN05S01.event.clickCheckOk'
	,'click div[id^="divCheck_"]'				: 'UNTOPEN05S01.event.clickOpenPop'
}

UNTOPEN05S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN05S01');
	
	//$("#pTitle").text("펀드상세정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-04-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN05S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN05S01.location.pageInit = function() {
	

	$(document).off("click", '.popup_close').on("click",'.popup_close',function(){
        $(this).parents('.popup_wrap').hide();
    });
	
	//if(!ComUtil.isNull(sParams.fund_no)){
	//	UNTOPEN05S01.variable.sendData.fund_no = sParams.fund_no;
	
		// 자문 계좌 상세정보 조회
	//	UNTOPEN05S01.tran.selectDetail();
	//}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문 계좌 상세정보 조회
UNTOPEN05S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "adviceAcntFundDtl";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/advice_acnt_fund_dtl";
	inputParam.data 	= {};
	inputParam.callback	= UNTOPEN05S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN05S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	// 동의여부 체크
	if($('input:checkbox[id="ckOk_1"]').is(':checked') == false){
		gfn_alertMsgBox("API 정보제공동의를 체크해 주시길 바랍니다.", function(){});
		return;
	}
	//임시로 이동처리, gfn_alertMsgBox 함수가 작동하지 않음
	ComUtil.moveLink('/untact_open/UNTOPEN03S01');
} 

UNTOPEN05S01.event.clickOpenPop = function(e) {
	e.preventDefault();
	
	$('#divPop_'+$(this).data('idx')).show();
} 

UNTOPEN05S01.event.clickCheckOk = function(e) {
	e.preventDefault();
	
	var idx = $(this).data('idx');
	gfn_log("idx :: " + idx);
	
	$('input#ckOk_'+idx).attr( "checked", true );
	
	$(this).parents('.popup_wrap').hide();
	
	if($('input:checkbox[id^="ckOk_"]').length == $('input:checkbox[id^="ckOk_"]:checked').length){
		$('#btnNext').removeAttr( "disabled" );
	}
} 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN05S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 펀드 상세내역 조회 
	if(sid == "adviceAcntFundDtl"){
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
UNTOPEN05S01.location.displayDetail = function(result){
	
	gfn_setDetails(UNTOPEN05S01.variable.detailData, $('#f-content'));
}




UNTOPEN05S01.init();
