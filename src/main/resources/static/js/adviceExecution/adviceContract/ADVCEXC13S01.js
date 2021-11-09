/**
* 파일명 		: ADVCEXC13S01.js (e-13-01)
* 업무		: 자문실행 > 자문계약
* 설명		: 자문계약을 한다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.19
* 수정일/내용	: 
*/
var ADVCEXC13S01 = CommonPageObject.clone();

/* 화면내 변수  */
ADVCEXC13S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,returnData		: []								// 동의결과
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,noHead			: false								// 해더영역 존재여부 default 는 false
	,showMenu		: false								//
	,noBack			: true								// 상단 백버튼 존재유무
}

/* 이벤트 정의 */
ADVCEXC13S01.events = {
	 'click #btnNext'		 						: 'ADVCEXC13S01.event.clickBtnNext'
	//,'click li[id^="popCall_"]'						: 'ADVCEXC13S01.event.callPopUp'
}

ADVCEXC13S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ADVCEXC13S01');
	
	//$("#pTitle").text("자문계약");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-13-01";
	gfn_azureAnalytics(inputParam);
	
	ADVCEXC13S01.location.pageInit();
}


// 화면내 초기화 부분
ADVCEXC13S01.location.pageInit = function() {
	
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("ADVCEXC13S01Params");
	if(!ComUtil.isNull(sParams)){
		$('#div_ADVCEXC13S01').show();
		ADVCEXC13S01.variable.initParamData = sParams;
		// 계좌정보 그리기
		ADVCEXC13S01.location.displayAcntInfo(); 
	}
	else{
		ADVCEXC13S01.variable.directMoveYn = 'Y';
	}
	
	// 이체 이관계좌번호 입력 여부 조회
	ADVCEXC13S01.tran.selectDetail();
	
	/*
	// testData s
	var result = {};
	result.result 		= "ok";
	result.num_acnt 	= 2;
	result.acnt_list 	= [];
	
	var acntRow = {
		acnt_uid			: '1',		// 계좌UID
		opin_chck_mthd      : '전화통화',      // 의사확인방법
		fncl_agc_cd         : '001',      // 금융기관코드
		fncl_agc_nm         : 'NH투자증권',      // 금융기관명
		kftc_agc_cd         : '5',      // 금결원코드
		acnt_nm             : '우리나라만세연금저축계좌',      // 계좌명
		chng_fncl_agc_cd    : '002',      // 변경금융기관코드
		chng_kftc_agc_cd    : '8',      // 변경금결원코드
		chng_fncl_agc_nm    : 'KB증권',      // 변경금융기관명
		chng_acnt_no        : '565656565667',      // 변경계좌번호
		chng_prdt_nm        : '더만세연금저축계좌'       // 변경상품이름
	};
	var acntRow2 = {
		acnt_uid			: '2',		// 계좌UID
		opin_chck_mthd      : '전화통화2',      // 의사확인방법
		fncl_agc_cd         : '001',      // 금융기관코드
		fncl_agc_nm         : 'NH투자증권2',      // 금융기관명
		kftc_agc_cd         : '5',      // 금결원코드
		acnt_nm             : '우리나라만세연금저축계좌2',      // 계좌명
		chng_fncl_agc_cd    : '002',      // 변경금융기관코드
		chng_kftc_agc_cd    : '8',      // 변경금결원코드
		chng_fncl_agc_nm    : 'KB증권2',      // 변경금융기관명
		chng_acnt_no        : '4343434343435',      // 변경계좌번호
		chng_prdt_nm        : '더만세연금저축계좌2'       // 변경상품이름
	};
	
	result.acnt_list.push(acntRow);
	result.acnt_list.push(acntRow2);
	ADVCEXC13S01.callBack('selectRelAcntList', result, 'success');
	// testData e
	*/
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

// 계약완료 후 이체이관계좌 조회
ADVCEXC13S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectRelAcntList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_rel_acnt_list";
	inputParam.data 	= {};
	inputParam.callback	= ADVCEXC13S01.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

ADVCEXC13S01.event.clickBtnNext = function(e) {
	e.preventDefault();
	
	var detailData = ADVCEXC13S01.variable.detailData;
	var num_acnt = ComUtil.null(detailData.num_acnt, '0');
	
	
	if(num_acnt == '0'){
		/*gfn_alertMsgBox("이체대상계좌 없음!!", '', function(){
			ComUtil.moveLink('/pension_execution/PENSEXE01S01');	// 머플러자문안 t
		});*/
		
		// 화면접근정보 통지
		ADVCEXC13S01.location.enterScreen();
			
		ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
		return;
	}
	else{
		num_acnt = 0;
		var emptyAcntNoArr = new Array();
		$.each(detailData.acnt_list, function(index, item){
			if(ComUtil.isNull(item.acnt_no)){
				num_acnt++;
				emptyAcntNoArr.push(index);
			}
		});
		
		detailData.emptyAcntNoArr = emptyAcntNoArr.reverse();
		
		if(num_acnt == '0'){
			// 화면접근정보 통지
			ADVCEXC13S01.location.enterScreen();
			
			ComUtil.moveLink('/pension_execution/PENSEXE01S01', false);	// 머플러자문안 t
			return;
		}
		
		
		sStorage.setItem("ADVCEXC14S01Params", detailData);
		ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC14S01', false);
		return;
	}
}


ADVCEXC13S01.event.callPopUp = function(e) {
	e.preventDefault();
	
	var link = $(this).data("link");
	var url = "";
	
	switch(link){
		case '2'	:	url = "/advice_execution/advice_contract/ADVCEXC13P02";
			break;
		case '3'	:	url = "/advice_execution/advice_contract/ADVCEXC13P03";
			break;
		case '4'	:	url = "/advice_execution/advice_contract/ADVCEXC13P04";
			break;
		case '5'	:	url = "/advice_execution/advice_contract/ADVCEXC13P05";
			break;
		default		:
			return;
			break;
	}
	
	var sParam = {};
	sParam.url = url;
	gfn_callPopup(sParam, function(){});
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ADVCEXC13S01.callBack = function(sid, result, success){
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		$('#btnNext').attr('disabled', true);
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
		// 어디로 가나??
		return;
	}
	
	// 머플러 자문계약을 위한 진행 정보 내역을 조회
	if(sid == "selectRelAcntList"){
		ADVCEXC13S01.variable.detailData = result;
		
		ADVCEXC13S01.variable.detailData.user_nm = JsEncrptObject.decrypt(ADVCEXC13S01.variable.initParamData.enc_user_nm);
		
		
		if(ADVCEXC13S01.variable.directMoveYn == 'Y'){
			ADVCEXC13S01.location.directMove();
		}
		else{
			// 상세내역 셋팅
			gfn_setDetails(ADVCEXC13S01.variable.detailData, $('#f-content'));
		}

		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
// 계좌정보 그리기
ADVCEXC13S01.location.displayAcntInfo = function(){
	var detailData = ADVCEXC13S01.variable.initParamData;
	// 초기화
	$('#ulAcntList').html('');
	
	if(gfn_isNull(detailData.account)){
		return;
	}
	
	//var _template = $("#_dumyFncl").html();
	//var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyAcnt").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each( detailData.account, function(index, item){
		item.idx = index + 1;
		
		$.each( item.account_info_list, function(index, item2){
			item2.idx = index;
			item2.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
			item2.acnt_type_nm = gfn_getAcntTypeNm(item2.acnt_type);
			item2.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item2.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
			
			var html2 = template2(item2);
			$('#ulAcntList').append(html2);
		});
	});
	
}

// move direct
ADVCEXC13S01.location.directMove = function(){
	$('#btnNext').trigger("click");
}

// 화면접근정보 통지
ADVCEXC13S01.location.enterScreen = function(){
	var inputParam = {};
	inputParam.type 	= '1';		// 애드브릭스
	inputParam.event 	= 'adviceagree_fin';
	gfn_enterScreen(inputParam);
	 
	inputParam.type 	= '2';		// 페이스북
	inputParam.event 	= 'adviceagree_fin';
	gfn_enterScreen(inputParam);
}



ADVCEXC13S01.init();
