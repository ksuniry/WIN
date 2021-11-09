/**
* 파일명 		: PENSEXE05S01.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 최종화면 (t-05-01)
* 설명		: 최종화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.07
* 수정일/내용	: 
*/
var PENSEXE05S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE05S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,bPwd			: false								// 패스워드 팝업창 호출 필요 여부
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
PENSEXE05S01.events = {
	 'click #btnPensionExeOk'							: 'PENSEXE05S01.event.clickBtnPensionExeOk'
}

PENSEXE05S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE05S01');
	
	$("#pTitle").text("실행절차안내");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-05-01";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE05S01.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE05S01.location.pageInit = function() {
	PENSEXE05S01.variable.initParamData = sStorage.getItem("PENSEXEDATA");
	
	// 전송데이터 셋팅 s
	if(ComUtil.isNull(PENSEXE05S01.variable.initParamData.ptfl_seq_no)){
		gfn_alertMsgBox("자문일련번호 없습니다. 정상적인 접근이 아닙니다.", '', function(){
			ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);
		});
		return;
	}
	/*
	// 좀더확인 필요
	if(ComUtil.isNull(PENSEXE05S01.variable.initParamData.smpl_invt_expl_all_chk_yn)
	|| ComUtil.isNull(PENSEXE05S01.variable.initParamData.invt_fund_list)
	){
		gfn_alertMsgBox("정상적인 접근이 아닙니다.", '', function(){
			ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);
		});
		return;
	}
	*/
	PENSEXE05S01.variable.sendData.ptfl_seq_no 					= PENSEXE05S01.variable.initParamData.ptfl_seq_no; 
	PENSEXE05S01.variable.sendData.import_content_check_yn	 	= PENSEXE05S01.variable.initParamData.import_content_check_yn;
	PENSEXE05S01.variable.sendData.pwd						 	= '';
	var invt_fund_list = [];
	
	$.each(PENSEXE05S01.variable.initParamData.own_acnt_list, function(index, item){
		// 2 : 이체,   11 : 퇴직연금 IRP
		if( item.advc_gbn_cd == '2' && item.acnt_type == '11' ){
			PENSEXE05S01.variable.bPwd = true;
		}
	});
	
	
	$.each(PENSEXE05S01.variable.initParamData.invt_fund_list, function(index, item){
		var detail = {};
		detail.prdt_cd 					= item.prdt_cd;
		detail.smpl_invt_expl_chk_dtm 	= item.smpl_invt_expl_chk_dtm;
		
		invt_fund_list.push(detail);
	});
	PENSEXE05S01.variable.sendData.invt_fund_list 				= invt_fund_list;
	// 전송데이터 셋팅 e
	
	// 고객센터 관련 조회  	
	//PENSEXE05S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 최종승인내역 등록 
PENSEXE05S01.tran.savePensionAdvice = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "executePortfolio";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/execute_portfolio";
	inputParam.data 	= PENSEXE05S01.variable.sendData;
	inputParam.callback	= PENSEXE05S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 승인버튼 
PENSEXE05S01.event.clickBtnPensionExeOk = function(e) {
 	e.preventDefault();

	if(PENSEXE05S01.variable.bPwd){
		var inputParam = {};
		inputParam.callback = PENSEXE05S01.callBack.popPassword;
		inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
		gfn_callPwdPopup(inputParam);
	}
	else{
		// 최종승인내역 등록 
		PENSEXE05S01.tran.savePensionAdvice();
	}

	
	// 자문안 실행은 이체신청확인에서 하기로함
	//sStorage.setItem("PENSEXEDATA", PENSEXE05S01.variable.sendData);
	//ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S02', false);	// 이체신청확인
	
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSEXE05S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		sStorage.setItem("PENSEXEDATA", '');
		//ComUtil.moveLink('/pension_execution/PENSEXE01S01');	// 최초 화면으로 이동
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
		//sStorage.setItem("PENSEXEDATA", '');
			// 어디로 가나??
		return;
	}
	
	
	if(sid == "executePortfolio"){
		gfn_setUserInfo('status', 		'wait');			// 자문대기
		gfn_historyClear();
		gfn_goMain();
		//ComUtil.moveLink('/pension_mng/PENSION01M00');	// 최초 화면으로 이동   m-01
		
		/*// 이체유무
		if(1==1){
			// 이동페이지 
			ComUtil.moveLink('/pension_mng/PENSION01M00');	// 계좌이체(이전) 기관에 계좌이체 신청
		}
		else{
			ComUtil.moveLink('/pension_mng/PENSION01M00');	// 최초 화면으로 이동   m-01
		}*/
	}
}


// 비밀번호 입력후 팝업 콜백함수 
PENSEXE05S01.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		PENSEXE05S01.variable.sendData.pwd = returnParam.pwd;
		  
		// 최종승인내역 등록 
		PENSEXE05S01.tran.savePensionAdvice();
	}
	else{
		gfn_alertMsgBox("계좌비밀번호를 입력하셔야 자문안 등록이 가능합니다.");
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 지역함수



PENSEXE05S01.init();
