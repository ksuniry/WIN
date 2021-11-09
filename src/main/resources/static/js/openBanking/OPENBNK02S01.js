/**
* 파일명 		: OPENBNK02S01.html
* 업무		: 오픈뱅킹 메인화면 (ob-01-01)
* 설명		: 오픈뱅킹 사용자 계좌 목록 및 이체대상 목록 조회
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.06
* 수정일/내용	: 2021.05.07
*/
var OPENBNK02S01 = CommonPageObject.clone();

/* 화면내 변수  */
OPENBNK02S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// 
}

/* 이벤트 정의 */
OPENBNK02S01.events = {
	 'click #btnConfirm'						: 'OPENBNK02S01.event.clickBtnConfirm'				// 확인 / 재실행
}

OPENBNK02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('OPENBNK02S01');
	
	$("#pTitle").text("오픈뱅킹");
	gfn_OnLoad();
	
	OPENBNK02S01.location.pageInit();
}


// 화면내 초기화 부분
OPENBNK02S01.location.pageInit = function() {
	// 전달받은 파라미터 셋팅
	
	var sParams = sStorage.getItem("OPENBNK02S01Params");
	if(!ComUtil.isNull(sParams)){
		
		OPENBNK02S01.variable.initParamData = sParams;
		OPENBNK02S01.variable.detailData = sParams;
	}
	sStorage.setItem("OPENBNK02S01Params", '');
	//sStorage.clear();
	
	// 임시데이터로 우선 displayDetails
	OPENBNK02S01.location.displayDetails();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 입금실행하기 
OPENBNK02S01.tran.tranAccount = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "postUserTransAccount";
	inputParam.target 	= "api";
	inputParam.url 		= "/open_bank/post_user_trans_account";
	inputParam.data 	= OPENBNK02S01.variable.sendData;
	inputParam.callback	= OPENBNK02S01.callBack;
	
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 확인 / 재실행  버튼 클릭시 
OPENBNK02S01.event.clickBtnConfirm = function(e) {
	e.preventDefault();
	
	if(OPENBNK02S01.variable.detailData.fail_trans_account_list.length > 0){
		// 실패 입금계좌 재시도
		OPENBNK02S01.location.reTranAccount();
	}
	else{
		// 나를 호출한 시작으로 가자
		gfn_historyClear();
		gfn_goMain();
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
OPENBNK02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "postUserTransAccount"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){});
			return;
		}
		
		OPENBNK02S01.variable.detailData = result;
		OPENBNK02S01.location.displayDetails();
	}
	
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
OPENBNK02S01.location.displayDetails = function(){
	// 초기화
	$('#transAccountList').html('');
	$('#btnTitle').html("확인");
	
	var detailData = OPENBNK02S01.variable.detailData;
	
	detailData.balance_dis = ComUtil.number.addCommmas(detailData.balance_amt);
	$('#openBankImg').attr('src', gfn_getImgSrcByCd(detailData.bank_code_std, 'C'));
	//gfn_setDetails(OPENBNK02S01.variable.initParamData.outAcntInfo, $('#openBankAccountInfo'));
	gfn_setDetails(detailData, $('#openBankAccountInfo'));
	
	
	// 입금하실 연금계좌 리스트
	{
		var _template = $("#_dumyAccountList").html();
		var template = Handlebars.compile(_template);
		
		if(!ComUtil.isNull(detailData.success_trans_account_list)){
			$.each(detailData.success_trans_account_list, function(index, item){
				item.idx = index  + 1;
				item.account_num_dis = ComUtil.pettern.acntNo(item.account_num + gfn_getAddAcntNoByCd(item.bank_code_std));
				item.tran_dis = ComUtil.number.addCommmas(item.tran_amt);
				item.tran_unit = "원";
				
				item.passClass = 'complete';
				item.passNm = '성공';
				
				var html = template(item);
				$('#transAccountList').append(html);
				$('#transAccountDetail_' + item.idx).data(item);
			});
			
			OPENBNK02S01.location.calSuccessTotalAmt();
		}
		
		if(!ComUtil.isNull(detailData.fail_trans_account_list)){
			$.each(detailData.fail_trans_account_list, function(index, item){
				item.idx = index  + 1;
				item.account_num_dis = ComUtil.pettern.acntNo(item.account_num + gfn_getAddAcntNoByCd(item.bank_code_std));
				item.tran_dis = ComUtil.number.addCommmas(item.tran_amt);
				item.tran_unit = "원";
							
				item.passClass = '';
				item.passNm = '실패';
				
				var html = template(item);
				$('#transAccountList').append(html);
				$('#transAccountDetail_' + item.idx).data(item);
			});
			
			if(detailData.fail_trans_account_list.length > 0){
				$('#btnTitle').html("재시도");
			}
		}
		
		
	}
	
}


// 입금 성공한 금액들 총합 구하기 
OPENBNK02S01.location.calSuccessTotalAmt = function(){
	var totalAmt = 0;
    $.each(OPENBNK02S01.variable.detailData.success_trans_account_list, function(index, item){
		totalAmt += ComUtil.null(item.tran_amt, 0) * 1;
	});
	
	$('#tot_tran_dis').html(ComUtil.number.addCommmas(totalAmt));
}

// 입금 성공한 금액들 총합 구하기 
OPENBNK02S01.location.calFailTotalAmt = function(){
	var totalAmt = 0;
    $.each(OPENBNK02S01.variable.detailData.fail_trans_account_list, function(index, item){
		totalAmt += ComUtil.null(item.tran_amt, 0) * 1;
	});
	
	return totalAmt;
}


// 실패 입금계좌 재시도
OPENBNK02S01.location.reTranAccount = function(){
	
	var detailData = OPENBNK02S01.variable.detailData;
	
	var tot_tran_amt = 0;		// 총입금액
	var balance_amt = 0;		// 잔액
	// 유효성 체크 
	{
		balance_amt = detailData.balance_amt * 1;
		tot_tran_amt = OPENBNK02S01.location.calFailTotalAmt();
		
		if(balance_amt < tot_tran_amt){
			gfn_alertMsgBox("잔액이 부족해서 이체할 수 없습니다.");
			return;
		}
	}
	
	$.extend(OPENBNK02S01.variable.sendData, OPENBNK02S01.variable.detailData.outAcntInfo);
	OPENBNK02S01.variable.sendData.balance_amt	= balance_amt;
	OPENBNK02S01.variable.sendData.tot_tran_amt = tot_tran_amt;
	
	// 선택되어진 입금계좌들 
	var trans_account_list = new Array();
	$.each(detailData.fail_trans_account_list, function(index, item){
		trans_account_list.push(item); 
	});
	
	OPENBNK02S01.variable.sendData.trans_account_list = trans_account_list;
	
	// 입금실행하기 
	OPENBNK02S01.tran.tranAccount();
}

OPENBNK02S01.init();
