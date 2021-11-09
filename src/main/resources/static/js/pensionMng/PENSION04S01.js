/**
* 파일명 		: PENSION04S01.js (pension-m-04-01)
* 업무		: 웰컴보드 > 자산배분 > 계좌 클릭 > 펀트 클릭    펀드 상세정보 화면
* 설명		: 자문계좌내 펀드 상세정보 조회.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.17
* 수정일/내용	: 
*/
var PENSION04S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION04S01.variable = {
	sendData		: {
						acnt_uid : ""			// 계좌 UID
						,fund_no : ""			// 펀드 번호
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normalz
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION04S01.events = {
	 'click #btnHelp'		 						: 'PENSION04S01.event.clickBtnHelp'
	,'click #btnCallFundDetail'						: 'PENSION04S01.event.clickbtnCallFundDetail'
	//,'click li[id^="fundInfo_"]'					: 'PENSION04S01.event.goFundDetail'
}

PENSION04S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION04S01');
	
	$("#pTitle").text("펀드정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-04-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION04S01.location.pageInit();
}


// 화면내 초기화 부분
PENSION04S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("PENSION04S01Params");
	gfn_log("PENSION04S01Params :: ");
	gfn_log(sParams);
	//sStorage.clear();
	
	
	// header light
	/*
	$('#header_' + PENSION04S01.variable.headType).addClass('light');
	
	const winHeight = $('html').height();
    const headHeight = $('.p_head').outerHeight();
    const darkHeight = $('.dark').height();
   
    $('.m_04_01 .box_color').height(winHeight - headHeight - darkHeight + 15);
	*/
	
	
	if(!ComUtil.isNull(sParams.fund_no)){
		PENSION04S01.variable.sendData.acnt_uid = sParams.acnt_uid;
		PENSION04S01.variable.sendData.fund_no = sParams.fund_no;
	
		// 자문 계좌 상세정보 조회
		PENSION04S01.tran.selectDetail();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문 계좌 상세정보 조회
PENSION04S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "adviceAcntFundDtl";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/advice_acnt_fund_dtl";
	inputParam.data 	= PENSION04S01.variable.sendData;
	inputParam.callback	= PENSION04S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
PENSION04S01.event.clickBtnHelp = function() {
	// order popup call
	sStorage.setItem("ORDREXE01P01Params", {acnt_no:ComUtil.string.replaceAll(PENSION04S01.variable.detailData.acnt_no, '-', '')});
	
	var sParam = {};
	
	sParam.url = '/pension_execution/order/ORDREXE01P01';
	gfn_callPopup(sParam, function(){
		sStorage.setItem('endOrderYn', 'Y');
	});
}


// 삼성펀드링크
PENSION04S01.event.clickbtnCallFundDetail = function(e) {
 	e.preventDefault();
	
	var item = PENSION04S01.variable.detailData;
	var inputParam = {};
	inputParam.fund_no 		= item.fund_no;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION04S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
			gfn_historyBack();
		});
			
		return;
	}
	
	
	// 펀드 상세내역 조회 
	if(sid == "adviceAcntFundDtl"){
		PENSION04S01.variable.detailData = result;
		
		// 상단 상세 셋팅
		result.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(result.acnt_no, '') + gfn_getAddAcntNoByCd(result.kftc_agc_cd));
		result.acnt_type_nm = gfn_getAcntTypeNm(result.acnt_type);
		PENSION04S01.location.displayDetail(result);
		
		
		var listLength = 0;
		if(!ComUtil.isNull(result.fund_list)){
			listLength = result.fund_list.length;
		}
		
		
		if(0 == listLength){
			$('#no_result').show();
		}
		else{
			$('#no_result').hide();
			
			// 펀드리스트 그리기
			PENSION04S01.location.displayFundList(result.fund_list);
		}
		
	}
}

// 네이티브 호출후 콜백함수 
PENSION04S01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 외부링크 호출 
	if(key == 'otherLinkOpen'){
		gfn_log("setOtherLinkOpen :: " + result.type);
		gfn_log("passYn :: " + result.passYn);
		gfn_log("idx :: " + result.objId);
		
		if(result.type == "link"){
			//result.objId
		}
		
		if(result.type == "pdf"){
			//result.objId
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
PENSION04S01.location.displayDetail = function(result){
	var fncl_nm = "";	// 계좌정보 상세 이름
	if(!ComUtil.isNull(result.fncl_agc_nm))			{ fncl_nm += "["+result.fncl_agc_nm+"]";}
	if(!ComUtil.isNull(result.acnt_no))				{ fncl_nm += result.acnt_no_dis;}
	if(!ComUtil.isNull(result.pnsn_prdt_gbn_nm))	{ fncl_nm += "("+result.pnsn_prdt_gbn_nm+")";}
	
	result.fncl_nm = fncl_nm;
	
	
	//oprt_status_cd - 0:정상, 1: 경고, 2:심각, 3: 대기, 4: 잠김
	var oprtInfo = gfn_getOprtStatusInfo(result.oprt_status_cd);
	$.extend(result, oprtInfo);
	
	if('000' == result.oprt_status_cd){
		$('#divWarn').hide();
	}
	else{
		$('#divWarn').show();
		$('#pTitleWarn').addClass(oprtInfo.operStatusClass);
	}
	// 문제해결버튼
	if(ComUtil.null(result.bHelpBtn, 'true')){
		$('#btnHelp').show();
	}
	
	PENSION04S01.variable.detailData = result;
	gfn_setDetails(PENSION04S01.variable.detailData, $('#f-content'));
}






PENSION04S01.init();
