/**
* 파일명 		: MYINFOM03S30.js
* 업무		: 메뉴 > 내 자문 내역 > 마이머플러 자문안 (c-03-30)
* 설명		: 마이머플러 자문안
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.09
* 수정일/내용	: 
*/
var MYINFOM03S30 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S30.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,screenType		: 'approval_1'						// 애드브릭스 이벤트값
	,screenFType	: 'approval_basic'					// 페이스북 이벤트값
}

/* 이벤트 정의 */
MYINFOM03S30.events = {
	 'click li[id^="OwnAcntRow_"], li[id^="NewAcntRow_"]'	: 'MYINFOM03S30.event.clickAcntRow'
	,'click #btnNext'										: 'MYINFOM03S30.event.clickBtnNext'
	,'click #btnClear'										: 'MYINFOM03S30.event.clickBtnClear'
}

MYINFOM03S30.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S30');
	
	$("#pTitle").text("자문 내용");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-30";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S30.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S30.location.pageInit = function() {
	MYINFOM03S30.variable.initParamData = sStorage.getItem("MYINFOM03S30Params");
	
	MYINFOM03S30.variable.sendData.ptfl_seq_no = MYINFOM03S30.variable.initParamData.ptfl_seq_no;	// 자문계약 일련 번호
	
		// 연금관리 메인 상세내역 조회 
	MYINFOM03S30.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 지난 자문 내역 조회 
MYINFOM03S30.tran.selectDetail = function() {
	var inputParam 		= {};
	inputParam.sid 		= "customerContractInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_info";
	inputParam.data 	= MYINFOM03S30.variable.sendData;
	inputParam.callback	= MYINFOM03S30.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 다음 버튼 클릭시
MYINFOM03S30.event.clickBtnNext = function(e) {
 	e.preventDefault();
	
	ComUtil.moveLink('/pension_execution/PENSEXE02S01');	// 투자설명서 확인
}

// 다음 버튼 클릭시
MYINFOM03S30.event.clickBtnClear = function(e) {
 	e.preventDefault();
	
	if(gfn_isLocal()){
		sStorage.setItem("PENSEXEDATA", "");
	}
}

// 계좌 클릭시
MYINFOM03S30.event.clickAcntRow = function(e) {
 	e.preventDefault();

	var data = $(this).data();
	
	
	// 자문구분코드  1: [변경], 2: [이체], 3: [유지], 4:[연계], 5:[신규], 9:[해지]
	if("3|4".indexOf(data.advc_gbn_cd) > -1){
		return;
	}
	var url = "/pension_execution/PENSEXE01P02";	// 자문계좌정보 
	data.oScreenId = gfn_getScreenId();
	sStorage.setItem("PENSEXE01P02Params", data);
	
	//ComUtil.moveLink(url);
	
	var sParam = {};
	sParam.url = url;
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S30.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "customerContractInfo"){
		MYINFOM03S30.variable.detailData = result;
		MYINFOM03S30.variable.detailData.join_date = MYINFOM03S30.variable.initParamData.join_date;	// 자문일자
				
		// 상세 셋팅 
		MYINFOM03S30.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S30.location.displayDetail = function(){
	var detailData = MYINFOM03S30.variable.detailData;
	
	
	gfn_setDetails(detailData, $('#f-content'));
	
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
		MYINFOM03S30.location.displayList(detailData.own_acnt_list, 'Own');
	}
	
	
	if(gfn_isNull(detailData.new_acnt_list)){
		$('#no_resultNewAcnt').show();
	}
	else{
		$('#no_resultNewAcnt').hide();
		acntCnt += detailData.new_acnt_list.length;
		MYINFOM03S30.location.displayList(detailData.new_acnt_list, 'New');
	}
	
	// 자문안 갯수가 없으면 
	if(acntCnt == 0){
		$('#btnNext').attr('disabled', true);
	}

}	

MYINFOM03S30.location.displayList = function(list, type){
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



MYINFOM03S30.init();
