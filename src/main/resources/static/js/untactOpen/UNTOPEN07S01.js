/**
* 파일명 		: UNTOPEN07S01.js (E-07-01)
* 업무		: 비대면계좌개설 > 계좌별한도입력
* 설명		: 계좌별한도입력
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.11
* 수정일/내용	: 
*/
var UNTOPEN07S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN07S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,initParamData	: {}						// 이전화면에서 받은 파라미터
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'account_cap'						// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
UNTOPEN07S01.events = {
	 'click #btnNext' 							: 'UNTOPEN07S01.event.clickBtnNext'
	//,'click button[id^="btnCk_"]'				: 'UNTOPEN07S01.event.clickCheckOk'
	//,'click div[id^="divCheck_"]'				: 'UNTOPEN07S01.event.clickOpenPop'
	,'click #lmt_rmdr_amt'						: 'UNTOPEN07S01.event.closeTooltip'
	,'click #btnConfirm'						: 'UNTOPEN07S01.event.clickBtnConfirm'
	,'click #btnCancel' 						: 'UNTOPEN07S01.event.clickBtnCancel'
	,'click #questionIcon'						: 'UNTOPEN07S01.event.clickQuestionIcon'
}

UNTOPEN07S01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN07S01');
	
	$("#pTitle").text("연금계좌 납입한도 설정");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-07-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN07S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN07S01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("UNTOPENParams");
	
    //invst_prpst_status   0 : 투자성향 받지 않음, 1 : 투자성향 받음
	if(gfn_isLocal()){
		sParams = ComUtil.null(sParams, {});
		sParams.invst_prpst_status = ComUtil.null(sParams.invst_prpst_status, "0");
	}
	
	if(!ComUtil.isNull(sParams)){
		UNTOPEN07S01.variable.initParamData = sParams;
		UNTOPEN07S01.variable.detailData = sParams;
	//	sStorage.clear();
	}
	else{
		if(!gfn_isLocal()){
			gfn_alertMsgBox("납입한도설정을 위한 정상적인 접근이 아닙니다.", '', function(){
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false);
			});
			return;
		}
	}
	
	
	$(document).off("keydown", '#lmt_rmdr_amt').on("keydown",'#lmt_rmdr_amt',function(e){
		//alert(e.keyCode);
		if(e.keyCode === 13) {
			UNTOPEN07S01.event.clickBtnNext(e);
		}
	});
	

	//$(document).off("click", '.popup_close').on("click",'.popup_close',function(){
    //   $(this).parents('.popup_wrap').hide();
    //});


	// KB 투자성향 필요여부 
	if(ComUtil.null(sParams.invst_prpst_status, '0') == '0'){
		// 투자자 정보확인  팝업 호출
		UNTOPEN07S01.location.callPopupKBInvestProp();
	}
	
	
	UNTOPEN07S01.location.displayDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN07S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	// KB 투자성향분석 완료인지 확인
	if(UNTOPEN07S01.variable.detailData.invst_prpst_status == '0'){
		gfn_confirmMsgBox("투자성향분석을 하셔야만 계좌개설을 진행할수 있습니다.<br> 진행하시겠습니까?", '', function(returnData){
			if(returnData.result == 'N'){
				// 처음화면으로 돌아간다.
				gfn_historyBack();
			}
			else{
				// 투자자 정보확인  팝업 호출
				UNTOPEN07S01.location.callPopupKBInvestProp();
			}
		});
		return;
	}
	
	
	// 한도금액 풀로 입력했는지 확인
	if(0 > ComUtil.null($('#lmt_rmdr_amt').val(), -1)){
		gfn_alertMsgBox("한도금액을 입력해 주세요", '', function(){
			$('#lmt_rmdr_amt').focus();
		});
		return;
	}
	
	
	if($('#lmt_rmdr_amt').val() > UNTOPEN07S01.variable.detailData.lmt_rmdr_amt){
		gfn_alertMsgBox("한도금액보다 많이 입력할수 없습니다.");
		return;
	}
	
	// 전달데이터 셋팅
	var sParams = sStorage.getItem("UNTOPENParams");
	sParams.new_lmt_rmdr_amt = $('#lmt_rmdr_amt').val(); 
	sParams.new_lmt_rmdr_dis = ComUtil.number.addCommmas($('#lmt_rmdr_amt').val()); 
	sParams.lmt_order_dis = ComUtil.number.addCommmas(UNTOPEN07S01.variable.detailData.lmt_order_amt); 
	sParams.acnt_limit_amt_list = UNTOPEN07S01.variable.detailData.new_acnt_list;

	sStorage.setItem("UNTOPENParams", sParams);
	
	
	// 납입한도금액이   자문납입금액보다 적은 경우  
	if(UNTOPEN07S01.variable.detailData.lmt_rmdr_amt < UNTOPEN07S01.variable.detailData.lmt_order_amt){
		sParams.msgType = 'msgType01'; 
		sStorage.setItem("UNTOPENParams", sParams);
	}
	
	
		
	if($('#lmt_rmdr_amt').val() < UNTOPEN07S01.variable.detailData.lmt_order_amt){
		sParams.msgType = 'msgType02'; 
		sStorage.setItem("UNTOPENParams", sParams);
	}
	
	UNTOPEN07S01.showAcctList();
	
	$('#divConfirm').show();
	
	//ComUtil.moveLink('/untact_open/UNTOPEN04S01', false);
}

