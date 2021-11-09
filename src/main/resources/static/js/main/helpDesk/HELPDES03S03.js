/**
* 파일명 		: HELPDES03S03.js
* 업무		: 메인 > 고객센터 > 1:1문의(c-03-03)
* 설명		: 내자문내역
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.15
* 수정일/내용	: 
*/
var HELPDES03S03 = CommonPageObject.clone();

/* 화면내 변수  */
HELPDES03S03.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: {}								// 팝업에서 결과값 리턴시 사용
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: false								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
HELPDES03S03.events = {
	 'click #btnSave' 				: 'HELPDES03S03.event.clickMsgCall'
	,'click #btnPopCancel'			: 'HELPDES03S03.event.clickBtnPopCancel'
	,'click #btnPopOk'				: 'HELPDES03S03.event.clickBtnPopOk'
	
	
	
	,'click #tablist > li'	 		: 'HELPDES03S03.event.tabChange'
	,'click .result_ask'			: 'HELPDES03S03.event.detailAsk'
}

HELPDES03S03.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('HELPDES03S03');
	
	$("#pTitle").text("1:1 문의");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-03";
	gfn_azureAnalytics(inputParam);
	
	HELPDES03S03.location.pageInit();
}

// 화면내 초기화 부분
HELPDES03S03.location.pageInit = function() {
	//tab
    $('.tablist li:nth-child(1) a').addClass('is_active');
    $('#tabPanel-1').show();


	HELPDES03S03.variable.sendData.q_email 		= gfn_getUserInfo("userEmail", true);
	HELPDES03S03.variable.sendData.userPn	 	= gfn_getUserInfo("userPn", true);

	if(!ComUtil.isNull(gfn_getUserInfo("userEmail", true))){
		$('#divEmailMsg').show();
		$('#divEmailInfo').show();
		// test data
		HELPDES03S03.variable.sendData.q_email = 'aa@bb.co.kr';
	}
	
	//$('#userEmail').html(ComUtil.null(gfn_getUserInfo("userEmail", true), '이메일이 등록되어 있지 않습니다.'));
	$('#userPn').html(ComUtil.string.format(gfn_getUserInfo("userPn", true), 'tel'));
	
	// 문의유형 셋팅
	HELPDES03S03.tran.selectCommCode();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 문의유형 코드조회
HELPDES03S03.tran.selectCommCode = function() {
	/*
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "selectCommCode";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/code_list";
	inputParam.data 	= {group_code:'qna_category'};
	inputParam.callback	= HELPDES03S03.callBack; 
	
	gfn_Transaction( inputParam );
	*/
	var inputParam 			= {};
	inputParam.sid 			= "selectCommCode";
	inputParam.callback		= HELPDES03S03.callBack;
	 
	inputParam.group_code	= 'qna_category';
	inputParam.objId		= 'q_type';
	inputParam.setType		= 'sel';
	
	gfn_getCommCode(inputParam);
}


// 문의내역 조회 거래
HELPDES03S03.tran.selectQnaList = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "myQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/my_qna";
	inputParam.data 	= {};
	inputParam.callback	= HELPDES03S03.callBack; 
	
	gfn_Transaction( inputParam );
}

// 문의내역 등록 거래
HELPDES03S03.tran.saveQna = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "saveQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/reg_qna";
	inputParam.data 	= gfn_makeInputData($('#tabPanel-1'), HELPDES03S03.variable.sendData, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.callback	= HELPDES03S03.callBack;
	
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 탭 클릭 이벤트
HELPDES03S03.event.tabChange = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('a').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab_panel').hide();
        $('#tabPanel-'+index).show();
    }

	if(index == "2"){
		HELPDES03S03.tran.selectQnaList();
	}
	
	$(window).scrollTop(0);
}

