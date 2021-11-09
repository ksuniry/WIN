/**
* 파일명 		: BORDNOT03P05.js (c-03-05)
* 업무		: 연금자문 대시보드 > 공지사항 상세보기
* 설명		: 공지사항 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var BORDNOT03P05 = CommonPageObject.clone();

/* 화면내 변수  */
BORDNOT03P05.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,startTouchX	: 0
	,moveTouchX		: 0
}

/* 이벤트 정의 */
BORDNOT03P05.events = {
	 //'click li[id^="liPrdt"]'							: 'BORDNOT03P05.event.clickDetailView'
	//,'click a[id^="btnP02Popup_"]'						: 'BORDNOT03P05.event.clickMovePoint'
}

BORDNOT03P05.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDNOT03P05');
	
	/*우측밀어서 팝업닫기*/
	ComUtil.event.touchClosePop('BORDNOT03P05', 'P03-content');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-05";
	gfn_azureAnalytics(inputParam);
	
	BORDNOT03P05.location.pageInit();
}


// 화면내 초기화 부분
BORDNOT03P05.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("BORDNOT03P05Params");
	BORDNOT03P05.variable.initParamData = sParams;
	BORDNOT03P05.variable.sendData.board_idx = sParams.board_idx;
	//sStorage.clear();
	
	// 초기조회
	BORDNOT03P05.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
BORDNOT03P05.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "noticeDetail";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/notice_detail";
	inputParam.data 	= BORDNOT03P05.variable.sendData;
	inputParam.callback	= BORDNOT03P05.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
 


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDNOT03P05.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 내연금 상세조회
	if(sid == "noticeDetail"){
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
		
		BORDNOT03P05.variable.detailData = result;
		
		// 상세화면 그리기
		BORDNOT03P05.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
BORDNOT03P05.location.displayDetail = function(){
	var detailData = BORDNOT03P05.variable.detailData;
	// 상세내역 셋팅
	gfn_setDetails(BORDNOT03P05.variable.detailData.notice, $('#P03-content'));
	
	if(!ComUtil.isNull(detailData.thumbnail_img_url)){
		$('#imgThumbnail').attr("src", detailData.thumbnail_img_url);
		$('#imgThumbnail').show();
	}
}



BORDNOT03P05.init();