UNTOPEN07S01.event.closeTooltip = function() {
	$('.tip').hide();  
}

UNTOPEN07S01.event.clickBtnConfirm = function(e) {
	e.preventDefault();
	
	ComUtil.moveLink('/untact_open/UNTOPEN04S01', false);
}

UNTOPEN07S01.event.clickBtnCancel = function(e) {
	e.preventDefault();
	$('#lmt_rmdr_amt').val("");
	// confirm msg call
	$('#divConfirm').hide();
	$('.tip').show();
}

UNTOPEN07S01.event.clickQuestionIcon = function() {

	var sParam = {};
	sParam.url = '/untact_open/UNTOPEN07P04';
	gfn_callPopup(sParam, function(){
	});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
// 상단 상세 셋팅
UNTOPEN07S01.location.displayDetail = function(){
	var detailData = UNTOPEN07S01.variable.detailData;
	
	$("#lmt_rmdr_amt").attr("placeholder", ComUtil.number.addCommmas(detailData.lmt_rmdr_amt));
	$("#lmt_rmdr_amt_txt").html(ComUtil.number.addCommmas(detailData.lmt_rmdr_amt));
	
	$("#lmt_order_amt_txt").html(ComUtil.number.addCommmas(detailData.lmt_order_amt));
	
	if(detailData.invst_prpst_status == '0'){
		$('#divFail').show();
		$('#divOk').hide();
	}
	else{
		$('#divFail').hide();
		$('#divOk').show();
	}
	
	if(detailData.lmt_rmdr_amt < detailData.lmt_order_amt){
		$('.problem-box').show();
	}else{
		$('.problem-box').hide();
	}

}

// 결과 화면 팝업 호출  
UNTOPEN07S01.location.displayInvestPropResult = function(resultData){
	/*var sParam = {};
	sParam.url = '/untact_open/UNTOPEN02P07';
	sStorage.setItem("UNTOPEN02P07Params", resultData);
	gfn_callPopup(sParam, function(){});*/
}

// // 투자자 정보확인  팝업 호출
UNTOPEN07S01.location.callPopupKBInvestProp = function(){
	var sParam = {};
	sParam.url = '/untact_open/UNTOPEN02P06';
	
	gfn_callPopup(sParam, function(resultData){
		
		gfn_log('UNTOPEN02P06.callback resultData :::  ');
		gfn_log(resultData);
		
		if(!ComUtil.isNull(resultData.result)){
			if(resultData.result){
				// 결과 화면 팝업 호출  
				//UNTOPEN07S01.location.displayInvestPropResult(resultData);
				
				UNTOPEN07S01.variable.detailData.invst_prpst_status = '1';
				$('#divFail').hide();
				$('#divOk').show();
				return;
			}
		}
		else{
			gfn_alertMsgBox("투자자 확인사항을 체크해주셔야<br>계좌개설 진행이 가능합니다.");
			return;
		}
	});
}

//숨겨진 연금계좌 연간 납입한도 확인 데이터를 가져와
//데이터를 바인딩하여 팝업창을 보여준고, 
//다음 페이지에 계산한 한도 금액을 넘겨주기 위한 set 도 추가로 한다.
UNTOPEN07S01.showAcctList = function(){
	
	var detailData = sStorage.getItem("UNTOPENParams");
	var lmtRmdrAmt = $("#lmt_rmdr_amt").val();
	var str = "";
	var totalPrice = 0;

	for(var i=0; i < detailData.new_acnt_list.length; i++){
		str += '<li class="modal-acc-list-item" id="divNewAcnt_"+'+i+'>';
		str += '<p class="title">';
		str += '<span>'+detailData.new_acnt_list[i].acnt_nm+'</span>';
		str += '</p>';
		str += '<div class="limit-value">';
		/*str += '<span class="value">'+lmtRmdrAmt * detailData.new_acnt_list[i].pay_limt_rate * 100+'</span><em class="unit">만원</em>';*/
		str += '<span class="value">'+Math.floor(lmtRmdrAmt * detailData.new_acnt_list[i].pay_limt_rate /100) * 1+'</span><em class="unit">만원</em>';
		str += '</div>';
		str += '</li>';
		detailData.acnt_limit_amt_list[i].acnt_limit_amt = Math.floor(lmtRmdrAmt * detailData.new_acnt_list[i].pay_limt_rate /100) * 1;
		totalPrice += Math.floor(lmtRmdrAmt * detailData.new_acnt_list[i].pay_limt_rate /100) * 1; 
	}
	
	str += '<div class="limit-total flex">';
	str += '<p class="title">총 한도(합계)</p>';
	str += '<div class="total-value">';
	str += '<span class="value">'+totalPrice+'</span><em class="unit">만원</em>';
	str += '</div>';
	str += '</div>';
	
	sStorage.setItem("UNTOPENParams", detailData); 
	
	$("#_dumyResult").html(str);
}

UNTOPEN07S01.init();
