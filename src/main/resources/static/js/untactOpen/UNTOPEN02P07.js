/**
* 파일명 		: UNTOPEN02P07.js
* 업무		: 비대면 > KB 투자성향분석 안내팝업 > KB 투자성향분석 ( e-02-07 )
* 설명		: KB 투자성향분석 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.27
* 수정일/내용	: 
*/
var UNTOPEN02P07 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN02P07.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}
}

/* 이벤트 정의 */
UNTOPEN02P07.events = {
	 'click #btnNextPop'		 						: 'UNTOPEN02P07.event.clickBtnNext'
	,'click #btnViewResultPop'							: 'UNTOPEN02P07.event.clickBtnViewResult'
	,'click #btnPopClose'								: 'UNTOPEN02P07.event.clickBtnPopClose'
}

UNTOPEN02P07.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN02P07');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-02-07";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN02P07.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN02P07.location.pageInit = function() {
	UNTOPEN02P07.location.steps();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 투자성향 저장
UNTOPEN02P07.tran.updateExtraInvestPropensity = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateExtraInvestPropensity";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_extra_invest_propensity";
	inputParam.data 	= UNTOPEN02P07.variable.sendData;
	inputParam.callback	= UNTOPEN02P07.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
UNTOPEN02P07.event.clickBtnNext = function() {
	var svIndex=  $('.survey_step li.is_active').index();
	var thisIndex = svIndex + 1;
	
	
	if(UNTOPEN02P07.location.checkSteps(thisIndex)){
	    $('.survey_step li').removeClass('is_active').eq(thisIndex).addClass('is_active');
	    UNTOPEN02P07.location.steps();
	}
	else{
		gfn_alertMsgBox("투자 성향 항목을 선택해 주세요.");
	}
	
}


// 투자성향분석 결과등록
UNTOPEN02P07.event.clickBtnViewResult = function(e) {
	e.preventDefault();

	var svIndex=  $('.survey_step li.is_active').index();
	var thisIndex = svIndex + 1;
	
	
	if(UNTOPEN02P07.location.checkSteps(thisIndex)){
		// 투자성향분석 조사내용을 만든다.
		UNTOPEN02P07.location.makeAnswerArr();
		
		// 투자성향 저장
		UNTOPEN02P07.tran.updateExtraInvestPropensity();
	}
	else{
		gfn_alertMsgBox("투자 성향 항목을 선택해 주세요.");
	}
	
}

// 투자성향분석 결과등록
UNTOPEN02P07.event.clickBtnPopClose = function(e) {
	e.preventDefault();
	
	gfn_confirmMsgBox("투자성향분석을 하셔야만 계좌개설을 진행할수 있습니다.<br>그래도 중지 하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){
			// 창 닫기 
			gfn_closePopup();
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN02P07.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 2021.06.28 기존 fail 뿐만 아니라 success일 때도 alert 추가 요청으로인한 분기 처리
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}else if(ComUtil.null(result.result, 'fail').toUpperCase() == "OK" ){
		//result.message = "결과값이 정상적으로 입력되었습니다. 창을 닫고 계좌개설 과정을 계속 진행해주세요.";
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
	} 
	
	// 투자성향 저장 
	if(sid == "updateExtraInvestPropensity"){
		
		var resultData = {};
		resultData.result = true;
		gfn_closePopup(resultData);
		return;
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 화면내 이동
UNTOPEN02P07.location.steps = function(){
	var svIndex=  $('.survey_step li.is_active').index();

	$('.survey_question ul li').hide().eq(svIndex).show();
	$('.survey_cklist ul').hide().eq(svIndex).show();

    if(svIndex !== 4){
        $('.bt-wrap:nth-child(1)').show().siblings().hide();
    }else{
        $('.bt-wrap:nth-child(1)').hide().siblings().show();
    }
	    
	if(svIndex !== 5){
        $('#btnNextPop').show();
        $('#btnViewResultPop').hide();
    }else{
        $('#btnNextPop').hide();
        $('#btnViewResultPop').show();
    }
}


// 화면내 이동전 필수값 체크
UNTOPEN02P07.location.checkSteps = function(svIndex){
	var result = false;
	
	
	if($('input:radio[name=sv'+svIndex+']').is(':checked')){
	    result = true;
	}
	else if($('input:checkbox[name^=sv'+svIndex+']').is(':checked')){
	    result = true;
	}
	
	return result;
}


// 투자성향 선택한 값들 추출하기
UNTOPEN02P07.location.makeAnswerArr = function() {
	var answerArr = UNTOPEN02P07.variable.sendData.answer_list;
	answerArr = [];
	
	debugger;
	
	$.each( $('ul[id^="answer_"]'), function(index){
		var item = {};
		item.idx = index + 1;
		item.code = $(this).data('code');
		item.is_multi = "0";		// 0 : 단일, 1 : 중복답변
		var answers = [];
		
		if(item.is_multi == "1"){
			$.each($('input:checkbox[name^="sv'+item.idx+'"]:checked'), function(index){
				answers.push(parseInt($(this).attr('value')));
			});
		}
		else{
			answers.push(parseInt($('input:radio[name="sv'+item.idx+'"]:checked').val()));
		}
		
		item.answers = answers; 
		answerArr.push(item);
	});
	
	UNTOPEN02P07.variable.sendData.answer_list = answerArr;
}

UNTOPEN02P07.init();
