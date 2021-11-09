/**
* 파일명 		: MYINFOM03S23.js
* 업무		: 메인 > 내정보 > 통합포털회원가입 약관동의​	(C-03-23)
* 설명		: 통합포털회원가입 약관동의
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.25
* 수정일/내용	: 
*/
var MYINFOM03S23 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S23.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S23.events = {
	 'click #btnOk'								: 'MYINFOM03S23.event.clickBtnOk'
	 ,'change input:radio[name="radio_all"]'	: 'MYINFOM03S23.event.changeAllCheck'
	 ,'change input:radio[name^="rd"]'			: 'MYINFOM03S23.event.changeCheck'
}

MYINFOM03S23.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S23');
	
	$("#pTitle").text("통합연금포털 가입하기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-23";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S23.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S23.location.pageInit = function() {

	// 통합연금포털 회원가입 약관 정보 조회 요청 	
	MYINFOM03S23.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 통합연금포털 약관동의 내역 조회 
MYINFOM03S23.tran.selectDetail = function() {
	var inputParam 		= {};
	inputParam.sid 		= "siteRegTerm";
	inputParam.target 	= "auth";
	inputParam.url 		= "/lifeplan/select_100_life_plan_site_reg_term";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S23.callBack; 
	
	gfn_Transaction( inputParam );
}


// 통합연금포털 약관동의 내역 저장 
MYINFOM03S23.tran.updateRegTerm = function() {
	var inputParam 		= {};
	inputParam.sid 		= "updateRegTerm";
	inputParam.target 	= "auth";
	inputParam.url 		= "/lifeplan/update_100_life_plan_site_reg_term";
	inputParam.data 	= MYINFOM03S23.variable.sendData;
	inputParam.callback	= MYINFOM03S23.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 
MYINFOM03S23.event.clickBtnOk = function(e) {
 	e.preventDefault();
	
	if($('input:radio[name=radio_all][value="N"]').is(':checked')){
		gfn_alertMsgBox("약관동의가 되지 않았습니다.", '', function(){});
		return;
	}
	
	/*
	// 약관동의 여부 저장은 회원가입과 동시에 저장하는걸로 변경
	MYINFOM03S23.variable.sendData.content = "Y";
	MYINFOM03S23.tran.updateRegTerm();
	*/
	
	sStorage.setItem("MYINFOM03S24Params", MYINFOM03S23.variable.sendData);
		
	// 저장 하였으면 다음 화면으로 가자.
	ComUtil.moveLink('/my_info/MYINFOM03S24', true);
}

// 모두 동의
MYINFOM03S23.event.changeAllCheck = function(e) {
 	e.preventDefault();
	
	$.each($('input:radio[name^=rd][value="'+$(this).val()+'"]'), function(index, item){
		//gfn_log("item.id :: " + item.id);
		$(item).attr("checked", true);
		
	});
}

// 개별 동의 변경시 전체체크 셋팅
MYINFOM03S23.event.changeCheck = function(e) {
 	e.preventDefault();
	
	
	if($('input:radio[name^=rd][value="Y"]:checked').length == $('input:radio[name^=rd][value="Y"]').length){
		$('input:radio[name=radio_all][value="Y"]').attr("checked", true);
	}
	else{
		$('input:radio[name=radio_all][value="N"]').attr("checked", true);
	}
} 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S23.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 약관조회
	if(sid == "siteRegTerm"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			return;
		}
		MYINFOM03S23.variable.detailData = result;
		gfn_setDetails(MYINFOM03S23.variable.detailData, $('#f-content'));
	}
	// 약관저장
	if(sid == "updateRegTerm"){
		
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			return;
		}
		
		sStorage.setItem("MYINFOM03S24Params", MYINFOM03S23.variable.sendData);
		
		// 저장 하였으면 다음 화면으로 가자.
		ComUtil.moveLink('/my_info/MYINFOM03S24', true);
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S23.location.displayDetail = function(){
	var detailData = MYINFOM03S23.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
}



MYINFOM03S23.init();
