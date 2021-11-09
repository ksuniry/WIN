/**
* 파일명 		: INVPROP05S01.js (d-05-01   01 ~ 06)
* 업무		: 투자성향분석
* 설명		: 투자성향분석
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.17
* 수정일/내용	: 
*/
var INVPROP05S01 = CommonPageObject.clone();

/* 화면내 변수  */
INVPROP05S01.variable = {
	sendData		: {
						 use_analysis 		: "1"		// 투자성향 분석 여부     0 : 미진행, 1 : 진행
					    ,invest_propensity 	: "3"	 	// 임의로 선택한 투자성향   (1~5) 선택
					    ,answer_list 		: []	 	// 답변 리스트
					  }							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {									// 이전화면에서 받은 파라미터
						reInvestPropensity  : false		// 재투자성향분석 여부
					  }
	,showMenu		: false								//
}

/* 이벤트 정의 */
INVPROP05S01.events = {
	 'click #btnNext'		 						: 'INVPROP05S01.event.clickBtnNext'
	,'click #btnViewResult'							: 'INVPROP05S01.event.clickBtnViewResult'
	,'change input:checkbox[id^="sv02"]'			: 'INVPROP05S01.event.change02'
	//,'click li[id^="fundInfo_"]'					: 'INVPROP05S01.event.goFundDetail'
}

INVPROP05S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INVPROP05S01');
	
	$("#pTitle").text("투자성향분석");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-05-01";
	gfn_azureAnalytics(inputParam);
	
	INVPROP05S01.location.pageInit();
}


// 화면내 초기화 부분
INVPROP05S01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("INVESTPROPParams");
	//console.log(INVPROP05S01.variable.initParamData);
	if(!ComUtil.isNull(sParams)){
		INVPROP05S01.variable.detailData = sParams;
		INVPROP05S01.variable.initParamData = sParams;
		//INVPROP05S01.variable.initParamData.reInvestPropensity = sParams.reInvestPropensity; 
	}
	else{
		gfn_alertMsgBox('투자성향 내용이 조회 되지 않았습니다. 다시 진행하도록 하겠습니다.', '', function(){
			// 투자성향 시작 화면 이동
			ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01');
			return;
		});
	}
	//sStorage.clear();
	
	// 재투자성향분석일 경우 필요한 작업?
	//if(INVPROP05S01.variable.initParamData.reInvestPropensity){		
	//}
	
	gfn_setDetails(INVPROP05S01.variable.detailData, $('#f-content'));
	
	if(!ComUtil.isNull(INVPROP05S01.variable.detailData.section_1_age)){
		$('#divAge_1').show();
	}
	if(!ComUtil.isNull(INVPROP05S01.variable.detailData.section_2_age)){
		$('#divAge_2').show();
	}
	if(!ComUtil.isNull(INVPROP05S01.variable.detailData.section_3_age)){
		$('#divAge_3').show();
	}
	
    
    INVPROP05S01.location.steps();

	//INVPROP05S01.tran.selectInvestPropensity();
	// 패널별 질문 상태값 저장
	INVPROP05S01.location.setAnswerInit();
	
	// 결과보기 버튼 숨기기
	$('#btnViewResult').hide();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 투자성향분석 완료 및 투자자문계약 정보 조회한다 
/*INVPROP05S01.tran.selectInvestPropensity = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectInvestPropensity";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/select_invest_propensity";
	inputParam.data 	= INVPROP05S01.variable.sendData;
	inputParam.callback	= INVPROP05S01.callBack; 
	
	gfn_Transaction( inputParam );
}*/




// 투자성향 저장
INVPROP05S01.tran.updateInvestPropensity = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateInvestPropensity";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/update_invest_propensity";
	inputParam.data 	= INVPROP05S01.variable.sendData;
	inputParam.callback	= INVPROP05S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
INVPROP05S01.event.clickBtnNext = function() {
	var svIndex=  $('.survey_step li.is_active').index();
	var thisIndex = svIndex + 1;
	
	
	if(INVPROP05S01.location.checkSteps(svIndex)){
	    $('.survey_step li').removeClass('is_active').eq(thisIndex).addClass('is_active');
	    INVPROP05S01.location.steps();
	}
	else{
		gfn_alertMsgBox("투자 성향 항목을 선택해 주세요.");
	}
	
}


