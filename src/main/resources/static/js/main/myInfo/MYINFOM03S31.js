/**
* 파일명 		: MYINFOM03S31.js
* 업무		: 메뉴 > 내정보  > 회원탈퇴 (c-03-31)
* 설명		: 회원탈퇴
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.24
* 수정일/내용	: 
*/
var MYINFOM03S31 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S31.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM03S31.events = {
	 'click #btnQuit'										: 'MYINFOM03S31.event.clickBtnQuit'
	,'change #chkWithdrawal'								: 'MYINFOM03S31.event.changeChkWithdrawal'
}

MYINFOM03S31.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S31');
	
	$("#pTitle").text("회원탈퇴");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-31";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S31.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S31.location.pageInit = function() {
	if('MYINFOM02S03' != gfn_getPreScreenId()){
		// 앱종료
		gfn_finishView({msg:'정상작인 방식의 접근이 아닙니다.<br>앱을 종료합니다.'});
		return false;
	}
	
	// 연금관리 메인 상세내역 조회 
	//MYINFOM03S31.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
/*// 회원탈퇴 신청 
MYINFOM03S31.tran.memberWithdrawal = function() {
	var inputParam 		= {};
	inputParam.sid 		= "memberWithdrawal";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/member_withdrawal";
	inputParam.data 	= MYINFOM03S31.variable.sendData;
	inputParam.callback	= MYINFOM03S31.callBack; 
	
	gfn_Transaction( inputParam );
	
	var result = {};
	result.result = "OK";
	
	MYINFOM03S31.callBack('memberWithdrawal', result, 'success');
}*/




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 회원탈퇴 버튼 클릭 이벤트
MYINFOM03S31.event.clickBtnQuit = function(e) {
	e.preventDefault();
	var sParam = {};
	
	gfn_confirmMsgBox("회원탈퇴를 진행하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){
			
			// 회원탈퇴 동의 여부 저장
			sParam['withdrawal_yn'] = 'Y';
			sStorage.setItem("MYINFOM03S32Params", sParam);
			
			// 화면 이동
			ComUtil.moveLink('/my_info/MYINFOM03S32', false);
		}
	});
	
	
}

// 유의사항 체크 여부 확인 후 탈퇴 버튼 활성화 
MYINFOM03S31.event.changeChkWithdrawal = function(e) {
	e.preventDefault();
	
	if($('#chkWithdrawal').is(':checked') == true){
		$('#btnQuit').attr('disabled', false);
	}else {
		$('#btnQuit').attr('disabled', true);
	}
	
}



////////////////////////////////////////////////////////////////////////////////////

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




MYINFOM03S31.init();
