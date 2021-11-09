/**
* 파일명 		: UNTOPEN03S01.js (E-03-01)
* 업무		: 비대면계좌개설 > 주민번호 입력
* 설명		: 주민번호 입력
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.10
* 수정일/내용	: 
*/
var UNTOPEN03S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN03S01.variable = {
	sendData		: {}						// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,bKeypad		: false						// 키패드 사용가능여부
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,failCnt		: 0 						// pw fail cnt
}

/* 이벤트 정의 */
UNTOPEN03S01.events = {
	'click #jumin1_keypad, #jumin1_keypad, #divKeyPad'		: 'UNTOPEN03S01.event.callKeyPad'
	,'click #btnTest'								: 'UNTOPEN03S01.event.btnTest'
	,'click #msg'									: 'UNTOPEN03S01.event.clickReload'
	//,'click li[id^="fundInfo_"]'					: 'UNTOPEN03S01.event.goFundDetail'
}

UNTOPEN03S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN03S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-03-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN03S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN03S01.location.pageInit = function() {
	var d = new Date();
	var tm = d.getHours()+""+d.getMinutes()+""+d.getSeconds();
	if(ComUtil.isNull(vKeypadAPI.url)){
		var reloadCnt = ComUtil.null(sStorage.getItem("reloadCnt"), 0);
		if(reloadCnt > 5){
			gfn_alertMsgBox('보안키패드 초기화를 하지 못했습니다.', '', function(){
				sStorage.setItem("reloadCnt", 0);
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false);
			});
			return;
		}
		sStorage.setItem("reloadCnt", reloadCnt+1);
		location.reload();
	}
	else{
		sStorage.setItem("reloadCnt", 0);
	}
	
	/*$.getScript('https://viewapi.kbsec.com/js/plugins/kings/vKeypad.min.js?_tm='+tm, function() { });
	$.getScript('https://viewapi.kbsec.com/js/plugins/kings/kjscrypto.min.js?_tm='+tm, function() { });
	$.getScript('https://viewapi.kbsec.com/js/plugins/kings/kjscrypto_contrib.min.js?_tm='+tm, function() { });*/
	//$.getScript('https://viewapi.kbsec.com/js/plugins/kings/vKeypadAPI.js?_tm='+tm, function() {
	var interval = setInterval(function(){
		
		if(ComUtil.isNull(vKeypadAPI)){
			gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
			});
		}
		else{
			vKeypadAPI.errorPage = "/untact_open/UNTOPEN01S01";
			gfn_log('vkpad_vkpad_rr_no_num load!!!');
			vKeypadAPI.initVKPad({
				"onloadCallback" : function() {
					gfn_log("--onloadCallback--");
					UNTOPEN03S01.variable.bKeypad = true;
					//vKeypadAPI.imagePath = "/js/plugins/kings/images_WG/";
					//vKeypadAPI.kncGubun = "NUMBERPAD_WG";
				},
				"showCallback" : function() {
					gfn_log("--showCallback--");
					//$('#divKeyPad').addClass('focus');
					$('#vkpad_rr_no').attr('style', '');
					$('#vkpad_vkpad_rr_no_num').css('top', 'auto');
					$('#vkpad_vkpad_rr_no_num').css('bottom', '0');
				},
				"hideCallback" : function() {
					gfn_log("--hideCallback--");
				},
				"doneCallback" : function(data) {
					//$.extend(UNTOPEN03S01.variable.sendData, (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody);
					var dataObj = (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody;
					for(_key in dataObj){
						gfn_log("key :: " + _key);
						_key = ComUtil.string.replaceAll(_key, "vkpad_", "");
						eval("UNTOPEN03S01.variable.sendData."+_key+ " = dataObj.vkpad_" + _key);
					}
					
					if($("#vkpad_rr_no").val().length < 13){
						gfn_alertMsgBox("주민번호 13자리를 입력해 주세요", '', function(){
							$('#vkpad_rr_no').val('');
							$('#vkpad_rr_no').focus();
						});
						return;
					}
					
					
					UNTOPEN03S01.tran.selectAccountLimitAmt();
					// test data s
					/*
					var result = {}
					result.lmt_rmdr_amt = 1500;
					result.lmt_rmdr_dis = "1,500";
					result.lmt_rmdr_unit = "만원";
					result.acnt_open_cnt = 1;
					UNTOPEN03S01.callBack("selectAccountLimitAmt", result, "success");
					*/
					// test data e
				}
			});
			
			clearInterval(interval);
		}
		
    }, 300);


	
	//if(!ComUtil.isNull(sParams.fund_no)){
	//	UNTOPEN03S01.variable.sendData.fund_no = sParams.fund_no;
	
		// 자문 계좌 상세정보 조회
	//	UNTOPEN03S01.tran.selectDetail();
	//}
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주민번호 검증 거래 호출 
UNTOPEN03S01.tran.selectAccountLimitAmt = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectAccountLimitAmt";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_account_limit_amt";
	inputParam.data 	= UNTOPEN03S01.variable.sendData;
	inputParam.callback	= UNTOPEN03S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

