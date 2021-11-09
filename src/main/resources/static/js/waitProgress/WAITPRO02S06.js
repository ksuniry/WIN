/**
* 파일명 		: WAITPRO02S06.js
* 업무		: 연금대기 상세보기(신규)(W-02-06)
* 설명		: 상세보기(신규)
* 작성자		: 배수한
* 최초 작성일자	: 2021.04.28
* 수정일/내용	: 
*/
var WAITPRO02S06 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO02S06.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
WAITPRO02S06.events = {
	 'click #btnSolution'									: 'WAITPRO02S06.event.clickBtnSolution'
	,'click #btnCapyAcnt'									: 'WAITPRO02S06.event.clickBtnCapyAcnt'
	,'click #btnStart'										: 'WAITPRO02S06.event.clickBtnStart'
	,'click #btnOk'											: 'WAITPRO02S06.event.clickBtnOk'
	,'click #btnCallPopupHandoDesc'							: 'WAITPRO02S06.event.clickBtnCallPopupHandoDesc'	// 납입한도 변경 설명 팝업 호출
	,'click #btnCallHandoPopup'								: 'WAITPRO02S06.event.clickBtnCallHandoPopup'	// 한도변경팝업 호출
	,'click #btnCloseChangeHando'							: 'WAITPRO02S06.event.clickBtnCloseChangeHando'	// 한도변경팝업 취소버튼
	,'click #btnSaveChangeHando'							: 'WAITPRO02S06.event.clickBtnSaveChangeHando'	// 한도변경저장
	,'click li[id^="prodDetail_"]'							: 'WAITPRO02S06.event.goFundDetail'
	
}

WAITPRO02S06.init = function(){
	

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO02S06');
	
	//$("#pTitle").text("자문안 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-06";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO02S06.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO02S06.location.pageInit = function() {
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("WAITPRO02S06Params");
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		WAITPRO02S06.variable.initParamData = sParams;
		//sStorage.clear();
		
		
		WAITPRO02S06.variable.sendData.orgn_acnt_uid = sParams.orgn_acnt_uid; 	// 기존계좌UID
		WAITPRO02S06.variable.sendData.chng_acnt_uid = sParams.chng_acnt_uid; 	// 변경계좌UID
		WAITPRO02S06.variable.sendData.advc_gbn_cd 	= sParams.advc_gbn_cd; 		// 자문구분코드
		
		WAITPRO02S06.variable.sendData.acnt_uid 		= sParams.chng_acnt_uid; 	// 변경계좌UID(한도변경용)
		WAITPRO02S06.variable.sendData.advice_acnt_no 	= sParams.chng_acnt_no; 	// 변경계좌번호(한도변경용)
	}
	else{
		//gfn_callPopupSysClose({msg:"비정상적인 접근입니다."});
		//return;
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


        /*$('.tablist li:nth-child(1) a').addClass('is_active');
        $('#panel-1').show();

        $('.tablist li').click(function(){
            var index = ($(this).index())+1;
            var active = $(this).children('a').hasClass('is_active');
            if(active !== true){
                $(this).children('a').addClass('is_active');
                $(this).siblings().children('a').removeClass('is_active');
                $('.tab_panel').hide();
                $('#panel-'+index).show();
            }
        });*/


		// 문제해결 msg popup 초기화
		//$('div[id^="msgCase_"]').hide();
		
		$('.modal-page-btn button, .dim').on("click",function(){
			// 저장은 해당 버튼내에서 처리함
			if('btnSaveChangeHando' == $(this).attr('id')){
				return;
			}
			if('btnCloseChangeHando' == $(this).attr('id')){
				return;
			}
			$('#divPopChangeHando').hide();
			$('#msgPopup').hide();
		});
	}
	
	// 차트 영역 셋팅
	WAITPRO02S06.location.initChart();
	
	// 자문대기 계좌상세 조회  	
	WAITPRO02S06.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 자문대기 계좌상세 조회 
WAITPRO02S06.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitAcntDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_detail";
	inputParam.data 	= WAITPRO02S06.variable.sendData;
	inputParam.callback	= WAITPRO02S06.callBack; 
	
	gfn_Transaction( inputParam );
}

// 자문계좌 계좌납입한도 수정
WAITPRO02S06.tran.updateAcntLimitAmt = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAcntLimitAmt";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/update_acnt_limit_amt";
	inputParam.data 	= WAITPRO02S06.variable.sendData;
	inputParam.callback	= WAITPRO02S06.callBack; 
	
	gfn_Transaction( inputParam );
}


