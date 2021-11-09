/**
* 파일명 		: WAITPRO01S01.js
* 업무		: 연금대기 메인화면(W-01-01)
* 설명		: 연금대기 메인화면
* 작성자		: 배수한
* 최초 작성일자	: 2021.04.26
* 수정일/내용	: 
*/
var WAITPRO01S01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO01S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,showOrder		: true								// 주문창 보여주기 여부
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
WAITPRO01S01.events = {
	 'click #showIcoTrans'									: 'WAITPRO01S01.event.clickShowIcoTrans'
	,'click li[id^="unexec_"]'								: 'WAITPRO01S01.event.clickMoveDetail'
	,'click .underline'										: 'WAITPRO01S01.event.clickBtnCapyAcnt'
	
	,'click i[id^="btnCallPopup_"]'							: 'WAITPRO01S01.event.clickBtnCallPopup'		// 내부 설명팝업 호출 
	,'click button[id^="btnBox_"]'							: 'WAITPRO01S01.event.clickBtnBox'				// 박스내 버튼 클릭시 (계좌이전 재신청 등.) 
	,'click i[id^="btnTooltip_"]'							: 'WAITPRO01S01.event.clickBtnTooltip'			// 계좌 툴팁 아이콘 클릭시
	,'click div[id^="tootip_"]'								: 'WAITPRO01S01.event.clickTooltip'				// 툴팁 클릭시
	
	,'click #pop2Close'										: 'WAITPRO01S01.event.clickPop2Close'
	,'click #pop3Close'										: 'WAITPRO01S01.event.clickPop3Close'
	,'click #btnRetryTrans'									: 'WAITPRO01S01.event.clickBtnRetryTrans'		// 이전 재실행
	,'click a[id^="btnAdviceDetail_"]'						: 'WAITPRO01S01.event.clickBtnAdviceDetail'		// 자문안보기 버튼 클릭시
}

WAITPRO01S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO01S01');
	
	//$("#pTitle").text("자문안 실행하기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-01-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO01S01.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO01S01.location.pageInit = function() {	

	{
		$('.dim', $('#w0101Pop2')).on("click", WAITPRO01S01.event.clickPop2Close);
	}
	
	// 연금대기메인조회 조회
	WAITPRO01S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문대기 대시보드 조회 
WAITPRO01S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitMain";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_main";
	inputParam.data 	= {};
	inputParam.callback	= WAITPRO01S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// '계좌 이전 재신청'			 
WAITPRO01S01.tran.retransAcnt = function() {
	
	WAITPRO01S01.variable.sendData = {};
	WAITPRO01S01.variable.sendData.acnt_uid 	= WAITPRO01S01.variable.detailData.orgn_acnt_uid; 		// 기존계좌UID
	WAITPRO01S01.variable.sendData.pwd          = WAITPRO01S01.variable.pwd								// 암호화 된 계좌 비밀번호

	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntReTrans";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_re_trans";
	inputParam.data 	= WAITPRO01S01.variable.sendData;
	inputParam.callback	= WAITPRO01S01.callBack;
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 툴팁보기 클릭시
WAITPRO01S01.event.clickShowIcoTrans = function(e) {
 	e.preventDefault();

	gfn_log($(this).data('type'));
	
	$('#noteTrans').addClass('show');
    /*
	setTimeout(function(){ 
        $('#noteTrans').removeClass('show');
    }, 3000);
	*/
}

// 상세화면이동 클릭시
WAITPRO01S01.event.clickMoveDetail = function(e) {
 	e.preventDefault();

	var data = $(this).data();
	// 2: 이체, 9:해지 5:신규
	if(data.advc_gbn_cd == '5'){
		sStorage.setItem("WAITPRO02S06Params", data);
		ComUtil.moveLink('/wait_progress/WAITPRO02S06'); //신규상세 화면이동
	}
	else{
		sStorage.setItem("WAITPRO02S01Params", data);
		ComUtil.moveLink('/wait_progress/WAITPRO02S01'); // 상세 화면이동
	}
}


//계좌 번호 복사 하기
WAITPRO01S01.event.clickBtnCapyAcnt = function() {
	var acntInfo = $(this).text();
	
	ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(acntInfo, '-', ''));
	gfn_toastMsgBox("계좌번호가 복사되었습니다.");
}


