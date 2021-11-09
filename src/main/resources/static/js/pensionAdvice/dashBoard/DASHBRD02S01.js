/**
* 파일명 		: DASHBRD02S01.js (pension-D-02)
* 업무		: 연금자문 대시보드 > 상세보기
* 설명		: 내연금 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var DASHBRD02S01 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD02S01.variable = {
	sendData		: {}							
	,detailData		: {
						currentSlide	:	'1'		// 첫화면 슬라이드 번호
					  }								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	,headType		: 'dash'							// 해더영역 디자인
}

/* 이벤트 정의 */
DASHBRD02S01.events = {
	// 'click #btnNext'		 							: 'DASHBRD02S01.event.clickBtnNext'
	'click a[id^="btnPopup_"], button[id^="btnPopup_"]'	: 'DASHBRD02S01.event.clickPopup'
	,'click #btnAdviceService'							: 'DASHBRD02S01.event.clickBtnAdviceService'
	,'change input[id^="myAnnM_"]'						: 'DASHBRD02S01.event.changeMyAnn'
	,'click #btnClosepopD0201'							: 'DASHBRD02S01.event.clickBtnClosepopD0201'
}

DASHBRD02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD02S01');
	
	$("#pTitle").text("투자성향분석");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-02";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD02S01.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD02S01.location.pageInit = function() {
	$('.pension_slide').not('.slick-initialized').slick({
        infinite: false,
        dots: true,
        arrows: true,
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 1,
        adaptiveHeight: true,
        pauseOnFocus: false
    });


	//슬라이드 높이
    var windowHeight = $(window).height();
    var tabScroll = windowHeight - 145;
    $('.mf_item>.box_r').height(tabScroll);

	$('.pension_slide').on('afterChange', function(event, slick, currentSlide, nextSlide){
		currentSlide++;
		DASHBRD02S01.variable.detailData.currentSlide = currentSlide;
		DASHBRD02S01.location.numberEffect();
		DASHBRD02S01.location.displayProgress();
		DASHBRD02S01.location.enterScreen();	// 애드브릭스 이벤트 전달 (슬라이드 시.)
    });

    // 차트 영역 셋팅
	DASHBRD02S01.location.initChart();

	// 초기조회
	DASHBRD02S01.tran.selectDetail();
	
	$('#f-content').show();
	
	
	/*
	$(document).off("click",  $('ul[role]').children()).on("click", $('ul[role]').children(),function(e,item){
		
		setTimeout(function(){
			//debugger;
		    $.each( $('ul[role]').children(), function(index, item){
				//$(item).blur();
				$(item).mouseout();
			});
		}, 10);
	});
	*/
}



////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD02S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myPensionDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/my_pension_all_info";
	//inputParam.url 		= "/pension/my_pension_detail";
	inputParam.data 	= DASHBRD02S01.variable.sendData;
	inputParam.callback	= DASHBRD02S01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 투자성향분석 완료 및 투자자문계약 정보 조회한다 (INVPROP03S01 있던것 화면이 없어져서 이리로 이동) 
DASHBRD02S01.tran.selectInvestPropensity = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectInvestPropensity";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/select_invest_propensity";
	inputParam.data 	= {};
	inputParam.callback	= DASHBRD02S01.callBack; 
	
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// popup 호출
DASHBRD02S01.event.clickPopup = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
	var url = "";
	var sParam = {};
	
	switch(link){
		case 'myPension'	:	url = "/pension_advice/dashBoard/DASHBRD02P02";		// 내연금 상세보기
								sParam.type = 'ani';
			break;
		case 'mufflerAdvice':	url = "/pension_advice/dashBoard/DASHBRD07P02";		// 머플러 월평균 예상수령액 상세보기
								sParam.type = 'ani';
			break;
		case 'mufflerPlan'  :	url = "/pension_advice/dashBoard/DASHBRD08P02";		// 머플러플랜 상세보기
								sParam.type = 'ani';
			break;
		case 'mufflerDetail'  :	url = "/pension_advice/dashBoard/DASHBRD08P07";		// 머플러로보자문 상세보기
								sParam.type = 'ani';
			break;
		default 			: 
			break;
	}
	
	sParam.url = url;
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}

// 자문계약 진행 화면으로 이동
DASHBRD02S01.event.clickBtnAdviceService = function(e) {
	e.preventDefault();
	
	// app 버젼 체크후 구버젼이면 더이상 진행 못하게 함
	/*if(gfn_isMobile()){
		if(!gfn_checkAppVersion()){
			$('#popD0201').show();
			//gfn_alertMsgBox('현재 마이머플러 서비스는 고객님의 연금자산 현황 및 마이머플러 자문안에 따른 결과보기 서비스만 제공됩니다.<br> 추가적인 ', '', function(){});
			return;
		}
	}*/
	
	
	//if(!gfn_isOper()){
		//ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP03S01', true);
		DASHBRD02S01.tran.selectInvestPropensity();
	//}
	//else{
		//$('#popD0201').show();
		//gfn_alertMsgBox('현재 마이머플러 서비스는 고객님의 연금자산 현황 및 마이머플러 자문안에 따른 결과보기 서비스만 제공됩니다. 워스톱서비스를 위한 제휴사 연결이 마무리되는대로 전체 서비스를 제공할 예정입니다.', '', function(){});
	//}
}



// 국민연금 선택 여부
DASHBRD02S01.event.changeMyAnn = function(e) {
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	var detailData = DASHBRD02S01.variable.detailData;
	// 모두 같은 값으로 변경
	//$('input[id^="myAnnM_"]').attr('checked', $(this).is(':checked'));
	
	var bMyAnn	= $(this).is(':checked'); 
	
	if(bMyAnn){	// 국민연금포함
		$('[id^=viewTot_]', $(this).closest(".mf_item")).show();
		$('[id^=view_]', $(this).closest(".mf_item")).hide();
	}
	else{
		$('[id^=viewTot_]', $(this).closest(".mf_item")).hide();
		$('[id^=view_]', $(this).closest(".mf_item")).show();
	}
	
	if(ComUtil.isNull(DASHBRD02S01.variable.detailData)){
		return;
	}
	
	
	
	DASHBRD02S01.location.numberEffect();
	
	DASHBRD02S01.location.displayProgress();

	DASHBRD02S01.location.printChart();
}