// 오픈뱅킹 인증여부 확인
WAITPRO02S06.tran.selectUserObStatus = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserObStatus";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/select_user_ob_status";
	//inputParam.data 	= WAITPRO02S06.variable.sendData;
	inputParam.data 	= {};
	inputParam.callback	= WAITPRO02S06.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 문제해결 클릭시
WAITPRO02S06.event.clickBtnSolution = function(e) {
 	e.preventDefault();	
	
	WAITPRO02S06.location.makeDepoInfo();
	$('#msgCase_depoInfo').show();
	$('#msgPopup').show();
}

// 계좌번호복사 클릭시
WAITPRO02S06.event.clickBtnCapyAcnt = function(e) {
 	e.preventDefault();

	// 클립보드 복사
	ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO02S06.variable.detailData.chng_acnt_no_p, '-', ''));
	var inputParam = {};
	inputParam.msg = '계좌번호가 복사되었습니다.';
	inputParam.isUnder = true;
	gfn_toastMsgBox(inputParam);
}

// 연금저축 시작하기 클릭시
WAITPRO02S06.event.clickBtnStart = function(e) {
 	e.preventDefault();

	//gfn_openBank3Agree({});
	//return;

	//gfn_alertMsgBox("연금저축 시작하기");
	
	gfn_confirmMsgBox("연금계좌에 오픈뱅킹을 통한<br> 입금을 시작합니다.", '', function(returnData){
		
		if(returnData.result == 'Y'){
			// 오픈뱅킹 인증여부 확인
			WAITPRO02S06.tran.selectUserObStatus();
		}
		else{
			//$(this).attr( "checked", false );
		}
	});
}

// 연금저축 시작하기 클릭시
WAITPRO02S06.event.clickBtnOk = function(e) {
 	e.preventDefault();

	$('#msgPopup').hide();
}

// 납입한도 변경 설명 팝업 호출
WAITPRO02S06.event.clickBtnCallPopupHandoDesc = function(e) {
 	e.preventDefault();

	var sParam = {};
	sParam.url = '/wait_progress/WAITPRO02P08';
	gfn_callPopup(sParam, function(){});
}

// 한도금액 설정팝업 호출
WAITPRO02S06.event.clickBtnCallHandoPopup = function(e) {
 	e.preventDefault();

	$('#msgCase_depoInfo').hide();
	$('#divPopChangeHando').show();
}

// 한도금액 설정팝업 취소버튼 클릭 
WAITPRO02S06.event.clickBtnCloseChangeHando = function(e) {
 	e.preventDefault();

	$('#divPopChangeHando').hide();
	$('#msgCase_depoInfo').show();
}

// 한도금액 설정팝업 취소버튼 클릭 
WAITPRO02S06.event.clickBtnSaveChangeHando = function(e) {
 	e.preventDefault();

	var detailData = WAITPRO02S06.variable.detailData;
	

	// 한도금액 체크 로직
	var set_limit_amt = ComUtil.null($('#set_limit_amt').val(), 0);
	
	if(parseInt(set_limit_amt) > parseInt(detailData.update_limit_amt)){
		gfn_alertMsgBox("최대 변경가능한 한도금액은 " + ComUtil.number.addCommmas(detailData.update_limit_amt) + "만원 입니다.");
		$('#set_limit_amt').val('');
		return;
	}
	if(parseInt(set_limit_amt) == 0){
		gfn_alertMsgBox("변경하실 한도금액을 입력해 주세요.");
		return;
	}
	
	// 정상적인 저장엑션이면 한도변경팝업을 숨긴다.
	$('#divPopChangeHando').hide();
	$('#msgPopup').hide();
	
	
	WAITPRO02S06.variable.sendData.set_limit_amt = set_limit_amt;	// (한도변경용)
	WAITPRO02S06.tran.updateAcntLimitAmt();
}


