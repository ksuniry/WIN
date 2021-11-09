/**
* 파일명 		: DASHBRD08P03.js (pension-D-08-03)
* 업무		: 연금자문 대시보드 > 머플러플랜 > 머플러플랜 자세히 보기
* 설명		: 머플러플렌 자세히 보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.30
* 수정일/내용	: 
*/
var DASHBRD08P03 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD08P03.variable = {
	sendData		: {
		retr_avg_exp_amt : ""							// 은퇴 후 월평균 생활비
	}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,tabIdx			: '1'								// 현재 1 / 제안 2
	,chart2_1 		: {}								// 2단계 현재차트
	,chart2_2 		: {}								// 2단계 제안차트
	,chart3 		: {}								// 중간차트(연금준비율)
	,lock 			: false								// 중복클릭 제거용
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD08P03.events = {
}

DASHBRD08P03.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD08P03');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-08-03";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD08P03.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD08P03.location.pageInit = function() {
    
	//Popup
    $('.popup_close').click(function(){
        $(this).parents('.popup_wrap').hide();
    });
		
	// 초기조회
	//DASHBRD08P03.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 머플러 월평균 예상수령액 조회 (현재/제안)
DASHBRD08P03.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "mufflerPlan";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/muffler_plan";
	inputParam.data 	= DASHBRD08P03.variable.sendData;
	inputParam.callback	= DASHBRD08P03.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD08P03.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 머플러플랜 조회
	if(sid == "mufflerPlan"){
		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수




DASHBRD08P03.init();
