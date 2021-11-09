/**
* 파일명 		: BORDSCF03P12.js (c-03-12)
* 업무		: 연금자문 대시보드 > 투자컨텐츠 상세
* 설명		: 투자컨텐츠 상세
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var BORDSCF03P12 = CommonPageObject.clone();

/* 화면내 변수  */
BORDSCF03P12.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,startTouchX	: 0
	,moveTouchX		: 0
}

/* 이벤트 정의 */
BORDSCF03P12.events = {
	 'click li[id^="liPrdt"]'							: 'BORDSCF03P12.event.clickDetailView'
	//,'click a[id^="btnP02Popup_"]'						: 'BORDSCF03P12.event.clickMovePoint'
}

BORDSCF03P12.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDSCF03P12');
	
	/*우측밀어서 팝업닫기*/
	ComUtil.event.touchClosePop('BORDIVS03P11', 'P03-content');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-12";
	gfn_azureAnalytics(inputParam);
	
	BORDSCF03P12.location.pageInit();
}


// 화면내 초기화 부분
BORDSCF03P12.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("BORDSCF03P12Params");
	BORDSCF03P12.variable.initParamData = sParams;
	BORDSCF03P12.variable.sendData.category = sParams.category;
	BORDSCF03P12.variable.sendData.board_idx = sParams.board_idx;
	//sStorage.clear();
    
	// 초기조회
	BORDSCF03P12.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
BORDSCF03P12.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "boardDetail";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/board_detail";
	inputParam.data 	= BORDSCF03P12.variable.sendData;
	inputParam.callback	= BORDSCF03P12.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
BORDSCF03P12.event.clickMovePoint = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
}

 
// 계좌별 상세화면 호출 
BORDSCF03P12.event.clickDetailView = function(e) {
	e.preventDefault();
	
	var sParams = {};
	sParams = $(this).data();
	sStorage.setItem("BORDSCF03P12Params", sParams);
	
	var sParam = {};
	sParam.url = "/pension_advice/dashBoard/BORDSCF03P12";	// 종류별 연금 상세보기
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDSCF03P12.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 내연금 상세조회
	if(sid == "boardDetail"){
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
		
		BORDSCF03P12.variable.detailData = result;
		
		// 상세화면 그리기
		BORDSCF03P12.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
BORDSCF03P12.location.displayDetail = function(){
	var detailData = BORDSCF03P12.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData.board, $('#P03-content'));
	
	if(!ComUtil.isNull(detailData.thumbnail_img_url)){
		$('#imgThumbnail').attr("src", detailData.thumbnail_img_url);
		$('#imgThumbnail').show();
	}
}



BORDSCF03P12.init();