// 펀드상세 외부 링크 화면 호출 
WAITPRO02S06.event.goFundDetail = function(e) {
	e.preventDefault();
	
	var item = $(this).closest('li').data();
	
	var inputParam = {};
	inputParam.fund_no 		= item.prdt_cd;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
	
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO02S06.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	// test 때문에 잠시 주석 
	/*
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		result.acnt_limit_amt = '0';
		result.update_limit_amt = '1200';
		result.rcmmnd_limit_dis = '100';
		result.acnt_status = '02';
		result.acnt_type = '11';
	}
	*/
	
	
	if(sid == "pensionWaitAcntDetail"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		WAITPRO02S06.variable.detailData = result;
		
		gfn_log("result.acnt_limit_amt ::  " + result.acnt_limit_amt);
		gfn_log("result.rcmmnd_limit_amt ::  " + result.rcmmnd_limit_amt);
		gfn_log("result.update_limit_amt ::  " + result.update_limit_amt);
		gfn_log("result.acnt_status ::  " + result.acnt_status);
		gfn_log("result.acnt_type ::  " + result.acnt_type);
				
		WAITPRO02S06.variable.detailData.userNm = gfn_getUserInfo('userNm', true);
		WAITPRO02S06.variable.detailData.chng_acnt_nm = WAITPRO02S06.variable.initParamData.chng_acnt_nm;	// 이전 화면의 데이터를 이용한다.
		
		// 상세 셋팅 
		WAITPRO02S06.location.displayDetail();
				
	}
	
	// 납입한도금액 수정
	if(sid == "updateAcntLimitAmt"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		gfn_alertMsgBox('입금한도 금액을 수정하였습니다.', '', function(){
			// 자문 계좌 상세정보 조회
			WAITPRO02S06.tran.selectDetail();
			$('#set_limit_amt').val('');	 // 신규 입력값 초기화
		});
		return;
	}
	
	
	// 오픈뱅킹 인증여부 확인
	if(sid == "selectUserObStatus"){
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
			//debugger;
			// 오픈뱅킹 화면으로 이동
			ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
		}
	}
}


