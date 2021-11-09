/**
* 파일명 		: MYINFOM03S07.js
* 업무		: 메인 > 내정보 > 설정 (c-03-07)
* 설명		: 설정
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.20
* 수정일/내용	: 
*/
var MYINFOM03S07 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S07.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S07.events = {
	 'click li[name="callPopupTerm"], div[name="callPopupTerm"]'		: 'MYINFOM03S07.event.clickCallPopupTerm'
	 ,'click #closePopupTerm'				: 'MYINFOM03S07.event.clickClosePopupTerm'
	 ,'click #btnPopOk'						: 'MYINFOM03S07.event.clickBtnPopOk'
	 ,'change #marketingAgree'				: 'MYINFOM03S07.event.changeMarketingAgree'
	 //'click div[id^="rowCntrt_"]'			: 'MYINFOM03S07.event.clickDetailCntrt'
}

MYINFOM03S07.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S07');
	
	$("#pTitle").text("약관 및 이용동의");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-07";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S07.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S07.location.pageInit = function() {
	$('.popup_wrap').hide().addClass('bottom');

	// 상세내역 조회
	MYINFOM03S07.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
//  약관 및 이용동의 조회 
MYINFOM03S07.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectCustomerAllTermList";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/select_customer_all_term_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S07.callBack; 
	
	gfn_Transaction( inputParam );
}

//  마케팅 동의여부 저장  
MYINFOM03S07.tran.updateMarketing = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateCustomerMarketingPolicy";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/update_customer_marketing_policy";
	inputParam.data 	= MYINFOM03S07.variable.sendData;
	inputParam.callback	= MYINFOM03S07.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트


// 약관내용 내부팝업 호출
MYINFOM03S07.event.clickCallPopupTerm = function(e){
	e.preventDefault();
	
	var detailData = MYINFOM03S07.variable.detailData;
	
	var index = $(this).data('index');
	var title = $(this).data('title');
	
	
	// 마케팅 활용 동의 
	/*if(index == "3"){
		$('#marketingAgree').trigger('change');
		return;
	}*/
	
	
	if(!ComUtil.isNull(detailData.term_list[index])){
		$('#popTitle').html(title);
		$('#popTerm').html(detailData.term_list[index].content);
	}
	
	$('#pop0307').show();
	
	setTimeout(function(){ 
       $('#pop0307').addClass('in');
    }, 100);
}

// 약관내용 내부팝업 닫기
MYINFOM03S07.event.clickClosePopupTerm = function(e){
	e.preventDefault();
	
	
	MYINFOM03S07.location.closePopMarketing();
}

// 마케팅동의 내부팝업 확인버튼 클릭시
MYINFOM03S07.event.clickBtnPopOk = function(e){
	e.preventDefault();
	
	MYINFOM03S07.location.closePopMarketing();
}

// 변경된 마켓팅 동의내용 저장
MYINFOM03S07.event.changeMarketingAgree = function(e){
	e.preventDefault();
	
	// 변경 내용 저장 
	if($('input:checkbox[id="marketingAgree"]').is(':checked') == true){
		MYINFOM03S07.variable.sendData.agree_yn = 'Y'; 
	}
	else{
		MYINFOM03S07.variable.sendData.agree_yn = 'N';
	}
	
	//  마케팅 동의여부 저장  
	MYINFOM03S07.tran.updateMarketing();
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
MYINFOM03S07.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	
	// 이용약관 동의
	if(sid == "selectCustomerAllTermList"){
		MYINFOM03S07.variable.detailData = result;
		
		// 
		MYINFOM03S07.location.displayDetail();
		return;				
	}
	
	// 변경된 마켓팅 동의내용 저장
	if(sid == "updateCustomerMarketingPolicy"){
		return;
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S07.location.displayDetail = function(){
	var detailData = MYINFOM03S07.variable.detailData;
	
	if(!ComUtil.isNull(detailData.term_list[2])){
		$('input#marketingAgree').attr( "checked", detailData.term_list[2].agree_yn == 'Y' ? true : false ); 
	}
	
	//gfn_setDetails(detailData, $('#f-content'));
}	


MYINFOM03S07.location.closePopMarketing = function(){
	$('#pop0307').removeClass('in');
    setTimeout(function(){ 
        $('#pop0307').hide();
    }, 100);
}



MYINFOM03S07.init();
