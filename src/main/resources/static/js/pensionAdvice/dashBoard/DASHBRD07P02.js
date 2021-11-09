/**
* 파일명 		: DASHBRD07P02.js (pension-D-07-02)
* 업무		: 연금자만 대시보드 > 머플러제안 > 머플러제안 상세보기 클릭
* 설명		: 머플러 월평균 예상수령액 상세
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.27
* 수정일/내용	: 
*/
var DASHBRD07P02 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD07P02.variable = {
	sendData		: {
		retr_avg_exp_amt : ""							// 은퇴 후 월평균 생활비
	}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,tabIdx			: '2'								// 현재 1 / 제안 2
	,chart1 		: {}								// 상단차트(연금수령액)
	,chart2 		: {}								// 중간차트(연금준비율)
	,lock 			: false								// 중복클릭 제거용
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD07P02.events = {
	'click #tabList_07P02 li'							: 'DASHBRD07P02.event.changeTab'
	,'change input[id="myAnn07P02"]'					: 'DASHBRD07P02.event.changeMyAnn'
	,'click #btnChangeRetrAvgExp'						: 'DASHBRD07P02.event.clickBtnChangeRetrAvgExp'
	,'click a[id^="btnPopup_P03_"]'						: 'DASHBRD07P02.event.clickPopup'
	,'click #btnPopChangeRetrAvgOk'						: 'DASHBRD07P02.event.clickBtnPopChangeRetrAvgOk'
	,'click #btnPopChangeRetrAvgClose, #dimPop0702Close, #btnPop0702Close': 'DASHBRD07P02.event.clickBtnPopChangeRetrAvgClose'
}

DASHBRD07P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD07P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-07-02";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD07P02.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD07P02.location.pageInit = function() {
	{
		$('#tabPanel-1').show();
		
		/*
		// DASHBRD07P02.event.changeTab  에서 구현중
		$(".tab-label-item a").on("click", function(e){
            e.preventDefault();

            //label
            //var target = $(this).attr("href");
            $(".tab-label-item a").removeClass("is_active");
            $(this).addClass("is_active");

            //panel
            //$(".tab-panel").hide();
            //$(target).show();
        });
		*/
		
	    //accor
		$('.accordion-head', $('#P72-content')).click(function(){
	        if($(this).children('i').hasClass('arr_down') === true){
	            $(this).next().show();
	            $(this).children('i').removeClass('arr_down').addClass('arr_up');
	        }else{
	            $(this).next().hide();
	            $(this).children('i').removeClass('arr_up').addClass('arr_down');
	        }
	    });
	}


	// 차트 영역 셋팅
	DASHBRD07P02.location.initChart1();
	DASHBRD07P02.location.initChart2();
	
	// 초기조회
	DASHBRD07P02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 머플러 월평균 예상수령액 조회 (현재/제안)
DASHBRD07P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "receiveMonthlyPension";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/advice_monthly_pension_amt";
	inputParam.data 	= DASHBRD07P02.variable.sendData;
	inputParam.callback	= DASHBRD07P02.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 탭이동시 조회
DASHBRD07P02.event.changeTab = function(e) {
	e.preventDefault();
	
	if(DASHBRD07P02.variable.lock){
		gfn_log("tab lock ing~~");
		return;
	}
	
	gfn_log("changeTab~~");
	var index = ($(this).index())+1;
	DASHBRD07P02.variable.tabIdx = index;
    var active = $(this).children('.tab-label-item a').hasClass('is_active');
    if(active !== true){
        $(this).children('.tab-label-item a').addClass('is_active');
        $(this).siblings().children('.tab-label-item a').removeClass('is_active');
    }

	if(DASHBRD07P02.variable.tabIdx == '1'){
		$('#divPpslMsg').hide();
	}
	else{
		$('#divPpslMsg').show();
	}
	
	//$('#P72-content').trigger("click");
	
	setTimeout(function(){
		// 디스플레이 변경(현재/제안)
		DASHBRD07P02.location.displayDetail();
	}, 1000);
	
}

// 팝업호출
DASHBRD07P02.event.clickPopup = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
	var url = "";
	
	switch(link){
		case 'myPensionRetr'	:	url = "/pension_advice/dashBoard/DASHBRD07P02";		// 퇴직연금 상세보기
			break;
		default 				: 
			break;
	}
	
	var sParam = {};
	sParam.url = url;
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}

