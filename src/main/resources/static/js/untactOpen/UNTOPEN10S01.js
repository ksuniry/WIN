/**
* 파일명 		: UNTOPEN10S01.js (E-10-01)
* 업무		: 비대면계좌개설 > 1원 게좌번호 입력화면
* 설명		: 계좌의 비밀번호 입력
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.12
* 수정일/내용	: 
*/
var UNTOPEN10S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN10S01.variable = {
	sendData		: {
						i_amt_bnk_cd : ""			// 입금은행코드
						,i_amt_ac_no : ""			// 입금계좌번호
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
}

/* 이벤트 정의 */
UNTOPEN10S01.events = {
	 'click #btnNext' 								: 'UNTOPEN10S01.event.clickBtnNext'
	,'click #btnSelPopup'							: 'UNTOPEN10S01.event.clickBtnSelPopup'
	,'click .bank_list li'							: 'UNTOPEN10S01.event.clickBank'
}

UNTOPEN10S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN10S01');
	
	//$("#pTitle").text("펀드상세정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-10-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN10S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN10S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("sParams");
	
	/*$('.dim').click(function(){
		$('#modal_wrap').hide();
	});*/
	
	/*$('.bank_list li').click(function(){	    	
		$('#modal_wrap').hide();
	});*/
	
	$('.tablist li:nth-child(1) a').addClass('is_active');
	$('#panel-1').show();
	
	$('.tablist li').click(function(){
		var index = ($(this).index())+1;
		var active = $(this).children('a').hasClass('is_active');
		if(active !== true){
			$(this).children('a').addClass('is_active');
            $(this).siblings().children('a').removeClass('is_active');
            $('.tab_panel').hide();
            $('#panel-'+index).show();
        }
    });
	
	/*
	$('#divSelectBank').dSelectBox({
        isSelectTag: true,
        eventType: 'click'
    });
	*/
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 비대면 본인확인 입금계좌 입력
UNTOPEN10S01.tran.updatePersonalAccount = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updatePersonalAccount";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_personal_account";
	inputParam.data 	= UNTOPEN10S01.variable.sendData;
	inputParam.callback	= UNTOPEN10S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
UNTOPEN10S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	if(!ComUtil.validate.check($('#f-content')))
	{
		return false;
	}
	
	UNTOPEN10S01.variable.sendData.i_amt_ac_no = $('#acNo').val();
	
	UNTOPEN10S01.tran.updatePersonalAccount();
	//UNTOPEN10S01.callBack('updatePersonalAccount', {}, 'success');
}

UNTOPEN10S01.event.clickBtnSelPopup = function(e) {
	e.preventDefault();
	
	$('#modal_wrap').show();
}

UNTOPEN10S01.event.clickBank = function(e) {
	e.preventDefault();
	
	$('#modal_wrap').hide();
	
	//var bnkCd = $('input[type="radio"]', $(this)).val();
	var bnkCd = $('img', $(this)).attr('src');
	bnkCd = bnkCd.substr(bnkCd.lastIndexOf('/')+1, 3);
	var bnkNm = $('span', $(this)).html();
	$('#bankSelect').val(bnkNm);
	UNTOPEN10S01.variable.sendData.i_amt_bnk_cd = bnkCd;
	UNTOPEN10S01.variable.sendData.i_amt_bnk_nm = bnkNm;
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN10S01.callBack = function(sid, result, success){
	
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
	
	// 비대면 본인확인 입금계좌 입력
	if(sid == "updatePersonalAccount"){
		//UNTOPEN10S01.variable.detailData = result;
		//sStorage.setItem("UNTOPEN10S02Params", UNTOPEN10S01.variable.detailData);
		
		ComUtil.moveLink('/untact_open/UNTOPEN10S02', false); // 개설완료안내 화면이동
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수




UNTOPEN10S01.init();
