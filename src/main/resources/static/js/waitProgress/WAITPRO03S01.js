/**
* 파일명 		: WAITPRO03S01.js
* 업무		: 월 적립식 투자 현황 화면(W-03-01)
* 설명		: 월 적립식 투자 현황
* 작성자		: 배수한
* 최초 작성일자	: 2021.08.04
* 수정일/내용	: 
*/
var WAITPRO03S01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO03S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
	,bKeypad		: false								// 키패드 사용가능여부
}

/* 이벤트 정의 */
WAITPRO03S01.events = {
	 'click a[id^="btnAdviceDetail_"]'						: 'WAITPRO03S01.event.clickBtnAdviceDetail'		// 자문안보기 버튼 클릭시
	,'click i[id^="btnTooltip_"]'							: 'WAITPRO03S01.event.clickBtnTooltip'			// 계좌 툴팁 아이콘 클릭시
	,'click div[id^="tootip_"]'								: 'WAITPRO03S01.event.clickTooltip'				// 툴팁 클릭시
	,'click button[id^="btnBox_"]'							: 'WAITPRO03S01.event.clickBtnBox'				// 박스네 버튼 클릭시
}

WAITPRO03S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO03S01');
	
	//$("#pTitle").text("자문안 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-03-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO03S01.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO03S01.location.pageInit = function() {
	
	// 월적립식 투자 상세 조회
	WAITPRO03S01.tran.selectDetail();
	
	
}

////////////////////////////////////////////////////////////////////////////////////
// 거래
// 월적립식 투자 상세 조회 
WAITPRO03S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getMonPayExecuteList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/get_mon_pay_execute_list";
	inputParam.data 	= WAITPRO03S01.variable.sendData;
	inputParam.callback	= WAITPRO03S01.callBack;
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 자문안보기 버튼 클릭시
WAITPRO03S01.event.clickBtnAdviceDetail = function(e) {
 	e.preventDefault();

	var idx = $(this).data('idx');
	var data = $('#acntDetail_' + idx).data();
	
	sStorage.setItem("WAITPRO04S01Params", data);

	var url = "/wait_progress/WAITPRO04S01";
	ComUtil.moveLink(url);
}


// 계좌 툴팁 아이콘 클릭시
WAITPRO03S01.event.clickBtnTooltip = function(e) {
 	e.preventDefault();
	
	var idx = $(this).data('idx');
	//var data = $('#acntDetail_' + idx).data();
	$(`#tootip_`+idx).toggleClass('show');
}

// 툴팁 클릭시
WAITPRO03S01.event.clickTooltip = function(e) {
 	e.preventDefault();

	$(this).removeClass('show');
}

// 툴팁 클릭시
WAITPRO03S01.event.clickBtnBox = function(e) {
 	e.preventDefault();

	var idx = $(this).data('idx');
	var data = $('#acntDetail_' + idx).data();
	
	if("|12|13|14|21|22|23|".indexOf(data.acnt_status) > -1){
		// 입금계좌번호 복사
		ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(data.acnt_no_pt, '-', ''));
		var inputParam = {};
		inputParam.msg = '계좌번호가 복사되었습니다.';
		inputParam.isUnder = true;
		gfn_toastMsgBox(inputParam);
	}
	else if("|02|05|24|".indexOf(data.acnt_status) > -1){
		// 매수주문 승인하기
		var sParam = {};
		sParam.url = '/pension_execution/order/ORDREXE01P01';
		gfn_callPopup(sParam, function(){});
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO03S01.callBack = function(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		gfn_historyBack();
		return;
	}
	
	// 월적립식 투자 상세 조회
	if(sid == "getMonPayExecuteList"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				gfn_historyBack();
			});
			return;
		}
		
		WAITPRO03S01.variable.detailData = result;
		// advc_exe_status ( 1 : 실행중 / 2 :실행완료 )
		WAITPRO03S01.variable.detailData.advc_exe_status_msg = (result.advc_exe_status == '1' ? "실행중" : "실행완료");
		
		// 상세 셋팅 
		WAITPRO03S01.location.displayDetail();
		return;
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO03S01.location.displayDetail = function(){
	var detailData = WAITPRO03S01.variable.detailData;
	
	
	// 초기화
	$("#divInvestList").html('');
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.mon_invt_list, function(index, item){
		item.idx = index + 1;
		
		//item.acnt_status = '12';
		// 계좌번호 패턴 추가
		item.acnt_no_pt = ComUtil.pettern.acntNo(item.acnt_no + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		
		// 추가적인 정보 셋팅
		$.extend(item, WAITPRO03S01.location.setInfoByStatus(item));
		
		var html = template(item);
		$("#divInvestList").append(html);
		$('#acntDetail_' + item.idx).data(item);
	});

	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
}



