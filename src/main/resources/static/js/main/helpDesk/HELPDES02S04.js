/**
* 파일명 		: HELPDES02S04.js
* 업무		: 메인 > 내정보 > 고객센터 (c-02-04)
* 설명		: 내자문내역
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.01
* 수정일/내용	: 
*/
var HELPDES02S04 = CommonPageObject.clone();

/* 화면내 변수  */
HELPDES02S04.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
HELPDES02S04.events = {
	 'click li[id^="movePage_"]'						: 'HELPDES02S04.event.clickLink'
	 ,'click #btnQuestKakao'							: 'HELPDES02S04.event.clickBtnQuestKakao'
}

HELPDES02S04.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('HELPDES02S04');
	
	$("#pTitle").text("고객센터");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-04";
	gfn_azureAnalytics(inputParam);
	
	HELPDES02S04.location.pageInit();
}


// 화면내 초기화 부분
HELPDES02S04.location.pageInit = function() {
	// 간단한 이벤트 셋팅
	$('.result_ask').click(function(){
        if($(this).children('i').hasClass('arr_down') === true){
            $(this).next().show();
            $(this).children('i').removeClass('arr_down').addClass('arr_up');
        }else{
            $(this).next().hide();
            $(this).children('i').removeClass('arr_up').addClass('arr_down');
        }
    });

    //clear search
    $("#searchclear").click(function(){
        $(".search").val('');
    });
	
	// 고객센터 관련 조회  	
	//HELPDES02S04.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
HELPDES02S04.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= HELPDES02S04.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 링크화면 호출
HELPDES02S04.event.clickLink = function(e) {
	e.preventDefault();
	var data = $(this).data();
	var url = "";
	switch(data.link){
		case 'frequentQuestion' :	url = "/help_desk/HELPDES03S01";		// 자주묻는 질문
			break; 
		case 'serviceGuide' 	:	url = "/help_desk/HELPDES03S02";		// 서비스이용안내
									return;
			break; 
		case '1vs1' 			:	url = "/help_desk/HELPDES03S03";		// 1:1문의
			break; 
		case 'incident' 		:	url = "";	// 사고 신고/해제
			break;
		case '' :	url = "";
			break; 
		case '' :	url = "";
			break; 
	}
	
	if(ComUtil.isNull(url)){
		//gfn_alertMsgBox("잘못된 주소입니다. 관리자에게 문의부탁드립니다.");
		return;
	}
	
	ComUtil.moveLink(url);
}

// 링크화면 호출
HELPDES02S04.event.clickBtnQuestKakao = function(e) {
 	e.preventDefault();

	// 카카오 호출하기 
	ComUtil.moveLink('http://pf.kakao.com/_pgGxhK/chat');
	
	/*Gitple('boot',
		{
		id: '12345', // [필수] 상담고객 식별 ID
	  name: '홍길동',
	  email: 'gildong1@gmail.com',
	  phone: '010-1234-1234'
		}
		); // 로그인 사용자라면 아래 추가 정보 부분을 확인*/
		
	/*
	Gitple('boot');
	Gitple('open');
	*/
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
HELPDES02S04.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){
		HELPDES02S04.variable.detailData = result;
		
		// 
		HELPDES02S04.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
HELPDES02S04.location.displayDetail = function(bannerList, divObj){
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





HELPDES02S04.init();
