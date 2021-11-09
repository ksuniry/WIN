/**
* 파일명 		: WAITPRO02P01.js
* 업무		: 연금대기 상세보기(W-02-01)
* 설명		: 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2021.04.28
* 수정일/내용	: 
*/
var WAITPRO02P01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO02P01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	//,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,bKeypad		: false								// 키패드 사용가능여부
}

/* 이벤트 정의 */
WAITPRO02P01.events = {
	 'click #btnTooltip'										: 'WAITPRO02P01.event.clickBtnTooltip'			// 계좌 툴팁 아이콘 클릭시
	,'click #divTootip'											: 'WAITPRO02P01.event.clickTooltip'				// 툴팁 클릭시
	,'click #btnTopBoxButton'									: 'WAITPRO02P01.event.clickBtnTopBoxButton'		// 상단 박스내 버튼 클릭시 상태값에 따라 작업
	,'click #orgn_acnt_no_pt'									: 'WAITPRO02P01.event.clickBtnCapyAcnt'			// 계좌번호 클립보드 복사
	,'click li[id^="prodDetail_"]'								: 'WAITPRO02P01.event.goFundDetail'				// 펀드 상세 조회
	
	,'click button[id^="btnCase"]'								: 'WAITPRO02P01.event.clickMsgPopClose'			// msg 팝업 닫기
	,'click #btnRetryTrans, #btnRetryTrans2'					: 'WAITPRO02P01.event.clickBtnRetryTrans'		// 이전 재실행
}

WAITPRO02P01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO02P01');
	
	//$("#pTitle").text("자문안 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO02P01.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO02P01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("WAITPRO02P01Params");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		WAITPRO02P01.variable.initParamData = sParams;
		
		WAITPRO02P01.variable.sendData.orgn_acnt_uid = sParams.orgn_acnt_uid;
		WAITPRO02P01.variable.sendData.chng_acnt_uid = sParams.chng_acnt_uid;
		WAITPRO02P01.variable.sendData.advc_gbn_cd = sParams.advc_gbn_cd;
		//sStorage.clear();
	}
	else{
		return;
	}
	
	//
	{
		//Tab
        $('.tab-label-item:nth-child(1) a').addClass('is_active');
        $('#tabPanel-1', $('#w0201-content')).show();

        $(".tab-label-item a").on("click", function(e){
            e.preventDefault();

            //label
            var target = $(this).attr("href");
            $(".tab-label-item a").removeClass("is_active");
            $(this).addClass("is_active");

            //panel
            $(".tab-panel", $('#w0201-content')).hide();
            $(target, $('#w0201-content')).show();
        });
		
		$('.dim', $('#msgPopup')).on("click",function(e){
			WAITPRO02P01.event.clickMsgPopClose(e);
		});
	}
	
	// 차트 영역 셋팅
	WAITPRO02P01.location.initChart();
	
	// 연금대기메인조회 조회  	
	WAITPRO02P01.tran.selectDetail();
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문대기 대시보드 조회 
WAITPRO02P01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_detail";
	inputParam.data 	= WAITPRO02P01.variable.sendData;
	inputParam.callback	= WAITPRO02P01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 자문대기 계좌상세 자문취소			 
WAITPRO02P01.tran.cancelPensionWaitAcnt = function() {
	WAITPRO02P01.variable.sendData = {};
	WAITPRO02P01.variable.sendData.acnt_uid 	= WAITPRO02P01.variable.initParamData.orgn_acnt_uid; 	// 기존계좌UID
	WAITPRO02P01.variable.sendData.advc_gbn_cd 	= WAITPRO02P01.variable.initParamData.advc_gbn_cd; 		// 자문구분코드
	WAITPRO02P01.variable.sendData.acnt_status 	= '99'; 			// 99 : 자문받지 않음 (고정값으로 셋팅)
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntCancel";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_cancel";
	inputParam.data 	= WAITPRO02P01.variable.sendData;
	inputParam.callback	= WAITPRO02P01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 재신청			 
WAITPRO02P01.tran.retransAcnt = function() {

	WAITPRO02P01.variable.sendData = {};
	WAITPRO02P01.variable.sendData.acnt_uid 	= WAITPRO02P01.variable.initParamData.orgn_acnt_uid; 	// 기존계좌UID
	WAITPRO02P01.variable.sendData.pwd          = WAITPRO02P01.variable.pwd								// 암호화 된 계좌 비밀번호


	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntReTrans";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_re_trans";
	inputParam.data 	= WAITPRO02P01.variable.sendData;
	inputParam.callback	= WAITPRO02P01.callBack;
	
	gfn_Transaction( inputParam );
}



// 오픈뱅킹 인증여부 확인
WAITPRO02P01.tran.selectUserObStatus = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserObStatus";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/select_user_ob_status";
	//inputParam.data 	= WAITPRO02S06.variable.sendData;
	inputParam.data 	= {};
	inputParam.callback	= WAITPRO02P01.callBack; 
	
	gfn_Transaction( inputParam );
}





