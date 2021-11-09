/**
* 파일명 		: PENSION02S02.js
* 업무		: 연금관리 > 인덱스 화면  (new_m-02-02)
* 설명		: 연금관리 관련 화면으로 이동할수 있도록 한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/
var PENSION02S02 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION02S02.variable = {
	showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION02S02.events = {
	 'click .box_r > a '					: 'PENSION02S02.event.clickLink'
}

PENSION02S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION02S02');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-02-02";
	gfn_azureAnalytics(inputParam);
	
	PENSION02S02.location.pageInit();
}


// 화면내 초기화 부분
PENSION02S02.location.pageInit = function() {
	
}

// 화면이동
PENSION02S02.event.clickLink = function(e) {
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

	ComUtil.moveLink(linkUrl);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION02S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "saveQna"){
		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////




PENSION02S02.init();
