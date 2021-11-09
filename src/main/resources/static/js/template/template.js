/**
* 파일명 		: PENSION02S01.js
* 업무		: 연금관리 > 추가저축 
* 설명		: 저축 대비 연금수령액 시뷸레이션 결과를 보여준다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/
var TEMPLATE = CommonPageObject.clone();

/* 화면내 변수  */
TEMPLATE.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: {}								// 팝업에서 결과값 리턴시 사용
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
	,screenType		: 'welcome_board'					// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
TEMPLATE.events = {
	 'click #btnSave' 				: 'TEMPLATE.event.saveQna'
	,'click #tablist > li'	 		: 'TEMPLATE.event.tabChange'
	,'click .result_ask'			: 'TEMPLATE.event.detailAsk'
	,'click #btnAlert'				: 'TEMPLATE.event.clickAlert'
	,'click #btnOk'					: 'TEMPLATE.event.clickOk'
	,'click #btnError'				: 'TEMPLATE.event.clickError'
	,'click #btnConfirm'			: 'TEMPLATE.event.clickConfirm'
	,'click #btnCallPopup'			: 'TEMPLATE.event.btnCallPopup'
	,'click #btnMapTest'			: 'TEMPLATE.event.btnMapTest'
	,'click #btnAddressTest'		: 'TEMPLATE.event.btnAddressTest'
	,'click #btnJunmunTest'			: 'TEMPLATE.event.btnJunmunTest'
	//'click li[id^="boardRow_"]'						: 'BORDSCF09S01.event.clickDetailView'
}

TEMPLATE.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('TEMPLATE');
	
	//$("#pTitle").text("qna");
	gfn_OnLoad();
	
	TEMPLATE.location.pageInit();
}

// 화면내 초기화 부분
TEMPLATE.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	//var sParams = sStorage.getItem("TEMPLATEParams");
	//if(!ComUtil.isNull(sParams)){
	//	gfn_log(sParams);
	//	TEMPLATE.variable.initParamData = sParams;
	//	sStorage.clear();
	//}
	
	/*
	var sParams = sStorage.getItem("UNTOPENParams");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		UNTOPEN06S01.variable.initParamData = sParams;
		UNTOPEN06S01.variable.detailData = sParams;
	}
	else{
		gfn_callPopupSysClose({msg:"비정상적인 접근입니다."});
		return;
	}
	*/
	
	//$(document).off("click", '.popup_close').on("click",'.popup_close',function(){
    //   $(this).parents('.popup_wrap').hide();
    //});

	// $('#userPn').html(ComUtil.string.format(gfn_getUserInfo("userPn", true), 'tel'));

	
	//tab
    $('.tablist li:nth-child(1) a').addClass('is_active');
    $('#panel-1').show();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 문의내역 조회 거래
TEMPLATE.tran.selectQnaList = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "myQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/my_qna";
	inputParam.data 	= {};
	inputParam.callback	= TEMPLATE.callBack; 
	
	gfn_Transaction( inputParam );
}

