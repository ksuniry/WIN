/**
* 파일명 		: HELPDES03S01.js
* 업무		: 메인 > 고객센터 > 자주묻는질문(c-03-01)
* 설명		: 자주묻는질문
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.02
* 수정일/내용	: 
*/
var HELPDES03S01 = CommonPageObject.clone();

/* 화면내 변수  */
HELPDES03S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
HELPDES03S01.events = {
	 'click li[id^="keywordRow_"]'						: 'HELPDES03S01.event.clickKeyword'
	,'click li[id^="cateRow_"]'							: 'HELPDES03S01.event.clickCategory'
	,'click #btnSearch'									: 'HELPDES03S01.event.clickBtnSearch'
}

HELPDES03S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('HELPDES03S01');
	
	$("#pTitle").text("자주묻는질문");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-01";
	gfn_azureAnalytics(inputParam);
	
	HELPDES03S01.location.pageInit();
}


// 화면내 초기화 부분
HELPDES03S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("HELPDES03S01Params");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		HELPDES03S01.variable.initParamData = sParams;
		
		if(!ComUtil.isNull(sParams.keyword)){
			$('#keyword').val(sParams.keyword);
		}
		
		$('#btnSearch').trigger('click');
		sStorage.setItem("HELPDES03S01Params", "");
		return;
	}
	
	// 코드조회
	// keyword, kategory 셋팅
	HELPDES03S01.tran.selectKeyword();
	HELPDES03S01.tran.selectCategory();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// keyword 코드조회
HELPDES03S01.tran.selectKeyword = function() {
	var inputParam 			= {};
	inputParam.sid 			= "selectKeyword";
	inputParam.callback		= HELPDES03S01.callBack;
	 
	inputParam.group_code	= 'faq_keyword';
	
	gfn_getCommCode(inputParam);
}

// catagory 코드조회
HELPDES03S01.tran.selectCategory = function() {
	var inputParam 			= {};
	inputParam.sid 			= "selectCategory";
	inputParam.callback		= HELPDES03S01.callBack;
	 
	inputParam.group_code	= 'faq_category';
	
	gfn_getCommCode(inputParam);
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

HELPDES03S01.event.clickBtnSearch = function(e) {
 	e.preventDefault();

	var sParams = {};
	sParams.search_type = "1";						// 0 : 카테고리만 , 1 : 검색어
	sParams.keyword = $('#keyword').val();			// 검색어
	sStorage.setItem("BORDFAQ04S01Params", sParams);

	ComUtil.moveLink('/board_mng/BORDFAQ04S01');
}

// 키워드 클릭시
HELPDES03S01.event.clickKeyword = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	var url = "/board_mng/BORDFAQ04S01";
	
	var sParams = {};
	sParams.search_type = "1";						// 0 : 카테고리만 , 1 : 검색어
	sParams.keyword = data.code_nm;					// 검색어
	sStorage.setItem("BORDFAQ04S01Params", sParams);
	
	ComUtil.moveLink(url);
}

// 카테고리 클릭시
HELPDES03S01.event.clickCategory = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	var url = "/board_mng/BORDFAQ04S02";
	
	var sParams = {};
	sParams.search_type = "0";						// 0 : 카테고리만 , 1 : 검색어
	sParams.category = data.code;					// 검색어
	sParams.keyword = data.code_nm;					// 검색어
	sStorage.setItem("BORDFAQ04S02Params", sParams);
	
	ComUtil.moveLink(url);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
HELPDES03S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	
	if(sid == "selectKeyword"){
		gfn_log("main page callback!!");
		HELPDES03S01.location.setKeyWord(result.code_list, 'keywordList');
	}
	if(sid == "selectCategory"){
		gfn_log("main page callback!!");
		HELPDES03S01.location.setCategory(result.code_list, 'cateList');
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 공통코드값 keyword 셋팅
HELPDES03S01.location.setKeyWord = function(codeList, objId){
	$('#'+objId).html('');
	
	if(gfn_isNull(codeList)){
		return;
	}
	
	var _template = $("#_dumyKeywordRow").html();
	var template = Handlebars.compile(_template);
	
	$.each(codeList, function(index, item){
		item.idx = index+1;
		
		var html = template(item);
		$('#'+objId).append(html);
		$('#keywordRow_'+item.idx).data(item);
	});
}

// 공통코드값 category 셋팅
HELPDES03S01.location.setCategory = function(codeList, objId){
	$('#'+objId).html('');
	
	if(gfn_isNull(codeList)){
		return;
	}
	//var obj = $('#'+objId);
	
	var _template = $("#_dumyCateRow").html();
	var template = Handlebars.compile(_template);
	
	$.each(codeList, function(index, item){
		item.idx = index+1;
		
		var html = template(item);
		$('#'+objId).append(html);
		$('#cateRow_'+item.idx).data(item);
	});
}

// 상세 셋팅
HELPDES03S01.location.displayDetail = function(bannerList, divObj){
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





HELPDES03S01.init();