// 내부 설명팝업 호출
WAITPRO01S01.event.clickBtnCallPopup = function() {
	
	var idx = $(this).data('idx');
	var data = $('#unexec_' + idx).data();
	
	
	if("|14|".indexOf(data.acnt_status) > -1){
		data.pop2_imgSrc 			= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd)); 
		data.pop2_acnt_holder_nm 	= ComUtil.null(JsEncrptObject.decrypt(data.account_holder_name), gfn_getUserInfo('userNm', true));
		
		gfn_setDetails(data, $('#w0101Pop2'));
		$("#w0101Pop2").show();
	}
	else if("|21|".indexOf(data.acnt_status) > -1){
		//'해지 후 입금' Popup 호출
		var sParam = {};
		sParam.url = '/wait_progress/WAITPRO01S01P01';
		
		gfn_callPopup(sParam, function(){
		});
	}
}

// 박스내 버튼 클릭시 (계좌이전 재신청 등.)
WAITPRO01S01.event.clickBtnBox = function() {
	
	var idx = $(this).data('idx');
	var data = $('#unexec_' + idx).data();
	
	//gfn_alertMsgBox(data.acnt_status);
	
	if("|15|".indexOf(data.acnt_status) > -1){
		// 계좌이전재신청
		data.acnt_type_nm 			= gfn_getAcntTypeNm(data.acnt_type);
		data.pop3_imgSrc 			= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd));
		WAITPRO01S01.variable.detailData.orgn_acnt_uid = data.orgn_acnt_uid;	// 이전 신청할 uid 
		
		gfn_setDetails(data, $('#w0101Pop3'));
		$("#w0101Pop3").show();
	}
	else if("|19|27|".indexOf(data.acnt_status) > -1){
		// 월적립식 투자하기
		ComUtil.moveLink('/wait_progress/WAITPRO03S01'); // 월 적립식 투자 화면으로 이동
	}
	else if("|21|23|25|".indexOf(data.acnt_status) > -1){
		// 입금계좌번호복사
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(data.acnt_no_pt, '-', ''));
		var inputParam = {};
		inputParam.msg = '계좌번호가 복사되었습니다.';
		inputParam.isUnder = true;
		gfn_toastMsgBox(inputParam);
	}
	else if("|05|16|24|26|".indexOf(data.acnt_status) > -1){
		// 매수주문 승인하기
		WAITPRO01S01.location.callOrderPopup();
	}
}

//'유의사항' 모달창 닫기
WAITPRO01S01.event.clickPop2Close = function() {
	$("#w0101Pop2").hide();
}

//'계좌이전 재신청' 모달창 닫기
WAITPRO01S01.event.clickPop3Close = function() {
	$("#w0101Pop3").hide();
}


// 계좌 툴팁 아이콘 클릭시
WAITPRO01S01.event.clickBtnTooltip = function(e) {
 	e.preventDefault();
	
	var idx = $(this).data('idx');
	//var data = $('#acntDetail_' + idx).data();
	$(`#tootip_`+idx).toggleClass('show');
}


// 툴팁 클릭시
WAITPRO01S01.event.clickTooltip = function(e) {
 	e.preventDefault();

	$(this).removeClass('show');
}



// '이전 재실행' 클릭시
WAITPRO01S01.event.clickBtnRetryTrans = function(e) {
 	e.preventDefault();

	gfn_confirmMsgBox("계좌이전을 재실행 하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){

			WAITPRO01S01.location.modalClose();			 
			
			$('#msgPopup').show();
			
			var inputParam = {};
			inputParam.callback = WAITPRO01S01.callBack.popPassword;
			inputParam.pwdMsg = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
			gfn_callPwdPopup(inputParam);
			
			
			//WAITPRO01S01.event.kbKeyPadInit();
			//$('#msgCase_pwd').show();
		}
	});
}


// 자문안보기 버튼 클릭시
WAITPRO01S01.event.clickBtnAdviceDetail = function(e) {
 	e.preventDefault();

	var idx = $(this).data('idx');
	var data = $('#unexec_' + idx).data();
	
	sStorage.setItem("WAITPRO02S01Params", data);

	var url = "/wait_progress/WAITPRO02S01";
	ComUtil.moveLink(url);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "pensionWaitMain"){
		WAITPRO01S01.variable.detailData = result;
		// advc_exe_status ( 1 : 실행중 / 2 :실행완료 )
		WAITPRO01S01.variable.detailData.advc_exe_status_msg = (result.advc_exe_status == '1' ? "실행중" : "실행완료");
		
		WAITPRO01S01.variable.detailData.user_nm = JsEncrptObject.decrypt(WAITPRO01S01.variable.detailData.user_nm);
		if(ComUtil.isNull(WAITPRO01S01.variable.detailData.user_nm)){
			WAITPRO01S01.variable.detailData.user_nm = gfn_getUserInfo('userNm', true);
		}
		
		// 상세 셋팅 
		WAITPRO01S01.location.displayDetail();
		
		// order popup call
		/*if(WAITPRO01S01.variable.showOrder){
			WAITPRO01S01.location.callOrderPopup();
		}*/
	}
	// 계좌이전 재신청
	else if(sid == "pensionWaitAcntReTrans"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		else{
			WAITPRO01S01.tran.selectDetail();
		}
	}
	
}


