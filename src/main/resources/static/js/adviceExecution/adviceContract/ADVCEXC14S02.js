/**
* 파일명 		: ADVCEXC14S02.js (e-14-02)
* 업무		: 자문실행 > 계좌 이체신청확인
* 설명		: 계좌이전신청 내용을 확인한다
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.29
* 수정일/내용	: 
*/
var ADVCEXC14S02 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC14S02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: false								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,noBack			: false						// 상단 백버튼 존재유무
	,screenType		: 'approval_trans'					// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
ADVCEXC14S02.events = {
	 'click #btnOk'				 						: 'ADVCEXC14S02.event.clickBtnOk'
	,'click #divAgreeCheck'		 						: 'ADVCEXC14S02.event.clickAgreeCheck'
	,'click #btnPopNext'				 				: 'ADVCEXC14S02.event.clickBtnPopNext'
	,'click #btnPopCancel'				 				: 'ADVCEXC14S02.event.clickBtnPopCancel'
	,'click #btnPopOk'				 					: 'ADVCEXC14S02.event.clickBtnPopOk'
	,'click #divPopNotice'				 				: 'ADVCEXC14S02.event.clickDivPopNotice'
	//,'click li[id^="popCall_"]'						: 'ADVCEXC12S01.event.callPopUp'
}

ADVCEXC14S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC14S02');
	
	$("#pTitle").text("연금 계좌이체 신청");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-14-02";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC14S02.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC14S02.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("PENSEXEDATA");		// 자문안실행을 위한 정보
	if(!ComUtil.isNull(sParams)){
		
		
		ADVCEXC14S02.variable.sendData	 		= sParams; 
	}
	
	
	ADVCEXC14S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 계약완료 후 이체이관계좌 조회
ADVCEXC14S02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectRelAcntList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_rel_acnt_list";
	inputParam.data 	= {};
	inputParam.callback	= ADVCEXC14S02.callBack; 
	
	gfn_Transaction( inputParam );
}


// 최종승인내역 등록 
ADVCEXC14S02.tran.savePensionAdvice = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "executePortfolio";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/execute_portfolio";
	inputParam.data 	= ADVCEXC14S02.variable.sendData;
	inputParam.callback	= ADVCEXC14S02.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

ADVCEXC14S02.event.clickAgreeCheck = function(e) {
	e.preventDefault();
	
	var sParam = {};
	sParam.url = '/advice_execution/advice_contract/ADVCEXC14P04';
	gfn_callPopup(sParam, function(){
		$('input#agree').attr( "checked", true );	
	});
}

ADVCEXC14S02.event.clickBtnOk = function(e) {
	e.preventDefault();
	
	// 동의여부 체크
	/*if($('input:checkbox[id="agree"]').is(':checked') == false){
		gfn_alertMsgBox('연금계좌 가입자 유의사항을 동의해 주시기 바랍니다.');
		return;
	}*/
	
	ADVCEXC14S02.variable.sendData.trans_content_check_yn = 'Y';
	
	$('#popAcntDetailInfo').show();
}

ADVCEXC14S02.event.clickBtnPopNext = function(e) {
	e.preventDefault();
	
	$('#popAcntDetailInfo').hide();
	// 최종승인내역 등록 
	//ADVCEXC14S02.tran.savePensionAdvice();
	ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
}

ADVCEXC14S02.event.clickBtnPopCancel = function(e) {
	e.preventDefault();
	
	$('#popAcntDetailInfo').hide();
}

ADVCEXC14S02.event.clickBtnPopOk = function(e) {
	e.preventDefault();
	
	$('#popMsgBox').hide();
	// 최종승인내역 등록을 하지 않으면 이리로 올일이 없음 
	//ComUtil.moveLink('/pension_mng/PENSION01M00');	// 최초 화면으로 이동   m-01
	ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
}

