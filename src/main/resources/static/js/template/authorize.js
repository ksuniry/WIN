/**
* 파일명 		: AUTHORIZE.js
* 업무		: 개별인증 테스트 화면  
* 설명		: 개별인증 값 전달한다.  
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/
var AUTHORIZE = CommonPageObject.clone();

/* 화면내 변수  */
AUTHORIZE.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: {}								// 팝업에서 결과값 리턴시 사용
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
	,screenType		: 'welcome_board'					// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
AUTHORIZE.events = {
	 'click #btnNext' 				: 'AUTHORIZE.event.saveQna'
}

AUTHORIZE.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('AUTHORIZE');
	
	//$("#pTitle").text("qna");
	gfn_OnLoad();
	
	AUTHORIZE.location.pageInit();
}

// 화면내 초기화 부분
AUTHORIZE.location.pageInit = function() {
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
AUTHORIZE.tran.callOpenApi = function(uri) {
	var inputParam 		= {};
	inputParam.sid 		= "gettoken";
	inputParam.target 	= "oapi";
	inputParam.url 		= "/mdapi/oauth/2.0/token/002";
	inputParam.data 	= AUTHORIZE.variable.sendData;
	inputParam.callback	= AUTHORIZE.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 저장버튼 클릭 이벤트
AUTHORIZE.event.saveQna = function(e) {
	AUTHORIZE.variable.sendData.code = $('#code').val();
	AUTHORIZE.variable.sendData.user_ci = sStorage.getItem('user_ci');;
	AUTHORIZE.tran.callOpenApi();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
AUTHORIZE.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		//history.back();
		return;
	}
	
	debugger;
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	
	if(sid == "gettoken"){
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 지역함수

AUTHORIZE.init();