// 네이티브 호출후 콜백함수 
WAITPRO02S06.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	
	//alert("result.passYn :: " + result.passYn);
	
	
	// openbanking 3자동의
	if(key == 'ob3agree'){
		if(ComUtil.null(result.passYn, 'N') == 'Y'){
			// 오픈뱅킹 화면으로 이동
			ComUtil.moveLink('/open_banking/OPENBNK01S01'); // 화면이동
		}
		if(ComUtil.null(result.passYn, 'N') == 'C'){
			// 스크랩핑 성공시 재조회
			gfn_alertMsgBox('3자동의를 취소할 경우 더이상 서비스 진행이 불가합니다.', '', function(){});
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
WAITPRO02S06.location.displayDetail = function(){
	var detailData = WAITPRO02S06.variable.detailData;
	
	// 상단타이틀 셋팅
	WAITPRO02S06.location.makeTitle();
	
	detailData.chng_acnt_no_p = ComUtil.pettern.acntNo(detailData.chng_acnt_no + gfn_getAddAcntNoByCd(detailData.chng_kftc_agc_cd));
	if(!ComUtil.isNull(detailData.advc_ptfl_prdt_list)){
		detailData.advc_ptfl_prdt_list_cnt = detailData.advc_ptfl_prdt_list.length;
	}
	
	$('#set_limit_amt').attr('placeholder', detailData.update_limit_amt);

	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	// bank img
	$('#imgCompany').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	//$('#orgn_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img_pop').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	
	// chart
	WAITPRO02S06.location.displayChart();
	
	
	
	
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


// 상단타이틀 셋팅
	// 상태에 따라 텍스트와 클라스명 변경됩니다
	/*
    case1 - prepare - <p class="title_2x"><span>계좌이전 준비중입니다</span></p>
    case2 - ing - <p class="title_2x"><span>계좌이전이 진행중입니다</span></p>
    case3 - fail - <p class="title_2x"><span>계좌이전이 실패하였습니다</span></p>
    case4 - cancel - <p class="title_2x"><span>계좌이전을 취소하였습니다</span></p>

	" - 01 : 자문실행전 
	  - 02 : 입금대기 (신규 계자)
	  - 09 : 계좌해지 (신규계좌)
	  - 10 : 이전대기중 (신규 계자)
	  - 11 : 이전신청 (구계좌)
	  - 12 : 이전신청 실패 (구계좌)
	  - 13 : 이전신청 예약 (구계좌)
	  - 14 : 이전진행중 (구계좌)
	  - 15 : 이전취소
	  - 16 : 이전완료 (구계좌)
	  - 17 : 이전재신청
	  - 21 : 해지신청 (구계좌)
	  - 22 : 해지완료 (구계좌)"
	*/
WAITPRO02S06.location.makeTitle = function(){
	var detailData = WAITPRO02S06.variable.detailData;
	
	var tMsg = "";
	var tClass = "";
	var tType = "";
	
	//detailData.acnt_status = '15';	// 이전취소
	//detailData.acnt_status = '21';	// 해지신청
	
	switch(detailData.acnt_status){
		case '02' : // 입금대기 (신규 계자) 입금안내 화면
			tMsg 	= "계좌이전 준비중입니다";
			tClass 	= "prepare";
			tType 	= "depoInfo";		// 입금안내 화면
			break;
		//case '10' : // 이전대기중 (신규 계자)
		case '11' : // 이전신청 (구계좌)
		//case '13' : // 이전신청 예약 (구계좌)
		case '14' : // 이전진행중 (구계좌)
		//case '17' : // 이전재신청
			tMsg 	= "계좌이전이 진행중입니다";
			tClass 	= "ing";
			tType 	= "ing";			// 이전진행중 화면
			break;
		case '12' : // 이전신청 실패 (구계좌)
			tMsg 	= "계좌이전이 실패하였습니다";
			tClass 	= "fail";
			tType 	= "retry";
			break;
		case '15' : // 이전취소
			tMsg 	= "계좌이전을 취소하였습니다";
			tClass 	= "cancel";
			tType 	= "retry";		// 이전 재신청화면
			break;
		case '21' : // 해지신청 (구계좌)
			tMsg 	= "해지신청이 진행중입니다";
			tClass 	= "ing";
			tType 	= "terminate";	// 해지안내 화면
			break;
		default :
			break;
	}
	
	$('#divTitle').attr('class','w_title ' + tClass);
	detailData.titleMsg = tMsg;
	
	
	// 문제해결 msg popup 활성화
	//$('#msgCase_' + tType).show();
}


// 입금안내 
WAITPRO02S06.location.makeDepoInfo = function(){
	var detailData = WAITPRO02S06.variable.detailData;
	$('#divProbHandoZero').hide();
	$('#divProbHandoZeroUpdate').hide();
	$('#divHandoZero').hide();
	$('#divBtnHandoZero').hide();
	$('#divProbHandoZeroOver').hide();
	$('#divHandoZeroOver').hide();
	$('#divBtnHandoZeroOver').hide();
	$('#divTimePension').hide();
	$('#divTimeIrp').hide();
	
	
	
	// 종합위탁계좌 이면
	if(detailData.acnt_type == '99'){
		$('#divProbHandoZeroOver').show();		
		$('#divHandoZeroOver').show();
		if(gfn_isOper()){
			$('#divBtnHandoZero').show();
		}
		else{
			$('#divBtnHandoZeroOver').show();
		}
		return;
	}
	
	
	var acnt_limit_amt 		= ComUtil.null(detailData.acnt_limit_amt, 0);	// 계좌입금 한도금액
	var update_limit_amt 	= ComUtil.null(detailData.update_limit_amt, 0);	// 수정가능 한도금액
	// 한도가 0인경우
	if(acnt_limit_amt == 0){
		// 수정가능 한도금액 0인경우
		if(update_limit_amt == 0){
			$('#divProbHandoZero').show();
		}
		else{
			$('#divProbHandoZeroUpdate').show();
		}
		
		$('#divHandoZero').show();
		$('#divBtnHandoZero').show();
	}
	// 한도가 0보다 큰경우
	else{
		$('#divProbHandoZeroOver').show();		
		
		$('#divHandoZeroOver').show();
		if(gfn_isOper()){
			$('#divBtnHandoZero').show();
		}
		else{
			$('#divBtnHandoZeroOver').show();
		}
		
		// 개인IRP 퇴직연금에 따른  안내시간 셋팅 
		if(detailData.acnt_type == '11'){
			$('#divTimeIrp').show();
		}
		else{
			$('#divTimePension').show();
		}
	}
	
	
	
}




// chart
WAITPRO02S06.location.displayChart = function(){
	var detailData = WAITPRO02S06.variable.detailData;
	
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
            data: [38,50,100-50],
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
	
    var ctx3 = document.getElementById('ppslChar').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : ppslData,
        options : options3
    });
	
}


// 차트 그리기
// 차트 초기
WAITPRO02S06.location.initChart = function(){
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
                        console.log(arc.round.startAngle)
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



WAITPRO02S06.init();