// 문의내역 등록 거래
TEMPLATE.tran.saveQna = function(paramObj) {
	var inputParam 		= gfn_objectCopy(paramObj);
	inputParam.sid 		= "saveQna";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/reg_qna";
	inputParam.data 	= gfn_makeInputData($('#panel-1'), {}, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.callback	= TEMPLATE.callBack;
	
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 탭 클릭 이벤트
TEMPLATE.event.tabChange = function(e) {
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
		TEMPLATE.tran.selectQnaList();
	}
}

// 저장버튼 클릭 이벤트
TEMPLATE.event.saveQna = function(e) {
	e.preventDefault();
	//$(this).attr("disabled", true);
	
	if(!ComUtil.validate.check($('#f-content')))
	{
		return false;
	}
	
	// 동의여부 체크
	if(!$("input:checkbox[id='term_yn']").is(":checked")){
		gfn_alertMsgBox("유의사항을 동의하셔야 합니다.");
		return;
	}
	
	TEMPLATE.tran.saveQna();
}

// 확장 펼침 이벤트
TEMPLATE.event.detailAsk = function(e) {
 	e.preventDefault();

	if($(this).find('.ico').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
    }

	var data = $(this).closest('.result_ask').data();
	gfn_log(data);
}


TEMPLATE.event.clickAlert = function(e) {
	e.preventDefault();
	
	gfn_alertMsgBox("ppe alert!! 고고고");
}

TEMPLATE.event.clickOk = function(e) {
	e.preventDefault();
	
	gfn_okMsgBox("ppe ok alert!! 고고고");
}

TEMPLATE.event.clickError = function(e) {
	e.preventDefault();
	
	gfn_errorMsgBox("ppe error!! 고고고");
}


TEMPLATE.event.btnCallPopup = function(e){
	var sParam = {};
	sParam.url = '/template/template_pop';
	gfn_callPopup(sParam, function(){});
	
	//UNTOPEN10S01.variable.detailData = result;
	//sStorage.setItem("UNTOPEN10S02Params", UNTOPEN10S01.variable.detailData);
	//ComUtil.moveLink(linkUrl); // 화면이동
}

TEMPLATE.event.clickConfirm = function(e) {
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


TEMPLATE.event.btnMapTest = function(e){
	// test니까 여기서 호출한거다. 트랜만들기 귀찮아서
	var inputParam 		= gfn_objectCopy({});
	inputParam.sid 		= "selectMap";
	inputParam.target 	= "webapp";
	inputParam.url 		= "/template/select_map";
	inputParam.data 	= gfn_makeInputData($('#panel-1'), {}, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.loadingTxt = "테스트 메세지";		// 로딩바 메세지
	inputParam.callback	= TEMPLATE.callBack;
	
	gfn_Transaction( inputParam );
}

// 주소테스트
TEMPLATE.event.btnAddressTest = function(e){
	// test니까 여기서 호출한거다. 트랜만들기 귀찮아서
	var inputParam 		= gfn_objectCopy({});
	inputParam.sid 		= "selectAddress";
	inputParam.target 	= "webapp";
	inputParam.url 		= "/template/selectAddress";
	inputParam.data 	= gfn_makeInputData($('#panel-1'), {}, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.callback	= TEMPLATE.callBack;
	
	gfn_Transaction( inputParam );
}

// 주소테스트
TEMPLATE.event.btnJunmunTest = function(e){
	// test니까 여기서 호출한거다. 트랜만들기 귀찮아서
	var inputParam 		= gfn_objectCopy({});
	inputParam.sid 		= "selectJunmun";
	inputParam.target 	= "webapp";
	inputParam.url 		= "/template/selectJunmun";
	inputParam.data 	= gfn_makeInputData($('#panel-1'), {}, '') ;
	inputParam.data.term_yn = "Y";		// 동의여부
	inputParam.callback	= TEMPLATE.callBack;
	
	gfn_Transaction( inputParam );
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
TEMPLATE.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		//history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	if(sid == "saveQna"){
		if(!gfn_isNull(result.message)){
			alert(result.message);
		}
		
		gfn_clearData($('#panel-1'));
		
		$('#tab2').trigger("click");
		//TEMPLATE.tran.selectQnaList();
	}
	
	if(sid == "selectMap"){
		//debugger;
	}
	
	if(sid == "selectAddress"){
		//debugger;
	}
	
	if(sid == "selectJunmun"){
		//debugger;
	}
	
	if(sid == "myQna"){
		TEMPLATE.location.displayQna(result);
		// 상세내역 셋팅
		//ADVCEXC12S01.variable.detailData = result;
		//gfn_setDetails(ADVCEXC12S01.variable.detailData, $('#f-content'));
		
		//ADVCEXC12S01.variable.detailData.user_nm = JsEncrptObject.decrypt(ADVCEXC12S01.variable.detailData.user_nm);
		var userNm = gfn_getUserInfo('userNm', true);
	}
}

// 네이티브 호출후 콜백함수 
TEMPLATE.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 스크랩핑 성공시 재조회
			// 다음버튼 클릭??
			$('#btnNext').trigger('click');
		}
		else{
			// 스크랩핑 실패시
			// 재시도할지 취소할지 컨펌창을 호출한다.
			var detailData = TEMPLATE.variable.detailData;
			//detailData.message = '';
			TEMPLATE.location.callScraping(detailData);
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수

TEMPLATE.location.displayQna = function(result){
	// 초기화
	$('div[id^="divResult_"]').html('');
	
	if(gfn_isNull(result.qna_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();

	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( result.qna_list, function(index, item){
		item.idx = index + 1;
		if(!ComUtil.isNull(item.q_content)){
			//item.q_content = item.q_content.replace(/(?:\r\n|\r|\n)/g, '<br />');
			item.q_content = ComUtil.string.convertHtml(item.q_content);
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


ADVCEXC12S01.location.displayAcntInfo = function(){
	var detailData = ADVCEXC12S01.variable.detailData;
	// 초기화
	$('div[id^="divFnclList"]').html('');
	
	if(gfn_isNull(detailData.account)){
		return;
	}
	
	var _template = $("#_dumyFncl").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyAcnt").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each( detailData.account, function(index, item){
		item.idx = index + 1;
		
		//item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		var html = template(item);
		$('#divFnclList').append(html);
		
		$.each( item.account_info_list, function(index, item2){
			item2.idx = index;
			var html2 = template2(item2);
			$('#ulAcntList_' + item.idx).append(html2);
		});
	});
	
}



TEMPLATE.init();
