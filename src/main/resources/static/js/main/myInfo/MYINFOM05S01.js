/**
* 파일명 		: MYINFOM05S01.js
* 업무		: 메뉴 > 내정보  > 회원탈퇴확인 (c-05-01)
* 설명		: 회원탈퇴확인
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.24
* 수정일/내용	: 
*/
var MYINFOM05S01 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM05S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,screenType		: 'withdrawal'						// 애드브릭스 이벤트값 
	,screenFType	: 'withdrawal'						// 페이스북 이벤트값
}

/* 이벤트 정의 */
MYINFOM05S01.events = {
	'click #btnNext'										: 'MYINFOM05S01.event.clickBtnNext'
}

MYINFOM05S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM05S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-05-01";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM05S01.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM05S01.location.pageInit = function() {
	
	// 연금관리 메인 상세내역 조회 
	//MYINFOM05S01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 지난 자문 내역 조회 
MYINFOM05S01.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "customerContractInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_info";
	inputParam.data 	= MYINFOM05S01.variable.sendData;
	inputParam.callback	= MYINFOM05S01.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 회원탈퇴 신청중인 회원이 볼 화면으로 이동 
MYINFOM05S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	//gfn_alertMsgBox("회원탈퇴 신청중인 회원이 볼 화면으로 이동중");
	
	// ComUtil.moveLink('/my_info/MYINFOM03S31'); // 회원탈퇴 안내페이지 
	//gfn_goMain();
	gfn_finishView( {msg:'앱을 종료합니다.'});
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM05S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "customerContractInfo"){
		
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 핀번호 호출 및 회원탈퇴 호출
MYINFOM05S01.location.memberSecession = function(){
	var sParam = {};
	sParam.url = '/popup/CMMPINN01P01';
	sParam.title = "";
	sStorage.setItem("CMMPINN01P01Params", sParam);
		
	gfn_callPopup(sParam, function(resultData){
		gfn_log('MYINFOM05S01.callback resultData :::  ' + resultData);
		if(!ComUtil.isNull(resultData)){
			if(ComUtil.isNull(resultData.result)){
				return;
			}
			
			if(resultData.result){
				// 회원탈퇴 호출
				gfn_memberSecession({});
			}
		}
		
	});
}	


MYINFOM05S01.init();
