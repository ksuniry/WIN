/**
* 파일명 		: BORDFAQ04S02.js (pension-m-03-07)
* 업무		: FAQ 카테고리 상세
* 설명		: FAQ 카테고리별 리스트 조회
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.18
* 수정일/내용	:
*/
var BORDFAQ04S02 = CommonPageObject.clone();

/* 화면내 변수  */
BORDFAQ04S02.variable = {
	sendData : {
				 search_type 	: "2"					// 0 : 카테고리만 , 1 : 검색어, 2 : 카테고리별 리스트
				,keyword		: ""
			   }
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
BORDFAQ04S02.events = {
	 'click .accordion-head'			: 'BORDFAQ04S02.event.detailAsk'
}

BORDFAQ04S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDFAQ04S02');
	
	//$("#pTitle").text("자주묻는질문");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-07";
	gfn_azureAnalytics(inputParam);
	
	BORDFAQ04S02.location.pageInit();
}

// 화면내 초기화 부분
BORDFAQ04S02.location.pageInit = function() {
	// 전달받은 파라미터 셋팅
	var sParams = sStorage.getItem("BORDFAQ04S02Params");
	if(!ComUtil.isNull(sParams)){
		$("#pTitle").text(sParams.keyword);
		BORDFAQ04S02.variable.sendData.keyword = ComUtil.null(sParams.category, "");
	}
	//sStorage.clear();
	
	// 리스트 조회
	BORDFAQ04S02.tran.selectFaqList();
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 문의내역 조회 거래
BORDFAQ04S02.tran.selectFaqList = function() {
	var inputParam 		= {};
	inputParam.sid 		= "faqList";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/faq_list";
	inputParam.data 	= BORDFAQ04S02.variable.sendData;
	inputParam.callback	= BORDFAQ04S02.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 확장 펼침 이벤트
BORDFAQ04S02.event.detailAsk = function(e) {
 	e.preventDefault();
	
    if($(this).children('i').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).children('i').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).children('i').removeClass('arr_up').addClass('arr_down');
    }
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDFAQ04S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		return;
	}
	
	
	if(sid == "faqList"){
		BORDFAQ04S02.location.displayFaq(result);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 리스트 뿌리기
BORDFAQ04S02.location.displayFaq = function(result){
	// 초기화
	$('#divFaqList').html('');
	
	if(gfn_isNull(result.faq_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
	
	var _template = $("#_dumyResult").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( result.faq_list, function(index, item){
		item.idx = index+1; 
		var html = template(item);
		$('#divFaqList').append(html);
	});	
}	



BORDFAQ04S02.init();
