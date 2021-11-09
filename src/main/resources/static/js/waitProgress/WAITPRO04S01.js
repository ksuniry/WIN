/**
* 파일명 		: WAITPRO04S01.js
* 업무		: 연금대기 상세보기(적립)(W-04-01)
* 설명		: 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2021.04.28
* 수정일/내용	: 
*/
var WAITPRO04S01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO04S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
	,bKeypad		: false								// 키패드 사용가능여부
}

/* 이벤트 정의 */
WAITPRO04S01.events = {
	 'click #btnTooltip'										: 'WAITPRO04S01.event.clickBtnTooltip'			// 계좌 툴팁 아이콘 클릭시
	,'click #divTootip_01, #divTootip_02'						: 'WAITPRO04S01.event.clickTooltip'				// 툴팁 클릭시
	,'click #btnTopBoxButton'									: 'WAITPRO04S01.event.clickBtnTopBoxButton'		// 상단 박스내 버튼 클릭시 상태값에 따라 작업
	,'click #chng_acnt_no_pt'									: 'WAITPRO04S01.event.clickBtnCapyAcnt'			// 계좌번호 클립보드 복사
	,'click li[id^="prodDetail_"]'								: 'WAITPRO04S01.event.goFundDetail'				// 펀드 상세 조회
	
	,'click button[id^="btnCase"]'								: 'WAITPRO04S01.event.clickMsgPopClose'			// msg 팝업 닫기
	,'click #btnRetryTrans, #btnRetryTrans2'					: 'WAITPRO04S01.event.clickBtnRetryTrans'		// 이전 재실행
}

WAITPRO04S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO04S01');
	
	//$("#pTitle").text("자문안 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO04S01.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO04S01.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("WAITPRO04S01Params");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		WAITPRO04S01.variable.initParamData = sParams;
		
		WAITPRO04S01.variable.sendData.acnt_uid = sParams.acnt_uid;
		//sStorage.clear();
	}
	else{
		return;
	}
	
	//
	{
		//Tab
        $('.tab-label-item:nth-child(1) a').addClass('is_active');
        $('#tabPanel-1').show();

        $(".tab-label-item a").on("click", function(e){
            e.preventDefault();

            //label
            var target = $(this).attr("href");
            $(".tab-label-item a").removeClass("is_active");
            $(this).addClass("is_active");

            //panel
            $(".tab-panel").hide();
            $(target).show();
        });
		
		$('.dim', $('#msgPopup')).on("click",function(e){
			WAITPRO04S01.event.clickMsgPopClose(e);
		});
	}
	
	// 차트 영역 셋팅
	WAITPRO04S01.location.initChart();
	
	// 연금대기메인조회 조회  	
	WAITPRO04S01.tran.selectDetail();
	
	
}

//KB키패드 초기화
WAITPRO04S01.event.kbKeyPadInit = function() {
	//키패드 관련 초기 셋팅
	var d = new Date();
	var tm = d.getHours()+""+d.getMinutes()+""+d.getSeconds();
	if(ComUtil.isNull(vKeypadAPI.url)){
		var reloadCnt = ComUtil.null(sStorage.getItem("reloadCnt"), 0);
		if(reloadCnt > 5){
			gfn_alertMsgBox('보안키패드 초기화를 하지 못했습니다.', '', function(){
				sStorage.setItem("reloadCnt", 0);
				ComUtil.moveLink('/waitProgress/WAITPRO04S01', false);
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
				ComUtil.moveLink('/waitProgress/WAITPRO04S01', false); // 계좌개설초기화면으로 이동
			});
		}
		else{
			vKeypadAPI.errorPage = "/waitProgress/WAITPRO04S01";
			gfn_log('vkpad_vkpad_rr_no_num load!!!');
			vKeypadAPI.initVKPad({
				"onloadCallback" : function() {
					gfn_log("--onloadCallback--");
					WAITPRO04S01.variable.bKeypad = true;
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
						eval("WAITPRO04S01.variable.sendData."+_key+ " = dataObj.vkpad_" + _key);
					}
		
					if($("#vkpad_rr_no").val().length < 4){
						gfn_alertMsgBox("비밀번호 4자리를 입력해 주세요", '', function(){
							$('#vkpad_rr_no').val('');
							$('#vkpad_rr_no').focus();
						});
						return;
					}
					
					//KB키보드 입력을 통해 입력 한 패스워드 암호화 되어 넘어온 데이터 셋팅
					WAITPRO04S01.variable.pwd = dataObj.vkpad_rr_no;

					WAITPRO04S01.tran.retransAcnt();
					
					$('#msgPopup').hide();
					$("#msgCase_pwd").hide();
				} 
			});
			
			clearInterval(interval);
		}
		
    }, 300);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 월적립식 투자현황 계좌 상세정보 조회 
