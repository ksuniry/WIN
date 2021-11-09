/**
* 파일명 		: UNTOPEN01S01.js (E-01-01)
* 업무		: 비대면계좌개설 > 초기화면
* 설명		: 초기화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN01S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN01S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,showMenu		: false								//
}

/* 이벤트 정의 */
UNTOPEN01S01.events = {
	 'click #btnNext' 							: 'UNTOPEN01S01.event.clickBtnNext'
	//,'click li[id^="fundInfo_"]'					: 'UNTOPEN01S01.event.goFundDetail'
}

UNTOPEN01S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN01S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-01-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN01S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN01S01.location.pageInit = function() {
	
	//if(!ComUtil.isNull(sParams.fund_no)){
	//	UNTOPEN01S01.variable.sendData.fund_no = sParams.fund_no;
	
		// 자문 계좌 상세정보 조회
	//	UNTOPEN01S01.tran.selectDetail();
	//}
	
	// 운영에서만 막아둠..
	//if(!gfn_isOper()){
		$('#btnNext').removeAttr("disabled");
	//}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문계약이 끝난 고객의 계좌개설 진행여부를 질의한다
UNTOPEN01S01.tran.checkUntackOpen = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectCreateAccountStatus";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_create_account_status";
	inputParam.data 	= {};
	inputParam.callback	= UNTOPEN01S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN01S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	// 운영에서만 막아둠..
	//if(!gfn_isOper()){
		// 동의여부 체크
		if($('input:checkbox[id="ckOk"]').is(':checked') == false){
			gfn_alertMsgBox("주요 확인내용을 체크해 주시길 바랍니다.", '', function(){
				//alert("111");
			});
			return;
		}
		
		// 거래호출  자문계약이 끝난 고객의 계좌개설 진행여부를 질의한다	
		UNTOPEN01S01.tran.checkUntackOpen();	
		//ComUtil.moveLink('/untact_open/UNTOPEN02S01', false);
	//}
} 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 자문계약이 끝난 고객의 계좌개설 진행여부를 질의한다
	if(sid == "selectCreateAccountStatus"){
		UNTOPEN01S01.variable.detailData = result;
		/*
		0 : 계좌생성
		1 : 운영시간관련 중지
		2 : 기존고객 사용 불가
		3 : IRP 개설불가
		6 : 자문계약이 끝났으나 비정상 종료 된 경우를 위해 값 추가 및 분기 처리
		9 : 기타사유 중단
		*/
		// test data s
		// result.status = "0";
		// test data e
		// result.status = '3';
		if(!ComUtil.isNull(result.status)){
			var sParam = {};
			if("0" == result.status){
				var url = UNTOPEN01S01.location.getUrlByAcntOpenStatus(result.acnt_open_status);
				ComUtil.moveLink(url);
				return;
			}
			else if("1" == result.status){
				sParam.url = '/untact_open/UNTOPEN02P04';
			}
			else if("2" == result.status){
				sParam.url = '/untact_open/UNTOPEN02P03';
			}
			else if("3" == result.status){
				//sParam.url = '/untact_open/UNTOPEN02P03';
				gfn_alertMsgBox(result.message, '', function(){
					gfn_historyClear();
					sStorage.setItem("MYINFOM02S07Params", {'callHealth':true});
					ComUtil.moveLink('/my_info/MYINFOM02S07', false);
				});
				return;
			}
			else if("4" == result.status){
				sParam.message    = result.message;
				UNTOPEN01S01.location.callScraping(sParam);
				return;
			}
			else if("6" == result.status){		//2021-06-29 분기 추가
				ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC13S01', false);
				return;
			}
			else if("9" == result.status){
				gfn_alertMsgBox(result.message);
				return;
			}
			
			gfn_callPopup(sParam, function(){});
		} 
	}
}

// 네이티브 호출후 콜백함수 
UNTOPEN01S01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 스크랩핑 성공시 재조회
			// 다음버튼 클릭??
			$('#btnNext').trigger('click');
		}
		else{
			// 스크랩핑 실패시
			// 재시도할지 취소할지 컨펌창을 호출한다.
			var detailData = UNTOPEN01S01.variable.detailData;
			//detailData.message = '';
			UNTOPEN01S01.location.callScraping(detailData);
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상단 상세 셋팅
UNTOPEN01S01.location.displayDetail = function(){
	
	gfn_setDetails(UNTOPEN01S01.variable.detailData, $('#f-content'));
}



UNTOPEN01S01.location.getUrlByAcntOpenStatus = function(status){
	var url = "";
	/*
	00 : 비대면 계좌개설 시작
	  -> 비대면 계좌개설 동의 화면으로 이동 
	  -> E-02-01
	01 : 신분증 일련번호 저장 및 비대면 정보 입력 성공
	  -> 고객 정보 입력 화면으로 이동 
	  -> E-06-01
	02 : 고객정보 입력 성공
	  -> 비밀번호 입력 화면으로 이동
	  -> E-09-01
	03 : 고객 계좌개설 완료 
	  -> 비대면 본인확인 입금계좌 입력 
	  ->  E-10-01
	04 : 비대면 본인확인 입금계좌 확인 완료
	  -> 비대면 본인확인 송금체크 화면으로 이동
	  -> E-10-02 
	06 : 비대면 본인확인 송금체크 완료 및 투자자문 계약 완료 
	  -> 투자자문 계약 진행화명으로 이동
	  -> E-12-01
	*/
	switch(status){
		case '00'	: url = '/untact_open/UNTOPEN02S01';
			break;
		case '01'	: url = '/untact_open/UNTOPEN06S01';	// 
			break;
		case '02'	: url = '/untact_open/UNTOPEN09S01';
			break;
		case '03'	: url = '/untact_open/UNTOPEN10S01';
			break;
		case '04'	: url = '/untact_open/UNTOPEN10S02';
			break;
		case '06'	: url = '/advice_execution/advice_contract/ADVCEXC12S01';		// 머플러 자문계약 진행 정보 조회  
			break;
		default 	: url = '/pension_advice/dashBoard/DASHBRD01S01';
			break;
	}
	return url;
}


// 스크랩핑 재시도 요청
UNTOPEN01S01.location.callScraping = function(inputParam){
	inputParam.btnOkTitle = '재시도';
	inputParam.msg = ComUtil.null(inputParam.message, '금융정보 수집을 다시 하시겠습니까?');
	inputParam.screenId = 'UNTOPEN01S01';
	gfn_confirmMsgBox2(inputParam, function(resultParam){
		if("Y" == resultParam.result){
			// ok일경우 후처리 작업 고고!!
			gfn_scraping(inputParam);
		}
		else{
			//var homeUrl = sStorage.getItem('homeUrl');
			//ComUtil.moveLink(homeUrl, false);
		}
	});
	
}

UNTOPEN01S01.init();
