/**
* 파일명 		: BORDNOT02S05.js
* 업무		: 메인 > 게시판 > 공지사항 (c-02-05)
* 설명		: 공지사항리스트
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.02
* 수정일/내용	: 
*/
var BORDNOT02S05 = CommonPageObject.clone();

/* 화면내 변수  */
BORDNOT02S05.variable = {
	sendData		: {
						current_page_no : 1
						,records_per_page : 10
	}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
BORDNOT02S05.events = {
	 'click li[id^="noticeRow_"]'						: 'BORDNOT02S05.event.clickDetailView'
}

BORDNOT02S05.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BORDNOT02S05');
	
	$("#pTitle").text("공지사항");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-05";
	gfn_azureAnalytics(inputParam);
	
	BORDNOT02S05.location.pageInit();
}


// 화면내 초기화 부분
BORDNOT02S05.location.pageInit = function() {
	
	// 공지사항 상세내역 조회
	BORDNOT02S05.tran.selectDetail();
	
	var timer = setInterval(function(){
		$(window).scroll(function() {
			var infScrolltop = $(document).scrollTop(); //스크롤 했을 때 top
	        var infHeightDoc = $(document).height(); //총 길이
	        var infHeightWin = $(window).height(); //윈도우 길이 
	
	        if (infScrolltop >= infHeightDoc - infHeightWin -1 ) {
		        if(ComUtil.null(BORDNOT02S05.variable.detailData.has_next_page, "N") == "Y"){
					BORDNOT02S05.variable.sendData.current_page_no++;
					BORDNOT02S05.tran.selectDetail();
				}
	        }
	    });
    }, 1000);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
BORDNOT02S05.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "notice";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/notice";
	inputParam.data 	= BORDNOT02S05.variable.sendData;
	inputParam.callback	= BORDNOT02S05.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 상세보기 팝업 호출
BORDNOT02S05.event.clickDetailView = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	
	sStorage.setItem("BORDNOT03P05Params", data);
	
	var sParam = {};
	sParam.url = "/board_mng/BORDNOT03P05";	// 공지사항 상세내역 보기화면 호출
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
BORDNOT02S05.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세내역 조회
	if(sid == "notice"){
		BORDNOT02S05.variable.detailData = result;
		
		// 내역 셋팅
		BORDNOT02S05.location.displayDetail();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
BORDNOT02S05.location.displayDetail = function(){
	var detailData = BORDNOT02S05.variable.detailData;
	
	// 초기화
	if(ComUtil.null(BORDNOT02S05.variable.detailData.current_page_no, 0) == "1"){
		$('#noticeList').html('');
	}
	
	if(gfn_isNull(detailData.notice_list)){
		$('#no_result').show();
		$('#noticeList').hide();
		//$('#btnMore').hide();
		return;
	}
	else{
		$('#no_result').hide();
		$('#noticeList').show();
		//$('#btnMore').show();
	}
	

	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.notice_list, function(index, item){
		item.idx = index + 1;
		
		var html = template(item);
		$('#noticeList').append(html);
		
		$('#noticeRow_' + item.board_idx).data(item);
	});	
}	





BORDNOT02S05.init();
