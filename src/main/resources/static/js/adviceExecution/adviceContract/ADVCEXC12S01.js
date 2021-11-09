/**
* 파일명 		: ADVCEXC12S01.js (e-12-01)
* 업무		: 자문실행 > 자문계약
* 설명		: 자문계약을 한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.19
* 수정일/내용	: 
*/
var ADVCEXC12S01 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC12S01.variable = {
	sendData		: {
						 muffler_invst_remd_cfm_dtm : ""		// 투자권유문서확인일시
					    ,invt_advc_cfm_dtm 			: ""		// 투자자문계약서확인일시
					    ,robo_advc_cfm_dtm 			: ""	 	// 로보어드바이저유의사항확인일시
					    ,muffler_rist_ntce_cfm_dtm	: ""	 	// 머플러위험고지확인일시
					  }							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {									// 이전화면에서 받은 파라미터
					  }
	,showMenu		: false								//
	,noBack			: false						// 상단 백버튼 존재유무
}

/* 이벤트 정의 */
ADVCEXC12S01.events = {
	 'click #btnNext'		 						: 'ADVCEXC12S01.event.clickBtnNext'
	//,'click .ck_list .box_r'						: 'ADVCEXC12S01.event.clickViewContents'
	,'click button[id^="btnOk_"]'					: 'ADVCEXC12S01.event.clickBtnOk'
	,'click li[id^="liContractCheck_"]'				: 'ADVCEXC12S01.event.clickViewContents'
	//,'change input:checkbox[id^="contractCheck_"]'	: 'ADVCEXC12S01.event.changeContractCheck'
}

ADVCEXC12S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC12S01');
	
	//$("#pTitle").text("자문계약");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-12-01";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC12S01.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC12S01.location.pageInit = function() {
	
	// 전 화면에서 받은 파라미터 셋팅
	//var sParams = sStorage.getItem("ADVCEXC12S01Params");
	//if(ComUtil.isNull(sParams)){
	//	ADVCEXC12S01.variable.initParamData.reInvestPropensity = sParams.reInvestPropensity; 
	//}
	//sStorage.clear();
	
	$('.popup_wrap').hide();    

    $('.popup_close').click(function(){
        $(this).parents('.popup_wrap').hide();
    });

	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	ADVCEXC12S01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 머플러 자문계약을 위한 진행 정보 내역을 조회
ADVCEXC12S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "portfolioContractProcInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/portfolio_contract_proc_info";
	inputParam.data 	= {};
	inputParam.callback	= ADVCEXC12S01.callBack; 
	
	gfn_Transaction( inputParam );
}


// 투자 자문계약 완료 정보를 서버에 저장한다.
ADVCEXC12S01.tran.updatePortfolioContractEnd = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "portfolioContractEnd";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/portfolio_contract_end";
	inputParam.data 	= ADVCEXC12S01.variable.sendData;
	inputParam.callback	= ADVCEXC12S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
ADVCEXC12S01.event.clickBtnNext = function() {
	var svIndex=  $('.survey_step li.active').index();
	var thisIndex = svIndex + 1;
	
	ADVCEXC12S01.variable.sendData.ptfl_seq_no				= ADVCEXC12S01.variable.detailData.ptfl_seq_no;	// 자문계약일련번호
	ADVCEXC12S01.variable.sendData.muffler_invst_remd_cntt	= ADVCEXC12S01.variable.detailData.muffler_invst_remd_cntt;	// 투자권유문서
	ADVCEXC12S01.variable.sendData.invt_advc_cntrt_cntt		= ADVCEXC12S01.variable.detailData.invt_advc_cntrt_cntt;	// 투자자문계약서내용
	ADVCEXC12S01.variable.sendData.robo_advc_ntce_cntt		= ADVCEXC12S01.variable.detailData.robo_advc_ntce_cntt;		// 로보어드바이저유의사항내용
	ADVCEXC12S01.variable.sendData.muffler_rist_ntce_cntt	= ADVCEXC12S01.variable.detailData.muffler_rist_ntce_cntt;	// 머플러 위험 고지
	
	// 확인 내용 저장하기
	ADVCEXC12S01.tran.updatePortfolioContractEnd();
}

// 계약서 상세내용 보기
ADVCEXC12S01.event.clickViewContents = function(e) {
	e.preventDefault();

	var popIndex = $(this).index();
    $('#divIndex_'+(popIndex+1)).show();

	// 화면접근정보 통지
	var inputParam = {};
	inputParam.event 	= 'adviceagree_' + $(this).data('idx');
	gfn_enterScreen(inputParam);
}

// 계약서 상세내용 확인 버튼 클릭시
ADVCEXC12S01.event.clickBtnOk = function(e) {
	e.preventDefault();
	
	var popIndex = $(this).data('idx');
    $('#contractCheck_'+popIndex).attr('checked', true);
 	$(this).parents('.popup_wrap').hide();

	// 문서별 확인시간셋팅
	ADVCEXC12S01.location.setConfirmDate(popIndex);
	
	// 확인사항 모두 체크후엔 다음버튼 활성화
	if($('input:checkbox[id^="contractCheck_"]').length == $('input:checkbox[id^="contractCheck_"]:checked').length){
		$('#btnNext').attr('disabled', false);
	}
}