// 임시 팝업창 닫기 
DASHBRD02S01.event.clickBtnClosepopD0201 = function(e) {
	e.preventDefault();
	
	$('#popD0201').hide();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		return;
	}
	
	// 연금자문 대시보드 화면 초기 조회
	if(sid == "myPensionDetail"){
		
		DASHBRD02S01.variable.detailData = $.extend(DASHBRD02S01.variable.detailData, result);
		var detailData = DASHBRD02S01.variable.detailData;
		
		// 복호화
		DASHBRD02S01.variable.detailData.user_nm = JsEncrptObject.decrypt(DASHBRD02S01.variable.detailData.user_nm);
		
		// 국민연금 포함값 셋팅
		$('#my_tot_pnsn_dis').data('ori', detailData.my_tot_pnsn_dis);
		$('#my_expt_tot_pnsn_dis').data('ori', detailData.my_expt_tot_pnsn_dis);
		$('#crnt_tot_retr_rdy_dis').data('ori', detailData.crnt_tot_retr_rdy_dis);
		$('#crnt_tot_mon_recv_dis').data('ori', detailData.crnt_tot_mon_recv_dis);
		$('#ppsl_tot_expt_mon_recv_dis').data('ori', detailData.ppsl_tot_expt_mon_recv_dis);
		
		// 국민연금 미포함값 셋팅
		$('#my_pnsn_dis').data('ori', detailData.my_pnsn_dis);
		$('#my_expt_pnsn_dis').data('ori', detailData.my_expt_pnsn_dis);
		$('#crnt_retr_rdy_dis').data('ori', detailData.crnt_retr_rdy_dis);
		$('#crnt_mon_recv_dis').data('ori', detailData.crnt_mon_recv_dis);
		$('#ppsl_expt_mon_recv_dis').data('ori', detailData.ppsl_expt_mon_recv_dis);
		
		
		// 예상수령액(현재 월) 계산 s
		// 국민연금 포함값 셋팅
		DASHBRD02S01.location.calCurMon();
		$('#rateMonNpsTot').width(detailData.ntnl_tot_pnsn_recv_rate+'%');		// 국민연금 
		$('#rateMonRetrTot').width(detailData.retr_tot_pnsn_recv_rate+'%');		// 퇴직연금 
		$('#rateMonCrntTot').width(detailData.crnt_tot_mon_recv_rate+'%');		// 개인연금 = 현재 
		$('#rateMonFitTot').width(detailData.fit_tot_mon_recv_rate+'%');		// 적정 
		$('#rateMonSafeTot').width(detailData.safe_tot_mon_recv_rate+'%');		// 안정
		
		// 국민연금 미포함값 셋팅
		//$('#rateMonNps').width('0%');	// 국민연금 
		$('#rateMonRetr').width(detailData.retr_pnsn_recv_rate+'%');	// 퇴직연금 
		$('#rateMonCrnt').width(detailData.crnt_mon_recv_rate+'%');		// 개인연금 = 현재 
		$('#rateMonFit').width(detailData.fit_mon_recv_rate+'%');		// 적정 
		$('#rateMonSafe').width(detailData.safe_mon_recv_rate+'%');		// 안정
		
		$('#rateMonNpsTot').hide();
		// 예상수령액(현재 월) 계산 e
		
		
		
		// 연금준비율 s
		// 국민연금포함
		if(parseInt(detailData.crnt_tot_retr_rdy_rate) >= 100){
			$('#rateSafeTot').hide();
			$('#rateFitTot').hide(); 
			$('#rateCrntTot').width('100%');
		}
		else{
			$('#rateSafeTot').width(detailData.safe_retr_rdy_dis + detailData.safe_retr_rdy_unit); 
			$('#rateFitTot').width(detailData.fit_retr_rdy_dis + detailData.fit_retr_rdy_unit); 
			$('#rateCrntTot').width(detailData.crnt_tot_retr_rdy_dis + detailData.crnt_tot_retr_rdy_unit);
		}
		
		// 국민연금미포함
		if(parseInt(detailData.crnt_retr_rdy_rate) >= 100){
			$('#rateSafeTot').hide();
			$('#rateFitTot').hide(); 
			$('#rateCrnt').width('100%');
		}
		else{
			$('#rateSafeTot').width(detailData.safe_retr_rdy_dis + detailData.safe_retr_rdy_unit); 
			$('#rateFitTot').width(detailData.fit_retr_rdy_dis + detailData.fit_retr_rdy_unit); 
			$('#rateCrnt').width(detailData.crnt_retr_rdy_dis + detailData.crnt_retr_rdy_unit);
		}
		// 연금준비율 e
		
		
		// 예상수령액(머플러 월) 계산 s
		DASHBRD02S01.location.calExptMon();
		// 국민연금포함
		$('#rateExptMonNpsTot').width(detailData.ntnl_expt_pnsn_recv_rate+'%');			// 국민연금 
		$('#rateExptMonRetrTot').width(detailData.retr_tot_expt_pnsn_recv_rate+'%');	// 퇴직연금 
		$('#rateExptMonCrntTot').width(detailData.crnt_tot_expt_mon_recv_rate+'%');		// 개인연금 = 현재 
		$('#rateExptMonFitTot').width(detailData.fit_tot_expt_mon_recv_rate+'%');		// 적정 
		$('#rateExptMonSafeTot').width(detailData.safe_tot_expt_mon_recv_rate+'%');		// 안정
		$('#rateExptMonMufflerTot').width(detailData.ppsl_tot_expt_mon_recv_rate+'%');	// 머플러
		
		// 국민연금미포함
		//$('#rateExptMonNps').width(detailData.ntnl_expt_pnsn_recv_rate+'%');	// 국민연금 
		$('#rateExptMonRetr').width(detailData.retr_expt_pnsn_recv_rate+'%');	// 퇴직연금 
		$('#rateExptMonCrnt').width(detailData.crnt_expt_mon_recv_rate+'%');	// 개인연금 = 현재 
		$('#rateExptMonFit').width(detailData.fit_expt_mon_recv_rate+'%');		// 적정 
		$('#rateExptMonSafe').width(detailData.safe_expt_mon_recv_rate+'%');	// 안정
		$('#rateExptMonMuffler').width(detailData.ppsl_expt_mon_recv_rate+'%');	// 머플러
		// 예상수령액(머플러 월) 계산 e
		
		
		
		//연평균수익률에 따른 이미지 교체 s
		if(detailData.year_avrg_rvnu_rate > 1.5) {
			$("#myPensionImg").attr("src", "/images/up_img.svg");
		} else if(detailData.year_avrg_rvnu_rate < -1.5) {
			$("#myPensionImg").attr("src", "/images/down_img.svg");
		} else {
			$("#myPensionImg").attr("src", "/images/keep_img.svg");
		}
		$("#myPensionImg").show();
		//연평균수익률에 따른 이미지 교체 e
		
		// 머플러제안 s
		DASHBRD02S01.location.setArrowUpDown($('#year_avrg_rvnu_idcrs_dis'), 	'rate');	// 연평균기대수익율
		DASHBRD02S01.location.setArrowUpDown($('#my_expt_tot_pnsn_idcrs_dis'), 	'rate');	// 모을수있는연금증감률
		DASHBRD02S01.location.setArrowUpDown($('#pnsn_rdy_idcrs_dis'), 			'rate');	// 연금준비증감률
		// 머플러제안 e
		
		
		// 숫자 또르르 s
		DASHBRD02S01.location.numberEffect();
		// 숫자 또르르 e
		
		DASHBRD02S01.location.displayProgressInit();
		
		
		// 상세내역 셋팅
		gfn_setDetails(DASHBRD02S01.variable.detailData, $('#f-content'));
	
		DASHBRD02S01.location.printChart();
		
		// 국민연금 선택별 화면 초기화 
		$.each($('input[id^="myAnnM_"]'), function(index){
			var bMyAnn	= $(this).is(':checked');
			if(bMyAnn){	// 국민연금포함
				$('[id^=viewTot_]', $(this).closest(".mf_item")).show();
				$('[id^=view_]', $(this).closest(".mf_item")).hide();
			}
			else{
				$('[id^=viewTot_]', $(this).closest(".mf_item")).hide();
				$('[id^=view_]', $(this).closest(".mf_item")).show();
			}
		});
		
		
		// 숨김처리된 패널 살리기
		$.each($('.mf_item'), function(index, item){
			//if($(this).data('load') == 'Y'){
			//	return;
			//}
			
			$(this).show();
		});
	}
	
	// 투자성향 조회
	if(sid == "selectInvestPropensity"){
		DASHBRD02S01.variable.detailData = result;
		
		// 화면내 이동
		DASHBRD02S01.location.callNextPage();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 숫자 또르르
DASHBRD02S01.location.numberEffect = function(){
	
	var currentSlide = DASHBRD02S01.variable.detailData.currentSlide;
	var bMyAnn = $('input[id^="myAnnM_"]', $('#slick-slide0'+(currentSlide-1))).is(":checked");
	
	if(bMyAnn){	// 국민연금포함
		if(currentSlide == '1'){
			ComUtil.number.setDigitCount('#my_tot_pnsn_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('my_tot_pnsn_dis');
		}
		/*else if(currentSlide == '2'){
			ComUtil.number.setDigitCount('#my_expt_tot_pnsn_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('my_expt_tot_pnsn_dis');
		}*/
		else if(currentSlide == '2'){
			ComUtil.number.setDigitCount('#crnt_tot_mon_recv_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('crnt_tot_mon_recv_dis');
		}
		else if(currentSlide == '3'){
			ComUtil.number.setDigitCount('#crnt_tot_retr_rdy_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('crnt_tot_retr_rdy_dis');
		}
		else if(currentSlide == '4'){
			DASHBRD02S01.location.resetTitleNum('ppsl_tot_expt_mon_recv_dis');
		}
		else if(currentSlide == '5'){
			ComUtil.number.setDigitCount('#ppsl_tot_expt_mon_recv_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('ppsl_tot_expt_mon_recv_dis');
		}
		else if(currentSlide == '6'){
			DASHBRD02S01.location.resetTitleNum('');
		}
		else{
			DASHBRD02S01.location.resetTitleNum('');
		}
	}
	else{
		if(currentSlide == '1'){
			ComUtil.number.setDigitCount('#my_pnsn_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('my_pnsn_dis');
		}
		/*else if(currentSlide == '2'){
			ComUtil.number.setDigitCount('#my_expt_pnsn_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('my_expt_pnsn_dis');
		}*/
		else if(currentSlide == '2'){
			ComUtil.number.setDigitCount('#crnt_mon_recv_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('crnt_mon_recv_dis');
		}
		else if(currentSlide == '3'){
			ComUtil.number.setDigitCount('#crnt_retr_rdy_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('crnt_retr_rdy_dis');
		}
		else if(currentSlide == '4'){
			ComUtil.number.setDigitCount('#crnt_retr_rdy_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('crnt_retr_rdy_dis');
		}
		else if(currentSlide == '5'){
			ComUtil.number.setDigitCount('#ppsl_expt_mon_recv_dis', 200, 1200);
			DASHBRD02S01.location.resetTitleNum('ppsl_expt_mon_recv_dis');
		}
		else if(currentSlide == '6'){
			DASHBRD02S01.location.resetTitleNum('');
		}
		else{
			DASHBRD02S01.location.resetTitleNum('');
		}
	}
}

// 프로그래스바 셋팅전 초기화
DASHBRD02S01.location.displayProgressInit = function(){
	DASHBRD02S01.location.displayProgress({currentSlide:'2', bMyAnn:false});		// 은퇴후 월평균 수령액
	DASHBRD02S01.location.displayProgress({currentSlide:'3', bMyAnn:false});
	DASHBRD02S01.location.displayProgress({currentSlide:'5', bMyAnn:false});
}
// 프로그래스바 셋팅
DASHBRD02S01.location.displayProgress = function(sParam){
	
	var detailData = DASHBRD02S01.variable.detailData;
	var currentSlide = DASHBRD02S01.variable.detailData.currentSlide;
	var bMyAnn = $('input[id^="myAnnM_"]', $('#slick-slide0'+(currentSlide-1))).is(":checked");
	
	sParam = ComUtil.null(sParam, {});
	if(!ComUtil.isNull(sParam.currentSlide)){
		currentSlide = sParam.currentSlide;
	}
	if(!ComUtil.isNull(sParam.bMyAnn)){
		bMyAnn = sParam.bMyAnn;
	}
	
	
	if(bMyAnn){	// 국민연금포함
		if(currentSlide == '1'){
		}
		else if(currentSlide == '2'){
			$('#rateMonNpsTot').show();
			$('#rateMonNpsTot').width(detailData.ntnl_tot_pnsn_recv_rate+'%');		// 국민연금
			$('#diagramRateMonRetr').width(detailData.retr_tot_pnsn_recv_rate + '%');		// 퇴직연금
			$('#diagramRateMonCrnt').width(detailData.crnt_tot_mon_recv_rate + '%');		// 현재
			$('#diagramRateMonCrntTri').width(detailData.crnt_tot_mon_recv_rate + '%');		// 현재 막대기
			$('#diagramRateMonFitTot').width(detailData.fit_tot_mon_recv_rate + '%');		// 적정
			$('#diagramRateMonSafeTot').width(detailData.safe_tot_mon_recv_rate + '%');		// 안정
			$('#diagram_crnt_mon_recv_amt').html(detailData.crnt_tot_mon_recv_dis + detailData.crnt_tot_mon_recv_unit);
			
			// 세모셋팅
			if(detailData.crnt_tot_mon_recv_rate < 15){
				$('#diagramRateMonCrntTri').addClass('under');
				$('#diagramRateMonCrntTri').removeClass('over');
			}
			else if(detailData.crnt_tot_mon_recv_rate > 85){
				$('#diagramRateMonCrntTri').removeClass('under');
				$('#diagramRateMonCrntTri').addClass('over');
			}
			else{
				$('#diagramRateMonCrntTri').removeClass('under');
				$('#diagramRateMonCrntTri').removeClass('over');
			}
		}
		else if(currentSlide == '3'){
			if(detailData.crnt_tot_retr_rdy_dis > 100){
				$('#rateSafeTot').hide();
				$('#rateFitTot').hide();
				$('#diagramRateCrnt').width('100' + detailData.crnt_tot_retr_rdy_unit);
				$('#diagramRateCrntTri').width('100' + detailData.crnt_tot_retr_rdy_unit);
			}
			else{
				$('#rateSafeTot').show();
				$('#rateFitTot').show();
				$('#diagramRateCrnt').width(detailData.crnt_tot_retr_rdy_dis + detailData.crnt_tot_retr_rdy_unit);
				$('#diagramRateCrntTri').width(detailData.crnt_tot_retr_rdy_dis + detailData.crnt_tot_retr_rdy_unit);
			}
			$('#diagram_crnt_retr_rdy_rate').html(detailData.crnt_tot_retr_rdy_dis + detailData.crnt_tot_retr_rdy_unit);
			
			// 세모셋팅
			if(detailData.crnt_tot_retr_rdy_dis < 15){
				$('#diagramRateCrntTri').addClass('under');
				$('#diagramRateCrntTri').removeClass('over');
			}
			else if(detailData.crnt_tot_retr_rdy_dis > 85){
				$('#diagramRateCrntTri').removeClass('under');
				$('#diagramRateCrntTri').addClass('over');
			}
			else{
				$('#diagramRateCrntTri').removeClass('under');
				$('#diagramRateCrntTri').removeClass('over');
			}
			
			$('#crnt_pnsn_msg_txt').html(detailData.crnt_pnsn_tot_msg);		// 연금준비율 가이드
			
		}
		else if(currentSlide == '4'){
		}
		else if(currentSlide == '5'){
			$('#diagramRateExptMonNpsTot').show();
			$('#diagramRateExptMonNpsTot').width(detailData.ntnl_tot_expt_pnsn_recv_rate + '%');
			$('#diagramRateExptMonRetr').width(detailData.retr_tot_expt_pnsn_recv_rate + '%');
			$('#diagramRateExptMonCrnt').width(detailData.crnt_tot_expt_mon_recv_rate + '%');
			$('#diagramRateExptMonCrntTri').width(detailData.crnt_tot_expt_mon_recv_rate + '%');
			$('#diagram_crnt_tot_mon_recv_dis').html(detailData.crnt_tot_mon_recv_dis + detailData.crnt_tot_mon_recv_unit);
			$('#diagramRateExptMonMuffler').width(detailData.ppsl_tot_expt_mon_recv_rate + '%');
			$('#diagramRateExptMonMufflerTri').width(detailData.ppsl_tot_expt_mon_recv_rate + '%');
			$('#diagram_ppsl_tot_expt_mon_recv_dis').html(detailData.ppsl_tot_expt_mon_recv_dis + detailData.ppsl_tot_expt_mon_recv_unit);
			
			// 세모셋팅
			if(detailData.crnt_tot_expt_mon_recv_rate < 15){
				$('#diagramRateExptMonCrntTri').addClass('under');
				$('#diagramRateExptMonCrntTri').removeClass('over');
			}
			else if(detailData.crnt_tot_expt_mon_recv_rate > 85){
				$('#diagramRateExptMonCrntTri').removeClass('under');
				$('#diagramRateExptMonCrntTri').addClass('over');
			}
			else{
				$('#diagramRateExptMonCrntTri').removeClass('under');
				$('#diagramRateExptMonCrntTri').removeClass('over');
			}
			
			if(detailData.ppsl_tot_expt_mon_recv_rate < 15){
				$('#diagramRateExptMonMufflerTri').addClass('under');
				$('#diagramRateExptMonMufflerTri').removeClass('over');
			}
			else if(detailData.ppsl_tot_expt_mon_recv_rate > 85){
				$('#diagramRateExptMonMufflerTri').removeClass('under');
				$('#diagramRateExptMonMufflerTri').addClass('over');
			}
			else{
				$('#diagramRateExptMonMufflerTri').removeClass('under');
				$('#diagramRateExptMonMufflerTri').removeClass('over');
			}
		}
		else if(currentSlide == '6'){
		}
		else{
		}
	}
	else{
		if(currentSlide == '1'){
		}
		else if(currentSlide == '2'){
			$('#rateMonNpsTot').width('0%');		// 국민연금
			$('#rateMonNpsTot').hide();
			$('#diagramRateMonRetr').width(detailData.retr_pnsn_recv_rate + '%');	// 퇴직연금
			$('#diagramRateMonCrnt').width(detailData.crnt_mon_recv_rate + '%');		// 현재
			$('#diagramRateMonCrntTri').width(detailData.crnt_mon_recv_rate + '%');		// 현재 막대기
			$('#diagramRateMonFitTot').width(detailData.fit_mon_recv_rate + '%');		// 적정
			$('#diagramRateMonSafeTot').width(detailData.safe_mon_recv_rate + '%');		// 안정
			$('#diagram_crnt_mon_recv_amt').html(detailData.crnt_mon_recv_dis + detailData.crnt_mon_recv_unit);
			
			// 세모셋팅
			if(detailData.crnt_mon_recv_rate < 15){
				$('#diagramRateMonCrntTri').addClass('under');
				$('#diagramRateMonCrntTri').removeClass('over');
			}
			else if(detailData.crnt_mon_recv_rate > 85){
				$('#diagramRateMonCrntTri').removeClass('under');
				$('#diagramRateMonCrntTri').addClass('over');
			}
			else{
				$('#diagramRateMonCrntTri').removeClass('under');
				$('#diagramRateMonCrntTri').removeClass('over');
			}
		}
		else if(currentSlide == '3'){
			if(detailData.crnt_retr_rdy_dis > 100){
				$('#rateSafeTot').hide();
				$('#rateFitTot').hide();
				$('#diagramRateCrnt').width('100' + detailData.crnt_retr_rdy_unit);
				$('#diagramRateCrntTri').width('100' + detailData.crnt_retr_rdy_unit);
			}
			else{
				$('#rateSafeTot').show();
				$('#rateFitTot').show();
				$('#diagramRateCrnt').width(detailData.crnt_retr_rdy_dis + detailData.crnt_retr_rdy_unit);
				$('#diagramRateCrntTri').width(detailData.crnt_retr_rdy_dis + detailData.crnt_retr_rdy_unit);
			}
			$('#diagram_crnt_retr_rdy_rate').html(detailData.crnt_retr_rdy_dis + detailData.crnt_retr_rdy_unit);
			
			// 세모셋팅
			if(detailData.crnt_retr_rdy_dis < 15){
				$('#diagramRateCrntTri').addClass('under');
				$('#diagramRateCrntTri').removeClass('over');
			}
			else if(detailData.crnt_retr_rdy_dis > 85){
				$('#diagramRateCrntTri').removeClass('under');
				$('#diagramRateCrntTri').addClass('over');
			}
			else{
				$('#diagramRateCrntTri').removeClass('under');
				$('#diagramRateCrntTri').removeClass('over');
			}
			
			$('#crnt_pnsn_msg_txt').html(detailData.crnt_pnsn_msg);		// 연금준비율 가이드
		}
		else if(currentSlide == '4'){
		}
		else if(currentSlide == '5'){
			$('#diagramRateExptMonNpsTot').hide();
			$('#diagramRateExptMonNpsTot').width('0%');
			$('#diagramRateExptMonRetr').width(detailData.retr_expt_pnsn_recv_rate + '%');
			$('#diagramRateExptMonCrnt').width(detailData.crnt_expt_mon_recv_rate + '%');
			$('#diagramRateExptMonCrntTri').width(detailData.crnt_expt_mon_recv_rate + '%');
			$('#diagram_crnt_tot_mon_recv_dis').html(detailData.crnt_mon_recv_dis + detailData.crnt_mon_recv_unit);
			$('#diagramRateExptMonMuffler').width(detailData.ppsl_expt_mon_recv_rate + '%');
			$('#diagramRateExptMonMufflerTri').width(detailData.ppsl_expt_mon_recv_rate + '%');
			$('#diagram_ppsl_tot_expt_mon_recv_dis').html(detailData.ppsl_expt_mon_recv_dis + detailData.ppsl_expt_mon_recv_unit);
			
			// 세모셋팅
			if(detailData.crnt_expt_mon_recv_rate < 15){
				$('#diagramRateExptMonCrntTri').addClass('under');
				$('#diagramRateExptMonCrntTri').removeClass('over');
			}
			else if(detailData.crnt_expt_mon_recv_rate > 85){
				$('#diagramRateExptMonCrntTri').removeClass('under');
				$('#diagramRateExptMonCrntTri').addClass('over');
			}
			else{
				$('#diagramRateExptMonCrntTri').removeClass('under');
				$('#diagramRateExptMonCrntTri').removeClass('over');
			}
			
			if(detailData.ppsl_expt_mon_recv_rate < 15){
				$('#diagramRateExptMonMufflerTri').addClass('under');
				$('#diagramRateExptMonMufflerTri').removeClass('over');
			}
			else if(detailData.ppsl_expt_mon_recv_rate > 85){
				$('#diagramRateExptMonMufflerTri').removeClass('under');
				$('#diagramRateExptMonMufflerTri').addClass('over');
			}
			else{
				$('#diagramRateExptMonMufflerTri').removeClass('under');
				$('#diagramRateExptMonMufflerTri').removeClass('over');
			}
		}
		else if(currentSlide == '6'){
		}
		else{
		}
	}
			
}

DASHBRD02S01.location.resetTitleNum = function(exceptId){
	if(exceptId != 'my_tot_pnsn_dis'){$('#my_tot_pnsn_dis').text("0");}
	if(exceptId != 'my_expt_tot_pnsn_dis'){$('#my_expt_tot_pnsn_dis').text("0");}
	if(exceptId != 'crnt_tot_retr_rdy_dis'){$('#crnt_tot_retr_rdy_dis').text("0");}
	if(exceptId != 'crnt_tot_mon_recv_dis'){$('#crnt_tot_mon_recv_dis').text("0");}
	if(exceptId != 'ppsl_tot_expt_mon_recv_dis'){$('#ppsl_tot_expt_mon_recv_dis').text("0");}
	
	if(exceptId != 'my_pnsn_dis'){$('#my_pnsn_dis').text("0");}
	if(exceptId != 'my_expt_pnsn_dis'){$('#my_expt_pnsn_dis').text("0");}
	if(exceptId != 'crnt_retr_rdy_dis'){$('#crnt_retr_rdy_dis').text("0");}
	if(exceptId != 'crnt_mon_recv_dis'){$('#crnt_mon_recv_dis').text("0");}
	if(exceptId != 'ppsl_expt_mon_recv_dis'){$('#ppsl_expt_mon_recv_dis').text("0");}
}

// 차트 그리기
DASHBRD02S01.location.printChart = function() {
	// 차트 그리기
	var detailData = DASHBRD02S01.variable.detailData;
	
	var chartInfo = null;
	var bMyAnn	= $('#myAnnM_9').is(':checked'); 
	if(bMyAnn){
		chartInfo = detailData.service_tot_expl_graph; 
	}
	else{
		chartInfo = detailData.service_expl_graph;
	}
	
	//var chartInfo = result.service_expl_graph;
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
	chartInfo.first 	= detailData.first_base_age; // 1기
    chartInfo.second 	= detailData.second_base_age; // 2기
    chartInfo.third 	= detailData.third_base_age; // 3기
	
	// 기타셋팅
	var getIcon = function(index, startAge){
        return{
            index:index,
            start:startAge
        };
    }
    var icon =[
        getIcon(1, chartInfo.first),
        getIcon(2, chartInfo.second), 
        getIcon(3, chartInfo.third)
    ]

	DASHBRD02S01.variable.chart.data.icon = icon;
	
	
	var annoLine = [chartInfo.first,chartInfo.second,chartInfo.third];
    var annotations = annoLine.map(function(date, index) {
        return {
            type: 'line',
            id: 'vline' + index,
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: date,
            borderColor: 'rgb(102, 102, 102)',
            borderWidth: 1,
            label: {
                enabled: false,
                position: "top",
                content: [index+1]+'기',
                backgroundColor:'rgb(102, 102, 102)',
                fontSize:11,
                // yAdjust: -20,
            }
        }
    });

	DASHBRD02S01.variable.chart.options.annotation.annotations = annotations;
	
	const originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw : function() {

            //draw line
            originalLineDraw.apply(this, arguments);
            var chart = this.chart;
            var icon = chart.config.data.icon;
            var ctx = chart.chart.ctx;
            var xaxis = chart.scales['x-axis-0'];
            var yaxis = chart.scales['y-axis-0'];
            ctx.save();
               
                var xaxis = chart.scales['x-axis-0'];
                var yaxis = chart.scales['y-axis-0'];

                icon.forEach(ele => {

                    var i = ele.index;

                    //rounded corner
                    CanvasRenderingContext2D.prototype.roundedRectangle = function(x, y, width, height, rounded) {
                        const radiansInCircle = 2 * Math.PI
                        const halfRadians = (2 * Math.PI)/2
                        const quarterRadians = (2 * Math.PI)/4  
                        
                        // top left arc
                        this.arc(x , y , 0, -quarterRadians, halfRadians, true)
                        // line from top left to bottom left
                        this.lineTo(x, y + height)
                        // bottom left arc  
                        this.arc( x -1, height + y, 0, halfRadians, quarterRadians, true)  
                        // line from bottom left to bottom right
                        this.lineTo(x + width - rounded, y + height)
                        // bottom right arc
                        this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)  
                        // line from bottom right to top right
                        this.lineTo(x + width, y + rounded)  
                        // top right arc
                        this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)  
                        // line from top right to top left
                        this.lineTo(x + rounded, y)  
                    }
                    
                    //icon position
                    var xStartPixel = xaxis.getPixelForValue(ele.start); // x점
                    var yEndPixel = yaxis.getPixelForValue(0); // y하위점
                 
                    //center
                    var xCenter = xStartPixel - 11;
                    var yBottom = yEndPixel - 5;

                    //ctx.drawImage(DASHBRD02S01.variable.chart.arrow, xCenter, yBottom, 22, 23);

                    //btn
                  
                    ctx.beginPath();
                    ctx.fillStyle = "#666666";
                    ctx.roundedRectangle(xStartPixel, 6 , 30, 20, 10);
                    ctx.fill();

                    ctx.font = "12px Arial";
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.fillText(i+"기", xStartPixel + 14, 21);


                })
            ctx.restore();
                   
        }
    });


	Chart.pluginService.register(originalLineDraw);
	
	
	
	// options 셋팅
	var maxValue = parseInt(chartInfo.vertical_maximum);
	
	// 국민연금 포함 / 미포함 중 맥스값의 최고값을 그래프의 y축으로 사용
	if(parseInt(maxValue) > parseInt(ComUtil.null(DASHBRD02S01.variable.detailData.maxValue, '0'))){
		DASHBRD02S01.variable.detailData.maxValue = maxValue;
	}
	else{
		maxValue = DASHBRD02S01.variable.detailData.maxValue;
	}
	
	var minValue = parseInt(chartInfo.vertical_minimum);
	if(maxValue > 0){
		stepSize = parseInt(maxValue / 5);
	} 
	
	DASHBRD02S01.variable.chart.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100;
	var stepSize = parseInt(DASHBRD02S01.variable.chart.options.scales.yAxes[0].ticks.max/5);
	DASHBRD02S01.variable.chart.options.scales.yAxes[0].ticks.min = minValue; 
	DASHBRD02S01.variable.chart.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	// data 셋팅
	DASHBRD02S01.variable.chart.data.datasets[0].label = chartInfo.chart[0].legend_name;
	DASHBRD02S01.variable.chart.data.datasets[0].data = chartInfo.chart[0].value;
	//DASHBRD02S01.variable.chart.data.datasets[0].backgroundColor = chartInfo.chart[0].color;
	
	
	DASHBRD02S01.variable.chart.data.labels = chartInfo.labels;

	
	//var ctx = document.getElementById('d9Chart').getContext('2d');
	DASHBRD02S01.variable.chart.myChart = new Chart(DASHBRD02S01.variable.chart.ctx, {
        type 	: 'line',
        data 	: DASHBRD02S01.variable.chart.data,
        options : DASHBRD02S01.variable.chart.options
    });
}

// 차트 초기
DASHBRD02S01.location.initChart = function(){
	var chardInfo = {};
	
	var ctx = document.getElementById('d9Chart').getContext('2d');
	chardInfo.ctx = ctx;
	chardInfo.gradient 	= ctx.createLinearGradient(0, 0, 0, 450);

    chardInfo.gradient.addColorStop(0, 'rgba(255, 149, 43, 0.6)');
    chardInfo.gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    chardInfo.gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    /*var arrow = new Image();
    arrow.src = '/images/triangle.svg'; 
	chardInfo.arrow = arrow;*/
	
	
	// options
    chardInfo.options ={
		responsive: true,
		aspectRatio:3/2,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false,
        },
        scales:{
            xAxes:[{
                display: true,
                gridLines: {
                    display: false,
                    color:'rgb(221, 221, 221)',
                    drawBorder: false,
                    borderDash:[2,3]
                },
                ticks:{
                    fontColor: "#999999",
                    beginAtZero: true,
                    padding: 8,
					autoSkipPadding:20,
					maxRotation:0
                }
            }],
            yAxes:[{
                gridLines: {
                    display: true,
                    color:'rgb(221, 221, 221)',
                    drawBorder: true,
                    borderDash:[2,3]
                },
                ticks: {
                    min:0,
                    max:1600,
                    stepSize:400,
                    fontColor: "#999999",
                    beginAtZero: true,
                    padding: 3
                }
            }],
            
        },
        elements: {
            point:{
                radius: 0
            }
        },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            annotations: null
        }
    }	


	chardInfo.data ={
        labels: ["60세","65세","70세","75세","80세","85세","90세"],
            datasets: [
            {
                label: '자문', 
                data: [800,	1000,500, 1200, 1400,1000,1100], 
                borderColor: '#ff952b', 
                borderWidth: 2,
                backgroundColor: chardInfo.gradient,
                lineTension: 0
                
            }],
            icon : null 
    }

	DASHBRD02S01.variable.chart = chardInfo;
}


// 예상수령액(현재버전 월)
DASHBRD02S01.location.calCurMon = function(){
	var detailData = DASHBRD02S01.variable.detailData;
	
	detailData.crnt_mon_recv_amt	= ComUtil.null(detailData.crnt_mon_recv_amt	, 0);	 // 현재연금월평균수령액
	detailData.fit_mon_recv_amt     = ComUtil.null(detailData.fit_mon_recv_amt  , 0);    // 적정연금월평균수령액
	detailData.safe_mon_recv_amt    = ComUtil.null(detailData.safe_mon_recv_amt , 0);    // 안전연금월평균수령액
	detailData.ntnl_pnsn_recv_amt   = ComUtil.null(detailData.ntnl_pnsn_recv_amt, 0);    // 국민연금수령액
	detailData.retr_pnsn_recv_amt   = ComUtil.null(detailData.retr_pnsn_recv_amt, 0);    // 퇴직연금수령액
	detailData.prsn_pnsn_recv_amt   = ComUtil.null(detailData.prsn_pnsn_recv_amt, 0);    // 개인연금수령액
	
	// 국민연금 포함 s
	if(detailData.safe_tot_mon_recv_amt  >= (detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt)){
		detailData.max_tot_mon_recv_amt	= parseInt(detailData.safe_tot_mon_recv_amt * 1.2);
	}
	else{
		detailData.max_tot_mon_recv_amt	= parseInt((detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) * 1.2);
	}
	detailData.crnt_tot_mon_recv_rate	= parseInt((detailData.crnt_tot_mon_recv_amt) / detailData.max_tot_mon_recv_amt * 100);     // 현재연금월평균수령액 까지의 비율
	detailData.fit_tot_mon_recv_rate	= parseInt((detailData.fit_tot_mon_recv_amt) / detailData.max_tot_mon_recv_amt * 100);      // 적정연금월평균수령액 까지의 비율
	detailData.safe_tot_mon_recv_rate	= parseInt((detailData.safe_tot_mon_recv_amt) / detailData.max_tot_mon_recv_amt * 100);     // 안전연금월평균수령액 까지의 비율
	
	detailData.ntnl_tot_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt) / detailData.max_tot_mon_recv_amt * 100);     // 국민연금수령액까지의 비율
	detailData.retr_tot_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt) / detailData.max_tot_mon_recv_amt * 100);      // 퇴직연금수령액까지의 비율
	detailData.prsn_tot_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) / detailData.max_tot_mon_recv_amt * 100);  	// 개인연금수령액까지의 비율
	// 국민연금 포함 e
	
	// 국민연금 미포함 s
	if(detailData.safe_mon_recv_amt  >= (detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt)){
		detailData.max_mon_recv_amt	= parseInt(detailData.safe_mon_recv_amt * 1.2);
	}
	else{
		detailData.max_mon_recv_amt	= parseInt((detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) * 1.2);
	}
	
	detailData.crnt_mon_recv_rate	= parseInt((detailData.crnt_mon_recv_amt) / detailData.max_mon_recv_amt * 100);     // 현재연금월평균수령액 까지의 비율
	detailData.fit_mon_recv_rate	= parseInt((detailData.fit_mon_recv_amt) / detailData.max_mon_recv_amt * 100);      // 적정연금월평균수령액 까지의 비율
	detailData.safe_mon_recv_rate	= parseInt((detailData.safe_mon_recv_amt) / detailData.max_mon_recv_amt * 100);     // 안전연금월평균수령액 까지의 비율
	
	//detailData.ntnl_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt) / detailData.max_mon_recv_amt * 100);     // 국민연금수령액까지의 비율
	detailData.retr_pnsn_recv_rate	= parseInt((detailData.retr_pnsn_recv_amt) / detailData.max_mon_recv_amt * 100);      		// 퇴직연금수령액까지의 비율
	detailData.prsn_pnsn_recv_rate	= parseInt((detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) / detailData.max_mon_recv_amt * 100);       // 개인연금수령액까지의 비율
	// 국민연금 미포함 e
	
	
	DASHBRD02S01.variable.detailData = detailData;
}