// 국민연금 포함여부 변경시
DASHBRD07P02.event.changeMyAnn = function(e) {
	e.preventDefault();
	
	//$('#P72-content').trigger("click");
	setTimeout(function(){
		// 디스플레이 변경(현재/제안)
		DASHBRD07P02.location.displayDetail();
	}, 1000);
}

// 은퇴평균 생활비 변경 클릭 (팝업에서 변경값을 받은후 후처리로 거래 호출한다.)
DASHBRD07P02.event.clickBtnChangeRetrAvgExp = function(e) {
	e.preventDefault();
	
	$('#divPop0702').show();
	
}

// 은퇴평균 생활비 변경 확인 버튼
DASHBRD07P02.event.clickBtnPopChangeRetrAvgOk = function(e) {
	e.preventDefault();
	
	if(ComUtil.isNull($('#newRetireAmt').val())){
		gfn_alertMsgBox('변경할 은퇴생활비를 입력해 주십시요.','', function(){});
		return;
	}
	
	DASHBRD07P02.variable.sendData.retr_avg_exp_amt = $('#newRetireAmt').val();
	DASHBRD07P02.tran.selectDetail();
	$('#divPop0702').hide();
}

DASHBRD07P02.event.clickBtnPopChangeRetrAvgClose = function(e) {
	e.preventDefault();
	
	$('#divPop0702').hide();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
DASHBRD07P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 머플러 월평균 예상수령액 조회 (현재/제안)
	if(sid == "receiveMonthlyPension"){
		
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
		
		DASHBRD07P02.variable.detailData = result;
		
		// 상세화면 그리기
		DASHBRD07P02.location.displayDetail();
		
		if(ComUtil.null(DASHBRD07P02.variable.sendData.retr_avg_exp_amt, 0) > 0){
			// 초기조회
			if( typeof DASHBRD02S01.tran.selectDetail == "function"){
				DASHBRD02S01.tran.selectDetail();
			}
		}
		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

DASHBRD07P02.location.lockItem = function(){
	$('#myAnn07P02').attr("disabled", DASHBRD07P02.variable.lock);
	$('#tabList_07P02').attr("disabled", DASHBRD07P02.variable.lock);
}

// 상세화면 그리기
DASHBRD07P02.location.displayDetail = function(){
	// 여러분 호출시 차트 이상현상 방지
	if(DASHBRD07P02.variable.lock){
		gfn_log("lock ing~~");
		return;
	}
	
	setTimeout(function(){
		gfn_log("lock end~~");
		DASHBRD07P02.variable.lock = false;
		DASHBRD07P02.location.lockItem();
	}, 1000);
	
	gfn_log("lock start~~");
	DASHBRD07P02.variable.lock = true;
	DASHBRD07P02.location.lockItem();
	
	var detailData = DASHBRD07P02.variable.detailData;
	
	var nptrOK = $('#myAnn07P02').is(":checked");	// 국민연금포함여부
	var tabIdx = DASHBRD07P02.variable.tabIdx;	// 현재 1 / 제안 2 
	
	
	
	if(tabIdx == '1'){	// 현재
		if(nptrOK){
			detailData.mon_recv_title 	= "국민연금 포함, 총수령액 현재가치";
			
			// 그래프
			detailData.mon_recv_dis 			= detailData.crnt_tot_mon_recv_dis;
			detailData.mon_recv_unit 			= detailData.crnt_tot_mon_recv_unit;
			detailData.mon_recv_graph			= detailData.crnt_tot_pnsn_recv_graph;
		}
		else{
			detailData.mon_recv_title = "국민연금 미포함, 총수령액 현재가치";
			
			// 그래프
			detailData.mon_recv_dis 			= detailData.crnt_prsn_mon_recv_dis;
			detailData.mon_recv_unit 			= detailData.crnt_prsn_mon_recv_unit;
			detailData.mon_recv_graph			= detailData.crnt_prsn_pnsn_recv_graph;
		}

		// 총연금수령액
		detailData.pnsn_recv_dis			= detailData.crnt_tot_pnsn_recv_dis;
		detailData.pnsn_recv_unit			= detailData.crnt_tot_pnsn_recv_unit;
		
		detailData.retr_pnsn_recv_dis		= detailData.crnt_retr_pnsn_recv_dis;
		detailData.retr_pnsn_recv_unit		= detailData.crnt_retr_pnsn_recv_unit;
		detailData.prsn_pnsn_recv_dis		= detailData.crnt_prsn_pnsn_recv_dis;
		detailData.prsn_pnsn_recv_unit		= detailData.crnt_prsn_pnsn_recv_unit;
		
		// 비율
		detailData.retr_pnsn_recv_amt_dis	= detailData.crnt_retr_pnsn_recv_amt_dis;
		detailData.retr_pnsn_recv_amt_unit	= detailData.crnt_retr_pnsn_recv_amt_unit;
		detailData.prsn_pnsn_recv_amt_dis	= detailData.crnt_prsn_pnsn_recv_amt_dis;
		detailData.prsn_pnsn_recv_amt_unit	= detailData.crnt_prsn_pnsn_recv_amt_unit;
				
		// 연금 준비율
		detailData.retr_rdy_rate			= detailData.crnt_retr_rdy_rate;
		detailData.retr_rdy_dis				= detailData.crnt_retr_rdy_dis;
		detailData.retr_rdy_unit			= detailData.crnt_retr_rdy_unit;
		
		// 상세
		detailData.retr_rdy_expl			= detailData.crnt_retr_rdy_expl;
		
		
		
		detailData.div_sub_title			= "총 연금 수령액";
		
	}
	else{	// 제안
		if(nptrOK){
			detailData.mon_recv_title = "국민연금 포함, 총수령액 현재가치";
			
			// 그래프
			detailData.mon_recv_dis 			= detailData.ppsl_tot_mon_recv_dis;
			detailData.mon_recv_unit 			= detailData.ppsl_tot_mon_recv_unit;
			detailData.mon_recv_graph			= detailData.ppsl_tot_pnsn_recv_graph;
		}
		else{
			detailData.mon_recv_title = "국민연금 미포함, 총수령액 현재가치";
			
			// 그래프
			detailData.mon_recv_dis 			= detailData.ppsl_prsn_mon_recv_dis;
			detailData.mon_recv_unit 			= detailData.ppsl_prsn_mon_recv_unit;
			detailData.mon_recv_graph			= detailData.ppsl_prsn_pnsn_recv_graph;
		}
		
		detailData.pnsn_recv_dis			= detailData.ppsl_tot_pnsn_recv_dis;
		detailData.pnsn_recv_unit			= detailData.ppsl_tot_pnsn_recv_unit;
		
		detailData.retr_pnsn_recv_dis		= detailData.ppsl_retr_pnsn_recv_dis;
		detailData.retr_pnsn_recv_unit		= detailData.ppsl_retr_pnsn_recv_unit;
		detailData.prsn_pnsn_recv_dis		= detailData.ppsl_prsn_pnsn_recv_dis;
		detailData.prsn_pnsn_recv_unit		= detailData.ppsl_prsn_pnsn_recv_unit;
		
		// 비율
		detailData.retr_pnsn_recv_amt_dis	= detailData.ppsl_retr_pnsn_recv_amt_dis;
		detailData.retr_pnsn_recv_amt_unit	= detailData.ppsl_retr_pnsn_recv_amt_unit;
		detailData.prsn_pnsn_recv_amt_dis	= detailData.ppsl_prsn_pnsn_recv_amt_dis;
		detailData.prsn_pnsn_recv_amt_unit	= detailData.ppsl_prsn_pnsn_recv_amt_unit;
				
		// 연금 준비율
		detailData.retr_rdy_rate			= detailData.ppsl_retr_rdy_rate;
		detailData.retr_rdy_dis				= detailData.ppsl_retr_rdy_dis;
		detailData.retr_rdy_unit			= detailData.ppsl_retr_rdy_unit;
		
		// 상세
		detailData.retr_rdy_expl			= detailData.ppsl_retr_rdy_expl;
		
		detailData.div_sub_title			= "마이머플러 제안 금액";
		
	}
	
	
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#P72-content'));
	$('#div_sub_title').html(detailData.div_sub_title);
	// 차트 그리기
	DASHBRD07P02.location.printChart1();
	DASHBRD07P02.location.printChart2();
}


// 차트 그리기
DASHBRD07P02.location.printChart1 = function() {
	var detailData = DASHBRD07P02.variable.detailData;
	//gfn_log("printChart1 s");
	
	var chartInfo = detailData.mon_recv_graph;
	if(ComUtil.isNull(chartInfo)){
		//gfn_log("printChart1 e2");
		return;
	}
	
	// options 셋팅
	var maxValue = parseInt(chartInfo.vertical_maximum);
	
	// 국민연금 포함 / 미포함 중 맥스값의 최고값을 그래프의 y축으로 사용
	if(parseInt(maxValue) > parseInt(ComUtil.null(DASHBRD07P02.variable.detailData.maxValue, '0'))){
		DASHBRD07P02.variable.detailData.maxValue = maxValue;
	}
	else{
		maxValue = DASHBRD07P02.variable.detailData.maxValue;
	}
	
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 4 / 100) * 100;}
	DASHBRD07P02.variable.chart1.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	DASHBRD07P02.variable.chart1.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	// data 셋팅
	DASHBRD07P02.variable.chart1.data.datasets = [];
	$.each(chartInfo.chart, function(index, item){
		var cData = {};
		cData.label 			= item.legend_name;
		cData.data 				= item.value;
		cData.backgroundColor 	= gfn_getChartBackgroundColor(item.legend_name);
        cData.borderColor 		= "#ffffff",
        cData.borderWidth 		= 0;

		DASHBRD07P02.variable.chart1.data.datasets.push(cData);
	});
		
	DASHBRD07P02.variable.chart1.data.labels = chartInfo.labels;

	//gfn_log("printChart1 e1");
	var lChart = new Chart(DASHBRD07P02.variable.chart1.ctx, {
        type :'bar',
        data : DASHBRD07P02.variable.chart1.data,
        options : DASHBRD07P02.variable.chart1.options
		/*,onAnimationProgress: function() {
            gfn_log("onAnimationProgress");
        },
        onAnimationComplete: function() {
            gfn_log("onAnimationComplete");
        }*/
    });

	DASHBRD07P02.variable.chart1.chartObj = lChart;

	//gfn_log("printChart1 e2");
}


