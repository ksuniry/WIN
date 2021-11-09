var TEMPLATE_POP = CommonPageObject.clone();

TEMPLATE_POP.variable = {
	
}

TEMPLATE_POP.events = {
	 'click #btnSave' 				: 'TEMPLATE_POP.event.saveQna'
	,'click #pop_tablist > li'	 	: 'TEMPLATE_POP.event.tabChange'
	,'click .result_ask'			: 'TEMPLATE_POP.event.detailAsk'
	,'click #btnAlert'				: 'TEMPLATE_POP.event.clickAlert'
	,'click #btnError'				: 'TEMPLATE_POP.event.clickError'
	,'click #btnConfirm'			: 'TEMPLATE_POP.event.clickConfirm'
}

TEMPLATE_POP.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('TEMPLATE_POP');
	
	//$("#pTitle").text("qna");
	gfn_OnLoad();
	
	TEMPLATE_POP.location.pageInit();
}

// 화면내 초기화 부분
TEMPLATE_POP.location.pageInit = function() {
	//tab
    $('.tablist li:nth-child(1) a', $('#pop_tablist')).addClass('is_active');
    $('#pop_panel1').show();
}

function fn_content(){
	var inputParam 		= new Object();
	inputParam.sid 		= "myQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/my_qna";
	inputParam.data 	= {};
	inputParam.data.term_yn = "Y";		
	
	gfn_Transaction( inputParam );
}

TEMPLATE_POP.event.tabChange = function(e) {
	
	var index = ($(this).index())+1;
    var active = $(this).children('a').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab_panel').hide();
        $('#pop_panel'+index).show();
    }

	if(index == "2"){
		fn_content();
	}
}

TEMPLATE_POP.event.saveQna = function(e) {
	if(!ComUtil.validate.check($('#pop_panel1')))
	{
		return false;
	}
	
	// 동의여부 체크
	if(!$("input:checkbox[id='term_yn']").is(":checked")){
		alert("유의사항을 동의하셔야 합니다.");
		return;
	}
	
	var inputParam 	= new Object();
	inputParam.sid 		= "saveQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/reg_qna";
	inputParam.data 	= gfn_makeInputData($('#pop_panel1'), {}, '') ;
	inputParam.data.term_yn = "Y";		
	
	gfn_Transaction( inputParam );
}


TEMPLATE_POP.event.detailAsk = function(e) {
	var data = $(this).closest('.result_ask').data();
	gfn_log(data);
}


TEMPLATE_POP.event.clickAlert = function(e) {
	e.preventDefault();
	
	gfn_alertMsgBox("ppe alert!! 고고고");
}

TEMPLATE_POP.event.clickError = function(e) {
	e.preventDefault();
	
	gfn_errorMsgBox("ppe error!! 고고고");
}

TEMPLATE_POP.event.clickConfirm = function(e) {
	e.preventDefault();
	
	gfn_confirmMsgBox("ppe confirm!! 고고고", '', function(resultParam){
		if("Y" == resultParam.result){
			// ok일경우 후처리 작업 고고!!
			gfn_alertMsgBox("parent ok!!!!!");
		}
		else{
			gfn_alertMsgBox("parent no!!!!!");
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
function fn_callBack(sid, result, success){
	
	if(success != "success" ) {
		alert("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "saveQna"){
		if(!gfn_isNull(result.message)){
			alert(result.message);
		}
		
		gfn_clearData($('#pop_panel1'));
		
		$('#tab2').trigger("click");
		//fn_content();
	}
	
	if(sid == "myQna"){
		fn_displayQna(result);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


function fn_displayQna(result){
	// 초기화
	$('div[id^="divResult_"]').html('');
	
	if(gfn_isNull(result.qna_list)){
		$('#no_result').show();
		return;
	}
	
	/*
	var _template = '<div class="result_ask">\
                        <p>\
                            <span>{{q_title}}</span>\
                        </p>\
                        <div class="ask_r">\
                            <span class="notyet">미답변</span>\
                            <i class="ico arr_down" id=""></i>\
                        </div>\
                    </div>\
                    <div class="result_answer">\
                        <p class="question">\
                            <i>문의</i>\
                            <span></span>\
                        </p>\
                    </div>';
	*/

	var _template = $("#_dumyResult").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( result.qna_list, function(index, item){
		
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
		$('#divResult_' + item.q_type).append(html);
		$('#seResult_' + item.q_type).show();
		
		$('.result_ask', '#divResult_' + item.q_type).last().data(item);
	});	
}
	
TEMPLATE_POP.init();