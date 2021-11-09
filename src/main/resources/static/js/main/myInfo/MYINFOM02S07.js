/**
* 파일명 		: MYINFOM02S07.js
* 업무		: 메인 > 내정보 > 연동관리 (c-02-07)
* 설명		: 연동관리
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.25
* 수정일/내용	: 
*/
var MYINFOM02S07 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM02S07.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,syncFinanceName : ''								// 금융사 연동시 금융사 이름
}

/* 이벤트 정의 */
MYINFOM02S07.events = {
	 'click #btnSync'						: 'MYINFOM02S07.event.clickBtnSync'
	 ,'click #btnDisc'						: 'MYINFOM02S07.event.clickBtnDisc'
	 ,'click #btnSyncHealth'				: 'MYINFOM02S07.event.clickBtnSyncHealth'
	 ,'click button[id^="btnFinance_"]'		: 'MYINFOM02S07.event.clickBtnSyncFinance'
}

MYINFOM02S07.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM02S07');
	
	$("#pTitle").text("연금 데이터 관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-07";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM02S07.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM02S07.location.pageInit = function() {
	
	var sParams = sStorage.getItem("MYINFOM02S07Params");
	MYINFOM02S07.variable.initParamData = sParams;

	// 통합연금 가입여부 조회 	
	MYINFOM02S07.tran.selectDetail();
	
	//MYINFOM02S07.tran.selectFinancialCompanyList();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 통합연금 가입여부 조회 
MYINFOM02S07.tran.selectDetail = function() {
	var inputParam 		= {};
	inputParam.sid 		= "syncInfo";
	inputParam.target 	= "auth";
	inputParam.url 		= "/lifeplan/select_100_life_plan_site_sync_info";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S07.callBack; 
	
	gfn_Transaction( inputParam );
}


// 금융사 목록 조회 
MYINFOM02S07.tran.selectFinancialCompanyList = function() {
	var inputParam 		= {};
	inputParam.sid 		= "selectFinancialCompanyList";
	inputParam.target 	= "api";
	inputParam.url 		= "/system/select_financial_company_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S07.callBack; 
	
	gfn_Transaction( inputParam );
}

// 통합포털 로그인 해제 호출
MYINFOM02S07.tran.deleteLifeSyncInfo = function() {
	var inputParam 		= {};
	inputParam.sid 		= "deleteLifeSyncInfo";
	inputParam.target 	= "auth";
	inputParam.url 		= "/lifeplan/delete_100_life_plan_site_sync_info";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S07.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 로그인 페이지로 이동
MYINFOM02S07.event.clickBtnSync = function(e) {
 	e.preventDefault();
	
	// 메뉴 > 내정보 > 연금포털 연결하기 로그인 화면
	gfn_movePageLifePlanFirst();
}

// 통합포털 로그인 해제 호출 (아이디/ 패스워드 삭제)
MYINFOM02S07.event.clickBtnDisc = function(e) {
 	e.preventDefault();
	
	
	var inputParam = {};
	inputParam.btnOkTitle = '예';
	inputParam.btnNoTitle = '아니요';
	inputParam.msg = '정말 통합연금포털과 연결을 끊으시겠습니까?';
	
	gfn_confirmMsgBox2(inputParam, function(resultParam){
		if("Y" == resultParam.result){
			// ok일경우 후처리 작업 고고!!
			//alert('deleteLifeSyncInfo call');
			MYINFOM02S07.tran.deleteLifeSyncInfo();
			return;
		}
	});
	return;
	
}

// 건강보험 연결
MYINFOM02S07.event.clickBtnSyncHealth = function(e) {
 	e.preventDefault();
	
	var inputParam = {};
	inputParam.type = 'NHIS';					// 건강보험
	
	// 필수값 체크
	gfn_scraping(inputParam);
}

// 금융사 연결
MYINFOM02S07.event.clickBtnSyncFinance = function(e) {
 	e.preventDefault();

	var item = $(this).closest('.finance').data();
	
	var inputParam = {};
	inputParam.type = item.type;					// 은행, 증권, 보험 
	inputParam.finance = item;
	
	MYINFOM02S07.variable.syncFinanceName = item.name;
	
	// 필수값 체크
	gfn_scraping(inputParam);
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM02S07.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	// 통합연금포털 연결 여부 조회
	if(sid == "syncInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		// 연결하기 / 연결해제 버튼 제어 
		if(ComUtil.null(result.is_sync, 'N') == 'Y'){
			$('#btnSync').hide();
			$('#btnDisc').show();
		}
		else{
			$('#btnSync').show();
			$('#btnDisc').hide();
		}
		
		// 추가 조회 필요
		if(ComUtil.null(result.is_sync, 'N') == 'Y' && ComUtil.null(result.data_sync_term, '0') == '0'){
			// 추가 조회 필요
			MYINFOM02S07.tran.selectFinancialCompanyList();
		}
		else{
			// 초기화
			var a = $('.finance', $('#ulFinanceList'));
			a.remove();
		}
		
		// 건강보험 가져오기 버튼 자동 클릭 기능 추가 
		if(!ComUtil.isNull(MYINFOM02S07.variable.initParamData)){
			if(ComUtil.null(MYINFOM02S07.variable.initParamData.callHealth, false)){
				// 한번만 호출하도록 한다.  중간에 중단한 경우에도 건강보험 뜨는걸 방지 
				var sParams = sStorage.getItem("MYINFOM02S07Params");
				sParams.callHealth = false;
				sStorage.setItem("MYINFOM02S07Params", sParams);
				$('#btnSyncHealth').trigger('click');
			}
		}
	}
	
	// 금융사 목록 조회
	if(sid == "selectFinancialCompanyList"){
		/*if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}*/
		
		MYINFOM02S07.variable.detailData = result;
		MYINFOM02S07.location.displayDetail();
	}
	
	// 통합연금 데이터 동기화 정보(ID/PW 저장여부) 제거
	if(sid == "deleteLifeSyncInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		gfn_alertMsgBox('통합연금포털과 연결이 끊어졌습니다.', '', function(){
			// 재조회 
			MYINFOM02S07.tran.selectDetail();
		});
	}
}



// 네이티브 호출후 콜백함수 
MYINFOM02S07.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.isNull(result.result)){
			gfn_alertMsgBox("정보수집을 하지 못했습니다.", '', function(){});
			return;
		}
		
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
		
		var typeNm = '연금';
		if(result.type == 'NHIS'){					// 건강보험
			typeNm = '건강보험공단에서';
		}
		else{
			typeNm = ComUtil.null(MYINFOM02S07.variable.syncFinanceName + "에서 ", typeNm);
		}
		
		if(errorCnt == 0){
			gfn_log('result..' + result);
			
			
			gfn_alertMsgBox(typeNm + ' 정보를 정상적으로 가져왔습니다.', '', function(){
				//gfn_historyClear();
				//gfn_goMain();
				
				// 건강보험 가져오기 버튼 자동 클릭 기능 추가 
				if(!ComUtil.isNull(MYINFOM02S07.variable.initParamData)){
					if(ComUtil.null(MYINFOM02S07.variable.initParamData.callHealth, false)){
						ComUtil.moveLink('/untact_open/UNTOPEN01S01');
					}
				}
				return;
			});
			return;
			/*
			if(result.type == 'NHIS'){
				// 스크랩핑 성공시 재조회
				gfn_historyClear();
				ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01', false);
			}
			*/
		}
		else{
			gfn_alertMsgBox(ComUtil.null(typeNm + errorMsg, gfn_helpDeskMsg()), '', function(){
				// 로그인은 성공하였으나 아직 정보 생성중일때..
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

// 상세 셋팅
MYINFOM02S07.location.displayDetail = function(){
	var detailData = MYINFOM02S07.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	// 금융사 목록 그리기 
	MYINFOM02S07.location.displayList();
}


MYINFOM02S07.location.displayList = function(){
	var detailData = MYINFOM02S07.variable.detailData;
	
	
	var financeList = new Array();
	//$.extend(financeList, detailData.bank_list, detailData.insurance_company_list);  // 잘 안되네.. ㅠㅠ
	if(!ComUtil.isNull(detailData.bank_list)){
		$.each(detailData.bank_list, function(index, item){
			if(ComUtil.null(item.selected, false)){
				item.type = 'bank';
				financeList.push(item);
			}
		});
	}
	
	if(!gfn_isOper()){
		// 우선 보험사 목록은 보이지 않도록 한다.
		if(!ComUtil.isNull(detailData.insurance_company_list)){
			$.each(detailData.insurance_company_list, function(index, item){
				if(ComUtil.null(item.selected, false)){
					item.type = 'insurance';
					financeList.push(item);
				}
			});
		}
	}

	if(!ComUtil.isNull(detailData.securities_firm_list)){
		$.each(detailData.securities_firm_list, function(index, item){
			if(ComUtil.null(item.selected, false)){
				item.type = 'stock';
				financeList.push(item);
			}
		});
	}
	
	if(!ComUtil.isNull(detailData.pension_info_list)){
		$.each(detailData.pension_info_list, function(index, item){
			if(ComUtil.null(item.selected, false)){
				item.type = 'stock';
				financeList.push(item);
			}
		});
	}
	
	// 초기화
	/*var a = $('.finance', $('#ulFinanceList'));
	a.remove();*/
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( financeList, function(index, item){
		item.idx = index + 1;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		var html = template(item);
		$('#ulFinanceList').append(html);
		$('#financeInfo_' + item.idx).data(item);
	});	
	
}
MYINFOM02S07.init();