WAITPRO04S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getMonPayAcntExecuteStatus";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/get_mon_pay_acnt_execute_status";
	inputParam.data 	= WAITPRO04S01.variable.sendData;
	inputParam.callback	= WAITPRO04S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 자문대기 계좌상세 자문취소			 
WAITPRO04S01.tran.cancelPensionWaitAcnt = function() {
	WAITPRO04S01.variable.sendData = {};
	WAITPRO04S01.variable.sendData.acnt_uid 	= WAITPRO04S01.variable.initParamData.orgn_acnt_uid; 	// 기존계좌UID
	WAITPRO04S01.variable.sendData.advc_gbn_cd 	= WAITPRO04S01.variable.initParamData.advc_gbn_cd; 		// 자문구분코드
	WAITPRO04S01.variable.sendData.acnt_status 	= '99'; 			// 99 : 자문받지 않음 (고정값으로 셋팅)
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntCancel";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_cancel";
	inputParam.data 	= WAITPRO04S01.variable.sendData;
	inputParam.callback	= WAITPRO04S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 재신청			 
WAITPRO04S01.tran.retransAcnt = function() {

	WAITPRO04S01.variable.sendData = {};
	WAITPRO04S01.variable.sendData.acnt_uid 	= WAITPRO04S01.variable.initParamData.orgn_acnt_uid; 	// 기존계좌UID
	WAITPRO04S01.variable.sendData.pwd          = WAITPRO04S01.variable.pwd								// 암호화 된 계좌 비밀번호


	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntReTrans";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_re_trans";
	inputParam.data 	= WAITPRO04S01.variable.sendData;
	inputParam.callback	= WAITPRO04S01.callBack;
	
	gfn_Transaction( inputParam );
}



// 오픈뱅킹 인증여부 확인
WAITPRO04S01.tran.selectUserObStatus = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserObStatus";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/select_user_ob_status";
	//inputParam.data 	= WAITPRO02S06.variable.sendData;
	inputParam.data 	= {};
	inputParam.callback	= WAITPRO04S01.callBack; 
	
	gfn_Transaction( inputParam );
}





////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 계좌 툴팁 아이콘 클릭시
WAITPRO04S01.event.clickBtnTooltip = function(e) {
 	e.preventDefault();

	var detailData = WAITPRO04S01.variable.detailData;
	if(ComUtil.isNull(detailData.advc_acnt_info)){
		return;
	}
	var data = detailData.advc_acnt_info;

	if("|12|13|14|".indexOf(data.acnt_status) > -1){
		$('#divTootip_01').toggleClass('show');
	}
	else if("|21|22|23|".indexOf(data.acnt_status) > -1){
		$('#divTootip_02').toggleClass('show');
	}
	
}


// 툴팁 클릭시
WAITPRO04S01.event.clickTooltip = function(e) {
 	e.preventDefault();

	$(this).removeClass('show');
}