DASHBRD07P02.location.printChart2 = function() {
	var detailData = DASHBRD07P02.variable.detailData;
	
	//detailData.retr_rdy_dis				= detailData.ppsl_retr_rdy_dis;
	//detailData.retr_rdy_unit			= detailData.ppsl_retr_rdy_unit;
	
		
	DASHBRD07P02.variable.chart2.data.datasets[0].data[0] 		= (detailData.retr_rdy_dis > 100 ? 100.0 : detailData.retr_rdy_dis);
	DASHBRD07P02.variable.chart2.data.datasets[0].data[1] 		= (detailData.retr_rdy_dis > 100 ? 0 : 100.0 - detailData.retr_rdy_dis);
	//DASHBRD07P02.variable.chart2.options.cutoutPercentage 		= (detailData.retr_rdy_dis > 100 ? 100.0 : detailData.retr_rdy_dis);
	
    var dChart = new Chart(DASHBRD07P02.variable.chart2.ctx, {
        type :'doughnut',
        data : DASHBRD07P02.variable.chart2.data,
        options : DASHBRD07P02.variable.chart2.options
    });

	/*$('#myRdyRateChart').attr('height', DASHBRD07P02.variable.chart2.ctx.canvas.height);
	$('#myRdyRateChart').attr('height', '100px');
	dChart.update();*/
}