ADVCEXC14S02.event.clickDivPopNotice = function(e) {
	e.preventDefault();
	
	// 체크가 되어있을 경우는 체크해제 및 버튼 비활성화
	if($('input:checkbox[id="agree"]').is(':checked') == true){
		// 체크박스 해제
		$('input:checkbox[id="agree"]').attr('checked', false);
		// 버튼 비활성화
		$('button[id="btnOk"]').attr('disabled', true);
		return;
	}
			
	var url = "/advice_execution/advice_contract/ADVCEXC14P04";
	var sParam = {};
	sParam.url = url;
	
	// 팝업호출
	gfn_callPopup(sParam, ADVCEXC14S02.location.callbackPop);
	
	
}

 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ADVCEXC14S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	if(sid == "selectRelAcntList"){
		ADVCEXC14S02.variable.detailData = result;
		//ADVCEXC14S02.variable.detailData.userPn = gfn_getUserInfo('userPn', true);
		
		// 이체대상계좌존재에 따라 진행
		if(ADVCEXC14S02.variable.detailData.num_acnt == 0){
			ADVCEXC14S02.variable.sendData.trans_content_check_yn = 'N';
			// 최종승인내역 등록 
			ADVCEXC14S02.tran.savePensionAdvice();
		}
		else{
			// 상세내역 셋팅
			ADVCEXC14S02.location.displayAcnt();
			gfn_setDetails(ADVCEXC14S02.variable.detailData, $('#f-content'));
		}
	}
	
	// 최종승인내역 등록 
	if(sid == "executePortfolio"){
		// 저장 성공했으니
		$('#popMsgBox').show();
		gfn_setUserInfo('status', 		'wait');			// 자문대기
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
// 팝업화면에서 확인 버튼을 눌렀을 때 체크박스 체크
ADVCEXC14S02.location.callbackPop = function(returnParam){
	if(returnParam == 'ok') {
		// 체크박스 체크
		$('input:checkbox[id="agree"]').attr('checked', true);
		
		// 버튼 활성화
		$('button[id="btnOk"]').attr('disabled', false);
	}
}

ADVCEXC14S02.location.displayAcnt = function(){
	var detailData = ADVCEXC14S02.variable.detailData;
	
	// 초기화
	$('#divFnclList').html('');
	
	if(gfn_isNull(detailData.acnt_list)){
		return;
	}
	
	var _template = $("#_dumyFncl").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyAcnt").html();
	var template2 = Handlebars.compile(_template2);
	
	var _template3 = $("#_dumyPopAcnt").html();
	var template3 = Handlebars.compile(_template3);
	
	var _templateArrow = $("#_dumyArrow").html();
	var templateArrow = Handlebars.compile(_templateArrow);
	
	$.each( detailData.acnt_list, function(index, item){
		item.idx = index + 1;
		
		if($('#divFncl_'+item.chng_acnt_type).length == 0){
			var typeInfo = ADVCEXC14S02.location.setInfoByAcntType(item.chng_acnt_type);
			//var typeInfo = gfn_getAcntTypeNm(item.chng_acnt_type);
			$.extend(item, typeInfo);
			var html = template(item);
			$('#divFnclList').append(html);
		}
		
		// 중간화살표
		var htmlArrow = templateArrow(item);
		$('#ulCompareList_'+item.chng_acnt_type).append(htmlArrow);
		
		// 이체하는 계좌
		item.view_fncl_agc_cd 	= item.fncl_agc_cd; 
		item.view_fncl_agc_nm 	= item.fncl_agc_nm; 
		item.view_companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		var htmlOld = template2(item);
		$('#oldAcntList_'+item.chng_acnt_type).append(htmlOld);
		
		// 이체받는 계좌
		item.view_fncl_agc_cd 	= item.chng_fncl_agc_cd; 
		item.view_fncl_agc_nm 	= item.chng_fncl_agc_nm;
		item.view_companyImgSrc = gfn_getImgSrcByCd(item.chng_kftc_agc_cd, 'C');
		var htmlNew = template2(item);
		$('#newAcntList_'+item.chng_acnt_type).append(htmlNew);
		
		
		item.chng_acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.chng_acnt_no, '') + gfn_getAddAcntNoByCd(item.chng_kftc_agc_cd));
		
		var htmlPop = template3(item);
		$('#ulAccList').append(htmlPop);
		
		
	});
	
	//$('#divFnclList').append($("#_dumyEtc").html());
}


// 계좌타입
// "11:퇴직연금 IRP, 20 : 연금저축, 99: TDF (종합위탁계좌)")
ADVCEXC14S02.location.setInfoByAcntType = function(acntType){
	var acntInfo = {};
	
	switch(acntType){
		case '11'	:
						acntInfo.typeNm = "개인형퇴직연금계좌(IRP)";
			break;
		case '20'	:
						acntInfo.typeNm = "연금저축계좌";
			break;
		case '99'	:
						acntInfo.typeNm = "종합위탁계좌";
			break;
	}
	
	return acntInfo;
}



ADVCEXC14S02.init();