/*이미지 주소 참조
bank_circle_logo (= 동그란 컬러로고) + 000 (=  은행/증권/보험사 번호).png
bank_circle_logo_gray (= 동그란 회색로고) + 000 (=  은행/증권/보험사 번호).png

bank_circle_logo/order.png = 매수주문
bank_circle_logo/deposit.png = 입금
bank_circle_logo/stock.png = 증권
bank_circle_logo/complete.png = 완료 
*/
WAITPRO03S01.location.setInfoByStatus = function(itemInfo){
	var addInfo = {};
	switch(itemInfo.acnt_status){
		case '02'	:
						addInfo.mTitle 		= "매수주문";
						addInfo.beforeImg 	= "order.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'G');
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '03'	:
						//addInfo.mTitle 		= "매수주문";  이거 같은데... ㅡㅡ;;
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "승인한 매수주문이 진행 중입니다.<br>완료까지 영업일 기준 2~3일 정도 걸립니다.";
			break; 
		case '05'	:
						addInfo.mTitle 		= "매수주문";
						addInfo.beforeImg 	= "order.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "정상적으로 처리되지 않았습니다.<br> 매수주문을 다시 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break; 
		case '12'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "현재 입금할 총 금액은 자문안의 월적립금과 미입금한 금액을 합산합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break; 
		case '13'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "입금일이 많이 경과했습니다. <br>상기 금액을 입금하시기 바랍니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break; 
		case '14'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "현재 입금할 총 금액은 자문안의 월적립금과 미입금한 금액을 합산합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break; 
		case '19'	: 
						//addInfo.mTitle 		= "투자완료";
						//addInfo.beforeImg 	= "complete.png";
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "월적립 투자완료";
			break; 
		case '21'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "일반종합계좌는 자문안에 따라 입금해야 할 전체 금액 기준으로 현재 입금할 총 금액 표시합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break;
		case '22'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "입금일이 많이 경과했습니다. <br>상기 금액을 입금하시기 바랍니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break;
		case '23'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "일반종합계좌는 자문안에 따라 입금해야 할 전체 금액 기준으로 현재 입금할 총 금액 표시합니다. 초과납입한 경우 '0'으로 표시될 수 있습니다.";
						addInfo.mBtnTitle	= "입금 계좌번호 복사";
			break;
		case '24'	: 
						addInfo.mTitle 		= "매수주문";
						addInfo.beforeImg 	= "order.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'G');
						addInfo.mBoxMsg		= "입금완료·매수주문 승인 전입니다. <br>매수주문을 승인해 주세요.";
						addInfo.mBtnTitle	= "매수주문 승인하기";
			break;
		case '29'	: 
						addInfo.mTitle 		= "입금하기";
						addInfo.beforeImg 	= "deposit.png";
						addInfo.afterImgSrc = gfn_getImgSrcByCd(itemInfo.kftc_agc_cd, 'C');
						addInfo.mBoxMsg		= "투자완료";
			break; 
	}
	
	return addInfo;
}



WAITPRO03S01.init();