////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 계좌 툴팁 아이콘 클릭시
WAITPRO02P01.event.clickBtnTooltip = function(e) {
 	e.preventDefault();

	$('#divTootip').toggleClass('show');
}


// 툴팁 클릭시
WAITPRO02P01.event.clickTooltip = function(e) {
 	e.preventDefault();

	$(this).removeClass('show');
}


// 상단 박스내 버튼 클릭시 상태값에 따라 작업
WAITPRO02P01.event.clickBtnTopBoxButton = function(e) {
 	e.preventDefault();

	var data = WAITPRO02P01.variable.detailData;
	
	//gfn_alertMsgBox(data.acnt_status);
	
	if("|14|".indexOf(data.acnt_status) > -1){
		// 이전안내
		//data.acnt_type_nm 			= gfn_getAcntTypeNm(data.acnt_type);
		data.imgSrc 				= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd));
		
		gfn_setDetails(data, $('#msgCase_ing'));
		$("#msgPopup", $('#w0201-content')).show();
		$("#msgCase_ing", $('#w0201-content')).show();
	}
	else if("|15|".indexOf(data.acnt_status) > -1){
		// 계좌이전재신청
		data.acnt_type_nm 			= gfn_getAcntTypeNm(data.acnt_type);
		data.imgSrc 				= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd));
		
		gfn_setDetails(data, $('#msgCase_retry'));
		$("#msgPopup", $('#w0201-content')).show();
		$("#msgCase_retry", $('#w0201-content')).show();
	}
	else if("|19|27|".indexOf(data.acnt_status) > -1){
		// 월적립식 투자하기
		// ComUtil.moveLink('/wait_progress/WAITPRO03S01'); // 월 적립식 투자 화면으로 이동
		var sParam = {};
		sParam.url = '/wait_progress/WAITPRO03P01'; // 월 적립식 투자 화면으로 이동
		gfn_callPopup(sParam, function(){});
	}
	else if("|21|23|".indexOf(data.acnt_status) > -1){
		// 해지안내
		data.acnt_type_nm 			= gfn_getAcntTypeNm(data.acnt_type);
		data.imgSrc 				= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd));
		
		gfn_setDetails(data, $('#msgCase_acnt_close'));
		$("#msgPopup", $('#w0201-content')).show();
		$("#msgCase_acnt_close", $('#w0201-content')).show();
	}
	else if("|25|".indexOf(data.acnt_status) > -1){
		// 입금 안내
		data.acnt_type_nm 			= gfn_getAcntTypeNm(data.acnt_type);
		data.imgSrc 				= gfn_getImgSrcByCd(data.orgn_kftc_agc_cd, 'C');
		data.orgn_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.orgn_acnt_no, '') + gfn_getAddAcntNoByCd(data.orgn_kftc_agc_cd));
		
		gfn_setDetails(data, $('#msgCase_deposit_noti'));
		$("#msgPopup", $('#w0201-content')).show();
		$("#msgCase_deposit_noti", $('#w0201-content')).show();
	}
	else if("|04|16|24|26|".indexOf(data.acnt_status) > -1){
		// 매수주문 승인하기
		WAITPRO02P01.location.callOrderPopup();
	}
}



// msg 팝업 닫기
WAITPRO02P01.event.clickMsgPopClose = function(e) {
 	e.preventDefault();	

	$("#msgPopup", $('#w0201-content')).hide();
	// 문제해결 msg popup 초기화
	$('div[id^="msgCase_"]', $('#w0201-content')).hide();
}



// 문제해결 클릭시
/*WAITPRO02P01.event.clickBtnSolution = function(e) {
 	e.preventDefault();	

	$('#msgPopup').show();
}*/