// 예상수령액(머플러 예상치 월)
DASHBRD02S01.location.calExptMon = function(){
	var detailData = DASHBRD02S01.variable.detailData;
	
	// 국민연금 포함 s
	detailData.ppsl_tot_expt_mon_recv_amt    = ComUtil.null(detailData.ppsl_tot_expt_mon_recv_amt , 0);    	// 제안예상월수령액
	detailData.max_tot_expt_mon_recv_amt 	= parseInt(detailData.safe_tot_mon_recv_amt * 1.2);

	if(detailData.safe_tot_mon_recv_amt < detailData.ppsl_tot_expt_mon_recv_amt){
		detailData.max_tot_expt_mon_recv_amt = parseInt(detailData.ppsl_tot_expt_mon_recv_amt * 1.2);
	}
	
	detailData.ppsl_tot_expt_mon_recv_rate	= parseInt((detailData.ppsl_tot_expt_mon_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);     // 머플러 예상금액 까지의 비율
	detailData.crnt_tot_expt_mon_recv_rate	= parseInt((detailData.crnt_tot_mon_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);     // 현재연금월평균수령액 까지의 비율
	detailData.fit_tot_expt_mon_recv_rate	= parseInt((detailData.fit_tot_mon_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);      // 적정연금월평균수령액 까지의 비율
	detailData.safe_tot_expt_mon_recv_rate	= parseInt((detailData.safe_tot_mon_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);     // 안전연금월평균수령액 까지의 비율
	
	detailData.ntnl_tot_expt_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);     // 국민연금수령액까지의 비율
	detailData.retr_tot_expt_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);      // 퇴직연금수령액까지의 비율
	detailData.prsn_tot_expt_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt+detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) / detailData.max_tot_expt_mon_recv_amt * 100);       // 개인연금수령액까지의 비율
	// 국민연금 포함 e
	
	
	// 국민연금 미포함 s
	detailData.ppsl_expt_mon_recv_amt    = ComUtil.null(detailData.ppsl_expt_mon_recv_amt , 0);    	// 제안예상월수령액
	detailData.max_expt_mon_recv_amt 	= parseInt(detailData.safe_mon_recv_amt * 1.2);
	
	if(detailData.safe_mon_recv_amt < detailData.ppsl_expt_mon_recv_amt){
		detailData.max_expt_mon_recv_amt = parseInt(detailData.ppsl_expt_mon_recv_amt * 1.2);
	}
	
	detailData.ppsl_expt_mon_recv_rate	= parseInt((detailData.ppsl_expt_mon_recv_amt) / detailData.max_expt_mon_recv_amt * 100);     // 머플러 예상금액 까지의 비율
	detailData.crnt_expt_mon_recv_rate	= parseInt((detailData.crnt_mon_recv_amt) / detailData.max_expt_mon_recv_amt * 100);     // 현재연금월평균수령액 까지의 비율
	detailData.fit_expt_mon_recv_rate	= parseInt((detailData.fit_mon_recv_amt) / detailData.max_expt_mon_recv_amt * 100);      // 적정연금월평균수령액 까지의 비율
	detailData.safe_expt_mon_recv_rate	= parseInt((detailData.safe_mon_recv_amt) / detailData.max_expt_mon_recv_amt * 100);     // 안전연금월평균수령액 까지의 비율
	
	detailData.ntnl_expt_pnsn_recv_rate	= parseInt((detailData.ntnl_pnsn_recv_amt) / detailData.max_expt_mon_recv_amt * 100);     // 국민연금수령액까지의 비율
	detailData.retr_expt_pnsn_recv_rate	= parseInt((detailData.retr_pnsn_recv_amt) / detailData.max_expt_mon_recv_amt * 100);      // 퇴직연금수령액까지의 비율
	detailData.prsn_expt_pnsn_recv_rate	= parseInt((detailData.retr_pnsn_recv_amt+detailData.prsn_pnsn_recv_amt) / detailData.max_expt_mon_recv_amt * 100);       // 개인연금수령액까지의 비율
	// 국민연금 미포함 e
	
	DASHBRD02S01.variable.detailData = detailData;
}

