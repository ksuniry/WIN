/**
* 파일명 		: OPENBNK01S01.html
* 업무		: 오픈뱅킹 메인화면 (ob-01-01)
* 설명		: 오픈뱅킹 사용자 계좌 목록 및 이체대상 목록 조회
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.06
* 수정일/내용	: 2021.05.07
*/
var OPENBNK01S01 = CommonPageObject.clone();

/* 화면내 변수  */
OPENBNK01S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,outAcntInfo	: {}								// 출금계좌 정보 
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// 
}

/* 이벤트 정의 */
OPENBNK01S01.events = {
	 'click li[id^="openBankDetail_"]'			: 'OPENBNK01S01.event.clickOpenBankDetail'
	,'click #btnSelectOtherAcnt'				: 'OPENBNK01S01.event.clickBtnSelectOtherAcnt'
	,'click #btnExecTran'						: 'OPENBNK01S01.event.clickBtnExecTran'				// 입금실행
	,'change input:checkbox[id^="prdChk_"]'		: 'OPENBNK01S01.event.changeTranAcnt'				// 입금할 연금계좌 선택 변경시
	//,'change input:radio[name="rdoOpenBank"]'	: 'OPENBNK01S01.event.changeRadioOpenBank'
	//,'click li[id^="openBankDetail_"]'			: 'OPENBNK01S01.event.changeRadioOpenBank'
}

OPENBNK01S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('OPENBNK01S01');
	
	$("#pTitle").text("오픈뱅킹");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "ob-01-01";
	gfn_azureAnalytics(inputParam);
	
	OPENBNK01S01.location.pageInit();
}


// 화면내 초기화 부분
OPENBNK01S01.location.pageInit = function() {
	// 전달받은 파라미터 셋팅
	
	var sParams = sStorage.getItem("OPENBNK01S01Params");
	if(!ComUtil.isNull(sParams)){
		OPENBNK01S01.variable.sendData.access_token = "Authorization";
	}
	//sStorage.clear();
	
	{
		$('#divModal, .dim').on("click", OPENBNK01S01.location.modalClose);
	}


	// 오픈뱅킹 사용자 계좌 목록 및 이체대상 목록 조회
	OPENBNK01S01.tran.selectDetail();
	
	// 임시데이터로 우선 displayDetails
	OPENBNK01S01.location.displayDetails();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 오픈뱅킹 사용자 계좌 목록 및 이체대상 목록 조회 
OPENBNK01S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getDepositAcnt";
	inputParam.target 	= "api";
	inputParam.url 		= "/open_bank/get_user_account_list";
	inputParam.data 	= OPENBNK01S01.variable.sendData;
	inputParam.callback	= OPENBNK01S01.callBack;
	
	gfn_Transaction( inputParam );
}

// 입금실행하기 
OPENBNK01S01.tran.tranAccount = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "postUserTransAccount";
	inputParam.target 	= "api";
	inputParam.url 		= "/open_bank/post_user_trans_account";
	inputParam.data 	= OPENBNK01S01.variable.sendData;
	inputParam.callback	= OPENBNK01S01.callBack;
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 하단 팝업 계좌 선택시 
OPENBNK01S01.event.clickOpenBankDetail = function(e) {
	e.preventDefault();
	
	var data = $(this).data();
	OPENBNK01S01.variable.outAcntInfo = data;
	
	$('#openBankImg').attr('src', gfn_getImgSrcByCd(data.bank_code_std, 'C'));
	$('#rdoOpenBank_' + data.idx).attr('checked', true);
	// 출금계좌영역 셋팅
	gfn_setDetails(data, $('#openBankAccountInfo'));
}

// 다른계좌 선택 클릭시 
OPENBNK01S01.event.clickBtnSelectOtherAcnt = function(e) {
	e.preventDefault();
	
	$('#divModal').show();
}

// 입금실행 
OPENBNK01S01.event.clickBtnExecTran = function(e) {
	e.preventDefault();
	
	var outAcntInfo = OPENBNK01S01.variable.outAcntInfo;
	
	if(ComUtil.isNull(outAcntInfo)){
		gfn_alertMsgBox("출금계좌가 선택되지 않았습니다.");
		return;
	}
	
	var tot_tran_amt = 0;
	// 유효성 체크 
	{
		var balance_amt = outAcntInfo.balance_amt * 1;
		tot_tran_amt = ComUtil.number.removeCommmas($('#tot_tran_dis').html());
		
		if(tot_tran_amt == 0){
			gfn_alertMsgBox("입금할 연금계좌를 선택해 주세요.");
			return;
		}
		
		if(balance_amt < tot_tran_amt){
			gfn_alertMsgBox("잔액이 부족해서 이체할 수 없습니다. 이체 금액을 잔액보다 적게 선택하세요.");
			return;
		}
	}
	
	$.extend(OPENBNK01S01.variable.sendData, outAcntInfo);
	OPENBNK01S01.variable.sendData.tot_tran_amt = tot_tran_amt;
	
	// 선택되어진 입금계좌들 
	var trans_account_list = new Array();
	$.each($('input:checkbox[id^="prdChk_"]'), function(index, item){
		if($(item).is(":checked")){
			var tranAcntData = $(item).closest("[id^=transAccountDetail_]").data();
			trans_account_list.push(tranAcntData); 
		}
	});
	
	OPENBNK01S01.variable.sendData.trans_account_list = trans_account_list;
	
	// test
	//sStorage.setItem("OPENBNK02S01Params", OPENBNK01S01.variable.sendData);
	//ComUtil.moveLink('/open_banking/OPENBNK02S01'); // 화면이동
	//return;
	
	// 입금실행하기 
	OPENBNK01S01.tran.tranAccount();
}

