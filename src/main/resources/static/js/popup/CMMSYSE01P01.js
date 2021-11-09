/**
* 파일명 		: CMMSYSE01P01.html  ( a-01-01 )
* 업무		: 시스템 강제 종료 팝업
* 설명		: 시스템 이상시 종료전에 해당 팝업으로 종료를 알려준다.
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.09
* 수정일/내용	: 
*/
var CMMSYSE01P01 = CommonPageObject.clone();

/* 화면내 변수  */
CMMSYSE01P01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
CMMSYSE01P01.events = {
	 //'click li[id^="liPrdt"]'							: 'CMMSYSE01P01.event.clickDetailView'
	 'click #btnTerminateSys'							: 'CMMSYSE01P01.event.clickBtnTerminateSys'
}

CMMSYSE01P01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('CMMSYSE01P01');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	CMMSYSE01P01.location.pageInit();
}


// 화면내 초기화 부분
CMMSYSE01P01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("CMMSYSE01P01Params");
	if(!ComUtil.isNull(sParams)){
		sStorage.setItem("CMMSYSE01P01Params", '');
		$('#msg', $('#PC01-content')).empty().append(sParams.msg); 
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

CMMSYSE01P01.event.clickBtnTerminateSys = function(e) {
 	e.preventDefault();

	gfn_finishView( {msg:'앱을 종료합니다.'});
	//gfn_closePopup();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수

CMMSYSE01P01.callBack = function(sid, result, success){
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수


CMMSYSE01P01.init();