// 수익율에 따른 증감 화살표 셋팅
DASHBRD02S01.location.setArrowUpDown = function(obj, type){
	var objId = obj.attr('id');
	var rateId = objId.substring(0, objId.lastIndexOf('_dis')) + '_' + type;
	var objRate = eval('DASHBRD02S01.variable.detailData.' + rateId);
	
	var targetObj = obj.next();
	
	// 증감
	if(objRate >= 0){
		targetObj.addClass("up");
		targetObj.html('&#9650;');
	}
	else{
		targetObj.addClass("down");
		targetObj.html('&#9660;');
	}
	
}


DASHBRD02S01.location.callNextPage = function(){
	var detailData = DASHBRD02S01.variable.detailData;

	// 투자성향분석 내용 저장
	sStorage.setItem('INVESTPROPParams', detailData);
	
	// use_analysis    		0 : 미진행(직접), 1 : 진행(분석)
	// invest_propensity	0 : 미진행
	if(detailData.invest_propensity == '0' || detailData.use_analysis == '0'){
		// 투자성향 시작 화면 이동
		//ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01', false); // 안드로이드의 백버튼 때문에 (원화면은 백버튼이 없는 화면이나)
		ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01');
	}
	else{
		// 투자성향 결과 화면 이동
		if(detailData.possible_contract_status == 'Y'){
			// 투자성향 결과 페이지로 이동
			ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP06S01");
		}
		else{
			// 투자성향 시작 화면 이동
			ComUtil.moveLink('/pension_advice/invest_propensity/INVPROP04S01');
			// 투자성향 결과 페이지로 이동 (서비스불가)
			//ComUtil.moveLink("/pension_advice/invest_propensity/INVPROP06S02");
		}
	}
}


// 애드브릭스 이벤트 전달 (슬라이드 시.)
DASHBRD02S01.location.enterScreen   = function(){
	var currentSlide = DASHBRD02S01.variable.detailData.currentSlide;
	// 화면접근정보 통지
	var inputParam = {};
	
	
	if(currentSlide == '1'){
		inputParam.event 	= "analysis_1";
	}
	else if(currentSlide == '2'){
		inputParam.event 	= "analysis_2";
	}
	else if(currentSlide == '3'){
		inputParam.event 	= "analysis_3";
	}
	else if(currentSlide == '4'){
		inputParam.event 	= "analysis_4";
	}
	else if(currentSlide == '5'){
		inputParam.event 	= "analysis_5";
	}
	else if(currentSlide == '6'){
		inputParam.event 	= "analysis_6";
	}
	else{
		inputParam.event 	= "analysis_fin";
		// facebook 추가 작업 필요
		inputParam.type	= '2';
		gfn_enterScreen(inputParam);
	}
	
	inputParam.type	= '1';
	gfn_enterScreen(inputParam);
} 


DASHBRD02S01.init();
