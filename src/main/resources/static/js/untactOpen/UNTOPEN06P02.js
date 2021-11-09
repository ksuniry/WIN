/**
* 파일명 		: UNTOPEN06P02.js ( e-06-02 )
* 업무		: 비대면계좌개설 > 주소검색팝업 
* 설명		: 주소검색팝업
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.12
* 수정일/내용	: 
*/
var UNTOPEN06P02 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN06P02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: {}								// 팝업에서 결과값 리턴시 사용
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
UNTOPEN06P02.events = {
	 'click #btnSearch'							: 'UNTOPEN06P02.event.clickBtnSearch'
	 //,'click #btnAddrOk'						: 'UNTOPEN06P02.event.clickBtnAddrOk'
	 ,'click #btnCancel'						: 'UNTOPEN06P02.event.clickBtnCancel'
	 ,'click li[id^="rowAddr_"]'				: 'UNTOPEN06P02.event.clickAddrDetail'
	 ,'click #btnSearchClear'					: 'UNTOPEN06P02.event.clickBtnSearchClear'
}

UNTOPEN06P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN06P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-06-02";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN06P02.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN06P02.location.pageInit = function() {
	/*
	var sParams = sStorage.getItem("UNTOPEN07S01Params");
	if(!ComUtil.isNull(sParams)){
		UNTOPEN06P02.variable.initParamData = sParams;
		UNTOPEN06P02.variable.detailData = sParams;
	//	sStorage.clear();
	
		gfn_setDetails(UNTOPEN06P02.variable.detailData, $('#P02-content'));
	}
	*/
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주소검색
UNTOPEN06P02.tran.selectAddressList = function() {
	var inputParam 		= {};
	inputParam.sid 		= "selectAddressList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_address_list";
	inputParam.data 	= UNTOPEN06P02.variable.sendData;
	inputParam.callback	= UNTOPEN06P02.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN06P02.event.clickBtnSearch = function(e) {
	e.preventDefault();
	gfn_makeInputData($('#divSearchbox'), UNTOPEN06P02.variable.sendData);
	
	
	if(ComUtil.isNull(UNTOPEN06P02.variable.sendData.inpt_data)){
		gfn_alertMsgBox("검색할 주소를 입력해 주세요.");
		return;
	}
	// 주소조회
	UNTOPEN06P02.tran.selectAddressList();
	// testdata s
	/*
	var address = "[       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106550000019635\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"100000047\",         \"bldngNm\": \"구룡초등학교\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06305\",         \"bldngHdNo\": \"263\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"655\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019990\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656\",         \"aptDngExtnt\": \"                    \"       }] ";
	var addr_srch_result = JSON.parse(address);
	UNTOPEN06P02.variable.detailData.addr_srch_result = addr_srch_result;
	UNTOPEN06P02.location.displayAddrList();
	*/
	// testdata e
}

// 데이터 전달
UNTOPEN06P02.event.clickBtnAddrOk = function(e) {
	e.preventDefault();
	
	UNTOPEN06P02.variable.returnData.dng_flwg_addr = $('#p_dng_flwg_addr').val();
	gfn_closePopup(UNTOPEN06P02.variable.returnData);
}

// 주소창 닫기
UNTOPEN06P02.event.clickBtnCancel = function(e) {
	e.preventDefault();
	
	gfn_closePopup();
}

// 선택된 주소값 셋팅
UNTOPEN06P02.event.clickAddrDetail = function(e) {
	e.preventDefault();
	
	// 먼저 상세주소에 선택된 주소를 셋팅한다.
	$('#divDetailAddr').html($(this).html());
	
	var data = $(this).data();
	/*
	// 내려줄 데이터 셋팅 s
	var bldngNm = ComUtil.isNull(data.bldngNm) ? "" : " (" + data.bldngNm+ ")";
	UNTOPEN06P02.variable.returnData = data; 
	UNTOPEN06P02.variable.returnData.nwAddr = data.nwAddr + " " + data.bldngHdNo + bldngNm;
	// 내려줄 데이터 셋팅 e
	
	$('#divBtnArea').show();
	*/
	
	gfn_closePopup(data);
}

// 검색창 입력값 초기화
UNTOPEN06P02.event.clickBtnSearchClear = function(e) {
	e.preventDefault();
	
	$('#inpt_data').val('');
} 



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN06P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	if(sid == "selectAddressList"){
		UNTOPEN06P02.variable.detailData = result;
		
		UNTOPEN06P02.location.displayAddrList();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

UNTOPEN06P02.location.displayAddrList = function(){
	var detailData = UNTOPEN06P02.variable.detailData;
	
	
	if(ComUtil.isNull(detailData.addr_srch_result) || detailData.addr_srch_result.Record1.length == 0){
		$('#divExp').show();
		$('#noResult').show();
		$('#divAddrList').hide();
		$('#divAddrDetail').hide();
		return;
	}
	else{
		$('#divExp').hide();
		$('#noResult').hide();
		$('#divAddrList').show();
		$('#divAddrDetail').show();
		$('#listCnt').html(detailData.addr_srch_result.Record1.length);
	}
	
	// 초기화
	$('#ulAddrList').html('');
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.addr_srch_result.Record1, function(index, item){
		item.idx = index;
		item.bldngNm = (item.bldngNm).trim();
				
		item.nwAddr = item.nwAddr + " " + item.bldngHdNo + " (" + item.eupMyeonDong + (ComUtil.isNull(item.bldngNm) ? "" : ", " + item.bldngNm) + ")";
		
		var html = template(item);
		$('#ulAddrList').append(html);
		$('#rowAddr_' + item.idx).data(item);
		
		/*if(index == 0){
			$('#divDetailAddr').html($('#rowAddr_' + item.idx).html());
			$('#rowAddr_' + item.idx).trigger('click');
		}*/
	});
}



UNTOPEN06P02.init();
