var BOARDMNG = CommonPageObject.clone();

/* 화면내 변수  */
BOARDMNG.variable = {
	
}

/* 이벤트 정의 */
BOARDMNG.events = {
	 'click #btnSave' 				: 'BOARDMNG.event.saveQna'
	,'click #tablist > li'	 		: 'BOARDMNG.event.tabChange'
	,'click .result_ask'			: 'BOARDMNG.event.detailAsk'
}

BOARDMNG.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('BOARDMNG');
	
	$("#pTitle").text("1:1 문의");
	gfn_OnLoad();
	
	BOARDMNG.location.pageInit();
}

// 화면내 초기화 부분
BOARDMNG.location.pageInit = function() {
	//tab
    $('.tablist li:nth-child(1) a').addClass('is_active');
    $('#panel-1').show();
}

// 문의내역 조회 거래
BOARDMNG.tran.selectQnaList = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "myQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/my_qna";
	inputParam.data 	= {};
	inputParam.callback	= BOARDMNG.callBack; 
	
	gfn_Transaction( inputParam );
}

// 문의내역 등록 거래
BOARDMNG.tran.saveQna = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "saveQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/reg_qna";
	inputParam.data 	= gfn_makeInputData($('#panel-1'), {}, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.callback	= BOARDMNG.callBack;
	
	gfn_Transaction( inputParam );
}

// 탭 클릭 이벤트
BOARDMNG.event.tabChange = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('a').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab_panel').hide();
        $('#panel-'+index).show();
    }

	if(index == "2"){
		BOARDMNG.tran.selectQnaList();
	}
}

// 저장버튼 클릭 이벤트
BOARDMNG.event.saveQna = function(e) {
	e.preventDefault();
	
	if(!ComUtil.validate.check($('#panel-1')))
	{
		return false;
	}
	
	// 동의여부 체크
	if(!$("input:checkbox[id='term_yn']").is(":checked")){
		gfn_alertMsgBox("유의사항을 동의하셔야 합니다.");
		return;
	}
	
	BOARDMNG.tran.saveQna();
}

// 확장 펼침 이벤트
BOARDMNG.event.detailAsk = function(e) {
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
BOARDMNG.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "saveQna"){
		if(!gfn_isNull(result.message)){
			gfn_alertMsgBox(result.message);
		}
		
		gfn_clearData($('#panel-1'));
		
		$('#tab2').trigger("click");
	}
	
	if(sid == "myQna"){
		BOARDMNG.location.displayQna(result);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


BOARDMNG.location.displayQna = function(result){
	// 초기화
	$('div[id^="divResult_"]').html('');
	
	if(gfn_isNull(result.qna_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
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



BOARDMNG.init();