// 차트 초기
DASHBRD07P02.location.initChart1 = function(){
	
	var ctbar = document.getElementById('myBarChart').getContext('2d');
	DASHBRD07P02.variable.chart1.ctx = ctbar;
	
	// options
    DASHBRD07P02.variable.chart1.options ={
        responsible:false,
		tooltips: {
            enabled: true
        },
        scales: {
            xAxes: [{
                stacked: true,
                //barPercentage: 0.6,
                display: true,
                beginAtZero: true,
                gridLines: {
                    display: false
                },
                ticks: {
                    min:30,
                    max:100,
                    autoSkip:true,
                    autoSkipPadding:5,
                    maxRotation:0
                },

            }],
            yAxes: [{
                stacked: true,
                display: true,
                gridLines: {
                    display: true,
                    borderDash:[2,10],
                    color:"#888",
                    drawBorder: false
                },
                ticks:{
                    max: 300,
                    stepSize:50,
                    padding:12
                }
            }]
        },
        legend: {
            display: true,
            position:'bottom',
            fontColor:'#474747',
            labels:{
                usePointStyle: true,
                boxWidth:5,
                padding:20,
            }
		}
    }
/*
        },
		onAnimationComplete: function () {
			alert('onAnimationComplete');
		},
		onComplete: function () {
			alert('onComplete');
		}*/

	DASHBRD07P02.variable.chart1.data ={
        labels: ['60세','61세','62세','63세','64세','65세','66세','67세','68세','69세',
        '70세', '71세','72세','73세','74세','75세','76세','77세','78세','79세',
        '80세', '81세','82세','83세','84세','85세','86세','87세','88세','89세',
        '90세', '91세','92세','93세','94세','95세','96세','97세','98세','99세',
        '100세'],
        datasets: []
    }


}


