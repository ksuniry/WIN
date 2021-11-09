/**
* 파일명 		: UNTOPEN09S01.js (E-09-01)
* 업무		: 비대면계좌개설 > 비밀번호 입력화면
* 설명		: 계좌의 비밀번호 입력
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.08
* 수정일/내용	: 
*/
var UNTOPEN09S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN09S01.variable = {
	sendData		: {
						pwd : ""				// 패스워드
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,bKeypad		: false						// 키패드 사용가능여부
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false						//
	,failCnt		: 0 						// pw fail cnt
	,screenType		: 'account_pw'						// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
UNTOPEN09S01.events = {
	 'click #pw1_keypad, #divKeyPad'				: 'UNTOPEN09S01.event.callKeyPad'
	 ,'click #pwdMsg'	 							: 'UNTOPEN09S01.event.clickPwdMsg'
	//,'click li[id^="fundInfo_"]'					: 'UNTOPEN09S01.event.goFundDetail'
}

UNTOPEN09S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN09S01');
	
	//$("#pTitle").text("펀드상세정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-09-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN09S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN09S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("sParams");
	
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
	//$.getScript('https://viewapi.kbsec.com/js/plugins/kings/vKeypadAPI.js?_tm='+tm, function() { 
	var interval = setInterval(function(){
		if(ComUtil.isNull(vKeypadAPI)){
			gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
			});
		}
		else{
			vKeypadAPI.errorPage = "/untact_open/UNTOPEN01S01";
			vKeypadAPI.initVKPad({
				"onloadCallback" : function() {
					gfn_log("--onloadCallback--");
					UNTOPEN09S01.variable.bKeypad = true;
					//vKeypadAPI.imagePath = "/js/plugins/kings/images_WG/";
					//vKeypadAPI.kncGubun = "NUMBERPAD_WG";
				},
				"showCallback" : function() {
					gfn_log("--showCallback--");
					$('#divKeyPad').addClass('focus');
					$('#vkpad_acntPw1').attr('style', '');
					$('#vkpad_vkpad_acntPw1_num').css('top', 'auto');
					$('#vkpad_vkpad_acntPw1_num').css('bottom', '0');
				},
				"hideCallback" : function() {
					gfn_log("--hideCallback--");
				},
				"doneCallback" : function(data) {
					//$.extend(UNTOPEN09S01.variable.sendData, (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody);
					var dataObj = (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody;
					for(_key in dataObj){
						gfn_log("key :: " + _key);
						//_key = ComUtil.string.replaceAll(_key, "vkpad_", "");
						if($("#"+_key).val().length < 4){
							gfn_alertMsgBox("비밀번호 4자리를 입력해 주세요");
							return;
						}
						
						var pwd 	= ComUtil.null(UNTOPEN09S01.variable.sendData.pwd, '');
						var newPwd 	= dataObj[_key];
						
						if(!ComUtil.isNull(pwd)){
							UNTOPEN09S01.variable.sendData.pwd2 = newPwd;
							UNTOPEN09S01.tran.updateAccountPassword();
						}
						else{
							$('#pwdMsg').html("비밀번호를 다시 입력해주세요");
							$('#vkpad_acntPw1').val('');
							//$('#divKeyPad').removeClass('focus');
							$('#vkpad_acntPw1').focus();
							$('#errorMsg').html('');	// 에러메세지 초기화 
							UNTOPEN09S01.variable.sendData.pwd = newPwd;
						}
					}
					
					//UNTOPEN09S01.tran.updateAccountPassword();
					// test data s
					//var result = {}
					//result.lmt_rmdr_amt = 1800;
					//result.lmt_rmdr_dis = "1,800";
					//result.lmt_rmdr_unit = "만원";
					//result.acnt_open_cnt = 1;
					//UNTOPEN09S01.callBack("updateAccountPassword", result, "success");
					// test data e
				}
			});
		}
	
		clearInterval(interval);
    }, 300);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문 계좌 상세정보 조회
UNTOPEN09S01.tran.updateAccountPassword = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAccountPassword";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_account_password";
	inputParam.data 	= UNTOPEN09S01.variable.sendData;
	inputParam.callback	= UNTOPEN09S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
UNTOPEN09S01.event.clickBtnHelp = function() {
	gfn_alertMsgBox("문제해결!!");
}

UNTOPEN09S01.event.callKeyPad = function(e) {
	e.preventDefault();
	
	if(!UNTOPEN09S01.variable.bKeypad){
		gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
			ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
		});
		return;
	}
	
	//gfn_callKeyPad(this);
}
 
UNTOPEN09S01.event.clickPwdMsg = function(e) {
	e.preventDefault();
	
	location.reload();
} 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN09S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		
		var errorMsg = ComUtil.null(result.message, gfn_helpDeskMsg());
		//errorMsg = errorMsg.substr(errorMsg.indexOf('[ERROR]') + 7).trim();
		errorMsg = ComUtil.string.replaceAll(errorMsg, '[ERROR]', '').trim();
		
		if("pwd" == result.result){
			UNTOPEN09S01.variable.sendData.pwd = "";
			UNTOPEN09S01.variable.sendData.pwd2 = "";
			$('#vkpad_acntPw1').val('');
			$('#vkpad_acntPw1').focus();
			$('#pwdMsg').html("계좌의 비밀번호를<br>입력해주세요.");
			$('#errorMsg').html(errorMsg);
			
			
			UNTOPEN09S01.variable.failCnt++;
		
			if(UNTOPEN09S01.variable.failCnt >= 5){
				gfn_finishView( {msg:'비밀번호 5회 입력 실패하였습니다. 앱을 종료합니다.'});
				return;
			}
		}
		else{
			gfn_alertMsgBox(errorMsg, '', function(){
				ComUtil.moveLink('/untact_open/UNTOPEN01S01', false); // 계좌개설초기화면으로 이동
			});
		}
		
		
		
		return;
	}
	
	//
	if(sid == "updateAccountPassword"){
		/*
		gfn_alertMsgBox(result.message, '', function(){
			ComUtil.moveLink('/untact_open/UNTOPEN10S01', false); // 입금내역확인 게좌번호 입력
		});
		*/
		ComUtil.moveLink('/untact_open/UNTOPEN10S01', false); // 입금내역확인 게좌번호 입력
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수




UNTOPEN09S01.init();
