/**
* 파일명 		: MYINFOM03S20.js
* 업무		: 메인 > 내정보 > 통합연금 로그인 (c-03-20)
* 설명		: 통합연금 로그인 
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.24\

* 수정일/내용	: 
*/
var MYINFOM03S20 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S20.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,certLoginYn	: 'N'								// 통합연금포털 인증서 로그인 여부
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S20.events = {
	 'click #btnJoinPage'					: 'MYINFOM03S20.event.clickBtnJoinPage'
	 ,'change #userId'						: 'MYINFOM03S20.event.changeUserId'
	 ,'click #btnCallPopCert'				: 'MYINFOM03S20.event.clickBtnCallPopCert'
	 ,'click #btnCertLogin'					: 'MYINFOM03S20.event.clickBtnCertLogin'
	 ,'click #btnClosePop'					: 'MYINFOM03S20.event.clickBtnClosePop'
}

MYINFOM03S20.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S20');
	
	$("#pTitle").text("통합연금포털 연결하기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-20";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S20.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S20.location.pageInit = function() {
	
	//$('.ffl-wrapper').floatingFormLabels();
	var formFields = $('.floating_label_wrap');
                
    formFields.each(function() {
        const field = $(this);
        const input = field.find('.ft_inp');
        const label = field.find('.ft_label');
        
        input.focusin(  
            function(){  
                input.parent('.ft_inp_group').addClass('ft_inp__focused');  
            }).focusout(  
            function(){  
                input.parent('.ft_inp_group').removeClass('ft_inp__focused');  
        });
        
        function checkInput() {
            var valueLength = input.val().length;
            
            if (valueLength > 0 ) {
                label.parent('.ft_inp_group').addClass('ft_inp__has_value');
            } else {
                    label.parent('.ft_inp_group').removeClass('ft_inp__has_value');
            }
        }
        
        input.change(function() {
            checkInput()
        })
    });

	$('.modal-page-btn button, .dim', $('#divPopCert')).on("click", function(){
		$('#divPopCert').hide();
	});
	
	/*if(!gfn_isOper()){
		$('#divCertBtn').show();
	}*/
	

	// 통합연금포털 아이디 조회 	
	//MYINFOM03S20.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM03S20.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S20.callBack; 
	
	gfn_Transaction( inputParam );*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 회원가입 페이지로 이동
MYINFOM03S20.event.clickBtnJoinPage = function(e) {
 	e.preventDefault();
	
	//ComUtil.moveLink('/my_info/MYINFOM03S21', true);
	
	// 브릿지 호출	
	var inputParam = {};
	inputParam.url 			= 'https://100lifeplan.fss.or.kr/login/loginScrn.do?mode=id';
	inputParam.screenId 	= "MYINFOM03S21";
	inputParam.objId	 	= 'span';
	inputParam.inYn		 	= "N";
	inputParam.type		 	= "link";
	
	gfn_otherLinkOpen(inputParam);
}


// 회원정보 입력
MYINFOM03S20.event.changeUserId = function(e) {
 	e.preventDefault();

	var uid = $(this).val();
	
	if(ComUtil.isNull(uid)){
		$('#divPw').hide();
		return;
	}
	
	// id check
	var inputParam = {};
	inputParam.value 		= uid;
	inputParam.site 		= 'lifeplan';
	inputParam.minLength 	= $(this).attr('minLength');
	inputParam.maxLength 	= $(this).attr('maxLength');
	
	var resultParam = ComUtil.validate.chkId( inputParam );
	if( !resultParam.pass ) {
		gfn_alertMsgBox($(this).attr('title') + " " + resultParam.msg, '', function(){
			$(this).trigger('click');
		});
		
		$(this).val('');
		return;
	}
	
	/*if(ComUtil.null(uid, '').length < 6 && ComUtil.null(uid, '').length > 0){
		gfn_alertMsgBox('아이디는 6자리 이상 입니다.', '', function(){
			//$(this).focus();
			$(this).trigger('click');
		});
		return;
	}*/
	$('#divPw').show();
	//$('#userPw_keypad').focus();
	$('#userPw_keypad').trigger('click');
	MYINFOM03S20.location.callScraping();
}

// 공인인증서를 이용한 연결 안내 팝업호출 버튼 클릭시
MYINFOM03S20.event.clickBtnCallPopCert = function(e) {
 	e.preventDefault();

	$('#divPopCert').show();
}

// 공인인증서를 이용한 연결 안내 팝업취소 버튼 클릭시
MYINFOM03S20.event.clickBtnClosePop = function(e) {
 	e.preventDefault();

	$('#divPopCert').hide();
}

// 공인인증서를 이용한 연결 안내 팝업에서 연결하기 버튼 클릭시
MYINFOM03S20.event.clickBtnCertLogin = function(e) {
 	e.preventDefault();

	MYINFOM03S20.variable.certLoginYn = "Y";
	MYINFOM03S20.location.callScraping();
	MYINFOM03S20.variable.certLoginYn = "N";
	$('#divPopCert').hide();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S20.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세조회
	if(sid == "myPnsnList"){
		MYINFOM03S20.variable.detailData = result;
		
		// 
		MYINFOM03S20.location.displayDetail();
	}
}

// 네이티브 호출후 콜백함수 
MYINFOM03S20.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	gfn_log('key :::::::::::  ' + key);
	
	// 키패드 호출 
	if(key == 'keyPad'){
		// 길이체크 최소 8 / 최대 20
		var valId = ComUtil.string.replaceAll(result.id, '_keypad', '');  // 실제 값을 저장할 아이디
		var valObj = $('#' + valId);
		
		if(8 > result.cnt){
			$('#' + result.id).val('');
			valObj.val('');
			gfn_alertMsgBox("8자리 이상 입력하시길 바랍니다.");
			return;
		}
		
		gfn_log('adfasdf..' + valObj.val());
		MYINFOM03S20.location.callScraping();
		return;
	}
	
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.isNull(result.result)){
			gfn_alertMsgBox("정보수집을 하지 못했습니다.", '', function(){
				
			});
			return;
		}
		gfn_log('scraping..........................' + result.result.length);
		
		var errorCnt = 0;
		var errorMsg = "";
		var errorCode = "";
		$.each(result.result, function(index, item){
			// 스크랩핑 실패
			if(parseInt(ComUtil.null(item.errorCode, '-1')) != 0){
				errorCnt++;
				errorMsg = item.errorMsg;
				errorCode = item.errorCode;
			}
		});
		
		gfn_log('errorCnt..........................' + errorCnt);
		
		if(errorCnt == 0){
			gfn_log('result..');
			gfn_log(result);
			// 스크랩핑 성공시 재조회
			gfn_historyClear();
			gfn_goMain();
		}
		else{
			// 에러메세지 변경이 필요한 경우 적용
			if('80004051|80004054|80002214|'.indexOf(errorCode) > -1){
				errorMsg = '아이디나 비밀번호가 일치하지 않습니다.<br>5회 오류 입력시 로그인이 차단되므로 유의하시기 바랍니다.';
			}
			else if('42110000|'.indexOf(errorCode) > -1){
				errorMsg = '통합연금포털에서 조회한 결과 고객님의 연금을 찾을 수 없습니다.';
			}
			
			gfn_alertMsgBox(ComUtil.null(errorMsg, gfn_helpDeskMsg()), '', function(){
				// 로그인은 성공하였으나 아직 정보 생성중일때..
				gfn_log('errorCode :: ' + errorCode);
				// gfn_alertMsgBox('errorCode :: ' + errorCode);
				if("|80002E26|42110000|".indexOf(errorCode) > -1){
					gfn_historyClear();
					gfn_goMain();
				}
				else{
					$('#divPw').hide();
					$('#userPw').val('');
					$('#userPw_keypad').val('');
					$('#userId').val('');
				}
			});
			return;
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S20.location.displayDetail = function(){
	var detailData = MYINFOM03S20.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
}

// 통합연금 로그인(스크랩핑)
MYINFOM03S20.location.callScraping = function(){
	
	var inputParam = {};
	inputParam.type = 'lifeplan';
	
	if(MYINFOM03S20.variable.certLoginYn == 'N'){
		inputParam.userId = $('#userId').val();
		inputParam.userPw = $('#userPw').val();
		
		gfn_log("inputParam.userId :: " + inputParam.userId);
		gfn_log("inputParam.userPw :: " + inputParam.userPw);
		
		// 필수값 체크
		if(ComUtil.isNull(inputParam.userId) || ComUtil.isNull(inputParam.userPw)){
			return;
		}
	}
	
	gfn_scraping(inputParam);
}



MYINFOM03S20.init();
