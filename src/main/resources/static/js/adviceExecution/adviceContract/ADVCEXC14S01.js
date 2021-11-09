/**
* 파일명 		: ADVCEXC14S01.js (e-14-01)
* 업무		: 자문실행 > 계좌이전신청입력
* 설명		: 계좌이전신청을 건수만큼 입력한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.16
* 수정일/내용	: 
*/
var ADVCEXC14S01 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC14S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,noBack			: false								// 상단 백버튼 존재유무
}

/* 이벤트 정의 */
ADVCEXC14S01.events = {
	 'click #btnOk'		 						: 'ADVCEXC14S01.event.clickBtnOk'
	,'click #btnOtherAcnt'		 				: 'ADVCEXC14S01.event.clickBtnOtherAcnt'
	//,'click li[id^="allPnsnAcntDetail_"]'		: 'ADVCEXC12S01.event.clickAllPnsnAcntDetail'
	,'change input:radio[id^="radio_"]'			: 'ADVCEXC12S01.event.clickAllPnsnAcntDetail'
}

ADVCEXC14S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC14S01');
	
	$("#pTitle").text("자문계약");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-14-01";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC14S01.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC14S01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("ADVCEXC14S01Params");
	
	if(gfn_isLocal()){
		if(ComUtil.isNull(sParams)){
			sParams = {};
			sParams.emptyAcntNoArr = [0];
			sParams.acnt_list = [{fncl_agc_nm : 'KB증권'}];
		}
	}
	
	if(!ComUtil.isNull(sParams)){
		//var curIdx = ComUtil.null(sParams.curIdx, '0');
		if(sParams.emptyAcntNoArr.length == 0){
			
			ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S02', false);	// 이체신청확인
			//ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
			return;
		}
		
		var curIdx = sParams.emptyAcntNoArr.pop();
		sParams.curIdx = curIdx;
		
		ADVCEXC14S01.variable.detailData	 	= sParams; 
		ADVCEXC14S01.variable.initParamData 	= sParams;
		
		ADVCEXC14S01.variable.sendData.fncl_agc_nm 	= ADVCEXC14S01.variable.detailData.acnt_list[curIdx].fncl_agc_nm;
		ADVCEXC14S01.variable.sendData.acnt_type 	= ADVCEXC14S01.variable.detailData.acnt_list[curIdx].acnt_type;
		
		ADVCEXC14S01.tran.getUserTransOrgAcnt();
	}
	else {
		gfn_finishView( {msg:'비정상적으로 진행되었습니다. 앱을 재실행하시고 비대면 계좌개설을 진행하세요.'});
		//gfn_finishView( {msg:'이전 신청가능 계좌가 없습니다.'});
		return;
	}
	
	
	{
		$('#divModal, .dim').on("click", ADVCEXC14S01.location.modalClose);
		
		const winHeight = $(window).height();
	    $('.inp_with_btn').each(function(){
	        //포커스 가면 버튼실종
	        $(this).bind("focus", function(){
	                $(".btn_box").css("display", "none");
	        });  
	
	        $(this).bind("blur",function(){
	            $(".btn_box").css("display", "block");
	        });
	
	        $(window).resize(function(){
	            // 키보드 내려가고 페이지 리사이즈되면 버튼 원복                  
	            const resizeHeight = $(window).height();
	            if(resizeHeight >= winHeight){
	                $(".btn_box").css("display", "block");
	            }
	        });
	
	    });
	}
	
	
	// 셋팅
	ADVCEXC14S01.location.displayAcnt();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 이제정보 저장
ADVCEXC14S01.tran.updateRelAcntNo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateRelAcntNo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_rel_acnt_no";
	inputParam.data 	= ADVCEXC14S01.variable.sendData;
	inputParam.callback	= ADVCEXC14S01.callBack; 
	
	gfn_Transaction( inputParam );
}


// 이체대상정보 조회 
ADVCEXC14S01.tran.getUserTransOrgAcnt = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getUserTransOrgAcnt";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/get_user_trans_org_acnt";
	inputParam.data 	= ADVCEXC14S01.variable.sendData;
	inputParam.callback	= ADVCEXC14S01.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

