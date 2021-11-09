/**
* 파일명 		: UNTOPEN06S01.js (E-06-01)
* 업무		: 비대면계좌개설 > 개설정보입력
* 설명		: 신분증찰영
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN06S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN06S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,initParamData	: {}						// 
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'account_info'						// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
UNTOPEN06S01.events = {
	 'click #btnNext' 							: 'UNTOPEN06S01.event.clickBtnNext'
	,'click #btnPopAddr'						: 'UNTOPEN06S01.event.clickBtnPopAddr'
}

UNTOPEN06S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN06S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-06-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN06S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN06S01.location.pageInit = function() {
	var sParams = sStorage.getItem("UNTOPENParams");
	if(!ComUtil.isNull(sParams)){
		UNTOPEN06S01.variable.initParamData = sParams;
		UNTOPEN06S01.variable.detailData = sParams;
	}	
	
	
	// 이름 / 전화번호 셋팅
	if(!ComUtil.isNull(UNTOPEN06S01.variable.initParamData.cs_nm)){
		gfn_log('UNTOPEN06S01.variable.initParamData.cs_nm ::: ' + UNTOPEN06S01.variable.initParamData.cs_nm);
		$('#cs_nm').val(JsEncrptObject.decrypt(UNTOPEN06S01.variable.initParamData.cs_nm));
	}
	else{
		gfn_log('gfn_getUserInfo(userNm, true) ::: ' + gfn_getUserInfo('userNm', true));
		$('#cs_nm').val( gfn_getUserInfo('userNm', true) );
	}
	
	if(!ComUtil.isNull(UNTOPEN06S01.variable.initParamData.qprsn_crtfy_tel_no)){
		$('#cs_tel').val(ComUtil.string.hpFormat(JsEncrptObject.decrypt(UNTOPEN06S01.variable.initParamData.qprsn_crtfy_tel_no)));
	}
	else{
		$('#cs_tel').val(ComUtil.string.hpFormat(gfn_getUserInfo('userPn', true)));
	}
	
	
	$('#divSelectMail').dSelectBox({
        isSelectTag: true,
        eventType: 'click'
    });
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 고객 정보 입력 화면(개설정보를 입력)
UNTOPEN06S01.tran.updateCustomerInfo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateCustomerInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_customer_info";
	inputParam.data 	= UNTOPEN06S01.variable.sendData;
	inputParam.callback	= UNTOPEN06S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN06S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	// 이메일 체크 주소 체크 로직 필요
	if(!ComUtil.validate.check($('#f-content')))
	{
		return false;
	}
	
	var emailFullAddrArr = $('#emailFullAddr').val().split('@');
	
	UNTOPEN06S01.variable.sendData.email_id    		= emailFullAddrArr[0]		;	// 이메일ID
	UNTOPEN06S01.variable.sendData.email_addr    	= emailFullAddrArr[1]   	;	// 이메일주소
	
	UNTOPEN06S01.variable.sendData.dng_flwg_addr 	= $('#dng_flwg_addr').val();
	UNTOPEN06S01.variable.sendData.pst_str 			= UNTOPEN06S01.variable.sendData.nwAddr + " " + UNTOPEN06S01.variable.sendData.dng_flwg_addr;
	
	// 고객 정보 입력 화면(개설정보를 입력)
	gfn_log("UNTOPEN06S01.variable.sendData :: " + UNTOPEN06S01.variable.sendData);
	UNTOPEN06S01.tran.updateCustomerInfo();
} 

// kb 우편번호 검색창 호출
UNTOPEN06S01.event.clickBtnPopAddr = function(e) {
	e.preventDefault();
	
	$(this).removeClass('wide');
	
	var sParam = {};
	sParam.url = '/untact_open/UNTOPEN06P02';
	gfn_callPopup(sParam, function(resultData){
		if(ComUtil.isNull(resultData)){
			return;
		}
		
		//UNTOPEN06S01.variable.sendData.ld_nm_cd			= resultData.ldNmCd	  		;	// 도로명코드
		//UNTOPEN06S01.variable.sendData.undrgrnd_f		= resultData.undrgrndF	  	; 	// 지하여부
		//UNTOPEN06S01.variable.sendData.bldng_hd_no    	= resultData.bldngHdNo  	;	// 건물본번호
		//UNTOPEN06S01.variable.sendData.bldng_sb_no    	= resultData.bldngSbNo  	;	// 건물부번호
		UNTOPEN06S01.variable.sendData.pst_no    		= resultData.nwPstNo    	;	// 우편번호
		UNTOPEN06S01.variable.sendData.pst_sq    		= resultData.pstSq    	   	;	// 우편번호
		UNTOPEN06S01.variable.sendData.nwAddr    		= resultData.nwAddr    	   	;	// 동주소
		
		UNTOPEN06S01.variable.sendData.dng_flwg_addr    = resultData.dng_flwg_addr	;	// 동이하주소(상세주소)
		
		
		gfn_log("주소콜백 :: " + resultData);
		gfn_setDetails(resultData, $('#divAddrInfo'));
	});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN06S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// test data s
	// result.result = "ok";
	// test data e
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	// 고객 정보 입력 화면(개설정보를 입력)
	if(sid == "updateCustomerInfo"){
		
		ComUtil.moveLink('/untact_open/UNTOPEN09S01', false);	// 비밀벌호설정
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
UNTOPEN06S01.location.displayDetail = function(){
	gfn_setDetails(UNTOPEN06S01.variable.detailData, $('#f-content'));
}




UNTOPEN06S01.init();
