/**
* 파일명 		: PENSION03S05.js (pension-m-03-05)
* 업무		: 연금 관리  > 자문이력 클릭
* 설명		: 지난 자문 내역을 확인하세요
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.xx
* 수정일/내용	: 
*/
var PENSION03S05 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION03S05.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
PENSION03S05.events = {
	 'click #navi a' 						: 'PENSION03S05.event.clickTab'
	,'click #chooseBox > li'				: 'PENSION03S05.event.changeChice'
	,'click li[id^="rowCntrt_"]'			: 'PENSION03S05.event.clickDetailCntrt'
}

PENSION03S05.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION03S05');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-05";
	gfn_azureAnalytics(inputParam);
	
	PENSION03S05.location.pageInit();
	
	PENSION03S05.tran.selectDetail();
}


// 화면내 초기화 부분
PENSION03S05.location.pageInit = function() {
	
	$( ".lnb ul" ).scrollLeft( 300 );
}

/*tab 영역 클릭시*/ 
PENSION03S05.event.clickTab = function(e){
	e.preventDefault();

	var linkUrl = "";
	var page = $(this).data('link'); 
	
	switch(page){
		case 'addSave' 			: linkUrl = "/pension_mng/PENSION03S02"; break;	// 추가저축  
		case 'limitSave' 		: linkUrl = "/pension_mng/PENSION03S03"; break;	// 저축한도 
		//case 'changeProd' 		: linkUrl = "/pension_mng/PENSION03S04"; break; // 상품변경
		case 'adviceHistory' 	: linkUrl = "/pension_mng/PENSION03S05"; break;	// 자문이력
		default : return; 
	}

	ComUtil.moveLink(linkUrl, false);
}

/*납입기간 변경시*/
PENSION03S05.event.changeChice = function(e){
	e.preventDefault();
	
	if($(this).children().hasClass("is_active") !== true){
        $(this).children().addClass("is_active");
        $(this).siblings().children().removeClass("is_active");
    }else{
     
    }
}

PENSION03S05.event.clickDetailCntrt = function(e){
	e.preventDefault();
	sStorage.setItem("PENSION04S02Params", $(this).data());
	ComUtil.moveLink("/pension_mng/PENSION04S02");
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION03S05.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "customerContractList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_list";
	inputParam.data 	= {};
	inputParam.callback	= PENSION03S05.callBack; 
	
	gfn_Transaction( inputParam );
}






////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION03S05.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}

	if(sid == "customerContractList"){
		PENSION03S05.variable.detailData = result;
		
		// 
		PENSION03S05.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSION03S05.location.displayDetail = function(){
	var detailData = PENSION03S05.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	// list
	PENSION03S05.location.displayList();
}	


// 각 페널 셋팅
PENSION03S05.location.displayList = function(){
	var detailData = PENSION03S05.variable.detailData;
	
	// 초기화
	$('#cntrtList').html('');
	
	if(gfn_isNull(detailData.cntrt_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.cntrt_list, function(index, item){
		item.idx = index + 1;
		
		item.join_date = ComUtil.string.dateFormatHan(item.join_date);
		
		
		var html = template(item);
		$('#cntrtList').append(html);
		$('#rowCntrt_' + item.idx).data(item);
		
	});	
}




PENSION03S05.init();
