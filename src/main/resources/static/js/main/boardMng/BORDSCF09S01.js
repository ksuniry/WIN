/**
* 파일명 		: BORDSCF09S01.js
* 업무		: 메인 > 게시판 > 스터디카페리스트 (c-09-01)
* 설명		: 스터디카페리스트
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.11
* 수정일/내용	: 
*/
var BORDSCF09S01 = CommonPageObject.clone();

/* 화면내 변수  */
BORDSCF09S01.variable = {
	sendData		: {
						 category			: '1'		// 0 : 투자이야기  , 1 : 스터디카페
						,current_page_no 	: 1
						,records_per_page 	: 10
	}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
BORDSCF09S01.events = {
	 'click li[id^="boardRow_"]'						: 'BORDSCF09S01.event.clickDetailView'
}

BORDSCF09S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDSCF09S01');
	
	$("#pTitle").text("스터디카페");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-09-01";
	gfn_azureAnalytics(inputParam);
	
	BORDSCF09S01.location.pageInit();
}


// 화면내 초기화 부분
BORDSCF09S01.location.pageInit = function() {
	
	// 공지사항 상세내역 조회
	BORDSCF09S01.tran.selectDetail();
	
	var timer = setInterval(function(){
		$(window).scroll(function() {
			var infScrolltop = $(document).scrollTop(); //스크롤 했을 때 top
	        var infHeightDoc = $(document).height(); //총 길이
	        var infHeightWin = $(window).height(); //윈도우 길이 
	
	        if (infScrolltop >= infHeightDoc - infHeightWin -1 ) {
		        if(ComUtil.null(BORDSCF09S01.variable.detailData.has_next_page, "N") == "Y"){
					BORDSCF09S01.variable.sendData.current_page_no++;
					BORDSCF09S01.tran.selectDetail();
				}
	        }
	    });
    }, 1000);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
BORDSCF09S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "boardList";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/board_list";
	inputParam.data 	= BORDSCF09S01.variable.sendData;
	inputParam.callback	= BORDSCF09S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 상세보기 팝업 호출
BORDSCF09S01.event.clickDetailView = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	
	sStorage.setItem("BORDIVS03P11Params", data);
	
	var sParam = {};
	sParam.url = "/board_mng/BORDIVS03P11";	// 공지사항 상세내역 보기화면 호출
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDSCF09S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세내역 조회
	if(sid == "boardList"){
		BORDSCF09S01.variable.detailData = result;
		
		// 내역 셋팅
		BORDSCF09S01.location.displayDetail();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
BORDSCF09S01.location.displayDetail = function(){
	var detailData = BORDSCF09S01.variable.detailData;
	
	// 초기화
	if(ComUtil.null(BORDSCF09S01.variable.detailData.current_page_no, 0) == "1"){
		$('#boardList').html('');
	}
	
	if(gfn_isNull(detailData.board_list)){
		$('#no_result').show();
		$('#boardList').hide();
		//$('#btnMore').hide();
		return;
	}
	else{
		$('#no_result').hide();
		$('#boardList').show();
		//$('#btnMore').show();
	}
	

	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.board_list, function(index, item){
		item.idx = index + 1;
		
		var html = template(item);
		$('#boardList').append(html);
		
		$('#boardRow_' + item.board_idx).data(item);
	});	
}	





BORDSCF09S01.init();