// 상단 박스내 버튼 클릭시 상태값에 따라 작업
WAITPRO04S01.event.clickBtnTopBoxButton = function(e) {
 	e.preventDefault();

	var detailData = WAITPRO04S01.variable.detailData;
	if(ComUtil.isNull(detailData.advc_acnt_info)){
		return;
	}
	var data = detailData.advc_acnt_info;
	
	//gfn_alertMsgBox(data.acnt_status);
	if("|12|13|14|21|22|23|".indexOf(data.acnt_status) > -1){
		// 입금 안내
		data.imgSrc 				= gfn_getImgSrcByCd(data.chng_kftc_agc_cd, 'C');
		data.chng_acnt_no_pt 		= ComUtil.pettern.acntNo(ComUtil.null(data.chng_acnt_no, '') + gfn_getAddAcntNoByCd(data.chng_kftc_agc_cd));
		
		gfn_setDetails(data, $('#msgCase_deposit_noti'));
		gfn_setDetails(detailData, $('#msgCase_deposit_noti'));
		$("#msgPopup").show();
		$("#msgCase_deposit_noti").show();
	}
	else if("|||".indexOf(data.acnt_status) > -1){
		// 월적립식 투자하기
		ComUtil.moveLink('/wait_progress/WAITPRO03S01'); // 월 적립식 투자 화면으로 이동
	}
	else if("|02|05|24|26|".indexOf(data.acnt_status) > -1){
		// 매수주문 승인하기
		WAITPRO04S01.location.callOrderPopup();
	}
}



// msg 팝업 닫기
WAITPRO04S01.event.clickMsgPopClose = function(e) {
 	e.preventDefault();	

	$("#msgPopup").hide();
	// 문제해결 msg popup 초기화
	$('div[id^="msgCase_"]').hide();
}



// 문제해결 클릭시
/*WAITPRO04S01.event.clickBtnSolution = function(e) {
 	e.preventDefault();	

	$('#msgPopup').show();
}*/

// 계좌번호복사 클릭시
WAITPRO04S01.event.clickBtnCapyAcnt = function(e) {
 	e.preventDefault();

	var type = $(this).data("type");

	// 클립보드 복사
	if(type == "orgn"){
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO04S01.variable.detailData.advc_acnt_info.orgn_acnt_no_pt, '-', ''));
	}
	else{
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO04S01.variable.detailData.advc_acnt_info.chng_acnt_no_pt, '-', ''));
	}
	
	var inputParam = {};
	inputParam.msg = '계좌번호가 복사되었습니다.';
	inputParam.isUnder = false;
	gfn_toastMsgBox(inputParam);
}

// '이전 재실행' 클릭시
WAITPRO04S01.event.clickBtnRetryTrans = function(e) {
 	e.preventDefault();

	gfn_confirmMsgBox("계좌이전을 재실행 하시겠습니까?", '', function(returnData){
		if(returnData.result == 'Y'){

			WAITPRO04S01.location.modalClose();

			WAITPRO04S01.event.kbKeyPadInit();
			
			$('#msgPopup').show();
			$('#msgCase_pwd').show();
		}
	});
}


// 펀드상세 외부 링크 화면 호출 
WAITPRO04S01.event.goFundDetail = function(e) {
	e.preventDefault();
	
	var item = $(this).closest('li').data();
	
	var inputParam = {};
	inputParam.fund_no 		= item.prdt_cd;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
	
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO04S01.callBack = function(sid, result, success){

	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		gfn_historyBack();
		return;
	}
	
	// 월적립식 투자현황 계좌 상세정보 조회
	if(sid == "getMonPayAcntExecuteStatus"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				gfn_historyBack();
			});
			return;
		}
		
		WAITPRO04S01.variable.detailData = result;
		
		// WAITPRO04S01.variable.detailData.chng_acnt_nm = WAITPRO04S01.variable.initParamData.chng_acnt_nm;	// 이전 화면의 데이터를 이용한다.
		
		// 상세 셋팅 
		WAITPRO04S01.location.displayDetail();
		return;
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
			ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
		}
		
		
	}
}