// 계좌번호복사 클릭시
WAITPRO02P01.event.clickBtnCapyAcnt = function(e) {
 	e.preventDefault();

	var type = $(this).data("type");

	// 클립보드 복사
	if(type == "orgn"){
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO02P01.variable.detailData.orgn_acnt_no_pt, '-', ''));
	}
	else{
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO02P01.variable.detailData.chng_acnt_no_pt, '-', ''));
	}
	
	var inputParam = {};
	inputParam.msg = '계좌번호가 복사되었습니다.';
	inputParam.isUnder = false;
	gfn_toastMsgBox(inputParam);
}

// '이전 재실행' 클릭시
WAITPRO02P01.event.clickBtnRetryTrans = function(e) {
 	e.preventDefault();

	gfn_confirmMsgBox("계좌이전을 재실행 하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){

			WAITPRO02P01.location.modalClose();
			
			$('#msgPopup', $('#w0201-content')).show();
			
			var inputParam = {};
			inputParam.callback = WAITPRO02P01.callBack.popPassword;
			inputParam.pwdMsg = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
			gfn_callPwdPopup(inputParam);
			
		}
	});
}

// 해지신청  후 입금 클릭시
/*WAITPRO02P01.event.clickBtnTerminate = function(e) {
 	e.preventDefault();

	//gfn_alertMsgBox("해지신청  후 입금");
	gfn_confirmMsgBox("해지신청  후 입금.", '', function(returnData){
		
		if(returnData.result == 'Y'){
			// 오픈뱅킹 인증여부 확인
			WAITPRO02P01.tran.selectUserObStatus();
		}
		else{
			//$(this).attr( "checked", false );
		}
	});
	
}*/



// 자문대기 계좌상세 자문취소 클릭시
/*WAITPRO02P01.event.changeCancelAcnt = function(e) {
 	e.preventDefault();

	if( $(this).is(':checked') == false ){
		return;
	}

	gfn_confirmMsgBox("더이상 연금관리를 받지 않을실건가요? 멘트주세요.", '', function(returnData){
		
		if(returnData.result == 'Y'){
			WAITPRO02P01.tran.cancelPensionWaitAcnt();
		}
		else{
			$(this).attr( "checked", false );
		}
	});
	
	var inputParam = {};
	inputParam.thisId = $(this).attr('id');
	inputParam.msg = '더이상 연금관리를 받지 않을실건가요? 멘트주세요!!!';
	
	gfn_confirmMsgBox2(inputParam, function(resultParam){
		if("Y" == resultParam.result){
			WAITPRO02P01.tran.cancelPensionWaitAcnt();
			$('#msgPopup').hide();
		}
		else{
			$('#' + resultParam.param.thisId).attr( "checked", false );
		}
	});
}*/



// 펀드상세 외부 링크 화면 호출 
WAITPRO02P01.event.goFundDetail = function(e) {
	e.preventDefault();
	
	var item = $(this).closest('li').data();
	
	var inputParam = {};
	inputParam.fund_no 		= item.prdt_cd;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
	
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO02P01.callBack = function(sid, result, success){

	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		gfn_historyBack();
		return;
	}
	
	if(sid == "pensionWaitAcntDetail"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				gfn_historyBack();
			});
			return;
		}
		
		WAITPRO02P01.variable.detailData = result;
		
		WAITPRO02P01.variable.detailData.chng_acnt_nm = WAITPRO02P01.variable.initParamData.chng_acnt_nm;	// 이전 화면의 데이터를 이용한다.
		
		// 상세 셋팅 
		WAITPRO02P01.location.displayDetail();
		return;
	}
	// 계좌이전 재신청
	else if(sid == "pensionWaitAcntReTrans"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		else{
			gfn_alertMsgBox(ComUtil.null(result.message, "계좌이전 실행을 완료 하였습니다."));
			//ComUtil.moveLink('wait_progress/WAITPRO01S01'); // 화면이동
			gfn_closePopup();
		}
	}
	// 
	else if(sid == "pensionWaitAcntCancel"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			return;
		}
		
		gfn_okMsgBox(result.message, '', function(){
			gfn_historyBack();
		});
	}
	// 오픈뱅킹 인증여부 확인
	else if(sid == "selectUserObStatus"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			/*
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				gfn_openBank3Agree({});
			});
			*/
			gfn_openBank3Agree({});
			return;
		}
		else{
			// 오픈뱅킹 화면으로 이동
			//ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
		}
		
		
	}
}