// 저장버튼 클릭 이벤트
HELPDES03S03.event.clickMsgCall = function(e) {
	e.preventDefault();
	
	if(!ComUtil.validate.check($('#tabPanel-1')))
	{
		return false;
	}
	
	// msp popup call
	$('#divPop0303').show(); 
}

// msg popup close
HELPDES03S03.event.clickBtnPopCancel = function(e) {
 	e.preventDefault();

	$('#divPop0303').hide(); 
}


// 1:1 qna save ok
HELPDES03S03.event.clickBtnPopOk = function(e) {
 	e.preventDefault();

	$('#divPop0303').hide();
	
	if(!ComUtil.validate.check($('#tabPanel-1')))
	{
		return false;
	}
	 
	// 동의여부 체크
	/*if(!$("input:checkbox[id='term_yn']").is(":checked")){
		gfn_alertMsgBox("유의사항을 동의하셔야 합니다.");
		return;
	}*/
	
	// pin num check
	
	var sParam = {};
	sParam.url = '/popup/CMMPINN01P01';
	//sParam.title = $("#pTitle").text();
	sParam.title = '질문내용 저장을';
	sStorage.setItem("CMMPINN01P01Params", sParam);
	
	gfn_callPopup(sParam, function(resultData){
		gfn_log('HELPDES03S03.callback resultData :::  ' + resultData);
		if(!ComUtil.isNull(resultData)){
			if(ComUtil.isNull(resultData.result)){
				return;
			}
			
			if(resultData.result){
				HELPDES03S03.tran.saveQna();
			}
		}
		
	});
	
}


// 확장 펼침 이벤트
HELPDES03S03.event.detailAsk = function(e) {
 	e.preventDefault();

	if($(this).find('.ico').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
    }

	var data = $(this).closest('.result_ask').data();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
HELPDES03S03.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "saveQna"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		gfn_clearData($('#tabPanel-1'));
		
		$('#tab2').trigger("click");
	}
	
	if(sid == "selectCommCode"){
		//HELPDES03S03.location.setSelectBox(result.code_list, 'q_type');
		gfn_log("main page callback!!");
	}
	if(sid == "myQna"){
		HELPDES03S03.location.displayQna(result);
	}
}

HELPDES03S03.callBack.keyPad = function(result){
	gfn_log(result);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 공통코드값 select에 셋팅
HELPDES03S03.location.setSelectBox = function(codeList, objId){
	
	if(gfn_isNull(codeList)){
		return;
	}
	
	var obj = $('#'+objId);
	
	$.each(codeList, function(index, item){
		var option = '<option value="'+item.code+'">'+item.code_nm+'</option>';
		
		$('#'+objId).append(option);
	});
}


HELPDES03S03.location.displayQna = function(result){
	// 초기화
	$('#divTypeList').html('');
	
	if(gfn_isNull(result.qna_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
	

	var _templateType = $("#_dumyType").html();

	var templateType = Handlebars.compile(_templateType);
	
	var _template = $("#_dumyResult").html();

	var template = Handlebars.compile(_template);
	
	var typeArr = new Array();
	
	$.each( result.qna_list, function(index, item){
		
		if(typeArr.indexOf(item.q_type) == -1){
			typeArr.push(item.q_type);
			
			
			// new type add 
			var htmlType = templateType(item);
			$('#divTypeList').append(htmlType);
		}
		
		
		
		if(!ComUtil.isNull(item.q_content)){
			item.q_content = item.q_content.replace(/(?:\r\n|\r|\n)/g, '<br />');
		}
		
		if(ComUtil.isNull(item.a_content)){
			item.txt_ask = "미답변";
			item.class_ask = "notyet";
		}
		else{
			item.a_content = item.a_content.replace(/(?:\r\n|\r|\n)/g, '<br />');
			item.txt_ask = "답변완료";
			item.class_ask = "complete";
		}
		
		var html = template(item);
		$('#qnaRow_' + item.q_type).append(html);
		
	});	
}	



HELPDES03S03.init();
