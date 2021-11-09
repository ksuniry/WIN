/**
* 파일명 		: PENSION03S03.js
* 업무		: 연금관리  > 연금저축한도 (new_m-03-03.html)
* 설명		: 연금관리 연금저축한도 내역을 조회한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/
var PENSION03S03 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION03S03.variable = {
	detailData 	: {}	// 조회값
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION03S03.events = {
	 'click #navi a' 						: 'PENSION03S03.event.clickTab'
}

PENSION03S03.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION03S03');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-03";
	gfn_azureAnalytics(inputParam);
	
	PENSION03S03.location.pageInit();
}


// 화면내 초기화 부분
PENSION03S03.location.pageInit = function() {
	
	// 연금저축한도 조회 	
	PENSION03S03.tran.selectDetail();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금저축한도 조회 
PENSION03S03.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "addionalPayAmt";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/addional_pay_amt";
	inputParam.data 	= {};
	inputParam.callback	= PENSION03S03.callBack;
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
/*tab 영역 클릭시*/ 
PENSION03S03.event.clickTab = function(e){
	e.preventDefault();

	var linkUrl = "";
	var page = $(this).data('link'); 
	
	switch(page){
		case 'addSave' 			: linkUrl = "/pension_mng/PENSION03S02"; break;	// 추가저축  
		case 'limitSave' 		: linkUrl = "/pension_mng/PENSION03S03"; break;	// 저축한도 
		//case 'changeProd' 		: linkUrl = "/pension_mng/PENSION03S04"; break; // 상품변경
		case 'adviceHistory' 	: linkUrl = "/pension_mng/PENSION03S05"; break;	// 자문이력
		default : return; 
	}

	ComUtil.moveLink(linkUrl, false);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION03S03.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 연금저축한도 조회 
	if(sid == "addionalPayAmt"){
		PENSION03S03.variable.detailData = result;
		gfn_setDetails(PENSION03S03.variable.detailData, $('#f-content'))
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수





PENSION03S03.init();
