/**
* 파일명 		: MYINFOM03S21.js
* 업무		: 메인 > 내정보 > 통합연금 로그인 (c-03-21)
* 설명		: 통합연금 가입화면 
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.24
* 수정일/내용	: 
*/
var MYINFOM03S21 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S21.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,certLoginYn	: 'N'								// 통합연금포털 인증서 로그인 여부
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S21.events = {
	 'click #btnJoinPage2'						: 'MYINFOM03S21.event.clickBtnJoinPage2'		// 가입하기
	,'click #btnCallLifePlan'					: 'MYINFOM03S21.event.clickBtnCallLifePlan'		// 계정찾기
	,'click #btnLifePlanId'						: 'MYINFOM03S21.event.clickBtnLifePlanId'		// 아이디 로그인 
	,'click #btnCallPopCert'					: 'MYINFOM03S21.event.clickBtnCallPopCert'
	,'click #btnCertLogin'						: 'MYINFOM03S21.event.clickBtnCertLogin'
	,'click #btnClosePop'						: 'MYINFOM03S21.event.clickBtnClosePop'
}

MYINFOM03S21.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S21');
	
	$("#pTitle").text("통합연금포털 연결하기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-21";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S21.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S21.location.pageInit = function() {
	{
		$('.modal-page-btn button, .dim', $('#divPopCert')).on("click", function(){
			$('#divPopCert').hide();
		});
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM03S21.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S21.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 계정찾기 페이지로 webview 호출
MYINFOM03S21.event.clickBtnCallLifePlan = function(e) {
 	e.preventDefault();

	// 브릿지 호출	
	var inputParam = {};
	inputParam.url 			= 'https://100lifeplan.fss.or.kr/login/loginScrn.do?mode=id';
	inputParam.screenId 	= "MYINFOM03S21";
	inputParam.objId	 	= 'span';
	inputParam.inYn		 	= "N";
	inputParam.type		 	= "link";
	
	gfn_otherLinkOpen(inputParam);
}

// 통합포털 회원가입 페이지로 이동
MYINFOM03S21.event.clickBtnLifePlanId = function(e) {
 	e.preventDefault();
	
	ComUtil.moveLink('/my_info/MYINFOM03S20', true);
}

// 통합포털 회원가입 페이지로 이동
MYINFOM03S21.event.clickBtnJoinPage2 = function(e) {
 	e.preventDefault();
	
	ComUtil.moveLink('/my_info/MYINFOM03S22', true);
}



// 공인인증서를 이용한 연결 안내 팝업호출 버튼 클릭시
MYINFOM03S21.event.clickBtnCallPopCert = function(e) {
 	e.preventDefault();

	$('#divPopCert').show();
}

// 공인인증서를 이용한 연결 안내 팝업취소 버튼 클릭시
MYINFOM03S21.event.clickBtnClosePop = function(e) {
 	e.preventDefault();

	$('#divPopCert').hide();
}

// 공인인증서를 이용한 연결 안내 팝업에서 연결하기 버튼 클릭시
MYINFOM03S21.event.clickBtnCertLogin = function(e) {
 	e.preventDefault();

	debugger;

	MYINFOM03S21.variable.certLoginYn = "Y";
	MYINFOM03S21.location.callScraping();
	MYINFOM03S21.variable.certLoginYn = "N";
	$('#divPopCert').hide();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S21.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세조회
	if(sid == "myPnsnList"){
		
	}
}


// 네이티브 호출후 콜백함수 
MYINFOM03S21.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	gfn_log('key :::::::::::  ' + key);
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.isNull(result.result)){
			gfn_alertMsgBox("정보수집을 하지 못했습니다.", '', function(){
				
			});
			return;
		}
		gfn_log('scraping..........................' + result.result.length);
		
		var errorCnt = 0;
		var errorMsg = "";
		var errorCode = "";
		$.each(result.result, function(index, item){
			// 스크랩핑 실패
			if(parseInt(ComUtil.null(item.errorCode, '-1')) != 0){
				errorCnt++;
				errorMsg = item.errorMsg;
				errorCode = item.errorCode;
			}
		});
		
		gfn_log('errorCnt..........................' + errorCnt);
		
		if(errorCnt == 0){
			gfn_log('result..');
			gfn_log(result);
			// 스크랩핑 성공시 재조회
			gfn_historyClear();
			gfn_goMain();
		}
		else{
			if('42110000|'.indexOf(errorCode) > -1){
				errorMsg = '통합연금포털에서 조회한 결과 고객님의 연금을 찾을 수 없습니다.';
			}
			
			gfn_alertMsgBox(ComUtil.null(errorMsg, gfn_helpDeskMsg()), '', function(){
				// 로그인은 성공하였으나 아직 정보 생성중일때..
				gfn_log('errorCode :: ' + errorCode);
				if(errorCode == "80002E26"){
					gfn_historyClear();
					gfn_goMain();
				}
			});
			return;
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 통합연금 로그인(스크랩핑)
MYINFOM03S21.location.callScraping = function(){
	
	var inputParam = {};
	inputParam.type = 'lifeplan';
	
	if(MYINFOM03S21.variable.certLoginYn == 'N'){
		inputParam.userId = $('#userId').val();
		inputParam.userPw = $('#userPw').val();
		
		gfn_log("inputParam.userId :: " + inputParam.userId);
		gfn_log("inputParam.userPw :: " + inputParam.userPw);
		
		// 필수값 체크
		if(ComUtil.isNull(inputParam.userId) || ComUtil.isNull(inputParam.userPw)){
			return;
		}
	}
	
	gfn_scraping(inputParam);
}




MYINFOM03S21.init();
