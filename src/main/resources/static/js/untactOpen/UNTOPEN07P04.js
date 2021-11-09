/**
* 파일명 		: UNTOPEN07P04.js (E-07-04)
* 업무			: 비대면계좌개설 > 연금계좌 납입 한도 설정 > 납입한도 팝업
* 설명			: 납입한도 설명
* 작성자		: 박광현
* 최초 작성일자	: 2021.06.30
* 수정일/내용	: 
*/
var UNTOPEN07P04 = CommonPageObject.clone();

/*화면내 변수*/
UNTOPEN07P04.variable = {
	 sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
UNTOPEN07P04.events = {
}

UNTOPEN07P04.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN07P04');
	
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-07-04";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN07P04.location.pageInit();
}

// 화면내 초기화 부분
UNTOPEN07P04.location.pageInit = function() {
	
	//Popup
    $('.popup_close').click(function(){
        $(this).parents('.popup_wrap').hide();
    });
}

UNTOPEN07P04.init();