// 비밀번호 입력후 팝업 콜백함수 
WAITPRO01S01.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		var cnfrCd = $('#nintv_sm_cnfr_cd').val();
		
		//KB키보드 입력을 통해 입력 한 패스워드 암호화 되어 넘어온 데이터 셋팅
		WAITPRO01S01.variable.pwd = returnParam.pwd;

		WAITPRO01S01.tran.retransAcnt();
		
		//$("#msgCase_pwd").hide();
		$('#msgPopup').hide();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO01S01.location.displayDetail = function(){
	var detailData = WAITPRO01S01.variable.detailData;
	
	// 초기화
	$('#ulUnexecList').html('');
	if(detailData.unexec_list == null || detailData.unexec_list.length == 0){
		detailData.num_unexec = 0;
		
		/*
		// 사용자 기본정보 상태값 변경
		gfn_setUserInfo('status', 'mng');
		var homeUrl = '/pension_mng/PENSION11M01';
		sStorage.setItem('homeUrl', homeUrl);
		// 관리화면으로 이동한다.
		ComUtil.moveLink(homeUrl);
		return;
		*/
	}
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	if(detailData.unexec_list == null || detailData.unexec_list.length == 0){
		detailData.num_unexec = 0;
		return;
	}
	
	var _template = $("#_dumyUnexecList").html();
	var template = Handlebars.compile(_template);
	
	
	$.each(detailData.unexec_list, function(index, item){
		item.idx = index + 1;
		item.title = '';
		
		// 상태태그
		//item.stateHtml = WAITPRO01S01.location.makeStateHtml(item.status_tag);
		// 계좌번호 패턴 추가
		item.acnt_no_pt = ComUtil.pettern.acntNo(item.acnt_no + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		
		// 추가적인 정보 셋팅
		//item.acnt_status = '15';
		$.extend(item, WAITPRO01S01.location.setInfoByStatus(item));
		
		item.status_title = item.title;
		
		var html = template(item);
		$('#ulUnexecList').append(html);
		
		$('#unexec_' + item.idx).data(item);
	});

}



/*
var arr1 = ['14','15','21','23','25','26'];			//금융 아이콘2개
var arr2 = ['03','05','16','19','24','27'];			//금융 아이콘3개	

case '03' 	: titleNm = '상품 매수 진행중';
case '05' 	: titleNm = '매수주문실패';
case '07' 	: titleNm = '매수/매도 주문 후 다시 주문가능 상태인 경우';
case '14' 	: titleNm = '계좌이전 진행중';
case '15' 	: titleNm = '계좌이전 실패';
case '16' 	: titleNm = '계좌이전 이전완료. 매수주문 필요';
case '19' 	: titleNm = '계좌이전에 따른 자문안 실행완료';
case '21' 	: titleNm = '해지후 입금필요';
case '23' 	: titleNm = '해지후 입금 미실행';
case '24' 	: titleNm = '입금완료. 매수주문 필요';
case '25' 	: titleNm = '입금하기';
case '26' 	: titleNm = '입금확인 , 매수주문 승인하기';
case '27' 	: titleNm = '해지 후 입금완료';
case '28' 	: titleNm = '자문안 실행 완료';
			
/images/bank_circle_logo/order.png = 매수주문
/images/bank_circle_logo/deposit.png = 입금
/images/bank_circle_logo/stock.png = 증권
/images/bank_circle_logo/complete.png = 완료
*/
WAITPRO01S01.location.setInfoByStatus = function(itemInfo){
	var addInfo = {};
	switch(itemInfo.acnt_status){
		case '03'	:
						addInfo.mTitle 		= "상품 매수 진행중";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '/images/bank_circle_logo/order.png';
						addInfo.imgTitle_2 	= '매수주문';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "승인한 매수주문이 진행 중입니다.<br>완료까지 영업일 기준 2~3일 정도 걸립니다.";
						addInfo.mBtnTitle	= "";
			break; 
		case '05'	:
						addInfo.mTitle 		= "매수주문 실패";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '/images/bank_circle_logo/order.png';
						addInfo.imgTitle_2 	= '매수주문';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "정상적으로 처리되지 않았습니다.<br> 매수주문을 다시 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '14'	: 
						addInfo.mTitle 		= "계좌이전 진행 중";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '유의사항';
						addInfo.mBoxMsg		= "연금계좌이전이 진행 중입니다. <br>계좌이전 확인 전화를 받아주세요.";
						addInfo.mBtnTitle	= "";
			break; 
		case '15'	: 
						addInfo.mTitle 		= "계좌이전 실패";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "계좌이전이 취소되었습니다. <br>다시 이전신청을 해주세요.";
						addInfo.mBtnTitle	= "계좌이전 재신청";
			break; 
		case '16'	: 
						addInfo.mTitle 		= "계좌이전 완료·매수주문필요";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '/images/bank_circle_logo/order.png';
						addInfo.imgTitle_2 	= '매수주문';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "계좌이전 완료·매수주문필요 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '19'	: 
						addInfo.mTitle 		= "계좌이전·자문안 실행 완료";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'G');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'G');
						addInfo.imgTitle_2 	= itemInfo.chng_fncl_agc_nm;
						addInfo.imgSrc_3 	= '/images/bank_circle_logo/complete.png';
						addInfo.imgTitle_3 	= '완료';
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "수고하셨습니다. <br>계좌이전과 포트폴리오 매수가 완료되었습니다.";
						addInfo.mBtnTitle	= "월적립식 투자하기";
			break;
		case '21'	: 
						addInfo.mTitle 		= "해지 후 입금 필요";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '해지 후 입금하기';
						addInfo.mBoxMsg		= "상품 해지 후 환급금을 신규개설한 계좌로 입금해 주세요.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사하기";
			break;
		case '23'	: 
						addInfo.mTitle 		= "해지 후 입금 미실행";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "자문안이 실행되지 않았습니다. <br>해당 상품을 해지하고 입금해 주세요.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사하기";
			break;
		case '24'	: 
						addInfo.mTitle 		= "입금완료·매수주문필요";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'C');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= '/images/bank_circle_logo/order.png';
						addInfo.imgTitle_2 	= '매수주문';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "해지 후 입금완료·주문승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '25'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.imgSrc_1 	= '/images/bank_circle_logo/deposit.png';
						addInfo.imgTitle_1 	= '입금하기';
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'C');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "일반종합계좌는 자문안에 따라 입금해야 할 전체 금액 기준으로 현재 입금할 총 금액 표시합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사하기";
			break;
		case '26'	: 
						addInfo.mTitle 		= "입금확인";
						addInfo.imgSrc_1 	= '/images/bank_circle_logo/order.png';
						addInfo.imgTitle_1 	= '매수주문';
						addInfo.imgSrc_2 	= '';
						addInfo.imgTitle_2 	= '';
						addInfo.imgSrc_3 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'G');
						addInfo.imgTitle_3 	= itemInfo.chng_fncl_agc_nm;
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '27'	: 
						addInfo.mTitle 		= "해지 후 입금 완료";
						addInfo.imgSrc_1 	= gfn_getImgSrcByCd(itemInfo.orgn_kftc_agc_cd, 'G');
						addInfo.imgTitle_1 	= itemInfo.orgn_fncl_agc_nm;
						addInfo.imgSrc_2 	= gfn_getImgSrcByCd(itemInfo.chng_kftc_agc_cd, 'G');
						addInfo.imgTitle_2 	= itemInfo.chng_fncl_agc_nm;
						addInfo.imgSrc_3 	= '/images/bank_circle_logo/complete.png';
						addInfo.imgTitle_3 	= '완료';
						
						addInfo.mBoxTitle 	= '';
						addInfo.mBoxMsg		= "수고하셨습니다. <br>해지·입금·포트폴리오 구성이 완료 되었습니다.";
						addInfo.mBtnTitle	= "월적립식 투자하기";
			break;
	}
	
	return addInfo;
}

