/**
* 파일명 		: BORDIVS03P11.js (pension- c-03-11)
* 업무		: 연금자문 대시보드 > 상세보기
* 설명		: 스터디카페 컨텐츠
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var BORDIVS03P11 = CommonPageObject.clone();

/* 화면내 변수  */
BORDIVS03P11.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,startTouchX	: 0
	,moveTouchX		: 0
}

/* 이벤트 정의 */
BORDIVS03P11.events = {
	 'click li[id^="liPrdt"]'							: 'BORDIVS03P11.event.clickDetailView'
	//,'click a[id^="btnP02Popup_"]'						: 'BORDIVS03P11.event.clickMovePoint'
}

BORDIVS03P11.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDIVS03P11');
	
	/*우측밀어서 팝업닫기*/
	ComUtil.event.touchClosePop('BORDIVS03P11', 'P03-content');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-11";
	gfn_azureAnalytics(inputParam);
	
	BORDIVS03P11.location.pageInit();
}


// 화면내 초기화 부분
BORDIVS03P11.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("BORDIVS03P11Params");
	BORDIVS03P11.variable.initParamData = sParams;
	BORDIVS03P11.variable.sendData.category = sParams.category;
	BORDIVS03P11.variable.sendData.board_idx = sParams.board_idx;
	//sStorage.clear();
	
	// 0 : 투자이야기  , 1 : 스터디카페
	if(BORDIVS03P11.variable.sendData.category == '0'){
		$("#pTitle", $("#P03-content")).text("투자이야기");
	}
    else if(BORDIVS03P11.variable.sendData.category == '1'){
		$("#pTitle", $("#P03-content")).text("스터디카페");
	}
	// 초기조회
	BORDIVS03P11.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
BORDIVS03P11.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "boardDetail";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/board_detail";
	inputParam.data 	= BORDIVS03P11.variable.sendData;
	inputParam.callback	= BORDIVS03P11.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
BORDIVS03P11.event.clickMovePoint = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
}

 
// 계좌별 상세화면 호출 
BORDIVS03P11.event.clickDetailView = function(e) {
	e.preventDefault();
	
	var sParams = {};
	sParams = $(this).data();
	sStorage.setItem("BORDIVS03P11Params", sParams);
	
	var sParam = {};
	sParam.url = "/pension_advice/dashBoard/BORDIVS03P11";	// 종류별 연금 상세보기
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDIVS03P11.callBack = function(sid, result, success){
	
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
		
		BORDIVS03P11.variable.detailData = result;
		
		// 상세화면 그리기
		BORDIVS03P11.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
BORDIVS03P11.location.displayDetail = function(){
	var detailData = BORDIVS03P11.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData.board, $('#P03-content'));
	
	if(!ComUtil.isNull(detailData.thumbnail_img_url)){
		$('#imgThumbnail').attr("src", detailData.thumbnail_img_url);
		$('#imgThumbnail').show();
	}
}



BORDIVS03P11.init();
