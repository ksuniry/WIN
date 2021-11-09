/**
* 파일명 		: ADVCEXC14S03.js (e-14-03)
* 업무		: 자문실행 > 계좌이전신청 결과
* 설명		: 계좌이전신청을 결과화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.16
* 수정일/내용	: 
*/
var ADVCEXC14S03 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC14S03.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,noBack			: false						// 상단 백버튼 존재유무
}

/* 이벤트 정의 */
ADVCEXC14S03.events = {
	 'click #btnOk'		 						: 'ADVCEXC14S03.event.clickBtnOk'
	//,'click li[id^="popCall_"]'						: 'ADVCEXC12S01.event.callPopUp'
}

ADVCEXC14S03.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC14S03');
	
	$("#pTitle").text("자문계약");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-14-03";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC14S03.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC14S03.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("ADVCEXC14S01Params");
	if(!ComUtil.isNull(sParams)){
		var curIdx = ComUtil.null(sParams.curIdx, '0');
		sParams.curIdx = curIdx;
		
		ADVCEXC14S03.variable.detailData	 	= sParams; 
		ADVCEXC14S03.variable.initParamData 	= sParams; 
	}
	
	// 셋팅
	ADVCEXC14S03.location.displayAcnt();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

/*
// 이체 이관계좌 번호 변경 등록 
ADVCEXC14S03.tran.updateRelAcntNo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateRelAcntNo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_rel_acnt_no";
	inputParam.data 	= ADVCEXC14S03.variable.sendData;
	inputParam.callback	= ADVCEXC14S03.callBack; 
	
	gfn_Transaction( inputParam );
}
*/

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

ADVCEXC14S03.event.clickBtnOk = function(e) {
	e.preventDefault();
	
	var initParamData = ADVCEXC14S03.variable.initParamData;
	
	sStorage.setItem("ADVCEXC14S01Params", initParamData);
	// 마지막 계좌일경우
	//initParamData.curIdx++;
	//if(initParamData.curIdx == initParamData.num_acnt){
	if(initParamData.emptyAcntNoArr.length == 0){
		//ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
		ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S02', false);	// 이체신청확인
	}
	else{
		ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S01', false);	// 이체계좌번호입력
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ADVCEXC14S03.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	if(sid == "updateRelAcntNo"){
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
ADVCEXC14S03.location.displayAcnt = function(){
	var acntInfo = ADVCEXC14S03.variable.detailData.acnt_list[ADVCEXC14S03.variable.detailData.curIdx];
	
	acntInfo.acnt_no_dis 		= ComUtil.pettern.acntNo(acntInfo.acnt_no + gfn_getAddAcntNoByCd(acntInfo.kftc_agc_cd));	// 비암호화
	acntInfo.chng_acnt_no_dis 	= ComUtil.pettern.acntNo(acntInfo.chng_acnt_no + gfn_getAddAcntNoByCd(acntInfo.chng_kftc_agc_cd));	// 비암호화
	acntInfo.acnt_type_nm		= gfn_getAcntTypeNm(acntInfo.acnt_type);
	acntInfo.chng_acnt_type_nm	= gfn_getAcntTypeNm(acntInfo.chng_acnt_type);
		
	gfn_setDetails(acntInfo, $('#f-content'));
	
	// image src 셋팅
	$('#fncl_agc_img').attr('src', gfn_getImgSrcByCd(acntInfo.kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(acntInfo.chng_kftc_agc_cd, 'C'));
}


ADVCEXC14S03.init();