DASHBRD07P02.location.initChart2 = function(){
	var ctx3 = document.getElementById('myRdyRateChart').getContext('2d');
	DASHBRD07P02.variable.chart2.ctx = ctx3;
	
	// round corners
    Chart.pluginService.register({
        afterUpdate: function (chart) {
            if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
                var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
                arc.round = {
                    x: (chart.chartArea.left + chart.chartArea.right) / 2,
                    y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                    radius: (chart.outerRadius + chart.innerRadius) / 2,
                    thickness: (chart.outerRadius - chart.innerRadius) / 2,
                    backgroundColor: arc._model.backgroundColor
                }
            }
        },

        afterDraw: function (chart) {
            if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
                var ctx = chart.chart.ctx;
                var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
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
        },
    });

	// options
    DASHBRD07P02.variable.chart2.options ={
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
	}
	
	var selectBgColor = 'rgb(40, 209, 80)';
	
	// data
	DASHBRD07P02.variable.chart2.data ={
		labels: ['연금준비율'],
        datasets: [{
            label: '# of Votes',
            data: [38],
            backgroundColor: [
                selectBgColor
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                selectBgColor
            ]
        }]
	}
	
	/*new Chart(DASHBRD07P02.variable.chart2.ctx, {
        type :'doughnut',
        data : DASHBRD07P02.variable.chart2.data,
        options : DASHBRD07P02.variable.chart2.options
    });*/

	/*// draw options
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
    }

    var selectBgColor = 'rgb(40, 209, 80)';
        
    //data3
    var data3={
        labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [38,100-50],
            backgroundColor: [
                selectBgColor
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                selectBgColor
            ]
        }]
    }

    
    var ctx3 = document.getElementById('myRdyRateChart').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : data3,
        options : options3
    });*/

}


DASHBRD07P02.init();
