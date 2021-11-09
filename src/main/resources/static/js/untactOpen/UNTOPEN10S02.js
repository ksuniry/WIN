/**
* 파일명 		: UNTOPEN10S02.js  ( e-10-02 )
* 업무		: 비대면계좌개설 > 1원송금 입금자확인 
* 설명		: 1원송금 입금자확인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.12
* 수정일/내용	: 
*/
var UNTOPEN10S02 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN10S02.variable = {
	sendData		: {
						nintv_sm_cnfr_cd : ""			// 비대면송금확인코드
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
}

/* 이벤트 정의 */
UNTOPEN10S02.events = {
	 'click #btnNext' 								: 'UNTOPEN10S02.event.clickBtnNext'
	//,'click li[id^="fundInfo_"]'					: 'UNTOPEN10S02.event.goFundDetail'
}

UNTOPEN10S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN10S02');
	
	//$("#pTitle").text("펀드상세정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-10-02";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN10S02.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN10S02.location.pageInit = function() {
	// 본인확인 입금계좌 조회 
	UNTOPEN10S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 비대면 본인확인 입금계좌 조회
UNTOPEN10S02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getPersonalAccount";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/get_personal_account";
	inputParam.data 	= UNTOPEN10S02.variable.sendData;
	inputParam.callback	= UNTOPEN10S02.callBack; 
	
	gfn_Transaction( inputParam );
}


// 비대면 본인확인 송금체크
UNTOPEN10S02.tran.updateAccountTransInfo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAccountTransInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_account_trans_info";
	inputParam.data 	= UNTOPEN10S02.variable.sendData;
	inputParam.callback	= UNTOPEN10S02.callBack; 
	
	gfn_Transaction( inputParam );
}

// 비대면 본인확인 입금계좌 이동
UNTOPEN10S02.tran.updatePersonalAccountReturn = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updatePersonalAccountReturn";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_personal_account_return";
	inputParam.data 	= UNTOPEN10S02.variable.sendData;
	inputParam.callback	= UNTOPEN10S02.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
UNTOPEN10S02.event.clickBtnNext = function() {
	// 1원 게좌보니기 거래 호출해야 한다.
	
	if(!ComUtil.validate.check($('#f-content')))
	{
		return false;
	}
	
	var cnfrCd = $('#nintv_sm_cnfr_cd').val();
	if(cnfrCd.length < 4){
		gfn_alertMsgBox('인증번호 4자리를 입력해 주시길 바랍니다.');
		return false;
	}
	
	
	
	var inputParam = {};
	inputParam.callback = UNTOPEN10S02.callBack.popPassword;
	inputParam.pwdMsg = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
	gfn_callPwdPopup(inputParam);
	
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN10S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		//history.back();
		return;
	}
	
	//result.result = "ok";
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	// 비대면 본인확인 입금계좌 조회
	if(sid == "getPersonalAccount"){
		UNTOPEN10S02.variable.detailData = result;
		
		UNTOPEN10S02.variable.detailData.acnt_no_pat = ComUtil.pettern.acntNo(ComUtil.null(result.i_amt_ac_no, '') + gfn_getAddAcntNoByCd(result.i_amt_bnk_cd));
		gfn_setDetails(UNTOPEN10S02.variable.detailData, $('#f-content'));
		return;
	}
	
	// 비대면 본인확인 입금계좌 이동
	if(sid == "updatePersonalAccountReturn"){
		
		ComUtil.moveLink('/untact_open/UNTOPEN10S01', false); // 비대면 본인확인 입금계좌 화면으로 이동
		return;
	}
	
	//
	if(sid == "updateAccountTransInfo"){
		
		if(ComUtil.isNull(result.new_acnt_list)){
			gfn_finishView( {msg:'비정상적으로 비대면 계좌 개설이 진행되었습니다.  앱을 재실행하시고 비대면 계좌개설을 진행하세요.'});
		}
		
		if(result.new_acnt_list.length == 0){
			gfn_finishView( {msg:'비정상적으로 비대면 계좌 개설이 진행되었습니다.  앱을 재실행하시고 비대면 계좌개설을 진행하세요.'});
		}
		
		sStorage.setItem("UNTOPEN11S01Params", result);
		
		ComUtil.moveLink('/untact_open/UNTOPEN11S01', false); // 개설완료안내 화면이동
	}
}


// 비밀번호 입력후 팝업 콜백함수 
UNTOPEN10S02.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		var cnfrCd = $('#nintv_sm_cnfr_cd').val();
		
		UNTOPEN10S02.variable.sendData.nintv_sm_cnfr_cd = 'KB' + cnfrCd;
		UNTOPEN10S02.variable.sendData.pwd = returnParam.pwd;  
		UNTOPEN10S02.tran.updateAccountTransInfo();
	}
}

// 백버튼 클릭시 호출함수 
UNTOPEN10S02.callBack.close = function(){
	// 비대면 본인확인 입금계좌 이동 할수 있도록 한다.
	UNTOPEN10S02.tran.updatePersonalAccountReturn();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


UNTOPEN10S02.init();
