/**
* 파일명 		: MYINFOM02S03.js
* 업무		: 메인 > 내정보  (c-02-03)
* 설명		: 내 정보
* 작성자		: 배수한
* 최초 작성일자	: 2021.03.04
* 수정일/내용	: 
*/
var MYINFOM02S03 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM02S03.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM02S03.events = {
	 'click #btnChangePinnum'				: 'MYINFOM02S03.event.clickBtnChangePinnum'			// 앱인증번호 변경
	 ,'click #btnMemberSecession'			: 'MYINFOM02S03.event.clickBtnMemberSecession'		// 회원탈퇴
	 ,'change #chBio'						: 'MYINFOM02S03.event.changeBio'					// 생체인증 사용여부 변경
	 ,'click #btnTest'						: 'MYINFOM02S03.event.clickBtnTest'		// 인증테스트
}

MYINFOM02S03.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM02S03');
	
	$("#pTitle").text("내 설정");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-03";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM02S03.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM02S03.location.pageInit = function() {
	// 생체인증정보 조회 
	gfn_idenInfo({});
	
	if(!gfn_isLocal()){
		$('#divTest').show();
	}
	// 회원탈퇴 사용자 자문 체결/미체결 구분 값 조회
	MYINFOM02S03.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 상세내역 조회 
MYINFOM02S03.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "memberWithdrawalCase";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/member_withdrawal_case_value";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S03.callBack; 
	
	gfn_Transaction( inputParam );
	
}

// 내정보 저장 
MYINFOM02S03.tran.updateMyInfo = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "customerContractList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_list";
	inputParam.data 	= MYINFOM02S03.variable.sendData;
	inputParam.callback	= MYINFOM02S03.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트


// 앱인증번호 변경
MYINFOM02S03.event.clickBtnChangePinnum = function(e){
	
	// 앱인증번호 변경
	gfn_changePinnum({});
}


// 회원탈퇴
MYINFOM02S03.event.clickBtnMemberSecession = function(e){
	var detailData = MYINFOM02S03.variable.detailData;
	
	// 자문체결여부 확인후 탈퇴페이지로 이동
	if ( detailData.case_value == '1' ) { 	
		ComUtil.moveLink('/my_info/MYINFOM03S31'); // 회원탈퇴안내1 (c-03-31)
	}else {									
		ComUtil.moveLink('/my_info/MYINFOM03S33'); // 회원탈퇴안내2 (c-03-33)
	}
	
	
	
	/*if(gfn_isLocal()){
		//우선 막아논다. 아직 미정이 
		gfn_confirmMsgBox("회원탈퇴를 진행할까요?", '', function(returnData){
			if(returnData.result == 'Y'){
				// 회원탈퇴 호출
				gfn_memberSecession({});
			}
		});
	}
	else{
		gfn_alertMsgBox(gfn_helpDeskMsg());
	}*/
		
}

// 본인인증 test
MYINFOM02S03.event.clickBtnTest = function(e){
	var inputParam = {};
	inputParam.callId = 'memberSecession';
	gfn_idenVerification(inputParam);
}

// 지문인식 사용 체크 변경시
MYINFOM02S03.event.changeBio = function(e){
	e.preventDefault();
	
	var inputParam = {};
	inputParam.useYn = $(this).is(':checked') ? 'Y' : 'N';
	gfn_idenInfoUpdate(inputParam);
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
MYINFOM02S03.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 사용자 자문 체결/미체결 구분 값 조회
	if(sid == "memberWithdrawalCase"){
		MYINFOM02S03.variable.detailData = result;
		
		// 
		MYINFOM02S03.location.displayDetail();
				
	}
	
	// 내정보 저장 
	if(sid == "updateMyInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}		
	}
}



// 네이티브 호출후 콜백함수 
MYINFOM02S03.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 생체인증 정보조회 
	if(key == 'idenInfo'){
		// 명칭 셋팅
		if(ComUtil.isNull(result.bioType)){
			$('#bioNm').html('생체 인증');
			$('#bioInfo').addClass('disabled');
			$('#chBio').attr("disabled",true);
		}
		else if(result.bioType == 'finger'){
			$('#bioNm').html('지문 인식');
			$('#bioInfo').removeClass('disabled');
			$('#chBio').removeAttr("disabled"); 
		}
		else if(result.bioType == 'face'){
			$('#bioNm').html('Face ID');
			$('#bioInfo').removeClass('disabled');
			$('#chBio').removeAttr("disabled"); 
		}
		else{
			$('#bioNm').html('생체 인증');
			$('#bioInfo').addClass('disabled');
			$('#chBio').attr("disabled",true);
		}
		
		// 생체인증 사용여부 셋팅
		$('#chBio').attr('checked', ComUtil.null(result.useYn, 'N') == 'Y' ? true : false);
	}
	
	// 생체정보 설정수정 
	if(key == 'idenInfoUpdate'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 스크랩핑 성공시 재조회
			// 다음버튼 클릭??
			//$('#btnNext').trigger('click');
		}
		else{
			// 생체정보 설정수정  실패시  앱에서 메세지 처리
			/*gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()), '', function(){
				// 생체인증정보 조회 
				gfn_idenInfo({});
			});*/
			// 생체인증정보 조회 
			gfn_idenInfo({});
			return;
		}
	}
	
	// 본인인증  (앱에서 처리하기로)
	if(key == 'verification'){
		// 본인인증 성공시
		alert("result.idenType :: " + result.idenType);
		alert("result.bio :: " + result.bio);
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			if(result.callId == 'memberSecession'){
				// 회원탈퇴 호출
			}
		}
		else{
			// 본인인증 실패시
			gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()));
			return;
		}
	}
	
	// 앱인증번호 변경 ( msg도 모두 앱에서 처리하기로)  
	if(key == 'changePinnum'){
		gfn_log('앱인증번호 변경 콜백!!!!!!');
		// 생체인증정보 조회 
		gfn_idenInfo({});
		//  성공시
		/*if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 앱종료
			gfn_finishView({msg:'앱을 종료합니다.'});
		}
		else{
			// 실패시
			gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()));
			return;
		}*/
	}
	
	
	// 회원탈퇴  
	if(key == 'memberSecession'){
		//  성공시
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 앱종료
			gfn_finishView({msg:'앱을 종료합니다.'});
		}
		else{
			// 실패시
			gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()));
			return;
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM02S03.location.displayDetail = function(){
	var detailData = MYINFOM02S03.variable.detailData;
	
	
	// 초기화
	$('#cntrtList').html('');
	
	if(gfn_isNull(detailData.cntrt_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();
	
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	var cntrtCnt = detailData.cntrt_list.length;
	$('#cntrtCnt').html(cntrtCnt);
		
	$.each( detailData.cntrt_list, function(index, item){
		item.idx = index + 1;
		
		item.join_date = ComUtil.string.dateFormatHan(item.join_date);
		
		
		var html = template(item);
		$('#cntrtList').append(html);
		$('#rowCntrt_' + item.idx).data(item);
		
	});	
}	





MYINFOM02S03.init();
