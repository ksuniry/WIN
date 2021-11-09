/**
* 파일명 		: PENSEXE04S01.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 실행절차안내 (t-04-01)
* 설명		: 실행절차안내
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.04
* 수정일/내용	: 
*/
var PENSEXE04S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE04S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'approval_info'					// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
PENSEXE04S01.events = {
	 'click #btnProcessGuideOk'							: 'PENSEXE04S01.event.clickBtnProcessGuideOk'
}

PENSEXE04S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE04S01');
	
	$("#pTitle").text("실행절차안내");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-04-01";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE04S01.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE04S01.location.pageInit = function() {
	PENSEXE04S01.variable.detailData = sStorage.getItem("PENSEXEDATA");
	
	$('#procedureSlide').on('init', function(event, slick){
        var dots = $( '.slick-dots li' );
        dots.each( function( k, v){
            $(this).find( 'button' ).addClass( 'heading'+ k );
        });
        var items = slick.$slides;
        items.each( function( k, v){
            var text = $(this).find( 'h2' ).text();
            $( '.heading' + k ).text(text);
        });
    });

	//슬라이드 높이 21-05-10 추가
    var windowHeight = $(window).height();
    var slideHeight = windowHeight - 300; 
    $('.procedure_item>.box_r').height(slideHeight);

    $('#procedureSlide').slick({
        infinite: false,
        dots: true,
        arrows: false,
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 1,
        // adaptiveHeight: true,
		pauseOnFocus: false 
    });
	
	// 고객센터 관련 조회  	
	//PENSEXE04S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSEXE04S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE04S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 승인버튼 
PENSEXE04S01.event.clickBtnProcessGuideOk = function(e) {
 	e.preventDefault();
	/*
	var idx = 0;
	$.each($( '.slick-dots li' , $('#procedureSlide')), function(index){
		if($(this).hasClass('slick-active')){
			idx = index;
		}
	});
	
	gfn_log("idx :: " + idx);
	*/

	ComUtil.moveLink('/pension_execution/PENSEXE05S01');	// 최종 화면으로 이동
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSEXE04S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){		
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수



PENSEXE04S01.init();
