/**
* 파일명 		: WAITPRO01S01P01.js (e-01-01-pop1)
* 업무			: 
* 설명			: 
* 작성자		: 
* 최초 작성일자	: 
* 수정일/내용	: 
*/
var WAITPRO01S01P01 = CommonPageObject.clone();

WAITPRO01S01P01.variable = {
	 sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
WAITPRO01S01P01.events = {
}

WAITPRO01S01P01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO01S01P01');
	
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-01-01-pop1";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO01S01P01.location.pageInit();
}

// 화면내 초기화 부분
WAITPRO01S01P01.location.pageInit = function() {
	
	//Popup
    $('.popup_close').click(function(){
        $(this).parents('.popup_wrap').hide();
    });
}

WAITPRO01S01P01.init();