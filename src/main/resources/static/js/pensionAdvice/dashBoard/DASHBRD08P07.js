/**
* 파일명 		: DASHBRD08P07.js (D-08-07)
* 업무		: 연금자문 대시보드 > 마이머플러 자문 설명팝업(1,2,3단계)
* 설명		: 내연금 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.20
* 수정일/내용	: 
*/
var DASHBRD08P07 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD08P07.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD08P07.events = {
	 //'click li[id^="liPrdt"]'							: 'DASHBRD08P07.event.clickDetailView'
	//,'click a[id^="btnP02Popup_"]'						: 'DASHBRD08P07.event.clickMovePoint'
}

DASHBRD08P07.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD08P07');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-08-07";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD08P07.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD08P07.location.pageInit = function() {
	
	//Popup
    $('.popup_close').click(function(){
        $(this).parents('.popup_wrap').hide();
    });
    
	// 초기조회
	//DASHBRD08P07.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD08P07.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myPensionCurInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/my_pension_detail";
	//inputParam.url 		= "/pension/my_pension_detail";
	inputParam.data 	= DASHBRD08P07.variable.sendData;
	inputParam.callback	= DASHBRD08P07.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
DASHBRD08P07.event.clickMovePoint = function(e) {
	e.preventDefault();
	
	//var link = $(this).data('link');
}
 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD08P07.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 내연금 상세조회
	if(sid == "myPensionCurInfo"){
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


DASHBRD08P07.init();