UNTOPEN03S01.event.callKeyPad = function(e) {
	e.preventDefault();
	
	if(!UNTOPEN03S01.variable.bKeypad){
		gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
			ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
		});
		return;
	}
	
	//gfn_callKeyPad(this);
}

UNTOPEN03S01.event.btnTest= function(e) {
	e.preventDefault();
	
	gfn_log($('#vkpad_vkpad_rr_no_num').html());
}

UNTOPEN03S01.event.clickReload = function(e) {
	e.preventDefault();
	
	location.reload();
} 



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN03S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
			$('#vkpad_rr_no').val('');
			$('#vkpad_rr_no').focus();
		});
		
		UNTOPEN03S01.variable.failCnt++;
		
		if(UNTOPEN03S01.variable.failCnt >= 5){
			gfn_finishView( {msg:'주민번호 5회 입력 실패하였습니다. 앱을 종료합니다.'});
		}
		
		return;
	}
	
	// 상세내역 조회 
	if(sid == "selectAccountLimitAmt"){
		UNTOPEN03S01.variable.detailData = result;
		/*
		// 결과값이 정상일 경우 다음화면 진행
		gfn_errorMsgBox("주민등록번호가 일치하지 않습니다.\\n 다시입력해주세요", function(){
			$('li' , $('#jumin1_keypad')).removeClass('is_active');
			$('li' , $('#jumin2_keypad')).removeClass('is_active');
		});
		*/
		//alert("result.lmt_rmdr_amt :: " + result.lmt_rmdr_amt);
		UNTOPEN03S01.variable.detailData.lmt_rmdr_amt = parseInt(ComUtil.null(UNTOPEN03S01.variable.detailData.lmt_rmdr_amt, '0'));
		UNTOPEN03S01.variable.detailData.lmt_order_amt = parseInt(ComUtil.null(UNTOPEN03S01.variable.detailData.lmt_order_amt, '0'));
		// 공제한도
		if(ComUtil.null(result.lmt_rmdr_amt, 0) > 0){
			// 1. 한도가 있는경우 
			sStorage.setItem("UNTOPENParams", UNTOPEN03S01.variable.detailData);
			ComUtil.moveLink('/untact_open/UNTOPEN07S01', false);
		}
		else if(ComUtil.null(result.lmt_rmdr_amt, 0) == 0){		
			// 2. 한도가 없는경우 
			UNTOPEN03S01.variable.detailData.new_lmt_rmdr_amt 	= UNTOPEN03S01.variable.detailData.lmt_rmdr_amt; 
			UNTOPEN03S01.variable.detailData.new_lmt_rmdr_dis 	= ComUtil.number.addCommmas(UNTOPEN03S01.variable.detailData.lmt_rmdr_amt); 
			UNTOPEN03S01.variable.detailData.lmt_order_dis 		= ComUtil.number.addCommmas(UNTOPEN03S01.variable.detailData.lmt_order_amt);
			
			sStorage.setItem("UNTOPENParams", UNTOPEN03S01.variable.detailData);
			ComUtil.moveLink('/untact_open/UNTOPEN04S01', false);
		}else{
			// 
			var sParam = {};
			sParam.url = '/untact_open/UNTOPEN07P03';
			gfn_callPopup(sParam, function(){
				ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01', false);	// 대쉬보드로
			});
			
		}
		
	}
}

// 주민번호 입력후 정합성 체크
UNTOPEN03S01.callBack.keyPad = function(rData){
	gfn_log(rData);
	
	if(ComUtil.isNull($('#jumin1').val()) || ComUtil.isNull($('#jumin2').val())){
		return;
	}
	
	//UNTOPEN03S01.variable.sendData = gfn_
	
	UNTOPEN03S01.variable.sendData.jumin1 = $('#jumin1').val();
	UNTOPEN03S01.variable.sendData.jumin2 = $('#jumin2').val();
	
	// 주민번호 검증 거래 호출 
	UNTOPEN03S01.tran.checkPersonNum();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수



UNTOPEN03S01.init();