// 네이티브 호출후 콜백함수 
WAITPRO02P01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// openbanking 3자동의
	if(key == 'ob3agree'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 오픈뱅킹 화면으로 이동
			//ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
		}
		if(ComUtil.null(result.passYn, 'N') == 'C'){
			// 스크랩핑 성공시 재조회
			gfn_alertMsgBox('3자동의를 취소할 경우 더이상 서비스 지행이 불가합니다.', '', function(){});
		}
		else{
			// 스크랩핑 실패시
			gfn_alertMsgBox(ComUtil.null(result.msg, gfn_helpDeskMsg()), '', function(){});
		}
	}
}


// 비밀번호 입력후 팝업 콜백함수 
WAITPRO02P01.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		var cnfrCd = $('#nintv_sm_cnfr_cd').val();
		
		//KB키보드 입력을 통해 입력 한 패스워드 암호화 되어 넘어온 데이터 셋팅
		WAITPRO02P01.variable.pwd = returnParam.pwd;

		WAITPRO02P01.tran.retransAcnt();
		
		//$("#msgCase_pwd").hide();
		$('#msgPopup').hide();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO02P01.location.displayDetail = function(){
	var detailData = WAITPRO02P01.variable.detailData;
	
	//debugger;
	var advc_gbn_cd = WAITPRO02P01.variable.initParamData.advc_gbn_cd; 
	if(advc_gbn_cd == '2'){
		detailData.tabText = "계좌이전/운용변경";
	}
	else if(advc_gbn_cd == '9'){
		detailData.tabText = "계좌해지/운용변경";
	}
	else{
		detailData.tabText = "계좌이전/운용변경";
	}
	
	// 추가적인 정보 셋팅
	$.extend(detailData, WAITPRO02P01.location.setInfoByStatus(detailData));
	
	// 메인 타이틀이 두개인 경우 
	if("|26|".indexOf(detailData.acnt_status) > -1){
		$('#mTitle_2', $('#w0201-content')).show();
	}
	else{
		$('#mTitle_2', $('#w0201-content')).hide();
	}
	
	// tooltip 보여주기 여부 
	if("|25|".indexOf(detailData.acnt_status) > -1){
		$('#pTotalAmtInfo', $('#w0201-content')).show();
		$('#btnTooltip', $('#w0201-content')).show();
	}
	else{
		$('#pTotalAmtInfo', $('#w0201-content')).hide();
		$('#btnTooltip', $('#w0201-content')).hide();
	}
	
	// 박스내 버튼 보여주기 설정
	if("|03|28|".indexOf(detailData.acnt_status) > -1){
		$('#btnTopBoxButton', $('#w0201-content')).hide();
	}
	else{
		$('#btnTopBoxButton', $('#w0201-content')).show();
	}
	
	// 중간 계좌번호 표시여부 설정 
	if("|21|".indexOf(detailData.acnt_status) > -1){
		$('#pAcntNoArea', $('#w0201-content')).hide();
	}
	else{
		$('#pAcntNoArea', $('#w0201-content')).show();
	}
	
	
	detailData.orgn_acnt_no_pt = ComUtil.pettern.acntNo(detailData.orgn_acnt_no + gfn_getAddAcntNoByCd(detailData.orgn_kftc_agc_cd));
	detailData.chng_acnt_no_pt = ComUtil.pettern.acntNo(detailData.chng_acnt_no + gfn_getAddAcntNoByCd(detailData.chng_kftc_agc_cd));
	
	if(!ComUtil.isNull(detailData.advc_ptfl_prdt_list)){
		detailData.advc_ptfl_prdt_list_cnt = detailData.advc_ptfl_prdt_list.length;
	}
	/*else{
		// 제안 포트폴리오가 없으면 어떻게 하지?? 
		detailData.advc_ptfl_prdt_list_cnt = detailData.advc_ptfl_prdt_list.length;
	}*/

	
	// bank img
	$('#imgCompany').attr('src', gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C'));
	$('#orgn_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#w0201-content'));
	
	// 누적수익률 셋팅 
	if(!ComUtil.isNull(detailData.save_rvnu_rate)){
		if( parseFloat(detailData.save_rvnu_rate) > 0 ){
			$('#pSaveRvnuRate').addClass('plus');
		}
		else if( parseFloat(detailData.save_rvnu_rate) < 0 ){
			$('#pSaveRvnuRate').addClass('minus');
		}
		$('#divAssess', $('#w0201-content')).show();
	}
	else{
		gfn_log("숨길까?");
		$('#divAssess', $('#w0201-content')).hide();
	}
	
	// chart
	WAITPRO02P01.location.displayChart();
	
	// 초기화
	$('#ulProdList').html('');
	if(detailData.advc_ptfl_prdt_list == null || detailData.advc_ptfl_prdt_list.length == 0){
		return;
	}
	
	var _template = $("#_dumyProdList").html();
	var template = Handlebars.compile(_template);
	
	
	$.each(detailData.advc_ptfl_prdt_list, function(index, item){
		item.idx = index + 1;
		
		var html = template(item);
		$('#ulProdList').append(html);
		
		$('#prodDetail_' + item.idx).data(item);
	});
	
}	


