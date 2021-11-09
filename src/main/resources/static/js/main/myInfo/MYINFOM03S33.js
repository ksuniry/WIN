/**
* 파일명 		: MYINFOM03S33.js
* 업무		: 메뉴 > 내정보  > 회원탈퇴안내2 (c-03-33)
* 설명		: 회원탈퇴
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.28
* 수정일/내용	: 
*/
var MYINFOM03S33 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S33.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S33.events = {
	 'click #btnQuit'										: 'MYINFOM03S33.event.clickBtnQuit'
	,'click input[id^="reason_yn"]'							: 'MYINFOM03S33.event.changeBtnQuit'
	,'click #chkAgree'										: 'MYINFOM03S33.event.changeBtnQuit'
}

MYINFOM03S33.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S33');
	
	$("#pTitle").text("회원탈퇴");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-33";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S33.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S33.location.pageInit = function() {
	/*if('MYINFOM03S33' != gfn_getPreScreenId()){
		// 앱종료
		gfn_finishView({msg:'정상작인 방식의 접근이 아닙니다.<br>앱을 종료합니다.'});
		return false;
	}*/
	
	// 

	// 회원탈퇴 안내 조회 
	//MYINFOM03S33.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 회원탈퇴 신청 
MYINFOM03S33.tran.memberWithdrawal = function() {
	var inputParam 		= {};
	inputParam.sid 		= "memberWithdrawalNon";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/member_withdrawal_non";
	inputParam.data 	= MYINFOM03S33.variable.sendData;
	inputParam.callback	= MYINFOM03S33.callBack; 
	
	gfn_Transaction( inputParam );
	
	/*var result = {};
	result.result = "OK";
	
	MYINFOM03S33.callBack('memberWithdrawal', result, 'success');*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 회원탈퇴 버튼 클릭 이벤트
MYINFOM03S33.event.clickBtnQuit = function(e) {
	e.preventDefault();
	
	// 유의사항 체크
	if($('#chkAgree').is(':checked') == true){
		MYINFOM03S33.variable.sendData.withdrawal_yn = 'Y';
	}

	// 탈퇴 사유 체크
	$("input[id^='reason_yn']").each(function(idx, item) {
		index = idx + 1;
		if($(this).is(':checked') == true){
			MYINFOM03S33.variable.sendData['reason_yn' + index] = 'Y';
		}
	});
	
	// 탈퇴 사유 상세 체크
	if($('#reason_yn6').is(':checked') == true){
		var text = $('#quitText').val();
		if(ComUtil.isNull(text)){
			gfn_alertMsgBox('탈퇴사유를 적어주시길 바랍니다.');
			$('#quitText').focus();
			return;
		}
		MYINFOM03S33.variable.sendData.reason_etc_detail = text;
	}
		
	gfn_confirmMsgBox("회원탈퇴를 진행하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){
			// 회원탈퇴 호출
			MYINFOM03S33.location.memberWithdrawal();
		}
	});
	
}

// 탈퇴 사유 선택 개수가 없거나 유의사항 미체크 시 회원탈퇴 버튼 비활성화하기
MYINFOM03S33.event.changeBtnQuit = function(e) {
	
	var reasonNum = $("input[id^='reason_yn']:checked").length;		// 불편 항목 선택 개수
	if( reasonNum && $('#chkAgree').is(':checked') == true ) {
		$('#btnQuit').attr('disabled', false);
	}else{
		$('#btnQuit').attr('disabled', true);
	}
	
	//  기타 꼭 당부하고 싶은 말 항목 체크시에만 텍스트 박스 활성화
	if($('#reason_yn6').is(':checked') == true){
		$('#quitText').attr('disabled', false);
	}
	else{
		$('#quitText').val('');
		$('#quitText').attr('disabled', true);
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S33.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		return;
	}
	
	
	if(sid == "memberWithdrawalNon"){
		
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		// 해지할 계좌가 없을 경우 완료가 되어서 내려온다.
		//if(result.result == 'non'){
			gfn_historyClear();
			ComUtil.moveLink('/my_info/MYINFOM05S01', false); // 화면이동
		//}
		// 계좌를 해지하러 팝업을 호출한다. 
		/*else if(result.result == 'ok'){
			var sParam = {};
			sParam.url = '/my_info/MYINFOM04P22';
			result.pin = MYINFOM03S33.variable.sendData.pin;
			sStorage.setItem("MYINFOM04P22Params", result);
			
			if(gfn_isNull(result.acnt_order_list)){
				gfn_alertMsgBox("남아있는 계좌가 없습니다.<br>" + gfn_helpDeskMsg());
				return;
			}
			if(result.acnt_order_list.length == 0){
				gfn_alertMsgBox("남아있는 계좌가 없습니다.<br>" + gfn_helpDeskMsg());
				return;		
			}
			
			gfn_callPopup(sParam, function(resultData){
				gfn_log('MYINFOM04P22.callback resultData :::  ');
				gfn_log(resultData);
				
				if(!ComUtil.isNull(resultData)){
					if(ComUtil.isNull(resultData.result)){
						gfn_alertMsgBox("아직 남아있는 계좌가 있습니다.<br>회원탈퇴가 완료되지 않았습니다.");
						return;
					}
					
					if(resultData.result){
						// 회원탈퇴 호출 native 
						// gfn_memberWithdrawal({});
						gfn_historyClear();
						ComUtil.moveLink('/my_info/MYINFOM05S01', false); // 화면이동
						return;
					}
					else{
						gfn_alertMsgBox(ComUtil.null(result.msg, "아직 남아있는 계좌가 있습니다.<br>회원탈퇴가 완료되지 않았습니다."));
						return;
					}
				}
				else{
					gfn_alertMsgBox("아직 남아있는 계좌가 있습니다.<br>회원탈퇴가 완료되지 않았습니다.");
					return;
				}
				
			});
		}*/
	}
}


/*// 네이티브 호출후 콜백함수 
TEMPLATE.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 회원탈퇴  
	if(key == 'memberWithdrawal'){
		//  성공시
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 앱종료
			// gfn_finishView({msg:'앱을 종료합니다.'});
			
		}
		else{
			// 실패시
			gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()));
			return;
		}
	}
}*/

////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 핀번호 호출 및 회원탈퇴 호출	
MYINFOM03S33.location.memberWithdrawal = function(){
	var sParam = {};
	sParam.url = '/popup/CMMPINN01P01';
	sParam.title = "회원탈퇴를";
	sStorage.setItem("CMMPINN01P01Params", sParam);
	gfn_log('MYINFOM03S33.memberWithdrawal :::  ' + sStorage.getItem("gCurPopupId"));
		
	gfn_callPopup(sParam, function(resultData){
		gfn_log('MYINFOM03S33.callback resultData :::  ' + sStorage.getItem("gCurPopupId"));
		gfn_log(resultData);
		if(!ComUtil.isNull(resultData)){
			if(ComUtil.isNull(resultData.result)){
				return;
			}
			
			if(resultData.result){
				
				// 회원탈퇴 신청 호출 (app 호출이 아닌 api호출로 회원탈퇴 신청하기로 변경)
				MYINFOM03S33.variable.sendData.pin = resultData.pin;
				MYINFOM03S33.tran.memberWithdrawal();
			}
		}
		
	});
}	


MYINFOM03S33.init();
