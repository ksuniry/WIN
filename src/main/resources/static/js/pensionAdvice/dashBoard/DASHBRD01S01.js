/**
* 파일명 		: DASHBRD01S01.js (pension-D-01)
* 업무		: 연금자문 대시보스
* 설명		: 연금자문 대시보스
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var DASHBRD01S01 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD01S01.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	//,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,headType		: 'dash'							// 해더영역 디자인
	,screenType		: 'welcome_board'					// 애드브릭스 이벤트값 
	,screenFType	: 'welcome_board'					// 페이스북 이벤트값 
}

/* 이벤트 정의 */
DASHBRD01S01.events = {
	 'click #btnNext'		 						: 'DASHBRD01S01.event.clickBtnNext'
	,'change #myAnn'								: 'DASHBRD01S01.event.changeMyAnn'
	,'click #btnRefreshLifePlan'					: 'DASHBRD01S01.event.clickBtnRefreshLifePlan'
	//,'click li[id^="fundInfo_"]'					: 'DASHBRD01S01.event.goFundDetail'
}

DASHBRD01S01.init = function(){
	// 로딩팝업 셋팅 3초유지
	var sParam = {};
	sParam.url = '/pension_advice/dashBoard/DASHBRD01P02';
	
	/*
	if(ComUtil.isNull(sStorage.getItem('gUserInfo'))){
		gfn_callPopup(sParam, function(){
			//DASHBRD01S01.variable.noHead = false;
			//gfn_setHeader(DASHBRD01S01);
			$('#divMain').show();
		});
	}
	else{
		$('#divMain').show();
	}
	*/
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD01S01');
	
	$("#pTitle").text("투자성향분석");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-01-01";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD01S01.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD01S01.location.pageInit = function() {
	//sStorage.setItem('homeUrl', location.pathname);
	
	// 전 화면에서 받은 파라미터 셋팅
	//var sParams = sStorage.getItem("DASHBRD01S01Params");
	//gfn_log(DASHBRD01S01.variable.initParamData);
	//if(ComUtil.isNull(sParams)){
	//	DASHBRD01S01.variable.initParamData.reInvestPropensity = sParams.reInvestPropensity; 
	//}
	//sStorage.clear();
	
	/*var timer = setInterval(function(){
        $('#divRobo').hide();
		$('#f-content').show();
    }, 3000);*/
	//$('#f-content').show();
	
	//if(!gfn_isOper()){
		$('#divRefresh').show();
	//}
	
	$('.refresh_info').click(function(){
        $(this).addClass('show');
        setTimeout(function(){ 
            $('.refresh_info').removeClass('show');
         }, 3000);
    });
	
	$('#toast').attr('class','toast toast_under');
	
	
    // 차트 영역 셋팅
	DASHBRD01S01.location.initChart();

	// 초기조회
	DASHBRD01S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD01S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myPension";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/my_pension";
	//inputParam.url 		= "/pension/my_pension";
	inputParam.data 	= DASHBRD01S01.variable.sendData;
	inputParam.callback	= DASHBRD01S01.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
DASHBRD01S01.event.clickBtnNext = function(e) {
 	e.preventDefault();
	// 내 연금 - 서비스
	ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD02S01', true);
}

// 통합연금포털 재조회 
DASHBRD01S01.event.clickBtnRefreshLifePlan = function(e) {
 	e.preventDefault();
	
	// 스크래핑 성공 일자의 월이 현재 일자의 월과 다르면 무조건 재시도, 같으면 얼럿 표시 "통합연금포털의 데이터는 월말에 갱신됩니다. 그래도 다시 가져올까요?" 예, 아니요
	if(DASHBRD01S01.variable.detailData.data_sync_date.substr(5, 2) != ComUtil.date.curMonth()){
		// 통합연금 로그인(스크랩핑)
		DASHBRD01S01.location.callScraping();
	}
	else{
		var inputParam = {};
		inputParam.btnOkTitle = '예';
		inputParam.btnNoTitle = '아니요';
		inputParam.msg = '통합연금포털의 데이터는 월말에 갱신됩니다. 그래도 다시 가져올까요?';
		
		gfn_confirmMsgBox2(inputParam, function(resultParam){
			if("Y" == resultParam.result){
				// ok일경우 후처리 작업 고고!!
				// 통합연금 로그인(스크랩핑)
				DASHBRD01S01.location.callScraping();
				return;
			}
		});
		return;
	}
	// 토스트 메세지
	gfn_toastMsgBox({msg:'<span>연금 데이터를 다시 불러옵니다.<br> 연금통합포털의 데이터는 월말에 갱신됩니다.</span>'});
	
}


// 국민연금 선택 여부
DASHBRD01S01.event.changeMyAnn = function(e) {
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	if(ComUtil.isNull(DASHBRD01S01.variable.detailData)){
		return;
	}

	DASHBRD01S01.location.setDetails();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD01S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 투자성향 저장 
	if(sid == "myPension"){
		if(ComUtil.isNull(result.user_nm)){
			gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
			return;
		}
		
		//result.data_sync_yn = 'Y';
		//if(!gfn_isOper()){
			if(ComUtil.null(result.data_sync_yn, 'N') == 'N'
			|| ComUtil.null(result.data_sync_term, '27') != '0'
			){
				// 통합연금포털 가입유도 페이지 호출
				result.data_sync_term = ComUtil.null(result.data_sync_term, '27');
				sStorage.setItem("DASHBRD01S00Params", result);
				ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S00', false);
				return;
			}
			result.data_sync_date = ComUtil.string.dateFormat(result.data_sync_date, '.');
		//}
		
		$('#divMain').show();
		
		
		DASHBRD01S01.variable.detailData = result;
		
		// 사용자 기본정보 셋팅
		//DASHBRD01S01.location.setUserInfo();
		
		// 복호화
		DASHBRD01S01.variable.detailData.user_nm = JsEncrptObject.decrypt(DASHBRD01S01.variable.detailData.user_nm);
		
		// 상세내역 셋팅
		DASHBRD01S01.location.setDetails();
		
		// 로딩창 제거 요청 브릿지 호출
		/*if(!ComUtil.isNull(sStorage.getItem('gUserInfo'))){
			gfn_finishLoading();
		}*/
		
		// 알람조회
		gfn_reloadAlarm();
		
		// 이벤트 조회 
		gfn_noticePop();
	}
}

// 네이티브 호출후 콜백함수 
DASHBRD01S01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'scraping'){
		if(ComUtil.isNull(result.result)){
			gfn_alertMsgBox("정보수집을 하지 못했습니다.", '', function(){});
			return;
		}
		debugger;
		var errorCnt = 0;
		var errorMsg = "";
		//2021-03-15 
		var errorCode = "";
		$.each(result.result, function(index, item){
			// 스크랩핑 실패
			//2021-03-15 
			errorCode = item.errorCode;
			if(parseInt(ComUtil.null(item.errorCode, '-1')) != 0){
				errorCnt++;
				errorMsg = item.errorMsg;
			}
		});
		
		if(errorCnt == 0){
			gfn_log('result..' + result);
			// 스크랩핑 성공시 재조회
			DASHBRD01S01.tran.selectDetail();
		}
		else{
			// 에러메세지 변경이 필요한 경우 적용
			if('80004051|80004054|80002214|'.indexOf(errorCode) > -1){
				errorMsg = '아이디나 비밀번호가 일치하지 않습니다.<br>5회 오류 입력시 로그인이 차단되므로 유의하시기 바랍니다.';
			}
			else if('42110000|'.indexOf(errorCode) > -1){
				errorMsg = '통합연금포털에서 조회한 결과 고객님의 연금을 찾을 수 없습니다.';
			}
			
			gfn_alertMsgBox(ComUtil.null(errorMsg, gfn_helpDeskMsg()), '', function(){});
			return;
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 기본사용자정보 셋팅
DASHBRD01S01.location.setUserInfo = function(){
	gfn_setUserInfo('userNm', 	DASHBRD01S01.variable.detailData.user_nm);
	gfn_setUserInfo('usePrd', 	DASHBRD01S01.variable.detailData.use_prd);
	gfn_setUserInfo('userPn', 	DASHBRD01S01.variable.detailData.user_pn);
	//gfn_setUserInfo('useEmail', DASHBRD01S01.variable.detailData.use_prd);
	gfn_setHeaderInfo();
}


// 통합연금 로그인(스크랩핑)
DASHBRD01S01.location.callScraping = function(){
	
	var inputParam = {};
	inputParam.type = 'lifeplan';
	
	gfn_scraping(inputParam);
}

// 화면 셋팅
DASHBRD01S01.location.setDetails = function() {
		
	gfn_setDetails(DASHBRD01S01.variable.detailData, $('#f-content'));
	
	var mon_pnsn_dis = "";			// 현재연금
	var ppsl_mon_pnsn_dis = "";		// 머플러연금
	var mon_pnsn_unit = "";			// 현재연금단위
	var ppsl_mon_pnsn_unit = "";	// 머플러연금단위
	var chartInfo	= {};
	
	
	if($('#myAnn').is(":checked")){
		mon_pnsn_dis 		= DASHBRD01S01.variable.detailData.tot_mon_pnsn_dis;			// 현재연금(국민연금포함)
		ppsl_mon_pnsn_dis 	= DASHBRD01S01.variable.detailData.tot_ppsl_mon_pnsn_dis;		// 머플러연금(국민연금포함)
		mon_pnsn_unit 		= DASHBRD01S01.variable.detailData.tot_mon_pnsn_unit;
		ppsl_mon_pnsn_unit 	= DASHBRD01S01.variable.detailData.tot_ppsl_mon_pnsn_unit;
		
		chartInfo = DASHBRD01S01.variable.detailData.tot_pnsn_recv_graph;
	}
	else{
		mon_pnsn_dis 		= DASHBRD01S01.variable.detailData.mon_pnsn_dis;
		ppsl_mon_pnsn_dis 	= DASHBRD01S01.variable.detailData.ppsl_mon_pnsn_dis;
		mon_pnsn_unit 		= DASHBRD01S01.variable.detailData.mon_pnsn_unit;
		ppsl_mon_pnsn_unit 	= DASHBRD01S01.variable.detailData.ppsl_mon_pnsn_unit;
		chartInfo = DASHBRD01S01.variable.detailData.pnsn_recv_graph;
	}
	
	$('#mon_pnsn_dis').html(mon_pnsn_dis);
	$('#ppsl_mon_pnsn_dis').html(ppsl_mon_pnsn_dis);
	$('#mon_pnsn_unit').html(mon_pnsn_unit);
	$('#ppsl_mon_pnsn_unit').html(ppsl_mon_pnsn_unit);
	
	
	DASHBRD01S01.location.printChart(chartInfo);
			
	var ppsl_mon_pnsn_unit = parseInt("" + DASHBRD01S01.variable.detailData.ppsl_mon_pnsn_dis);		
	var mon_pnsn_unit = parseInt(DASHBRD01S01.variable.detailData.mon_pnsn_dis);
	$("#mon_incr_amt").text(ppsl_mon_pnsn_unit - mon_pnsn_unit);
}

// 차트 그리기
DASHBRD01S01.location.printChart = function(chartInfo) {
	//var chartInfo = result.pnsn_recv_graph;
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
	// options 셋팅
	var maxValue = parseInt(chartInfo.vertical_maximum);
	
	// 국민연금 포함 / 미포함 중 맥스값의 최고값을 그래프의 y축으로 사용
	if(parseInt(maxValue) > parseInt(ComUtil.null(DASHBRD01S01.variable.detailData.maxValue, '0'))){
		DASHBRD01S01.variable.detailData.maxValue = maxValue;
	}
	else{
		maxValue = DASHBRD01S01.variable.detailData.maxValue;
	}
	
	var minValue = parseInt(chartInfo.vertical_minimum);
	var stepSize = 400;
	if(maxValue > 0){
		parseInt(maxValue / 5 / 100) * 100;
	}

	if(maxValue <= 50) { stepSize = 10;}
	else { stepSize = parseInt(parseInt(maxValue / 4 * 100) / 1000) * 10;}
	
	DASHBRD01S01.variable.chart.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	DASHBRD01S01.variable.chart.options.scales.yAxes[0].ticks.min = minValue; 
	DASHBRD01S01.variable.chart.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	// data 셋팅
	DASHBRD01S01.variable.chart.data.datasets[0].label = chartInfo.chart[0].legend_name;
	DASHBRD01S01.variable.chart.data.datasets[0].data = chartInfo.chart[0].value;
	
	DASHBRD01S01.variable.chart.data.datasets[1].label = chartInfo.chart[1].legend_name;
	DASHBRD01S01.variable.chart.data.datasets[1].data = chartInfo.chart[1].value;
	//DASHBRD01S01.variable.chart.data.datasets[1].backgroundColor = chartInfo.chart[1].color;
	
	DASHBRD01S01.variable.chart.data.labels = chartInfo.labels;

	var ctbar = document.getElementById('d1Chart').getContext('2d');
	DASHBRD01S01.variable.chart.myChart = new Chart(ctbar, {
        type 	: 'line',
        data 	: DASHBRD01S01.variable.chart.data,
        options : DASHBRD01S01.variable.chart.options
    });
}

// 차트 초기
DASHBRD01S01.location.initChart = function(){
	var chardInfo = {};
	var ctx = document.getElementById('d1Chart').getContext('2d');
	chardInfo.gradient 	= ctx.createLinearGradient(0, 0, 0, 450);
    chardInfo.gradient2 = ctx.createLinearGradient(0, 0, 0, 450);

    chardInfo.gradient.addColorStop(0, 'rgba(255, 149, 43, 0.5)');
    chardInfo.gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    chardInfo.gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    chardInfo.gradient2.addColorStop(0, 'rgba(153, 153, 153, 0.5)');
    chardInfo.gradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    chardInfo.gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');

	// options
    chardInfo.options ={
        responsive: true,
        aspectRatio:4/3,
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
                    borderDash:[2,3],
                },
                ticks:{
                    stepSize:5,
                    fontColor: "#999999",
					autoSkipPadding:20,
					maxRotation:0
                }
            }],
            yAxes:[{
                gridLines: {
                    display: true,
                    color:'rgb(221, 221, 221)',
                    drawBorder: true,
                    borderDash:[2,3],
                },
                ticks: {
                    min:0,
                    max:1600,
                    stepSize:400,
                    fontColor: "#999999",
                }
            }],
            
        },
        elements: {
            point:{
                radius: 0
            }
        }
    }

	chardInfo.data ={
        labels: ["60세","65세","70세","75세","80세","85세","90세"],
        datasets: [{
            label: '현재',
            data: [200,	820, 450, 400,1000,900,800],
            borderColor: '#28d150', 
            borderWidth: 2,
            fill:'start',
            backgroundColor:'rgba(255, 255, 255, 0)',
            lineTension: 0
         
        },
        {
            label: '자문', 
            data: [800,	1000,500, 1200, 1400,1000,1100], 
            borderColor: '#ff952b', 
            borderWidth: 2,
            fill:'start',
            backgroundColor:'rgba(255, 255, 255, 0)',
            lineTension: 0
            
        }]
    }

	DASHBRD01S01.variable.chart = chardInfo;
}




DASHBRD01S01.init();