WAITPRO02P01.location.setInfoByStatus = function(itemInfo){
	//itemInfo.acnt_status = '19';
	
	var addInfo = {};
	switch(itemInfo.acnt_status){
		case '03'	:
						addInfo.mTitle 		= "상품 매수 진행중";
						addInfo.mBoxMsg		= "승인한 매수주문이 진행 중입니다.<br>완료까지 영업일 기준 2~3일 정도 걸립니다.";
						addInfo.mBtnTitle	= "";
			break; 
		case '04'	:
						addInfo.mTitle 		= "매수주문 실패";
						addInfo.mBoxMsg		= "정상적으로 처리되지 않았습니다.<br> 매수주문을 다시 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '14'	: 
						addInfo.mTitle 		= "계좌이전 진행 중";
						addInfo.mBoxMsg		= "계좌이전·입금이 완료되면 매수주문을<br>확인하는 내용이  안내 될 예정입니다.";
						addInfo.mBtnTitle	= "이전 안내";
			break; 
		case '15'	: 
						addInfo.mTitle 		= "계좌이전 실패";
						addInfo.mBoxMsg		= "계좌이전이 취소되었습니다. <br>다시 이전신청을 해주세요.";
						addInfo.mBtnTitle	= "이전 신청";
			break; 
		case '16'	: 
						addInfo.mTitle 		= "계좌이전 완료·매수주문필요";
						addInfo.mBoxMsg		= "계좌이전 완료·매수주문필요 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '19'	: 
						addInfo.mTitle 		= "계좌이전·자문안 실행 완료";
						addInfo.mBoxMsg		= "수고하셨습니다. <br>계좌이전과 포트폴리오 매수가 완료되었습니다.";
						addInfo.mBtnTitle	= "월적립식 투자하기";
			break;
		case '21'	: 
						addInfo.mTitle 		= "해지 후 입금 필요";
						addInfo.mBoxMsg		= "해지·입금이 완료되면 매수 주문을 <br>확인하는 내용이  안내 될 예정입니다.";
						addInfo.mBtnTitle	= "해지안내";
			break;
		case '23'	: 
						addInfo.mTitle 		= "해지 후 입금 미실행";
						addInfo.mBoxMsg		= "자문안이 실행되지 않았습니다. <br>해당 상품을 해지하고 입금해 주세요.";
						addInfo.mBtnTitle	= "해지안내";
			break;
		case '24'	: 
						addInfo.mTitle 		= "입금완료·매수주문필요";
						addInfo.mBoxMsg		= "해지 후 입금완료·주문승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '25'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "일반종합계좌는 자문안에 따라 입금해야 할 전체 금액 기준으로 현재 입금할 총 금액 표시합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break;
		case '26'	: 
						addInfo.mTitle 		= "입금확인";
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '27'	: 
						addInfo.mTitle 		= "해지 후 입금 완료";
						addInfo.mBoxMsg		= "수고하셨습니다. <br>해지·입금·포트폴리오 구성이 완료 되었습니다.";
						addInfo.mBtnTitle	= "월적립식 투자하기";
			break;
	}
	
	return addInfo;
}

// order popup call
WAITPRO02P01.location.callOrderPopup = function(){
	var sParam = {};
	sParam.url = '/pension_execution/order/ORDREXE01P01';
	gfn_callPopup(sParam, function(){
		// 화면엔 한번만 주문창을 호출한다. 
		//WAITPRO01S01.variable.showOrder = false;
		// 연금대기메인조회 조회  	
		//WAITPRO01S01.tran.selectDetail();
	});
}