// 네이티브 호출후 콜백함수 
WAITPRO04S01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// openbanking 3자동의
	if(key == 'ob3agree'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 오픈뱅킹 화면으로 이동
			ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
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


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO04S01.location.displayDetail = function(){
	var detailData = WAITPRO04S01.variable.detailData;
	var acntInfo = detailData.advc_acnt_info;
	
	// 추가적인 정보 셋팅
	$.extend(detailData, WAITPRO04S01.location.setInfoByStatus());
	
	// 메인 타이틀이 두개인 경우 
	if("|02|24|26|".indexOf(acntInfo.acnt_status) > -1){
		$('#view_mTitle_2').show();
	}
	else{
		$('#view_mTitle_2').hide();
	}
	
	// tooltip 보여주기 여부 
	if("|12|13|14|21|22|23|".indexOf(acntInfo.acnt_status) > -1){
		$('#pTotalAmtInfo').show();
		$('#btnTooltip').show();
	}
	else{
		$('#pTotalAmtInfo').hide();
		$('#btnTooltip').hide();
	}
	
	// 박스내 버튼 보여주기 설정
	if("|03|19|29|".indexOf(acntInfo.acnt_status) > -1){
		$('#btnTopBoxButton').hide();
	}
	else{
		$('#btnTopBoxButton').show();
	}
	
	// 중간 계좌번호 표시여부 설정 
	if("||".indexOf(acntInfo.acnt_status) > -1){
		$('#pAcntNoArea').hide();
	}
	else{
		$('#pAcntNoArea').show();
	}
	
	
	
	
	if(!ComUtil.isNull(acntInfo.advc_ptfl_prdt_list)){
		acntInfo.advc_ptfl_prdt_list_cnt = acntInfo.advc_ptfl_prdt_list.length;
	}
	/*else{
		// 제안 포트폴리오가 없으면 어떻게 하지?? 
		acntInfo.advc_ptfl_prdt_list_cnt = acntInfo.advc_ptfl_prdt_list.length;
	}*/
	
	
	acntInfo.acnt_type_nm 			= gfn_getAcntTypeNm(acntInfo.acnt_type);
	acntInfo.chng_acnt_no_pt 		= ComUtil.pettern.acntNo(acntInfo.chng_acnt_no + gfn_getAddAcntNoByCd(acntInfo.chng_kftc_agc_cd));

	
	// bank img
	$('#imgCompany').attr('src', gfn_getImgSrcByCd(acntInfo.chng_kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(acntInfo.chng_kftc_agc_cd, 'C'));
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	gfn_setDetails(acntInfo, $('#divAcntInfo'));
	gfn_setDetails(acntInfo, $('#divTab'));
	
	// chart
	WAITPRO04S01.location.displayChart();
	
	// 초기화
	$('#ulProdList').html('');
	if(acntInfo.advc_ptfl_prdt_list == null || acntInfo.advc_ptfl_prdt_list.length == 0){
		return;
	}
	
	var _template = $("#_dumyProdList").html();
	var template = Handlebars.compile(_template);
	
	
	$.each(acntInfo.advc_ptfl_prdt_list, function(index, item){
		item.idx = index + 1;
		
		var html = template(item);
		$('#ulProdList').append(html);
		
		$('#prodDetail_' + item.idx).data(item);
	});
	
}	


WAITPRO04S01.location.setInfoByStatus = function(){
	var detailData = WAITPRO04S01.variable.detailData;
	if(ComUtil.isNull(detailData.advc_acnt_info)){
		return;
	}
	
	var acntInfo = detailData.advc_acnt_info;
	
	//acntInfo.acnt_status = '19';
	//WAITPRO04S01.variable.detailData.advc_acnt_info.acnt_status = acntInfo.acnt_status;
	
	var addInfo = {};
	switch(acntInfo.acnt_status){
		case '02'	:
						addInfo.mTitle 		= "입금확인";
						addInfo.mTitle_2	= "매수주문 승인하기";
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '03'	:
						addInfo.mTitle 		= "상품 매수 진행중";
						addInfo.mBoxMsg		= "승인한 매수주문이 진행 중입니다.<br>완료까지 영업일 기준 2~3일 정도 걸립니다.";
						addInfo.mBtnTitle	= "";
			break; 
		case '05'	:
						addInfo.mTitle 		= "매수주문 실패";
						addInfo.mBoxMsg		= "정상적으로 처리되지 않았습니다.<br> 매수주문을 다시 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '12'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "입금이 완료되면 매수주문을 확인하는 내용이  안내 될 예정입니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break; 
		case '13'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "입금일이 많이 경과했습니다. <br>상기 금액을 입금하시기 바랍니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break; 
		case '14'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "현재 입금할 총 금액은 자문안의 월적립금과 미입금한 금액을 합산합니다. 초과납입한 경우 ‘0’으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break; 
		case '19'	: 
						addInfo.mTitle 		= "월적립 투자 완료";
						addInfo.mBoxMsg		= "월적립 투자 완료<br>투자완료일("+detailData.last_order_end_dt+")";
			break; 
		case '21'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "입금이 완료되면 매수주문을 확인하는 내용이  안내 될 예정입니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break;
		case '22'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "입금이 완료되면 매수주문을 확인하는 내용이  안내 될 예정입니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break;
		case '23'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.mBoxMsg		= "일반종합계좌는 자문안에 따라 입금해야 할 전체 금액 기준으로 현재 입금할 총 금액 표시합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 안내";
			break;
		case '24'	: 
						addInfo.mTitle 		= "입금완료";
						addInfo.mTitle_2	= "매수주문필요";
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '26'	: 
						addInfo.mTitle 		= "입금완료";
						addInfo.mTitle_2	= "매수주문필요";
						addInfo.mBoxMsg		= "해지후 입금 · 포트폴리오 매수가 일부만 실행되었습니다. 잔여분 실행을 위해서 주문을 승인해주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '29'	: 
						addInfo.mTitle 		= "자문안 실행완료";
						addInfo.mBoxMsg		= "투자 완료<br>투자완료일("+detailData.last_order_end_dt+")";
			break; 
	}
	
	return addInfo;
}

// order popup call
WAITPRO04S01.location.callOrderPopup = function(){
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
WAITPRO04S01.location.displayChart = function(){
	var detailData = WAITPRO04S01.variable.detailData;
	var acntInfo = detailData.advc_acnt_info;
	
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

	ppslData.datasets[0].data[0] = acntInfo.ppsl_stck_rate; // 제안주식비율
	ppslData.datasets[0].data[1] = acntInfo.ppsl_bond_rate; // 제안채권비율
	ppslData.datasets[0].data[2] = acntInfo.ppsl_cash_rate; // 제안현금비율
	

    var ctx3 = document.getElementById('ppslChar').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : ppslData,
        options : options3
    });
	
}


// 차트 그리기
// 차트 초기
WAITPRO04S01.location.initChart = function(){
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
WAITPRO04S01.event.clickBuyApproval = function () {
 /* history comment - 데이터 바인딩 등을 위한 추가 작업이 필요한지에 대해 허부장님께 문의를 드렸으나, 
	* 링크만 걸어 놓으라고 말씀 하셔서 팝업 링크만 걸어 둔 상태. 추가로 작업이 필요 한 경우
	* 해당 이벤트 때 데이터를 넘겨 parameter로 data를 넘기거나, 콜백(callbackFn)시 작업 처리 하면 될 듯. 
	* '내용 확인 후/작업 후' 해당 코멘트는 지워 주세요. */
	
	var sParam = {};
	sParam.url = '/pension_execution/order/ORDREXE01P01'

	// 매수주문 승인하기 팝업호출
	gfn_callPopup(sParam, function(){
	});
}

// modal popup close
WAITPRO04S01.location.modalClose = function(){
    $('#msgCase_acnt_transfer').hide();
}

WAITPRO04S01.init();
