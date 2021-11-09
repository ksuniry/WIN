/**
* 파일명 		: BORDPUS01P01.js (N-01-01)
* 업무		: 헤더 > 알람
* 설명		: 알람리스트보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.09
* 수정일/내용	: 
*/
var BORDPUS01P01 = CommonPageObject.clone();

/* 화면내 변수  */
BORDPUS01P01.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'popup'							// 해더영역 디자인    default 는 normal
}

/* 이벤트 정의 */
BORDPUS01P01.events = {
	 'click li[id^="alert_"]'							: 'BORDPUS01P01.event.clickDetailView'
	,'click #pw1_keypad' 								: 'BORDPUS01P01.event.callKeyPad'
	//,'click a[id^="btnP02Popup_"]'						: 'BORDPUS01P01.event.clickMovePoint'
}

BORDPUS01P01.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDPUS01P01');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "n-01-01";
	gfn_azureAnalytics(inputParam);
	
	BORDPUS01P01.location.pageInit();
}


// 화면내 초기화 부분
BORDPUS01P01.location.pageInit = function() {
	// 알람리스트조회 대신 
	BORDPUS01P01.tran.selectDetail();
	
	// 푸쉬 전체 읽음 호출 (추가 : 2021-07-21)
	BORDPUS01P01.tran.updateReadAllPushMessage();
	
	// testData s
	/*
	BORDPUS01P01.variable.detailData.message_list = 
												 [{p_uid : "1", title:"aaa", type:"입금/매수", 	read_yn:"N", body:"KB 연금자문계좌(3309) 10/31 09:00 매수 완료"}
	 											 ,{p_uid : "2", title:"bbb", type:"출금", 		read_yn:"Y", body:"KB 연금자문계좌(3310) 10/31 09:00 매수 완료"}
												 ,{p_uid : "3", title:"ccc", type:"경고", 		read_yn:"N", body:"KB 연금자문계좌(3311) 10/31 09:00 매수 완료"}
											     ];
	BORDPUS01P01.location.displayDetail();
	*/
	// testData e
	
	if(gfn_isLocal()){
		$('#localTest').show();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 알람리스트조회
BORDPUS01P01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pushMessageList";
	inputParam.target 	= "auth";
	inputParam.url 		= "/push/push_message_list";
	inputParam.data 	= {}; 
	inputParam.callback	= BORDPUS01P01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 읽음 설정
BORDPUS01P01.tran.updatePushMessageRead = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pushMessageRead";
	inputParam.target 	= "auth";
	inputParam.url 		= "/push/push_message_read";
	inputParam.data 	= BORDPUS01P01.variable.sendData; 
	inputParam.callback	= BORDPUS01P01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 푸쉬 전체 읽음 설정
BORDPUS01P01.tran.updateReadAllPushMessage = function() {
	
	var inputParam 	    = {};
	inputParam.sid      = "readAllPushMessage";
	inputParam.target   = "auth";
	inputParam.url      = "/push/push_message_read_all";
	inputParam.data 	= {}; 
	inputParam.callback	= BORDPUS01P01.callBack;
	
	gfn_Transaction( inputParam );	
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
BORDPUS01P01.event.clickMovePoint = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
}

 
// 상세화면 호출 
BORDPUS01P01.event.clickDetailView = function(e) {
	e.preventDefault();
	
	var sParams = {};
	sParams = $(this).data();
	sStorage.setItem("BORDPUS01P01Params", sParams);
	
	
	if($('a', $(this)).hasClass('no_visited')){
		$('a', $(this)).removeClass('no_visited');
		
		// 읽음 설정
		BORDPUS01P01.variable.sendData.p_uid = sParams.p_uid;
		BORDPUS01P01.tran.updatePushMessageRead();
	}
	
	if($('.no_visited', $('#ulAlertList')).length == 0){
		$('#headerPush').removeClass('active');
		gfn_setUserInfo('pushYn', 'N');
	}
	

	/*
	// 추후 화면 확정되면 풀어주세요	
	var url = sParams.alert_url;
	
	if(url.substr(-3,1) == 'M'){
		//gfn_closePopup();
		ComUtil.moveLink(url); // 화면이동
	}
	else if(url.substr(-3,1) == 'P'){
		var sParam = {};
		sParam.url = url;
		
		// 팝업호출
		gfn_callPopup(sParam, function(){});
	} 
	*/
}


BORDPUS01P01.event.callKeyPad = function(e) {
	e.preventDefault();
	
	gfn_callKeyPad(this);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDPUS01P01.callBack = function(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 알람리스트조회
	if(sid == "pushMessageList"){
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox(".");
		//	return;
		//}
		
		BORDPUS01P01.variable.detailData = result;
		
		// 상세화면 그리기
		BORDPUS01P01.location.displayDetail();
	}
	// 읽음 설정
	if(sid == "pushMessageRead"){
		// 
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
BORDPUS01P01.location.displayDetail = function(){
	var detailData = BORDPUS01P01.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(BORDPUS01P01.variable.detailData, $('#PN01-content'));
	
	// 목록 그리드 그리기
	BORDPUS01P01.location.displayAlertList();
}

// 상품별 리스트 그리기
BORDPUS01P01.location.displayAlertList = function(){
	var detailData = BORDPUS01P01.variable.detailData;
	
	// 초기화
	$('#ulAlertList').html('');
	
	if(ComUtil.isNull(detailData.message_list)){
		$('#nodata').show();
		return;
	}
	$('#nodata').hide();
	
	var _template = $("#_dumyAlertResult").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.message_list, function(index, item){
		item.idx = index + 1;
		BORDPUS01P01.location.setInfoRow(item);
		
		item.body = ComUtil.string.replaceAll(item.body, '\\n', '<br>');
		item.body = ComUtil.string.convertHtml(item.body);
		
		var html = template(item);
		$('#ulAlertList').append(html);
		$('#alert_'+item.idx).data(item);
	});
}


BORDPUS01P01.location.setInfoRow = function(rowItem){
	
	// <!-- buy:입금/매수 sell:출금/매도 warn:경고 announce:일반공지 -->
	// 1:입금, 2:출금, 3:경고, 4:공지 아이콘
	switch(rowItem.noti_type){
		case '1'	: 
						  rowItem.typeClass = "buy";
						  rowItem.url = "/xxxx/xxxxx";
			break;
		case '2'	: 
						  rowItem.typeClass = "sell";
			break;
		case '3'	: 
						  rowItem.typeClass = "warn";
			break;
		case '4'	: 
						  rowItem.typeClass = "announce";
			break;
		default			:
						  rowItem.typeClass = "";
			break;
	}
	
	if(rowItem.read_yn == "N"){
		rowItem.visitClass = "no_visited";
	}
	else{
		rowItem.visitClass = "";
	}
}



BORDPUS01P01.location.test = function(type){
	switch(type){
		case 'kbkey'	: 
				var inputParam = {};
				inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
				gfn_callPwdPopup(inputParam);
			break;
		default			:
				return null;
			break;
	}
}

BORDPUS01P01.init();
