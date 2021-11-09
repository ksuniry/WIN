/**
* 파일명 		: BOARDMN01S01.js (pension-m-02-03)
* 업무		: FAQ
* 설명		: FAQ
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.17
* 수정일/내용	: 
*/
var BOARDMN01S01 = CommonPageObject.clone();

/* 화면내 변수  */
BOARDMN01S01.variable = {
	sendData : {
				 search_type 	: "0"					// 0 : 카테고리만 , 1 : 검색어
				,keyword		: ""
			   }
	,showMenu		: false								//
}

/* 이벤트 정의 */
BOARDMN01S01.events = {
	 'click #btnSearch'				: 'BOARDMN01S01.event.selectFaqList'
	,'click #searchclear'	 		: 'BOARDMN01S01.event.searchClear'
	,'click .result_ask'			: 'BOARDMN01S01.event.detailAsk'
	,'click li[id^="cate_"]'		: 'BOARDMN01S01.event.callCateDetail'
}

BOARDMN01S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BOARDMN01S01');
	
	$("#pTitle").text("FAQ");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-02-03";
	gfn_azureAnalytics(inputParam);
	
	BOARDMN01S01.location.pageInit();
}

// 화면내 초기화 부분
BOARDMN01S01.location.pageInit = function() {
	//tab
	BOARDMN01S01.tran.selectFaqList();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 문의내역 조회 거래
BOARDMN01S01.tran.selectFaqList = function() {
	var inputParam 		= {};
	inputParam.sid 		= "faqList";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/faq_list";
	inputParam.data 	= BOARDMN01S01.variable.sendData;
	inputParam.callback	= BOARDMN01S01.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 검색버튼 클릭
BOARDMN01S01.event.selectFaqList = function(e) {
	e.preventDefault();
	
	if(ComUtil.isNull($("#keyword").val())){
		BOARDMN01S01.variable.sendData.search_type = "0";		// 카테고리만
		BOARDMN01S01.variable.sendData.keyword = "";
	}
	else{
		BOARDMN01S01.variable.sendData.search_type = "1";		// 검색어 조회
		BOARDMN01S01.variable.sendData.keyword = $("#keyword").val();
	}
	
	BOARDMN01S01.tran.selectFaqList();
}

// 검색영역 클리어 이벤트
BOARDMN01S01.event.searchClear = function(e) {
	e.preventDefault();
	$("#keyword").val('');
}

// 확장 펼침 이벤트
BOARDMN01S01.event.detailAsk = function(e) {
 	e.preventDefault();
	
    if($(this).children('i').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).children('i').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).children('i').removeClass('arr_up').addClass('arr_down');
    }	
}


// 카테고리 클릭시 상세 리스트 화면 호출
BOARDMN01S01.event.callCateDetail = function(e) {
	e.preventDefault();
	
	var sParams = {};
	sParams.category = ComUtil.null($(this).data('category'), "");
	sStorage.setItem("sParams", sParams); 
	
	//gfn_alertMsgBox(sParams.category);
	ComUtil.moveLink("/board_mng/BOARDMN01S02");
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BOARDMN01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		return;
	}
	
	
	if(sid == "faqList"){
		BOARDMN01S01.location.displayFaq(result);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 리스트 뿌리기
BOARDMN01S01.location.displayFaq = function(result){
	// 초기화
	$('#divCate').html('');
	$('#divFaqList').html('');
	
	if(gfn_isNull(result.faq_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
	
	if(BOARDMN01S01.variable.sendData.search_type == "0"){
		$('#divCate').show();
		$('#divFaqList').hide();
		BOARDMN01S01.location.displayCateList(result.faq_list);
	}
	else{
		$('#divCate').hide();
		$('#divFaqList').show();
		BOARDMN01S01.location.displayFaqList(result.faq_list);
	}	
}	

// 카테고리 리스트 출력
BOARDMN01S01.location.displayCateList = function(faq_list){
	
	var _template = $("#_dumyCateResult").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( faq_list, function(index, item){
		item.idx = index;
		
		var html = template(item);
		$('#divCate').append(html);
		
		$('#cate_' + item.idx).data(item);
	});	
}

// faq 리스트 출력
BOARDMN01S01.location.displayFaqList = function(faq_list){
	var _templateTop 	= $("#_dumyResultTop").html();
	var _templateList 	= $("#_dumyResultList").html();

	var templateTop 	= Handlebars.compile(_templateTop);
	var templateList 	= Handlebars.compile(_templateList);
	
	var cateIdx	= 0;	// 몇번째 카테고리인지
	var preCate	= "";	// 이전카테고리명
	
	$.each( faq_list, function(index, item){
		item.idx = index;
		item.cateIdx = cateIdx;
		
		if(preCate != item.category){
			preCate = item.category;
			item.cateIdx = ++cateIdx;
			
			// 카테고리 리스트 담을 공간 만들기
			var htmlTop = templateTop(item);
			$('#divFaqList').append(htmlTop);
		}
		
		var htmlList = templateList(item);
		$('#divResult_cate' + item.cateIdx).append(htmlList);
		
		//$('.result_ask', '#divResult_' + item.q_type).last().data(item);
	});	
}

BOARDMN01S01.init();
