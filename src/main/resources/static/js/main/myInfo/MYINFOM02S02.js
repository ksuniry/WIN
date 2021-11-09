/**
* 파일명 		: MYINFOM02S02.js
* 업무		: 메인 > 내정보 > 내자문내역 (c-02-02)
* 설명		: 내자문내역
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.01
* 수정일/내용	: 
*/
var MYINFOM02S02 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM02S02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM02S02.events = {
	 'click li[id^="rowCntrt_"]'			: 'MYINFOM02S02.event.clickDetailCntrt'
}

MYINFOM02S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM02S02');
	
	$("#pTitle").text("내 자문내역");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-02";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM02S02.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM02S02.location.pageInit = function() {
	
	// 연금관리 메인 상세내역 조회 	
	MYINFOM02S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM02S02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "customerContractList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S02.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트


// detail 링크화면 호출
MYINFOM02S02.event.clickDetailCntrt = function(e){
	e.preventDefault();
	
	//sStorage.setItem("PENSION04S02Params", $(this).data());
	//ComUtil.moveLink("/pension_mng/PENSION04S02");
	
	sStorage.setItem("MYINFOM03S30Params", $(this).data());
	ComUtil.moveLink("/my_info/MYINFOM03S30");
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
MYINFOM02S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "customerContractList"){
		MYINFOM02S02.variable.detailData = result;
		
		// 
		MYINFOM02S02.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM02S02.location.displayDetail = function(){
	var detailData = MYINFOM02S02.variable.detailData;
	
	// 초기화
	$('#cntrtList').html('');
	
	if(gfn_isNull(detailData.cntrt_list)){
		$('#no_result').show();
		return;
	}
	
	if(detailData.cntrt_list.length == 0){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	$('#divData').show();
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	var cntrtCnt = detailData.cntrt_list.length;
	$('#cntrtCnt').html(cntrtCnt);
		
	$.each( detailData.cntrt_list, function(index, item){
		item.idx = index + 1;
		
		item.join_date_han = ComUtil.string.dateFormatHan(item.join_date);
		item.join_date = ComUtil.string.dateFormat(item.join_date);
		
		
		var html = template(item);
		$('#cntrtList').append(html);
		$('#rowCntrt_' + item.idx).data(item);
		
	});	
}	





MYINFOM02S02.init();
