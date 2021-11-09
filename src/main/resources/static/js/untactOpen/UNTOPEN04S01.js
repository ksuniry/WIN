/**
* 파일명 		: UNTOPEN04S01.js (E-04-01)
* 업무		: 비대면계좌개설 > 신분증찰영
* 설명		: 신분증찰영
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN04S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN04S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'account_add'						// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
UNTOPEN04S01.events = {
	 'click #btnNext' 							: 'UNTOPEN04S01.event.clickBtnNext'
	,'click button[id^="btnCk_"]'				: 'UNTOPEN04S01.event.clickCheckOk'
	,'click div[id^="divCheck_"]'				: 'UNTOPEN04S01.event.clickOpenPop'
}

UNTOPEN04S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN04S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-04-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN04S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN04S01.location.pageInit = function() {
	var sParams = sStorage.getItem("UNTOPENParams");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		UNTOPEN04S01.variable.initParamData = sParams;
		UNTOPEN04S01.variable.detailData = sParams;
		UNTOPEN04S01.variable.sendData = sParams;
	//	sStorage.clear();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 네티이브 앱에서 계좌개수 만큼 진위확인 완료 후 하이브리드에서 진행
UNTOPEN04S01.tran.updatePersonalId = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updatePersonalId";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_personal_id";
	inputParam.data 	= UNTOPEN04S01.variable.sendData;
	inputParam.callback	= UNTOPEN04S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN04S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	//$(this).attr("disabled", true);
	
	var inputParam = {};
	inputParam.acnt_open_cnt 	= UNTOPEN04S01.variable.initParamData.acnt_open_cnt;
	inputParam.screenId 		= 'UNTOPEN04S01';
	inputParam.objId	 		= 'objId';
	inputParam.type	 			= 'KB';
	
	// 신분증 찰영 진위확인
	gfn_callIdAuthComfirm(inputParam);
	
	/*var resultData = {
		returnData : {
	     "id_crd_sq" 	:	"111111|222222|33333",
	     "cs_nm" 		:	"JVfazqUJEuIaeQhIdAE84Q==",
	     "id_crd_ccd"   :	'1',
	     "screenId"   	:	'UNTOPEN04S01',
	     "objId"       	:	'aaaaa',
	     "passYn"     	:	"Y",
	     "msg"     		:	'오류이유' 
		}
	}
	gfn_setIdAuthComfirm_KB(resultData);*/
} 


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN04S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		//history.back();
		return;
	}
	
	// test data s
	// UNTOPEN04S01.callBack('updatePersonalId', {}, 'success');
	/*
	result.result = "ok";
	result.cs_nm = JsEncrptObject.encrypt("허성실")
	result.qprsn_crtfy_tel_no = JsEncrptObject.encrypt("010-1111-2222");
	*/
	// test data e
	
	// 네티이브 앱에서 계좌개수 만큼 진위확인 완료 후 하이브리드에서 진행 
	if(sid == "updatePersonalId"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				// 어디로 가나??
				$('#btnNext').attr("disabled", false);
				//ComUtil.moveLink('/untact_open/UNTOPEN03S01', false);	// 주민번호를 입력
			});
			return;
		}
		UNTOPEN04S01.variable.initParamData.id_crd_sq 	= UNTOPEN04S01.variable.sendData.id_crd_sq;			// 신분증일련번호
		UNTOPEN04S01.variable.initParamData.id_crd_ccd 	= UNTOPEN04S01.variable.sendData.id_crd_ccd;		// 신분증구분코드
		UNTOPEN04S01.variable.initParamData.cs_nm 		= result.cs_nm;
		UNTOPEN04S01.variable.initParamData.qprsn_crtfy_tel_no 		= result.qprsn_crtfy_tel_no;
		
		sStorage.setItem("UNTOPENParams", UNTOPEN04S01.variable.initParamData);
		
		ComUtil.moveLink('/untact_open/UNTOPEN06S01', false);
	}
}


// 네이티브 호출후 콜백함수 
UNTOPEN04S01.callBack.native = function(result){
	var key = result.key;
	//gfn_log('UNTOPEN04S01.callBack.native result :: ' + result);
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 신분증 찰영 진위확인 호출시 
	if(key == 'idAuthComfirm_KB'){
		if(result.passYn == "N"){
			gfn_alertMsgBox("죄송합니다. 신분증  진위확인중 문제가 발생하였습니다.", '', function(){});
			return;
		}
		else if(result.passYn == "C"){	// 사용자가 창을 닫은 경우
			gfn_log("cancle pass~~~~");
		}
		else{
			//alert("메이티브 이름 :: " + JsEncrptObject.decrypt(result.cs_nm));
			UNTOPEN04S01.variable.sendData.id_crd_sq = result.id_crd_sq;			// 신분증일련번호
			UNTOPEN04S01.variable.sendData.cs_nm = result.cs_nm;
			UNTOPEN04S01.variable.sendData.id_crd_ccd = result.id_crd_ccd;			// 신분증구분코드
			UNTOPEN04S01.variable.sendData.lmt_rmdr_amt = UNTOPEN04S01.variable.initParamData.new_lmt_rmdr_amt;		// 한도잔여액
			
			// 네티이브 앱에서 계좌개수 만큼 진위확인 완료 후 하이브리드에서 진행
			UNTOPEN04S01.tran.updatePersonalId();
		}
	}
}
/*
UNTOPEN04S01.callBack.idAuthComfirm = function(resultData){
	if(resultData.passYn == "N"){
		//gfn_alertMsgBox(resultData.msg);
		gfn_alertMsgBox("죄송합니다. 지금 해당 펀드의 정보를 확인하실 수 없습니다.", '', function(){});
		return;
	}
	//alert("메이티브 이름 :: " + JsEncrptObject.decrypt(resultData.cs_nm));
	UNTOPEN04S01.variable.sendData.id_crd_sq = resultData.id_crd_sq;			// 신분증일련번호
	UNTOPEN04S01.variable.sendData.cs_nm = resultData.cs_nm;
	UNTOPEN04S01.variable.sendData.id_crd_ccd = resultData.id_crd_ccd;			// 신분증구분코드
	UNTOPEN04S01.variable.sendData.lmt_rmdr_amt = UNTOPEN04S01.variable.initParamData.new_lmt_rmdr_amt;		// 한도잔여액
	
	// 네티이브 앱에서 계좌개수 만큼 진위확인 완료 후 하이브리드에서 진행
	UNTOPEN04S01.tran.updatePersonalId();
}
*/
UNTOPEN04S01.callBack.test = function(){
	if(gfn_isLocal()){
		UNTOPEN04S01.variable.sendData.id_crd_sq = "2012230036164|2012230036165|2012230036166";			// 신분증일련번호
		UNTOPEN04S01.variable.sendData.cs_nm = JsEncrptObject.encrypt("허성실");
		UNTOPEN04S01.variable.sendData.id_crd_ccd = "3";			// 신분증구분코드
		UNTOPEN04S01.variable.sendData.lmt_rmdr_amt = "1500";		// 한도잔여액
		
		gfn_alertMsgBox(UNTOPEN04S01.variable.sendData.id_crd_sq);
		
		// 네티이브 앱에서 계좌개수 만큼 진위확인 완료 후 하이브리드에서 진행
		UNTOPEN04S01.tran.updatePersonalId();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
UNTOPEN04S01.location.displayDetail = function(result){
	
	gfn_setDetails(UNTOPEN04S01.variable.detailData, $('#f-content'));
}




UNTOPEN04S01.init();