// 입금계좌 선택 변경시 
OPENBNK01S01.event.changeTranAcnt = function(e) {
	e.preventDefault();
	
	// 총 연금 입금액 계산하기  
	OPENBNK01S01.location.calTotalAmt();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
OPENBNK01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 연금수령계획 상세내역 조회 
	if(sid == "getDepositAcnt"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){});
			return;
		}
		
		OPENBNK01S01.variable.detailData = result;
		// 상세 셋팅
		OPENBNK01S01.location.displayDetails();
	}
	
	
	if(sid == "postUserTransAccount"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){});
			return;
		}
		
		result.outAcntInfo = OPENBNK01S01.variable.outAcntInfo; 	// 출금계좌 정보
		sStorage.setItem("OPENBNK02S01Params", result);
		ComUtil.moveLink('/open_banking/OPENBNK02S01'); // 화면이동
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
OPENBNK01S01.location.displayDetails = function(){
	
	var detailData = OPENBNK01S01.variable.detailData;
	
	// 입금하실 연금계좌 리스트
	{
		var _template = $("#_dumyAccountList").html();
		var template = Handlebars.compile(_template);
		
		if(ComUtil.isNull(detailData.trans_account_list)){
			return;
		}
		
		$.each(detailData.trans_account_list, function(index, item){
			item.idx = index  + 1;
			item.account_num_dis = ComUtil.pettern.acntNo(item.account_num + gfn_getAddAcntNoByCd(item.bank_code_std));
			item.tran_dis = ComUtil.number.addCommmas(item.tran_amt);
			item.tran_unit = "원";
			
			// TDF
			if("99" == item.acnt_type){
				item.obChecked = "";
				item.obDisabled = "";
			}
			else{
				item.obChecked = "checked";
				item.obDisabled = "disabled";
			}
			
			var html = template(item);
			$('#transAccountList').append(html);
			$('#transAccountDetail_' + item.idx).data(item);
		});
		
		OPENBNK01S01.location.calTotalAmt();
	}
	
	//detailData.tot_tran_dis = ComUtil.number.addCommmas(detailData.tot_tran_amt);
	//gfn_setDetails(detailData, $('#f-content'));
	
	
	// 오픈뱅킹 계좌 리스트 셋팅
	{
		var _template = $("#_dumyOpenBankAccountList").html();
		var template = Handlebars.compile(_template);
		
		if(ComUtil.isNull(detailData.open_bank_account_list)){
			return;
		}
		
		$.each(detailData.open_bank_account_list, function(index, item){
			item.idx = index  + 1;
			
			item.account_num_masked = ComUtil.pettern.acntNo(item.account_num_masked + gfn_getAddAcntNoByCd(item.bank_code_std));
			item.balance_dis = ComUtil.number.addCommmas(item.balance_amt);
			
			var html = template(item);
			$('#openBankAccountList').append(html);
			$('#openBankDetail_' + item.idx).data(item);
		});
		
		// 첫번째 계좌를 우선 선택 한다.
		$('#openBankDetail_1').trigger('click');
	}
	
	
}

// 입금하실 연금계좌 선택된 금액들 총합 구하기 
OPENBNK01S01.location.calTotalAmt = function(){
	var totalAmt = 0;
    $.each($('input:checkbox[id^="prdChk_"]'), function(index, item){
		if($(item).is(":checked")){
			var tran_amt = $(item).closest("[id^=transAccountDetail_]").data("tran_amt");
			//totalAmt += parseInt(ComUtil.null(tran_amt, 0)); 
			totalAmt += ComUtil.null(tran_amt, 0) * 1; 
		}
	});
	
	$('#tot_tran_dis').html(ComUtil.number.addCommmas(totalAmt));
}

// modal popup close
OPENBNK01S01.location.modalClose = function(){
    $('#divModal').hide();
}


OPENBNK01S01.init();
