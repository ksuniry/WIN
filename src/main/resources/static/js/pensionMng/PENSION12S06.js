/**
* 파일명 		: PENSION12S06.js 
* 업무			: 리밸런싱 (m-12-06)
* 설명			: 리밸런싱 
* 작성자		: 
* 최초 작성일자	: 
* 수정일/내용	: 
*/
var PENSION12S06 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION12S06.variable = {
	sendData		: {}							// 조회시 조건
	,detailData		: {}							// 조회 결과값
	,initParamData	: {}							// 이전화면에서 받은 파라미터
	,headType		: 'normal'						// 해더영역 디자인    default 는 normal
	,showMenu		: false							// default : true
}

/* 이벤트 정의 */
PENSION12S06.events = {
	 'click #btnSave'				: 'PENSION12S06.event.saveChangeContent'
	//,'click #retirementAge' 		: 'PENSION12S06.event.callKeyPad'
	//,'click #monthlySalary' 		: 'PENSION12S06.event.callKeyPad'
	//,'click #payforMonth' 			: 'PENSION12S06.event.callKeyPad'			
}

PENSION12S06.init = function(){
	
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION12S06');
	
	$("#pTitle").text("리밸런싱");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-06";
	gfn_azureAnalytics(inputParam);
	
	PENSION12S06.location.pageInit();
	
}

PENSION12S06.location.pageInit = function() {
	PENSION12S06.tran.selectDetail();
}

// 데이터 조회 API 호출
PENSION12S06.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "rebalancingInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/rebalancing";
	inputParam.data 	= {};
	inputParam.callback	= PENSION12S06.callBack; 
	
	gfn_Transaction( inputParam );
}

PENSION12S06.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	PENSION12S06.variable.detailData = result;
	
	//조회한 데이터를 넘겨 화면에 필요한 데이터를 SET 한다.
	//PENSION12S06.event.setData(result);
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
			gfn_historyBack();
		});
		return;
	}
	gfn_setDetails(PENSION12S06.variable.detailData, $('#f-content'));
}


//키패드 호출
PENSION12S06.event.callKeyPad = function(e) {
	e.preventDefault();
	
	gfn_callKeyPad(this);
}


/** 아직 적용하지 않음 2021-07월 중순 기준 */
//입력 된 내용을 서버에 저장
/*PENSION12S06.tran.updateRebalancingData = function(){
	var inputParam 		= {};
	inputParam.sid 		= "rebalancingSave";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/rebalancing";
	inputParam.data 	= PENSION12S06.variable.sendData;
	inputParam.callback	= PENSION12S06.callBack; 
	
	gfn_Transaction( inputParam );
}*/


//변경내용 저장하기 버튼 클릭시
PENSION12S06.event.saveChangeContent = function(e) {
	e.preventDefault();
	
	PENSION12S06.variable.sendData.retr_age			 = $("#retirementAge").val();
	PENSION12S06.variable.sendData.mon_income_amt	 = $("#monthlySalary").val();
	PENSION12S06.variable.sendData.mon_expense_amt   = $("#payforMonth").val();
	
	
	/** 아직 적용하지 않음 2021-07월 중순 기준 */
	//은퇴나이
	/*if(ComUtil.isNull(PENSION12S06.variable.sendData.retr_age)){
		gfn_alertMsgBox('은퇴나이를 입력 하지 않았습니다.');
		return;
	}
	//월수입
	if(ComUtil.isNull(PENSION12S06.variable.sendData.mon_income_amt)){
		gfn_alertMsgBox('월수입을 입력 하지 않았습니다.');
		return;
	}
	//월지출
	if(ComUtil.isNull(PENSION12S06.variable.sendData.mon_expense_amt)){
		gfn_alertMsgBox('월지출을 입력 하지 않았습니다.');
		return;
	}
	
	PENSION12S06.tran.updateRebalancingData();*/	
	
	gfn_alertMsgBox('준비 중입니다. 서비스가 곧 제공될 예정이오니 양해부탁드립니다.');
	
	return;
}


//화면 로드시 각 데이터 바인딩
PENSION12S06.event.setData = function(result) {
	$("#reblnc_est_dt").text(result.reblnc_est_dt);
	$("#reblnc_remn_prd").text(result.reblnc_remn_prd);
	$("#retr_age").text(result.retr_age);
	$("#mon_income_amt").text(result.mon_income_dis);
	$("#mon_expense_amt").text(result.mon_expense_dis);
}

PENSION12S06.init();
