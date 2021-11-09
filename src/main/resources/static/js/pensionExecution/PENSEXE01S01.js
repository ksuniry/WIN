/**
* 파일명 		: PENSEXE01S01.js
* 업무		: 거래 (연금실행)> 머플러 자문안 (t-01-01)
* 설명		: 머플러 자문안
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.03
* 수정일/내용	: 
*/
var PENSEXE01S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE01S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,screenType		: 'approval_1'						// 애드브릭스 이벤트값
	,screenFType	: 'approval_basic'					// 페이스북 이벤트값
}

/* 이벤트 정의 */
PENSEXE01S01.events = {
	 'click li[id^="OwnAcntRow_"], li[id^="NewAcntRow_"]'	: 'PENSEXE01S01.event.clickAcntRow'
	,'click #btnNext'										: 'PENSEXE01S01.event.clickBtnNext'
	,'click #btnClear'										: 'PENSEXE01S01.event.clickBtnClear'
}

PENSEXE01S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE01S01');
	
	$("#pTitle").text("자문안 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-01-01";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE01S01.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE01S01.location.pageInit = function() {
	var detailData = sStorage.getItem("PENSEXEDATA");
	
	if(ComUtil.isNull(detailData)){
		// 고객센터 관련 조회  	
		PENSEXE01S01.tran.selectDetail();
	} 
	else{
		PENSEXE01S01.variable.detailData = detailData;
		
		// 상세 셋팅 
		PENSEXE01S01.location.displayDetail();
	}
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 최종 자문안 계좌 목록 조회  
PENSEXE01S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "portfolioAccountList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/portfolio_account_list";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE01S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 다음 버튼 클릭시
PENSEXE01S01.event.clickBtnNext = function(e) {
 	e.preventDefault();
	
	ComUtil.moveLink('/pension_execution/PENSEXE02S01');	// 투자설명서 확인
}

// 다음 버튼 클릭시
PENSEXE01S01.event.clickBtnClear = function(e) {
 	e.preventDefault();
	
	if(gfn_isLocal()){
		sStorage.setItem("PENSEXEDATA", "");
	}
}

// 계좌 클릭시
PENSEXE01S01.event.clickAcntRow = function(e) {
 	e.preventDefault();

	var data = $(this).data();
	
	
	// 자문구분코드  1: [변경], 2: [이체], 3: [유지], 4:[연계], 5:[신규], 9:[해지]
	if("3|4".indexOf(data.advc_gbn_cd) > -1){
		return;
	}
	var url = "/pension_execution/PENSEXE01P02";	// 자문계좌정보 
	
	sStorage.setItem("PENSEXE01P02Params", data);
	
	//ComUtil.moveLink(url);
	
	var sParam = {};
	sParam.url = url;
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSEXE01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "portfolioAccountList"){
		PENSEXE01S01.variable.detailData = result;
		sStorage.setItem("PENSEXEDATA", result);
		
		// 상세 셋팅 
		PENSEXE01S01.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSEXE01S01.location.displayDetail = function(){
	var detailData = PENSEXE01S01.variable.detailData;
	
	// 초기화
	$('#ulOwnAcnt').html('');
	$('#ulNewAcnt').html('');
	var acntCnt = 0;
	
	if(gfn_isNull(detailData.own_acnt_list)){
		$('#no_resultOwnAcnt').show();
	}
	else{
		$('#no_resultOwnAcnt').hide();
		acntCnt += detailData.own_acnt_list.length;
		PENSEXE01S01.location.displayList(detailData.own_acnt_list, 'Own');
	}
	
	
	if(gfn_isNull(detailData.new_acnt_list)){
		$('#no_resultNewAcnt').show();
	}
	else{
		$('#no_resultNewAcnt').hide();
		acntCnt += detailData.new_acnt_list.length;
		PENSEXE01S01.location.displayList(detailData.new_acnt_list, 'New');
	}
	
	// 자문안 갯수가 없으면 
	if(acntCnt == 0){
		$('#btnNext').attr('disabled', true);
	}

}	

PENSEXE01S01.location.displayList = function(list, type){
	var listObj = $('#ul'+type+'Acnt');
	
	if(list.length == 0){
		listObj.hide();
	}
	listObj.show();
	
	var _template = $("#_dumyList").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( list, function(index, item){
		item.idx = index + 1;
		item.type = type;
		item.addClass = "";
		
		if("3|4".indexOf(item.advc_gbn_cd) > -1){
			item.addClass = "default";
		}
		
		var html = template(item);
		listObj.append(html);
		
		$('#' + type + 'AcntRow_' + item.idx).data(item);
	});	
}



PENSEXE01S01.init();
