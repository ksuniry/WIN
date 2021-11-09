/**
* 파일명 		: DASHBRD02P04.js (pension-D-02-04)
* 업무		: 연금자문 대시보드 > 상세보기 > 종류별 연금 상세보기
* 설명		: 종류별 연금 상세보기 
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.26
* 수정일/내용	: 
*/
var DASHBRD02P04 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD02P04.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD02P04.events = {
	 'click a[id^="btnPopup_P03_"]'						: 'DASHBRD02P04.event.clickPopup'
	//,'click #btnViewResult'							: 'DASHBRD02P04.event.clickBtnViewResult'
}

DASHBRD02P04.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD02P04');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-02-04";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD02P04.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD02P04.location.pageInit = function() {

	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("DASHBRD02P04Params");
	DASHBRD02P04.variable.initParamData = sParams;
	sStorage.clear();
	
	{
		/*$('.accor_title', $('#P24-content')).click(function(){
	        if($(this).find('.ico').hasClass('arr_down') === true){
	            $(this).next().show();
	            $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
	        }else{
	            $(this).next().hide();
	            $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
	        }
	    });*/

		// Accordion
        $('.accordion-head').click(function(){
            if($(this).children('i').hasClass('arr_down') === true){
                $(this).next().show();
                $(this).children('i').removeClass('arr_down').addClass('arr_up');
            }else{
                $(this).next().hide();
                $(this).children('i').removeClass('arr_up').addClass('arr_down');
            }
        });
	
		$('.popup_close', $('#P24-content')).click(function(){
	        $(this).parents('.popup_wrap').hide();
	    });
	}
	
    DASHBRD02P04.variable.sendData.pnsn_prdt_cd = DASHBRD02P04.variable.initParamData.prdt_cd;
	// 초기조회
	DASHBRD02P04.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD02P04.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionProductDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/pension_product_detail";
	inputParam.data 	= DASHBRD02P04.variable.sendData;
	inputParam.callback	= DASHBRD02P04.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
DASHBRD02P04.event.clickPopup = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
	var url = "";
	
	switch(link){
		case 'myPensionRetr'	:	url = "/pension_advice/dashBoard/DASHBRD02P04";		// 퇴직연금 상세보기
			break;
		default 				: 
			break;
	}
	
	var sParam = {};
	sParam.url = url;
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}

// 팝업닫기
DASHBRD02P04.event.clickBtnPopClose = function(e) {
	e.preventDefault();
	
	//gfn_closePopup();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD02P04.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 내연금 상세조회
	if(sid == "pensionProductDetail"){
		
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
				
		DASHBRD02P04.variable.detailData = result;
		
		// 상세화면 그리기
		DASHBRD02P04.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
DASHBRD02P04.location.displayDetail = function(){
	var detailData = DASHBRD02P04.variable.detailData;
	
	detailData.acnt_type_nm = gfn_getAcntTypeNm(detailData.acnt_type);
	$('#pnsn_company_img').attr('src', gfn_getImgSrcByCd(detailData.kftc_agc_cd, 'C'));
	
	if(!ComUtil.isNull(detailData.acnt_no) && ComUtil.null(detailData.acnt_no, '0') != '0'){
		detailData.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(detailData.acnt_no, '') + gfn_getAddAcntNoByCd(detailData.kftc_agc_cd));
		$('#acntDis').show();
	}
	else{
		$('#divHeadTit').addClass('center'); 
	}
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#P24-content'));
}


DASHBRD02P04.init();