// 투자성향분석 결과등록
INVPROP05S01.event.clickBtnViewResult = function(e) {
	e.preventDefault();

	var svIndex=  $('.survey_step li.is_active').index();
	//var thisIndex = svIndex + 1;
	
	
	if(INVPROP05S01.location.checkSteps(svIndex)){
		// 투자성향분석 조사내용을 만든다.
		INVPROP05S01.location.makeAnswerArr();
		
		// 투자성향 저장
		INVPROP05S01.tran.updateInvestPropensity();
	}
	else{
		gfn_alertMsgBox("투자 성향 항목을 선택해 주세요.");
	}
	
}

// 두번째 투자성향분석에서 해당없음 선택시 
INVPROP05S01.event.change02 = function(e) {
	e.preventDefault();
	
	if($(this).attr('id') == 'sv0205'){
		if($('input:checkbox[id="sv0205"]').is(':checked')){
			$('input:checkbox[id^="sv02"]').attr('checked', false);
			$('input:checkbox[id="sv0205"]').attr('checked', true);
		}
	}
	else{
		$('input:checkbox[id="sv0205"]').attr('checked', false);
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
INVPROP05S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자성향 조회
	/*
	if(sid == "selectInvestPropensity"){
		INVPROP05S01.variable.detailData = result;
		
		// 패널별 질문 상태값 저장
		INVPROP05S01.location.setAnswerInit();
		
	}*/
	// 투자성향 저장 
	if(sid == "updateInvestPropensity"){
		
		var listLength = 0;
		if(ComUtil.isNull(result.invest_propensity)){
			gfn_alertMsgBox("투자성향분석 결과값을 받지 못했습니다.");
			return;
		}
					
		sStorage.setItem("INVESTPROPParams", result);
		if(result.possible_contract_status == 'Y'){
			// 투자성향 결과 페이지로 이동
			ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP06S01");
		}
		else{
			// 투자성향 결과 페이지로 이동 (서비스불가)
			ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP06S02");
		}
		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 화면내 이동
INVPROP05S01.location.steps = function(){
	var svIndex=  $('.survey_step li.is_active').index();

	$('.survey_question ul li').hide().eq(svIndex).show();
	$('.survey_cklist ul').hide().eq(svIndex).show();

    if(svIndex !== 4){
        $('.bt-wrap:nth-child(1)').show().siblings().hide();
    }else{
        $('.bt-wrap:nth-child(1)').hide().siblings().show();
    }
	    
	if(svIndex !== 5){
        $('#btnNext').show();
        $('#btnViewResult').hide();
    }else{
        $('#btnNext').hide();
        $('#btnViewResult').show();
    }
}

// 화면내 이동전 필수값 체크
INVPROP05S01.location.checkSteps = function(svIndex){
	var result = false;
	
	
	if($('input:radio[name=sv'+svIndex+']').is(':checked')){
	    result = true;
	}
	else if($('input:checkbox[name^=sv'+svIndex+']').is(':checked')){
	    result = true;
	}
	
	return result;
}

// 패널별 질문 상태값 저장
INVPROP05S01.location.setAnswerInit = function(){
	var initAnswerArr = INVPROP05S01.variable.detailData.answer_list;
	/*
	
	initAnswerArr.push({code:1, is_multi:0, enable:1});       // answer_1
	initAnswerArr.push({code:2, is_multi:0, enable:1});       // answer_2
	initAnswerArr.push({code:3, is_multi:1, enable:1});       // answer_3
	initAnswerArr.push({code:4, is_multi:0, enable:1});       // answer_4
	initAnswerArr.push({code:5, is_multi:0, enable:1});       // answer_5
	//initAnswerArr.push({code:6, is_multi:0, enable:1});       // answer_6
	*/
	
	//INVPROP05S01.variable.sendData.answer_list = initAnswerArr;
	var answerId = "answer_";
	
	$.each( initAnswerArr, function(index, item){
		$('#'+answerId+(parseInt(item.code)+1)).data(item);
		//$('#'+answerId+item.code).data(item);
	});
}

// 투자성향 선택한 값들 추출하기
INVPROP05S01.location.makeAnswerArr = function() {
	var answerArr = INVPROP05S01.variable.sendData.answer_list;
	answerArr = [];
	
	$.each( $('ul[id^="answer_"]'), function(index){
		var item = $(this).data();
		var answers = [];
		
		if(item.is_multi == "1"){
			$.each($('input:checkbox[name^="sv'+item.code+'"]:checked'), function(index){
				answers.push(parseInt($(this).attr('value')));
			});
		}
		else{
			answers.push(parseInt($('input:radio[name="sv'+item.code+'"]:checked').val()));
		}
		
		item.answers = answers; 
		answerArr.push(item);
	});
	
	INVPROP05S01.variable.sendData.answer_list = answerArr;
}


INVPROP05S01.init();