ADVCEXC14S01.event.clickBtnOk = function(e) {
	e.preventDefault();
	
	// 계좌번호 입력 여부 체크
	var acntNo = ComUtil.null($('#acnt_no').val(), ''); 

//2021-07-12 요청으로인한 주석 처리
/*	if(acntNo.length < 11){												
		gfn_alertMsgBox('계좌번호를 다시 확인해 주시기 바랍니다.');
		return;
	}*/

	// 계좌번호 유효성 체크 (길이는 무의미함)
	if(ComUtil.isNull(acntNo)){
		gfn_alertMsgBox('계좌번호를 다시 확인해 주시기 바랍니다.');
		return;
	}


	// 동의여부 체크
	if($('input[name="kftc_agc_cd"]:checked').val() != 'Y'){
		gfn_alertMsgBox('금융거래정보제공 의뢰를 동의해 주시기 바랍니다.');
		return;
	}
	
	var detailData = ADVCEXC14S01.variable.detailData;
	
	ADVCEXC14S01.variable.sendData.acnt_uid 	= detailData.acnt_list[detailData.curIdx].acnt_uid;
	ADVCEXC14S01.variable.sendData.acnt_no 		= $('#acnt_no').val();
	ADVCEXC14S01.variable.sendData.prvi_chk_yn 	= 'Y';
	ADVCEXC14S01.variable.sendData.kftc_agc_cd 	= detailData.acnt_list[detailData.curIdx].kftc_agc_cd;
	
	// 이체 이관계좌 번호 변경 등록  
	ADVCEXC14S01.tran.updateRelAcntNo();
}

// 다른계좌 선택창 호출 클릭시 
ADVCEXC14S01.event.clickBtnOtherAcnt = function(e) {
	e.preventDefault();
	
	$('#divModal').show();
}

// 다른계좌 선택창 호출 클릭시 
ADVCEXC14S01.event.clickAllPnsnAcntDetail = function(e) {
	e.preventDefault();
	
	
	var item = $(this).data();
	$('#acnt_no').val(item.acnt_no);
	$('#acnt_no_dis').val(ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '')));
	
	$('fncl_agc_nm').html = item.rgst_brn_nm;
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ADVCEXC14S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	/*
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	*/
	
	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	if(sid == "updateRelAcntNo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			if(result.result == 'acnt_error'){
				$('#divErrorMessage').show();
				//$('#acnt_no').val('');
				return;
			}
			
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
		}
		
		// 저장 성공했으니 결과 화면 호출
		var detailData = ADVCEXC14S01.variable.detailData;
		detailData.acnt_list[detailData.curIdx].acnt_no = $('#acnt_no').val();
		
		sStorage.setItem("ADVCEXC14S01Params", detailData);
		ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S03', false);
	}
	
	// 
	if(sid == "getUserTransOrgAcnt"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			return;
		}
		ADVCEXC14S01.variable.detailData.pnsn_acnt_list = ComUtil.null(result.pnsn_acnt_list, []);
		
		// 계좌 선택 리스트 셋팅 
		ADVCEXC14S01.location.displayUserTransOrgAcnt();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
ADVCEXC14S01.location.displayAcnt = function(){
	var acntInfo = ADVCEXC14S01.variable.detailData.acnt_list[ADVCEXC14S01.variable.detailData.curIdx];
	
	gfn_setDetails(acntInfo, $('#f-content'));
	
	// image src 셋팅
	$('#fncl_agc_img').attr('src', gfn_getImgSrcByCd(acntInfo.kftc_agc_cd, 'C')); 
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(acntInfo.chng_kftc_agc_cd, 'C'));
}

// 계좌 선택 리스트 셋팅 
ADVCEXC14S01.location.displayUserTransOrgAcnt = function(){
	var pnsn_acnt_list = ADVCEXC14S01.variable.detailData.pnsn_acnt_list;
	
	// 선택 가능 계좌가 1개이면 바로 셋팅
	if(pnsn_acnt_list.length == 1){
		$('#acnt_no').val(pnsn_acnt_list[0].acnt_no);
		$('#acnt_no_dis').val(ComUtil.pettern.acntNo(ComUtil.null(pnsn_acnt_list[0].acnt_no, '')));
	}
	else if(pnsn_acnt_list.length > 1){
		$('#btnOtherAcnt').show();
		$('#acnt_no').val(pnsn_acnt_list[0].acnt_no);
		$('#acnt_no_dis').val(ComUtil.pettern.acntNo(ComUtil.null(pnsn_acnt_list[0].acnt_no, '')));
		
		// 선택 가능 계좌가 여러개이면 밑에 팝업 
		var _template = $("#_dumyAllPnsnAcntList").html();
		var template = Handlebars.compile(_template);
		$.each( pnsn_acnt_list, function(index, item){
			item.idx = index + 1;
			
			item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, ''));
			
			var html = template(item);
			$('#allPnsnAcntList').append(html);
			
			//$('#allPnsnAcntDetail_' + item.idx).data(item);
			$('#radio_' + item.idx).data(item);
		});
		
		$('input:radio[id="radio_1"]').attr('checked', true);
	}
	else{
		gfn_alertMsgBox('선택가능한 계좌가 없습니다.');
	}
}


// modal popup close
ADVCEXC14S01.location.modalClose = function(){
    $('#divModal').hide();
}


ADVCEXC14S01.init();