// 상태태그 만들기
WAITPRO01S01.location.makeStateHtml = function(status_tag){
	if(ComUtil.isNull(status_tag)){
		return '';
	}
	
	var stateHtml = "";	

	var stateArr = status_tag.split('|');
	
	$.each(stateArr, function(index, item){
		stateHtml += '<span class="state">' + item + '</span> '; 
	});
	
	return stateHtml;
}



// order popup call
WAITPRO01S01.location.callOrderPopup = function(){
	
	// 무조건 주문창을 띄운다.
	//if(  ComUtil.null(WAITPRO01S01.variable.detailData.buy_order_yn, 'N') == 'Y'
	//  || ComUtil.null(WAITPRO01S01.variable.detailData.sell_order_yn, 'N') == 'Y'
	//  )
    {
		var sParam = {};
		sParam.url = '/pension_execution/order/ORDREXE01P01';
		gfn_callPopup(sParam, function(){
			// 화면엔 한번만 주문창을 호출한다. 
			//WAITPRO01S01.variable.showOrder = false;
			// 연금대기메인조회 조회  	
			//WAITPRO01S01.tran.selectDetail();
		});
	}
}


//KB키패드 초기화
WAITPRO01S01.event.kbKeyPadInit = function() {
	//키패드 관련 초기 셋팅
	var d = new Date();
	var tm = d.getHours()+""+d.getMinutes()+""+d.getSeconds();
	if(ComUtil.isNull(vKeypadAPI.url)){
		var reloadCnt = ComUtil.null(sStorage.getItem("reloadCnt"), 0);
		if(reloadCnt > 5){
			gfn_alertMsgBox('보안키패드 초기화를 하지 못했습니다.', '', function(){
				sStorage.setItem("reloadCnt", 0);
				ComUtil.moveLink('/waitProgress/WAITPRO01S01', false);
			});
			return;
		}
		sStorage.setItem("reloadCnt", reloadCnt+1);
		location.reload();
	}
	else{
		sStorage.setItem("reloadCnt", 0);
	}

	var interval = setInterval(function(){
		
		if(ComUtil.isNull(vKeypadAPI)){
			gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 진행 할 수 없습니다. 잠시 후 다시 시도해주세요.', '', function(){
				ComUtil.moveLink('/waitProgress/WAITPRO01S01', false); // 계좌개설초기화면으로 이동
			});
		}
		else{
			vKeypadAPI.errorPage = "/waitProgress/WAITPRO01S01";
			gfn_log('vkpad_vkpad_rr_no_num load!!!');
			vKeypadAPI.initVKPad({
				"onloadCallback" : function() {
					gfn_log("--onloadCallback--");
					WAITPRO01S01.variable.bKeypad = true;
				},
				"showCallback" : function() {
					gfn_log("--showCallback--");
					$('#vkpad_rr_no').attr('style', '');
					$('#vkpad_vkpad_rr_no_num').css('top', 'auto');
					$('#vkpad_vkpad_rr_no_num').css('bottom', '0');
				},
				"hideCallback" : function() {
					gfn_log("--hideCallback--");
				},
				"doneCallback" : function(data) {

					var dataObj = (JSON.parse(ComUtil.string.replaceAll(data, "'", '"'))).dataBody;
					for(_key in dataObj){
						gfn_log("key :: " + _key);
						_key = ComUtil.string.replaceAll(_key, "vkpad_", "");
						eval("WAITPRO01S01.variable.sendData."+_key+ " = dataObj.vkpad_" + _key);
					}
		
					if($("#vkpad_rr_no").val().length < 4){
						gfn_alertMsgBox("비밀번호 4자리를 입력해 주세요", '', function(){
							$('#vkpad_rr_no').val('');
							$('#vkpad_rr_no').focus();
						});
						return;
					}
					
					//KB키보드 입력을 통해 입력 한 패스워드 암호화 되어 넘어온 데이터 셋팅
					WAITPRO01S01.variable.pwd = dataObj.vkpad_rr_no;

					WAITPRO01S01.tran.retransAcnt();
					
					$("#msgCase_pwd").hide();
					$('#msgPopup').hide();
					//gfn_alertMsgBox('계좌이전 실행을 완료 하였습니다.');
					
					//setTimeout(function() {
  					//		ComUtil.moveLink('/wait_progress/WAITPRO01S01'); // 화면이동
					//}, 3000);

				} 
			});
			
			clearInterval(interval);
		}
		
    }, 300);
}

// modal popup close
WAITPRO01S01.location.modalClose = function(){
    $('#w0101Pop3').hide();
}


WAITPRO01S01.init();