// chart
WAITPRO02P01.location.displayChart = function(){
	var detailData = WAITPRO02P01.variable.detailData;
	
	// draw options
    var options3 ={
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        elements: {
            arc: {
                roundedCornersFor: 0
            }
        }
    };
	
	var selectBgColor = 'rgb(40, 209, 80)';
    var selectBgColor2 = 'rgb(253, 242, 106)';
	var selectBgColor3 = 'rgb(255 , 149 , 43)'; // 21-06-14 수정

    //현재
    var crntData={
        labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [10,10,80],
            backgroundColor: [
                selectBgColor,
                selectBgColor2,
                selectBgColor3
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                selectBgColor,
                selectBgColor2,
                selectBgColor3
            ]
        }]
    };
	
	crntData.datasets[0].data[0] = detailData.crnt_stck_rate; // 현재주식비율
	crntData.datasets[0].data[1] = detailData.crnt_bond_rate; // 현재채권비율
	crntData.datasets[0].data[2] = detailData.crnt_cash_rate; // 현재현금비율



    //제안
    var ppslData={
        labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [40,40,20],
            backgroundColor: [
                selectBgColor,
                selectBgColor2,
                selectBgColor3
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                selectBgColor,
                selectBgColor2,
                selectBgColor3
            ]
        }]
    };

	ppslData.datasets[0].data[0] = detailData.ppsl_stck_rate; // 제안주식비율
	ppslData.datasets[0].data[1] = detailData.ppsl_bond_rate; // 제안채권비율
	ppslData.datasets[0].data[2] = detailData.ppsl_cash_rate; // 제안현금비율
	
	
	var ctx2 = document.getElementById('crntChar').getContext('2d');
    new Chart(ctx2, {
        type :'doughnut',
        data : crntData,
        options : options3
    });

    var ctx3 = document.getElementById('ppslChar').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : ppslData,
        options : options3
    });
	
}


// 차트 그리기
// 차트 초기
WAITPRO02P01.location.initChart = function(){
	Chart.pluginService.register({
        afterUpdate: function (chart) {
                var a=chart.config.data.datasets.length -1;
                for (let i in chart.config.data.datasets) {
                    for(var j = chart.config.data.datasets[i].data.length - 1; j>= 0;--j) { 
                        if (Number(j) == (chart.config.data.datasets[i].data.length - 1))
                            continue;
                        var arc = chart.getDatasetMeta(i).data[j];
                        arc.round = {
                            x: (chart.chartArea.left + chart.chartArea.right) / 2,
                            y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                            radius: chart.innerRadius + chart.radiusLength / 2 + (a * chart.radiusLength),
                            thickness: chart.radiusLength / 2,
                            thickness: (chart.outerRadius - chart.innerRadius) / 2,
                            backgroundColor: arc._model.backgroundColor
                        }
                    }
                    a--;
                }
        },

        afterDraw: function (chart) {
                var ctx = chart.chart.ctx;
                for (let i in chart.config.data.datasets) {
                    for(var j = chart.config.data.datasets[i].data.length - 1; j>= 0;--j) { 
                        if (Number(j) == (chart.config.data.datasets[i].data.length - 1))
                            continue;
                        var arc = chart.getDatasetMeta(i).data[j];
                        var startAngle = Math.PI / 2 - arc._view.startAngle;
                        var endAngle = Math.PI / 2 - arc._view.endAngle;

                        ctx.save();
                        ctx.translate(arc.round.x, arc.round.y);
                        ctx.fillStyle = arc.round.backgroundColor;
                        ctx.beginPath();
                        ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
                        ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }
        },
    });
}


//'매수 주문 승인 하기 Popup'
WAITPRO02P01.event.clickBuyApproval = function () {
 /* history comment - 데이터 바인딩 등을 위한 추가 작업이 필요한지에 대해 허부장님께 문의를 드렸으나, 
	* 링크만 걸어 놓으라고 말씀 하셔서 팝업 링크만 걸어 둔 상태. 추가로 작업이 필요 한 경우
	* 해당 이벤트 때 데이터를 넘겨 parameter로 data를 넘기거나, 콜백(callbackFn)시 작업 처리 하면 될 듯. 
	* '내용 확인 후/작업 후' 해당 코멘트는 지워 주세요. */
	
	var sParam = {};
	sParam.url = '/pension_execution/order/ORDREXE01P01'

	//debugger;
	// 매수주문 승인하기 팝업호출
	gfn_callPopup(sParam, function(){
	});
}

// modal popup close
WAITPRO02P01.location.modalClose = function(){
    $('#msgCase_acnt_transfer', $('#w0201-content')).hide();
}

WAITPRO02P01.init();
