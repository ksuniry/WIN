/**
* 파일명 		: HELPDES03S02.js
* 업무		: 메인 > 고객센터 > 서비스이용안내(c-03-02)
* 설명		: 내자문내역
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.02
* 수정일/내용	: 
*/
var HELPDES03S02 = CommonPageObject.clone();

/* 화면내 변수  */
HELPDES03S02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
HELPDES03S02.events = {
	 'click li[name^="movePage_"]'						: 'HELPDES03S02.event.clickLink'
}

HELPDES03S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('HELPDES03S02');
	
	$("#pTitle").text("서비스 이용 안내");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-02";
	gfn_azureAnalytics(inputParam);
	
	HELPDES03S02.location.pageInit();
}


// 화면내 초기화 부분
HELPDES03S02.location.pageInit = function() {
	
	// 고객센터 관련 조회  	
	//HELPDES03S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
HELPDES03S02.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= HELPDES03S02.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 링크화면 호출
HELPDES03S02.event.clickLink = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	var url = "";
	switch(data.link){
		case '' :	url = "";
			break; 
		case '' :	url = "";
			break; 
		case '' :	url = "";
			break; 
		case '' :	url = "";
			break; 
		case '' :	url = "";
			break; 
	}
	
	if(ComUtil.isNull(url)){
		gfn_alertMsgBox("잘못된 주소입니다. 관리자에게 문의부탁드립니다.");
		return;
	}
	
	ComUtil.moveLink(url);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
HELPDES03S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){
		HELPDES03S02.variable.detailData = result;
		
		// 
		HELPDES03S02.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
HELPDES03S02.location.displayDetail = function(bannerList, divObj){
	// 초기화
	$('div', $(divObj)).remove();
	
	if(gfn_isNull(bannerList)){
		return;
	}

	var _template = $("#_dumyBanner").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( bannerList, function(index, item){
		
		var html = template(item);
		$(divObj).append(html);
		$('#seResult_' + item.q_type).show();
		
		$('div', $(divObj)).last().data(item);
	});	
}	





HELPDES03S02.init();