// 체크되어 있는 확인내역 풀어주기
ADVCEXC12S01.event.changeContractCheck = function(e) {
	e.preventDefault();
	
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ADVCEXC12S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		return;
	}
	
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	if(sid == "portfolioContractProcInfo"){
		// 필수값 체크
		/*if(ComUtil.isNull(result.ptfl_seq_no)){
			gfn_alertMsgBox('자문계약이 아직 이루어 지지 않았습니다. HelpDesk에 문의 부탁드립니다.', '', function(){
				
			});
			return;
		}*/
		
		ADVCEXC12S01.variable.detailData = result;
		ADVCEXC12S01.variable.detailData.invt_cntrt_expl = ComUtil.string.convertHtml(result.invt_cntrt_expl);
		
		if(ComUtil.isNull(result.cntrt_prdt_nm)){
			$('#no_result').show();
		}
		else{
			$('#no_result').hide();
			// popup 셋팅
			$('#divCntt_1').html(ADVCEXC12S01.variable.detailData.muffler_invst_remd_cntt);	// 투자권유문서
			$('#divCntt_2').html(ADVCEXC12S01.variable.detailData.invt_advc_cntrt_cntt);	// 투자자문계약서내용
			$('#divCntt_3').html(ADVCEXC12S01.variable.detailData.robo_advc_ntce_cntt);		// 로보어드바이저유의사항내용
			$('#divCntt_4').html(ADVCEXC12S01.variable.detailData.muffler_rist_ntce_cntt);	// 머플러 위험 고지
			
			// 복호화
			ADVCEXC12S01.variable.detailData.enc_user_nm = ADVCEXC12S01.variable.detailData.user_nm;
			ADVCEXC12S01.variable.detailData.user_nm = JsEncrptObject.decrypt(ADVCEXC12S01.variable.detailData.user_nm);
			ADVCEXC12S01.variable.detailData.user_brth_dt = JsEncrptObject.decrypt(ADVCEXC12S01.variable.detailData.user_brth_dt);
			ADVCEXC12S01.variable.detailData.user_mobile = JsEncrptObject.decrypt(ADVCEXC12S01.variable.detailData.user_mobile);
			
			// 계좌정보 그리기
			ADVCEXC12S01.location.displayAcntInfo();
			
			// 상세내역 셋팅
			gfn_setDetails(ADVCEXC12S01.variable.detailData, $('#f-content'));
		}
		
	}
	// 계약내용 저장 
	else if(sid == "portfolioContractEnd"){
		// 화면접근정보 통지
		var inputParam = {};
		inputParam.event 	= "portfolio_contract";
		inputParam.type		= "1";
		gfn_enterScreen(inputParam);		
		inputParam.type     = "2";
		gfn_enterScreen(inputParam);				// 페이스북 타입 추가 2021.06.23
		
		// 사용자 기본정보 상태값 변경
		gfn_setUserInfo('status', 		'trans');
		
		// 투자성향 결과 페이지로 이동
		sStorage.setItem("ADVCEXC13S01Params", ADVCEXC12S01.variable.detailData);
		/*gfn_alertMsgBox(result.message, '', function(){
			ComUtil.moveLink("/advice_execution/advice_contract/ADVCEXC13S01");	// 계약완료화면으로 이동
		});*/
		ComUtil.moveLink("/advice_execution/advice_contract/ADVCEXC13S01", false);	// 계약완료화면으로 이동
		//ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP05S01");	// 투자성향조회
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 계좌정보 그리기
ADVCEXC12S01.location.displayAcntInfo = function(){
	var detailData = ADVCEXC12S01.variable.detailData;
	// 초기화
	$('#ulAcntList').html('');
	
	if(gfn_isNull(detailData.account)){
		return;
	}
	
	//var _template = $("#_dumyFncl").html();
	//var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyAcnt").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each( detailData.account, function(index, item){
		item.idx = index + 1;
		
		$.each( item.account_info_list, function(index, item2){
			item2.idx = index;
			item2.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
			item2.fncl_agc_nm = item.fncl_agc_nm;
			
			item2.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item2.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
			item2.acnt_type_nm = gfn_getAcntTypeNm(item2.acnt_type);
			
			var html2 = template2(item2);
			$('#ulAcntList').append(html2);
		});
	});
	
}

// 문서별 확인시간셋팅
ADVCEXC12S01.location.setConfirmDate = function(popIdx){
	if(popIdx == "1")		{	ADVCEXC12S01.variable.sendData.muffler_invst_remd_cfm_dtm	= ComUtil.date.curDate('YYYYMMDDHHmmss');}
	else if(popIdx == "2")	{	ADVCEXC12S01.variable.sendData.invt_advc_cfm_dtm 			= ComUtil.date.curDate('YYYYMMDDHHmmss');}
	else if(popIdx == "3")	{	ADVCEXC12S01.variable.sendData.robo_advc_cfm_dtm	 		= ComUtil.date.curDate('YYYYMMDDHHmmss');}
	else if(popIdx == "4")	{	ADVCEXC12S01.variable.sendData.muffler_rist_ntce_cfm_dtm	= ComUtil.date.curDate('YYYYMMDDHHmmss');}
	else {gfn_log("번호가 맞지 않아요")}
}




ADVCEXC12S01.init();
