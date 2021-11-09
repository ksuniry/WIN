/**
* 파일명 		: UNTOPEN02S01.js (E-02-01) (popup E-02-05)
* 업무		: 비대면계좌개설 > 두번째 화면
* 설명		: 두번째 화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN02S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN02S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,noHead			: false
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'account_intro'					// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
UNTOPEN02S01.events = {
	 'click #btnNext' 							: 'UNTOPEN02S01.event.clickBtnNext'
	,'click button[id^="btnCk_"]'				: 'UNTOPEN02S01.event.clickCheckOk'
	,'click div[id^="divCheck_"]'				: 'UNTOPEN02S01.event.clickOpenPop'
	,'click span[name^="outlink"]'				: 'UNTOPEN02S01.event.clickCallOutLink'
	,'change input:radio[name^="api_"]'			: 'UNTOPEN02S01.event.changeApiAgreeYn'
	,'change input:radio[name^="fncl_"]'		: 'UNTOPEN02S01.event.changeFnclAgreeYn'
	,'change input:checkbox[id^="chkAll_"]'		: 'UNTOPEN02S01.event.changeChkAll'
}

UNTOPEN02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN02S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-02-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN02S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN02S01.location.pageInit = function() {
	

	$(document).off("click", '.popup_close').on("click",'.popup_close',function(){
        $(this).parents('.popup_wrap').hide();
    });
	
	//if(!ComUtil.isNull(sParams.fund_no)){
	//	UNTOPEN02S01.variable.sendData.fund_no = sParams.fund_no;
	
	// API 사용 제 3자 동의 정보 조회
	UNTOPEN02S01.tran.selectDetail();
	
	$('#btnNext').prop("disabled", true);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// API 사용 제 3자 동의 정보 조회
UNTOPEN02S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectThirdPartAgree";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_third_part_agree";
	inputParam.data 	= UNTOPEN02S01.variable.sendData;
	inputParam.callback	= UNTOPEN02S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// API 사용 제 3자 동의 등록
UNTOPEN02S01.tran.udpateThirdPartAgree = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "udpateThirdPartAgree";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_third_part_agree";
	inputParam.data 	= UNTOPEN02S01.variable.sendData;
	inputParam.callback	= UNTOPEN02S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN02S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	// 이미 정보동의를 한경우 해당 내용은 필요없음
	if(ComUtil.null(UNTOPEN02S01.variable.sendData.api_coll_agree_yn, 'N') == "Y"){
		UNTOPEN02S01.variable.detailData.api_coll_agree_yn = 'Z';	// 이미 동의한 사용자면 z로 보내준다.
	}
	else if(ComUtil.null(UNTOPEN02S01.variable.detailData.api_coll_agree_yn, 'N') == "Z"){
		UNTOPEN02S01.variable.detailData.api_coll_agree_yn = 'Z';	// 이미 동의한 사용자면 z로 보내준다.
	}
	else if(ComUtil.null(UNTOPEN02S01.variable.detailData.api_coll_agree_yn, 'N') != "Y"){
		// 동의여부 체크
		if($('input:checkbox[id="ckOk_1"]').is(':checked') == false){
			gfn_alertMsgBox("API 정보제공동의를 체크해 주시길 바랍니다.");
			return;
		}
		
		UNTOPEN02S01.variable.detailData.api_coll_agree_yn = 'Y';
	}
	
	// 동의여부 체크
	if($('input:checkbox[id="ckOk_2"]').is(':checked') == false){
		gfn_alertMsgBox("비대면 계좌개설 정보제공동의를 체크해 주시길 바랍니다.");
		return;
	}
	
	//UNTOPEN02S01.variable.sendData.nftf_agree_yn 	= "Y";
	UNTOPEN02S01.variable.sendData.api_coll_agree_yn 			= UNTOPEN02S01.variable.detailData.api_coll_agree_yn;
	UNTOPEN02S01.variable.sendData.api_coll_agree_ver 			= UNTOPEN02S01.variable.detailData.api_coll_agree_ver;
	UNTOPEN02S01.variable.sendData.api_coll_agree_id 			= UNTOPEN02S01.variable.detailData.api_coll_agree_id;
	
	UNTOPEN02S01.variable.sendData.api_offer_agree_yn 			= UNTOPEN02S01.variable.detailData.api_offer_agree_yn;
	UNTOPEN02S01.variable.sendData.api_offer_agree_ver 			= UNTOPEN02S01.variable.detailData.api_offer_agree_ver;
	UNTOPEN02S01.variable.sendData.api_offer_agree_id 			= UNTOPEN02S01.variable.detailData.api_offer_agree_id;
	
	UNTOPEN02S01.variable.sendData.fncl_coll_ID_agree_yn 		= UNTOPEN02S01.variable.detailData.fncl_coll_ID_agree_yn;
	UNTOPEN02S01.variable.sendData.fncl_coll_credit_agree_yn 	= UNTOPEN02S01.variable.detailData.fncl_coll_credit_agree_yn;
	UNTOPEN02S01.variable.sendData.fncl_offer_ID_agree_yn 		= UNTOPEN02S01.variable.detailData.fncl_offer_ID_agree_yn;
	UNTOPEN02S01.variable.sendData.fncl_offer_credit_agree_yn 	= UNTOPEN02S01.variable.detailData.fncl_offer_credit_agree_yn;
	UNTOPEN02S01.variable.sendData.fncl_select_ID_agree_yn 		= UNTOPEN02S01.variable.detailData.fncl_select_ID_agree_yn;
	UNTOPEN02S01.variable.sendData.fncl_select_credit_agree_yn	= UNTOPEN02S01.variable.detailData.fncl_select_credit_agree_yn;
	
	UNTOPEN02S01.tran.udpateThirdPartAgree();
	//ComUtil.moveLink('/untact_open/UNTOPEN03S01', false);
} 

UNTOPEN02S01.event.clickOpenPop = function(e) {
	e.preventDefault();
	
	$('#divPop_'+$(this).data('idx')).show();
} 

UNTOPEN02S01.event.clickCheckOk = function(e) {
	e.preventDefault();
	
	var idx = $(this).data('idx');
	gfn_log("idx :: " + idx);
	
	// api 정보제공동의
	if(idx == '1'){
		// 수집이용동의 체크 
		if($('input:radio[name="api_coll_agree_yn"]:checked').val() == 'N'){
			return;
		}
		// 제공동의 체크 
		if($('input:radio[name="api_offer_agree_yn"]:checked').val() == 'N'){
			return;
		}
		UNTOPEN02S01.variable.detailData.api_coll_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.api_offer_agree_yn = 'Y';
	}
	// 비대면 계좌개설 정보제공동의
	else if(idx == '2'){
		if($('input:radio[name="fncl_coll_ID_agree_yn"]:checked').val() == 'N'){return;}
		if($('input:radio[name="fncl_coll_credit_agree_yn"]:checked').val() == 'N'){return;}
		if($('input:radio[name="fncl_offer_ID_agree_yn"]:checked').val() == 'N'){return;}
		if($('input:radio[name="fncl_offer_credit_agree_yn"]:checked').val() == 'N'){return;}
		if($('input:radio[name="fncl_select_ID_agree_yn"]:checked').val() == 'N'){return;}
		if($('input:radio[name="fncl_select_credit_agree_yn"]:checked').val() == 'N'){return;}
		
		UNTOPEN02S01.variable.detailData.fncl_coll_ID_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.fncl_coll_credit_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.fncl_offer_ID_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.fncl_offer_credit_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.fncl_select_ID_agree_yn = 'Y';
		UNTOPEN02S01.variable.detailData.fncl_select_credit_agree_yn = 'Y';
	}
	
	
	$('input#ckOk_'+idx).attr( "checked", true );
	$(this).parents('.popup_wrap').hide();
	
	
	// 운영에서만 막아둠..
	//if(!gfn_isOper()){
		// 다음버튼 활성화 s 
		if($('input:checkbox[id^="ckOk_"]').length == $('input:checkbox[id^="ckOk_"]:checked').length){
			$('#btnNext').removeAttr( "disabled" );
			return;
		}
		
		if($('input:checkbox[id="ckOk_2"]').is(':checked') == true){
			if(ComUtil.null(UNTOPEN02S01.variable.detailData.api_coll_agree_yn, 'N') == "Y"){
				$('#btnNext').removeAttr( "disabled" );
			}
		}
		// 다음버튼 활성화 e
	//}
	
	 
} 

UNTOPEN02S01.event.clickCallOutLink = function(e) {
	e.preventDefault();
	
	var url = $(this).html();
	
	var inputParam = {};
	inputParam.url 			= url;
	inputParam.screenId 	= "UNTOPEN02S01";
	inputParam.objId	 	= 'span';
	inputParam.inYn		 	= "N";
	inputParam.type		 	= "link";
	
	gfn_otherLinkOpen(inputParam);
} 

// api 정보제공동의 내용 체크 
UNTOPEN02S01.event.changeApiAgreeYn = function(e) {
	e.preventDefault();
	
	// 수집이용동의 체크,  제공동의 체크 
	if($('input:radio[name="api_coll_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="api_offer_agree_yn"]:checked').val() == 'Y'
	){
		$('#btnCk_1').removeAttr( "disabled" );
		$('#chkAll_1').attr( "checked" , true);
	}
	else{
		$('#btnCk_1').attr( "disabled" , true);
		$('#chkAll_1').attr( "checked" , false);
	}
	
}

// 비대면 계좌개설 내용 체크 
UNTOPEN02S01.event.changeFnclAgreeYn = function(e) {
	e.preventDefault();
	
	// 수집이용동의 체크,  제공동의 체크 
	if($('input:radio[name="fncl_coll_ID_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="fncl_coll_credit_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="fncl_offer_ID_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="fncl_offer_credit_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="fncl_select_ID_agree_yn"]:checked').val() == 'Y' &&
	   $('input:radio[name="fncl_select_credit_agree_yn"]:checked').val() == 'Y' 
	){
		$('#btnCk_2').removeAttr( "disabled" );
		$('#chkAll_2').attr( "checked" , true);
	}
	else{
		$('#btnCk_2').attr( "disabled" , true);
		$('#chkAll_2').attr( "checked" , false);
	}
	
}

UNTOPEN02S01.event.changeChkAll = function(e) {
	e.preventDefault();
	var idx = $(this).data('idx');
	gfn_log("idx :: " + idx);
	
	// api 정보제공동의
	if(idx == '1'){
		var agreeYn = "N";
		
		if($(this).is(":checked")){
			agreeYn = "Y";
		}
		
		$('input:radio[name="api_coll_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="api_offer_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		
		UNTOPEN02S01.variable.detailData.api_coll_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.api_offer_agree_yn = agreeYn;
		
		UNTOPEN02S01.event.changeApiAgreeYn(e);
			
	}
	// 비대면 계좌개설 정보제공동의
	else if(idx == '2'){
		var agreeYn = "N";
		
		if($(this).is(":checked")){
			agreeYn = "Y";
		}
		
		$('input:radio[name="fncl_coll_ID_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="fncl_coll_credit_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="fncl_offer_ID_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="fncl_offer_credit_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="fncl_select_ID_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		$('input:radio[name="fncl_select_credit_agree_yn"][value="'+agreeYn+'"]').attr('checked', true);
		
		UNTOPEN02S01.variable.detailData.fncl_coll_ID_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.fncl_coll_credit_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.fncl_offer_ID_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.fncl_offer_credit_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.fncl_select_ID_agree_yn = agreeYn;
		UNTOPEN02S01.variable.detailData.fncl_select_credit_agree_yn = agreeYn;
		
		UNTOPEN02S01.event.changeFnclAgreeYn(e);
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	// API 사용 제 3자 동의 정보 조회
	if(sid == "selectThirdPartAgree"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		//result.api_coll_agree_yn = 'N';
		UNTOPEN02S01.variable.detailData = result;
		
		// 저장할 데이터 기본 셋팅
		UNTOPEN02S01.variable.sendData.api_coll_agree_yn 	= result.api_coll_agree_yn;
		UNTOPEN02S01.variable.sendData.api_coll_agree_id 	= result.api_coll_agree_id;
		UNTOPEN02S01.variable.sendData.api_coll_agree_ver 	= result.api_coll_agree_ver;
		UNTOPEN02S01.variable.sendData.api_offer_agree_id 	= result.api_offer_agree_id;
		UNTOPEN02S01.variable.sendData.api_offer_agree_ver 	= result.api_offer_agree_ver;
		
		UNTOPEN02S01.location.displayDetail();
	}
	
	// API 사용 제 3자 동의 등록
	if(sid == "udpateThirdPartAgree"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() == "NON" ) {
			var sParam = {};
			sParam.url = '/untact_open/UNTOPEN02P03';
			gfn_callPopup(sParam, function(){
				ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01', false);
			});
			return;
		}
		
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		ComUtil.moveLink('/untact_open/UNTOPEN03S01', false);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
UNTOPEN02S01.location.displayDetail = function(){
	var detailData = UNTOPEN02S01.variable.detailData;
	
	// 이미 정보동의를 한경우 해당 내용은 필요없음
	if(ComUtil.null(UNTOPEN02S01.variable.detailData.api_coll_agree_yn, 'N') != "Y"){
		
		/*
		if(ComUtil.isNull(detailData.api_coll_agree_body)){
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			return;
		}
		// api 정보 제공동의 셋팅
		$('#api_coll_agree_body').html(ComUtil.string.convertHtml(detailData.api_coll_agree_body));
		*/
		$('#divBox_1').show();
	}
}




UNTOPEN02S01.init();
