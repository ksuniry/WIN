/**
* 파일명 		: PENSION03S01.js (pension-m-03-01)
* 업무		: 웰컴보드 > 자산배분 > 계좌 클릭   자문 계좌 상세정보 화면
* 설명		: 계좌 상세정보를 조회 한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.15
* 수정일/내용	: 
*/
var PENSION03S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION03S01.variable = {
	sendData		: {
						acnt_uid : ""			// 계좌 UID
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION03S01.events = {
	 'click #btnHelp'		 						: 'PENSION03S01.event.clickBtnHelp'
	,'click a[id^="fundLink_"]'						: 'PENSION03S01.event.goFundDetail'
	,'click #btnAcntEnd'	 						: 'PENSION03S01.event.clickBtnAcntEnd'
	,'click div[id^="btnCallFundDetail_"]'			: 'PENSION03S01.event.clickbtnCallFundDetail'
	,'click #btnPopChangeLmtRmdr'	 				: 'PENSION03S01.event.clickBtnPopChangeLmtRmdr'
	,'click #btnPopClose, #btnPopChangeLmtRmdrCancel, #dimPop0301_01Close, #dimPop0301_02Close '	: 'PENSION03S01.event.clickBtnPopClose'
	,'click #btnPopChangeLmtRmdrOk'					: 'PENSION03S01.event.clickBtnPopChangeLmtRmdrOk'
}

PENSION03S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION03S01');
	
	$("#pTitle").text(" ");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION03S01.location.pageInit();
}


// 화면내 초기화 부분
PENSION03S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("PENSION03S01Params");
	PENSION03S01.variable.initParamData = sParams;
	
	// header light
	//$('#header_' + PENSION03S01.variable.headType).addClass('light');
	
	if('MYINFOM02S01|'.indexOf(PENSION03S01.variable.initParamData.screenId) > -1 ){
		$('#divBtnAcntEnd').show();
	}

	PENSION03S01.variable.detailData.acnt_uid = sParams.acnt_uid;	// 계좌 UID
	PENSION03S01.variable.sendData.acnt_uid = sParams.acnt_uid;	// 계좌 UID
	//sStorage.clear();

	// 자문 계좌 상세정보 조회
	PENSION03S01.tran.selectDetail();
	
	if(gfn_isLocal()){
		$('.p_assess_limit').show();
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문 계좌 상세정보 조회
PENSION03S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "adviceAcntDetailInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/advice_acnt_detail_info";
	inputParam.data 	= PENSION03S01.variable.sendData;
	inputParam.callback	= PENSION03S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 납입한도 변경내용 반영
PENSION03S01.tran.updateAcntLimitAmt = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAcntLimitAmt";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/update_acnt_limit_amt";
	inputParam.data 	= PENSION03S01.variable.sendData;
	inputParam.callback	= PENSION03S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
PENSION03S01.event.clickBtnHelp = function() {
	// order popup call
	sStorage.setItem("ORDREXE01P01Params", {acnt_no:ComUtil.string.replaceAll(PENSION03S01.variable.detailData.acnt_no, '-', '')});
	
	
	var sParam = {};
	
	/*var oprt_status_cd = PENSION03S01.variable.detailData.oprt_status_cd;
	
	switch(oprt_status_cd){
		case '300' : 
					sParam.url = '/pension_execution/order/ORDREXE01P02';
					break;
		default    :
					sParam.url = '/pension_execution/order/ORDREXE01P01';
					break;
					
	}*/
	
	sParam.url = '/pension_execution/order/ORDREXE01P01';
	gfn_callPopup(sParam, function(){
		sStorage.setItem('endOrderYn', 'Y');
	});
}


// 펀드상세조회 화면 이동
PENSION03S01.event.goFundDetail = function(e) {
	e.preventDefault();
	
	var item = $(this).closest('li').data();
	
	// 해지계좌의 펀드이기 때문에 상세가는것은 막는다.
	if(item.bTerminate){
		return;
	}
	
	sStorage.setItem("PENSION04S01Params", item);
	
	var url = "/pension_mng/PENSION04S01";
	ComUtil.moveLink(url);
}

// 계좌해지 화면 이동
PENSION03S01.event.clickBtnAcntEnd = function(e) {
	e.preventDefault();
	
	
	sStorage.setItem("PENSION04S10Params", PENSION03S01.variable.detailData);
	
	var url = "/pension_mng/PENSION04S10";
	ComUtil.moveLink(url);
}

// 납입한도 변경 팝업 호출 
PENSION03S01.event.clickBtnPopChangeLmtRmdr = function(e) {
	e.preventDefault();
	
	var detailData = PENSION03S01.variable.detailData;
	 
	//if(detailData.tot_pay_amt >= detailData.lmt_rmdr_amt){
	if(detailData.rmin_limit_amt == 0){
		$('#divPop0301_01').show();
	}
	else{
		$("#set_limit_amt").attr("placeholder", detailData.tot_limit_dis);
		$('#divPop0301_02').show();
	}
}

// 납입한도 팝업 닫기
PENSION03S01.event.clickBtnPopClose = function(e) {
 	e.preventDefault();

	$('.modal_wrap', $('#P0301-content')).hide();
}

// 납입한도 변경
PENSION03S01.event.clickBtnPopChangeLmtRmdrOk = function(e) {
 	e.preventDefault();

	//$('.modal_wrap', $('#P0301-content')).hide();
	
	
	var detailData = PENSION03S01.variable.detailData;
	
		
	if(ComUtil.isNull($('#set_limit_amt').val())){
		gfn_alertMsgBox('납입한도 금액을 입력해 주세요.', '', function(){});
		return;
	}
	
	// 금액 확인
	// 납입한도보다 크면 안된다.
	var set_limit_amt = ComUtil.null($('#set_limit_amt').val(), 0);
	if(set_limit_amt > detailData.tot_limit_amt){
		gfn_alertMsgBox('최대 납입한도 금액보다 크게 입력할수 없습니다.', '', function(){
			$('#set_limit_amt').val('');
		});
		return;
	}
	
	if(set_limit_amt == detailData.acnt_set_limit_amt){
		gfn_alertMsgBox('기존 납입한도 금액과 동일합니다. 다시 입력해 주시길 바랍니다.', '', function(){
			$('#set_limit_amt').val('');
		});
		return;
	}
	
	// 기존 납입금액보다 작게 입력하는 경우 
	if(set_limit_amt < detailData.acnt_set_limit_amt){
		gfn_confirmMsgBox('기존 납입한도 금액보다  적게 입력되었습니다. 지금 금액을 입력시 문제가 발생할수 있습니다. 그래도 진행하시겠습니까?', '', function(resultParam){
			if("Y" == resultParam.result){
				// ok일경우 후처리 작업 고고!!
				PENSION03S01.variable.sendData.set_limit_amt = set_limit_amt;
				PENSION03S01.tran.updateAcntLimitAmt();
			}
			else{
				$('#set_limit_amt').val('');
			}
		});
		return;
	}
	
	
	PENSION03S01.variable.sendData.set_limit_amt = set_limit_amt;
	PENSION03S01.tran.updateAcntLimitAmt();
	
}

 
// 삼성펀드링크
PENSION03S01.event.clickbtnCallFundDetail = function(e) {
 	e.preventDefault();

	var item = $(this).closest('.box_r').data();
	
	var inputParam = {};
	inputParam.fund_no 		= item.fund_no;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION03S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		//history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
			if(sid == "adviceAcntDetailInfo"){
				gfn_historyBack();
			}
		});
		return;
	}
	
	
	
	// 연금수령계획 상세내역 조회 
	if(sid == "adviceAcntDetailInfo"){
		// test data
		/*
		result.lmt_rmdr_amt = result.tot_pay_amt;
		result.lmt_rmdr_dis = result.tot_pay_dis;
		result.lmt_rmdr_unit = '만원';
		
		result.lmt_rmdr_dis = ComUtil.number.addCommmas(result.lmt_rmdr_amt);
		result.lmt_rmdr_amt = ComUtil.null(result.lmt_rmdr_amt, 0);
		*/
		//result.rmin_limit_amt = 300;
		//result.acnt_set_limit_amt = 200;
		//-- test data
		
		result.rmin_limit_amt = parseFloat(ComUtil.null(result.rmin_limit_amt, 0));			// 고객잔여한도금액
		result.rmin_limit_dis = ComUtil.number.addCommmas(result.rmin_limit_amt) == 0 ? '-' : ComUtil.number.addCommmas(result.rmin_limit_amt);
		result.rmin_limit_unit = ComUtil.null(result.rmin_limit_unit, '만원');
		
		result.acnt_set_limit_amt = parseFloat(ComUtil.null(result.acnt_set_limit_amt, 0));	// 계좌설정된한도금액
		result.acnt_set_limit_dis = ComUtil.number.addCommmas(result.acnt_set_limit_amt) == 0 ? '-' : ComUtil.number.addCommmas(result.acnt_set_limit_amt);
		result.acnt_set_limit_unit = ComUtil.null(result.acnt_set_limit_unit, '만원');
		// total 고객한도금액
		result.tot_limit_amt = parseInt(result.rmin_limit_amt) + parseInt(result.acnt_set_limit_amt);
		result.tot_limit_dis = ComUtil.number.addCommmas(result.tot_limit_amt);
		result.tot_limit_unit = ComUtil.null(result.acnt_set_limit_unit, '만원');
		
		// 상단 상세 셋팅
		result.advice_acnt_no_nm = ComUtil.pettern.acntNo(ComUtil.null(result.advice_acnt_no, '') + gfn_getAddAcntNoByCd(result.kftc_agc_cd));
		result.acnt_type_nm = gfn_getAcntTypeNm(result.acnt_type);
		PENSION03S01.variable.detailData = result;
		
		
				
		var listLength = 0;
		if(!ComUtil.isNull(result.fund_list)){
			listLength = result.fund_list.length;
		}
		result.totFundCnt = listLength;
		
		PENSION03S01.location.displayDetail(result);
				
		if(0 == listLength){
			$('#no_result').show();
		}
		else{
			$('#no_result').hide();
			
			// 펀드리스트 그리기
			PENSION03S01.location.displayFundList(result.fund_list);
		}
	}
	
	// 납입한도금액 수정
	if(sid == "updateAcntLimitAmt"){
		gfn_alertMsgBox('입금한도 금액을 수정하였습니다.', '', function(){
			// 자문 계좌 상세정보 조회
			PENSION03S01.tran.selectDetail();
			$('#divPop0301_02').hide();
			$('#set_limit_amt').val('');	 // 신규 입력값 초기화
		});
		return;
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
PENSION03S01.location.displayDetail = function(result){
	/*
	var fncl_funll_nm = "";	// 계좌정보 상세 이름
	if(!ComUtil.isNull(result.fncl_agc_nm))			{ fncl_funll_nm += "["+result.fncl_agc_nm+"]"}
	if(!ComUtil.isNull(result.advice_acnt_no))		{ fncl_funll_nm += "["+result.advice_acnt_no_nm+"]"}
	if(!ComUtil.isNull(result.pnsn_prdt_gbn_nm))	{ fncl_funll_nm += "("+result.pnsn_prdt_gbn_nm+")"}
	
	result.fncl_funll_nm = fncl_funll_nm;
	*/
	var fncl_new_nm = "";	// 계좌정보 상세 이름
	if(!ComUtil.isNull(result.fncl_agc_nm))			{ fncl_new_nm = result.fncl_agc_nm;}
	if(!ComUtil.isNull(result.advice_acnt_no))		{ fncl_new_nm = result.advice_acnt_no_nm;}
	result.fncl_new_nm = fncl_funll_nm;
	
	
	
	
	$('#company_img').attr('src', gfn_getImgSrcByCd(result.kftc_agc_cd, 'C'));
	
	
	//oprt_status_cd - 0:정상, 1: 경고, 2:심각, 3: 대기, 4: 잠김
	var oprtInfo = {};
	//if(ComUtil.null(result.advc_acnt_yn, 'N') == 'N'){	// 자문대상계좌여부
		//oprtInfo = gfn_getOprtStatusInfo('99');
	//}
	//else{
		//result.oprt_status_cd = '219';
		oprtInfo = gfn_getOprtStatusInfo(result.oprt_status_cd);
	//}
	$.extend(result, oprtInfo);
	
	PENSION03S01.location.setTerminate(result.bTerminate);
	if(!result.bTerminate){
		if('000' == result.oprt_status_cd){
			$('#divWarn').hide();
		}
		else{
			$('#divWarn').show();
			$('#pTitleWarn').addClass(result.operStatusClass);
		}
	}
	
	
	// 문제해결버튼
	if(ComUtil.null(result.bHelpBtn, true)){
		$('#btnHelp').show();
	}
	
	
	if(result.tot_limit_amt > 0){
		$('#btnPopChangeLmtRmdr').show();
	}
	
	PENSION03S01.variable.detailData = result;
	gfn_setDetails(PENSION03S01.variable.detailData, $('#P0301-content'));
}

// 펀드리스트 그리기
PENSION03S01.location.displayFundList = function(fund_list){
	if(ComUtil.isNull(fund_list)){
		$('#disFundList').hide();
		$('#disGuid').show();
		return;
	}
	else{
		$('#disFundList').show();
		$('#disGuid').hide();
	}
	
	var _template = $("#_dumyFundInfo").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( fund_list, function(index, item){
		item.idx = index+1;
		
		item.invt_plus = (item.invt_rate > 0) ? '+' : '';
		item.invt_rate_class = (item.invt_rate >= 0) ? '' : 'under';
		item.bTerminate = PENSION03S01.variable.detailData.bTerminate;
		 
		var rateInfo = PENSION03S01.location.getRateStatusNm(item.invt_rate_status_cd);
		$.extend(item, rateInfo);
		item.fncl_funll_nm = PENSION03S01.variable.detailData.fncl_funll_nm;
		item.acnt_uid = PENSION03S01.variable.sendData.acnt_uid;
		
		var html = template(item);
		$("#ulFundList").append(html);
		
		// 운영상태코드에 따라 아이콘 변경
		$('#invtInfo_' + item.idx).addClass(rateInfo.addClass);
		$('#fundInfo_' + item.idx).addClass(rateInfo.addBoxClass);
		
		$('#fundInfo_' + item.idx).data(item);
	});
}


// 투자비율상태코드에 따른 값 추출
PENSION03S01.location.getRateStatusNm = function(invt_rate_status_cd){
	var rateInfo = {};
	
	switch(invt_rate_status_cd){
		case '1' : rateInfo.statusText 		= "비중";
		           rateInfo.addStatusClass	= "";
			break; 
		case '2' : rateInfo.statusText 		= "비중 미달";
		           rateInfo.addStatusClass	= "under";
			break; 
		case '3' : rateInfo.statusText 		= "비중 초과";
		           rateInfo.addStatusClass	= "over";
			break; 
		default	 : break;
	}
	
	return rateInfo;
}


// 해지계좌 디자인 적용
PENSION03S01.location.setTerminate = function(bTerminate){
	if(bTerminate){
		$('#P0301_container').addClass('cancel');
		$('#divTerminateY').show();
		$('#divWarn').hide();
		$('#divBtnAcntEnd').hide();
	}
	else{
		$('#divTerminateN').show();
	}
}


PENSION03S01.init();
