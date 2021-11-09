/**
* 파일명 		: PENSION11M01.js 
* 업무		: 웰컴보드 > 메인화면 (m-11-01)
* 설명		: 신규 메인 화면 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.03
* 수정일/내용	: 
*/
var PENSION11M01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION11M01.variable = {
	chartInfo 		: {}
	,detailData		: {}								// 조회 결과값
	,noHead			: false								// 해더영역 존재여부 default 는 false
	,headType		: 'dash'
	,showMenu		: true								// default : true
}

/* 이벤트 정의 */
PENSION11M01.events = {
	 'click div[id^="btnCallMovePage_"]'		: 'PENSION11M01.event.clickBtnCallMovePage'	// 화면이동 호출
	,'click h4[id^="btnCallMovePage_"]'			: 'PENSION11M01.event.clickBtnCallMovePage'	// 화면이동 호출
	,'click #btnDetail'							: 'PENSION11M01.event.goDetailInfo'			// 기수 상세화면이동
	,'click #myChart'							: 'PENSION11M01.event.goDetailInfo2'		// 기수 상세화면이동
	,'click #adviceAcntDetail'				    : 'PENSION11M01.event.goAdviceAcntDetail'	// 자문계좌 상세화면이동
	,'click #myPnsnDetail'						: 'PENSION11M01.event.goMyPnsnDetail'		// 모은연금 상세화면이동
	,'click #myRecvPnsn'						: 'PENSION11M01.event.goMyRecvPnsn'			// 받을연금 상세화면이동
	,'click #myRebalancing'                     : 'PENSION11M01.event.goMyRebalancing'  	// 리밸런싱 화면으로 이동
	,'click #btnMonthInvest'                    : 'PENSION11M01.event.clickBtnMonthInvest'  	// 월적립식투자  화면으로 이동
	,'click #btnAdviceReview'                   : 'PENSION11M01.event.clickBtnAdviceReview'  	// 최근 자문내용 다시보기
}

PENSION11M01.init = function(){
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION11M01');
	
	//$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-11-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION11M01.location.pageInit();
}


// 화면내 초기화 부분
PENSION11M01.location.pageInit = function() {
	// 차트 영역 셋팅
	PENSION11M01.location.initChart();
	gfn_historyClear();
	sStorage.setItem('homeUrl', location.pathname);

	// 연금관리 메인 상세내역 조회 	
	PENSION11M01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION11M01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "mainDashboard";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/main_dashboard";
	inputParam.data 	= {};
	inputParam.callback	= PENSION11M01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 연금관리 메인 상세내역 재조회(주문정보 조회하기) 
PENSION11M01.tran.selectDetailRe = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "mainDashboardRe";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/main_dashboard";
	inputParam.data 	= {};
	inputParam.callback	= PENSION11M01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 화면이동
PENSION11M01.event.clickBtnCallMovePage = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	var linkUrl = "";
	
	if(data.type == 'detail'){	// 적립액 상세보기
		linkUrl = "/pension_mng/PENSION12S01";
	}
	else if(data.type == 'myPensionAdd'){	// 연금수령액 늘리기
		linkUrl = "/pension_mng/PENSION12S02";
	}
	else if(data.type == 'portfolioChange'){	// 포트폴리오 변경하기
		linkUrl = "/pension_mng/PENSION12S03";
	}
	else if(data.type == 'myPensionInfo'){	// 내 연금 정보
		linkUrl = "/pension_mng/PENSION12S04";
	}
	else{
		sStorage.setItem("BORDSCF03P12Params", data);
		linkUrl = "/board_mng/BORDSCF03P12";	// 스터디카페 상세내역 보기화면 호출
	}
	
	ComUtil.moveLink(linkUrl); // 화면이동
}

 

// 문제버튼 클릭시
PENSION11M01.event.goDetailInfo = function(e) {
 	e.preventDefault();
	
	var url = "/pension_mng/PENSION02S01";
	ComUtil.moveLink(url);
}

// 차크 클릭시
PENSION11M01.event.goDetailInfo2 = function(e) {
 	e.preventDefault();

	sStorage.setItem("sParams", {idx:1});	// 기수
	var url = "/pension_mng/PENSION02S01";
	ComUtil.moveLink(url);
}

//자문계좌 상세보기 클릭시
PENSION11M01.event.goAdviceAcntDetail = function(e) {
	e.preventDefault();
	
	var url = "/pension_mng/PENSION12S01";
	ComUtil.moveLink(url);
} 


// 모은연금 상세보기 클릭시
PENSION11M01.event.goMyPnsnDetail = function(e) {
	e.preventDefault();
	
	var url = "/pension_mng/PENSION12S04";
	ComUtil.moveLink(url);
}

// 받을연금 상세보기 클릭시
PENSION11M01.event.goMyRecvPnsn = function(e) {
	e.preventDefault();
	
	var url = "/pension_mng/PENSION12S05";
	ComUtil.moveLink(url);
}

//리밸런싱 클릭시
PENSION11M01.event.goMyRebalancing = function(e) {
	e.preventDefault();
	
	var url = "/pension_mng/PENSION12S06";
	ComUtil.moveLink(url);
}

//월적립식 투자 화면 이동 
PENSION11M01.event.clickBtnMonthInvest = function(e) {
	e.preventDefault();
	
	//var url = "/wait_progress/WAITPRO03S01";
	//ComUtil.moveLink(url);
	var sParam = {};
	sParam.url = '/wait_progress/WAITPRO03P01'; // 월 적립식 투자 화면으로 이동
	gfn_callPopup(sParam, function(){});
}


//최근 자문내용 다시보기
PENSION11M01.event.clickBtnAdviceReview = function(e) {
	e.preventDefault();
	
	// 연금관리 메인 상세내역 재조회(주문정보 조회하기) 
	PENSION11M01.tran.selectDetailRe();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSION11M01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			// 어디로 가나??
		return;
	}
	
	
	if(sid == "mainDashboard"){
		PENSION11M01.variable.detailData = result;
		
		
		// 내연금정보 셋팅
		PENSION11M01.location.displayMyPension();
		
		// 알람조회
		gfn_reloadAlarm();
		
		// order popup call
		PENSION11M01.location.callOrderPopup('N');
	}
	
	if(sid == "mainDashboardRe"){
		PENSION11M01.variable.detailData = result;
		
		// 내연금정보 셋팅
		PENSION11M01.location.displayMyPension();
		
		// order popup call
		PENSION11M01.location.callOrderPopup('Y');
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 나의 연금 영역 표시
PENSION11M01.location.displayMyPension = function(){
	var detailData = PENSION11M01.variable.detailData;
	
	// 날짜 셋팅
	detailData.next_advc_dt = ComUtil.string.dateFormat(detailData.next_advc_dt);
	
	
	gfn_setDetails(detailData, $('#f-content'));
	
	// 최근 자문내용 다시보기 버튼 셋팅 
	if( ComUtil.null(PENSION11M01.variable.detailData.advc_execute_cnt, 0) > 0){
		$('#btnAdviceReview').show();
	}
	
	// 숫자 또르르..
	//ComUtil.number.setDigitCount('#noti_pay_dis', 200, 1200);
	
	
	// 차트 그리기
	//PENSION11M01.location.displayChartCircle();
	PENSION11M01.location.displayChartLine2();
}



// order popup call
PENSION11M01.location.callOrderPopup = function(reYn){
	
	if(  ComUtil.null(PENSION11M01.variable.detailData.buy_order_yn, 'N') == 'Y'
	  || ComUtil.null(PENSION11M01.variable.detailData.sell_order_yn, 'N') == 'Y'
	  ){
		var sParam = {};
		sParam.url = '/pension_execution/order/ORDREXE01P01';
		gfn_callPopup(sParam, function(){
			//sStorage.setItem('endOrderYn', 'Y');
			
			if("Y" == reYn){
				// 자문실행 화면으로 이동
				PENSION11M01.location.callExecPopup();
			}
			else{
				// 자문내용 다시보기 로 클릭시   advc_exe_status (1 : 실행중 / 2 :실행완료)
				if(PENSION11M01.variable.detailData.advc_exe_status == '1'){
					// 자문실행 화면으로 이동
					PENSION11M01.location.callExecPopup();
				}
			}
		});
	}
	else{ 
		if("Y" == reYn){
			// 자문실행 화면으로 이동
			PENSION11M01.location.callExecPopup();
		}
		else{
			// 자문내용 다시보기 로 클릭시   advc_exe_status (1 : 실행중 / 2 :실행완료)
			if(PENSION11M01.variable.detailData.advc_exe_status == '1'){
				// 자문실행 화면으로 이동
				PENSION11M01.location.callExecPopup();
			}
		}
	}
	
}

// // 자문실행  popup call
PENSION11M01.location.callExecPopup = function(){
	if( ComUtil.null(PENSION11M01.variable.detailData.advc_execute_cnt, 0) > 0){
		var sParam = {};
		sParam.url = '/wait_progress/WAITPRO01P01';
		gfn_callPopup(sParam, function(){});
		
		//var url = "/wait_progress/WAITPRO01S01";
		//ComUtil.moveLink(url);
	}
}

// 차트 그리기
PENSION11M01.location.displayChartCircle = function(){
	var detailData = PENSION11M01.variable.detailData;
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
    }

    var selectBgColor = 'rgb(40, 209, 80)';
    var selectBgColor2 = 'rgb(253, 242, 106)';
	var selectBgColor3 = 'rgb(255 , 149 , 43)'; // 21-06-14 수정
	
	// 연금준비율 
    //data2
    var data2={
        labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [65, 0 ,100-50],
            backgroundColor: [
                selectBgColor,
                selectBgColor2
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                selectBgColor,
                selectBgColor2
            ]
        }]
    }

	data2.datasets[0].data[0] = ComUtil.null(detailData.retr_rdy_dis, '0');

	// 포트폴리오 (주식, 채권, 현금 비중)
    //data3
    var data3={
        labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [50, 10 ,20],
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

	data3.datasets[0].data[0] = ComUtil.null(detailData.stck_dis, '0');	// 주식
	data3.datasets[0].data[1] = ComUtil.null(detailData.bond_dis, '0');	// 채권
	data3.datasets[0].data[2] = ComUtil.null(detailData.cash_dis, '0');	// 현금


    var ctx2 = document.getElementById('myCircle').getContext('2d');
    new Chart(ctx2, {
        type :'doughnut',
        data : data2,
        options : options3
    });

    var ctx3 = document.getElementById('myCircle2').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : data3,
        options : options3
    });
}


// 차트 그리기2
PENSION11M01.location.displayChartLine = function(){
	var detailData = PENSION11M01.variable.detailData;
	
	if( ComUtil.isNull(detailData.pay_graph) ){
		return;
	}
	
	//bg color
    const ctx4 = document.getElementById('lineChart').getContext('2d'),
        chartBgGradient01 = ctx4.createLinearGradient(0, 0, 0, 200),
        chartBgGradient02 = ctx4.createLinearGradient(0, 0, 0, 200);

        chartBgGradient01.addColorStop(0, 'rgba(255, 149, 43, 0.9)');  // 21-06-14 수정
	    chartBgGradient01.addColorStop(0.5, 'rgba(255, 149, 43, 0.4)');
	    chartBgGradient01.addColorStop(0.7, 'rgba(255, 149, 43, 0.1)');
	    chartBgGradient01.addColorStop(1, 'rgba(153, 153, 153, 0)');
	
	    chartBgGradient02.addColorStop(0, 'rgba(40, 209, 80, 0.9)');  // 21-06-14 수정
	    chartBgGradient02.addColorStop(0.5, 'rgba(40, 209, 80, 0.4)');
	    chartBgGradient02.addColorStop(0.7, 'rgba(40, 209, 80, 0.1)');
	    chartBgGradient02.addColorStop(1, 'rgba(255, 149, 43, 0)');

	var today = ['75'];
    var arrow = new Image();
    arrow.src = '/images/triangle_down.svg';

	var annotations = today.map(function(old) {
        return {
            type: 'line',
            id: 'dashLine',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            yScaleID: 'y-axis-0',
            value: old,
            borderColor: '#333333',
            borderWidth: 1,
            borderDash:[2,3],
            yMin: 0,
            yMax: 100,
            label: {
                enabled: false,
                position: "top",
                //content:arrow
                //content: amount[index]
            }
        }
    });


    //chartData
    var chartData={
        labels: ['30','35','40','45','50','55','60'],
        datasets: [{
            label: '목표적립액',
            data: [50,50,100,100,150,200,250],
            borderColor: '#ff952b', // 21-06-14 수정
            backgroundColor: chartBgGradient01,
            //pointBackgroundColor: '#888',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            borderWidth:2,
            lineTension:0,
            },{
            label: '실제적립액',
            data: [10,40,30,120],
            borderColor: '#28d150', // 21-06-14 수정
            borderWidth: 2,
            backgroundColor: chartBgGradient02,
            //pointBackgroundColor: '#ff952b',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            lineTension:0,
            }
        ]
    };

	chartData.labels 		= detailData.pay_graph.labels;
	// 목표적립액 셋팅 
	chartData.datasets[0].label 		= detailData.pay_graph.chart[0].legend_name;
	chartData.datasets[0].data			= detailData.pay_graph.chart[0].value;
	// 실제적립액 셋팅 
	chartData.datasets[1].label 		= detailData.pay_graph.chart[1].legend_name;
	chartData.datasets[1].data			= detailData.pay_graph.chart[1].value;
	

    var options4 ={
        elements: {
            // point:{
            //     radius: 0
            // },
            line: {
                tension: 0
            }
        },
        layout: { 
            padding: { 
                top:10, 
                left: 0, 
                bottom: 10, 
                right: 0 
            } 
        },

        responsive: true,
        aspectRatio:2/1,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                display: false,
            }],
           yAxes: [{
                    display: true,
                    ticks: {
                        display: false,
                        Padding:0,
                        min:0,
                        max:300,
                        stepSize:50,
                        beginAtZero: true,
                    },
                    gridLines: {
                        drawBorder: false,
                        
                        //zeroLineColor:'transparent'
                    }
                }]
        },
        animation: {
            easing: "easeInOutBack"
        },
	    annotation: {
	        drawTime: 'afterDatasetsDraw',
	        annotations: annotations
	    }
    };

	const originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw : function() {

            originalLineDraw.apply(this, arguments);
            var chart = this.chart;
            var ctx = chart.chart.ctx;
            ctx.save();
            ctx.drawImage(arrow, 0, 0, 12, 12, 100 , 0, 12, 12); // 100 자리에 x 값을 못찾겠습니다
            ctx.restore();
                
        }
    });

	Chart.pluginService.register(originalLineDraw);


	// max / stepSize 샛팅하기
	var maxValue = parseInt(detailData.pay_graph.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options4.scales.yAxes[0].ticks.min			= detailData.pay_graph.vertical_minimum;
	options4.scales.yAxes[0].ticks.max			= maxValue * 1.2;
	options4.scales.yAxes[0].ticks.stepSize		= stepSize;
		

    //자문계좌 적립액 차트
    new Chart(ctx4, {
        type :'line',
        data : chartData,
        options : options4
    });
}


// 차트 초기
PENSION11M01.location.initChart = function(){
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


// 차트 초기
PENSION11M01.location.displayChartLine2 = function(){
	//bg color
    const ctx4 = document.getElementById('lineChart').getContext('2d'),
        chartBgGradient01 = ctx4.createLinearGradient(0, 0, 0, 200),
        chartBgGradient02 = ctx4.createLinearGradient(0, 0, 0, 200);

        chartBgGradient01.addColorStop(0, 'rgba(255, 149, 43, 0.9)');  // 21-06-14 수정
        chartBgGradient01.addColorStop(0.5, 'rgba(255, 149, 43, 0.4)');
        chartBgGradient01.addColorStop(0.7, 'rgba(255, 149, 43, 0.1)');
        chartBgGradient01.addColorStop(1, 'rgba(153, 153, 153, 0)');

        chartBgGradient02.addColorStop(0, 'rgba(40, 209, 80, 0.9)');  // 21-06-14 수정
        chartBgGradient02.addColorStop(0.5, 'rgba(40, 209, 80, 0.4)');
        chartBgGradient02.addColorStop(0.7, 'rgba(40, 209, 80, 0.1)');
        chartBgGradient02.addColorStop(1, 'rgba(255, 149, 43, 0)');
	

    //data4
    var chartData={
        labels: ["60세","65세","70세","75세","80세","85세","90세"],
        datasets: [{
            label: '목표적립액',
            data: [50,50,100,100,150,200,250],
			borderColor: '#ff952b', // 21-06-14 수정
            backgroundColor: chartBgGradient01,
            //pointBackgroundColor: '#888',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            borderWidth:2,
            lineTension:0,
            },{
            label: '실제적립액',
            data: [500,800,500,800,500,800,500],
            borderColor: '#28d150', // 21-06-14 수정
            borderWidth: 2,
            backgroundColor: chartBgGradient02,
            //pointBackgroundColor: '#ff952b',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            lineTension:0,
            }
        ]
    }

    var options4 ={
        elements: {
            // point:{
            //     radius: 0
            // },
            line: {
                tension: 0
            }
        },
        layout: { 
           	padding: { 
                    top:0, 
                    left: -10, 
                    bottom: 1, 
                    right: 0 
            } 
        },

        responsive: true,
        aspectRatio:2/1,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                    display: true,
                    ticks: {
                        display: false,
                        Padding:0,
                        min:0,
                        max:300,
                        stepSize:50,
                        beginAtZero: true,
                    },
                    gridLines: {
                        drawBorder: false,
                        
                        //zeroLineColor:'transparent'
                    }
                }]
        },
        animation: {
            easing: "easeInOutBack"
        },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            annotations: null
        }
    }
    /*const originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
            draw : function() {
                originalLineDraw.apply(this, arguments);
                var chart = this.chart;
                var ctx = chart.chart.ctx;
                ctx.save();
                //ctx.drawImage(arrow, 0, 0, 12, 12, 200 , 0, 12, 12); // 100 자리에 x 값을 못찾겠습니다
                //ctx.drawImage(arrow, PENSION11M01.variable.detailData.imgXpic, 0, 12, 12); // 100 자리에 x 값을 못찾겠습니다
                ctx.restore();
            }
        });*/
	const originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw : function() {

                originalLineDraw.apply(this, arguments);
                var chart = this.chart;
                var ctx = chart.chart.ctx;

                var now = chart.options.annotation.annotations[0].value;
                // 위 annotation의 value
                   
                var xaxis = chart.scales['x-axis-0'];
                var yaxis = chart.scales['y-axis-0'];
                    
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

                ctx.save();
                
                ctx.beginPath();
                ctx.fillStyle = "#333333";
                ctx.roundedRectangle(xaxis.getPixelForValue(now), 30 , 37, 20, 10); 
                ctx.fill();

                ctx.font = "bold 12px Arial";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.fillText("현재", xaxis.getPixelForValue(now) + 17, 45); 
            }
    });
/*
            ctx.beginPath();
            ctx.fillStyle = "#333333";
            //ctx.roundedRectangle(100, 30 , 37, 20, 10);  // 첫번째 100자리에 xPoint
			ctx.roundedRectangle(PENSION11M01.variable.detailData.imgXpic + 5, 0, 37, 20, 10);  // 첫번째 100자리에 xPoint
            ctx.fill();

            ctx.font = "bold 12px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            //ctx.fillText("현재", 100 + 17, 45);   // 첫번째 100자리에 xPoint
			ctx.fillText("현재", PENSION11M01.variable.detailData.imgXpic + 20, 15);   // 첫번째 100자리에 xPoint  
*/
        
        //Chart.pluginService.register(originalLineDraw);

	// data setting
	var detailData = PENSION11M01.variable.detailData;
	
	if( ComUtil.isNull(detailData.pay_graph) ){
		return;
	}
	
	chartData.labels 		= detailData.pay_graph.labels;
	// 목표적립액 셋팅 
	chartData.datasets[0].label 		= detailData.pay_graph.chart[0].legend_name;
	chartData.datasets[0].data			= detailData.pay_graph.chart[0].value;
	// 실제적립액 셋팅 
	chartData.datasets[1].label 		= detailData.pay_graph.chart[1].legend_name;
	chartData.datasets[1].data			= detailData.pay_graph.chart[1].value;
	
	
	// max / stepSize 샛팅하기
	var maxValue = parseInt(detailData.pay_graph.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options4.scales.yAxes[0].ticks.min			= detailData.pay_graph.vertical_minimum;
	options4.scales.yAxes[0].ticks.max			= maxValue * 1.2;
	options4.scales.yAxes[0].ticks.stepSize		= stepSize;
	//-- data setting
	
	// 점선 그리기 
	var today = [chartData.labels[ComUtil.null(chartData.datasets[1].data.length, 1) - 1]];
	//var today = ['2021-11'];
    //var arrow = new Image();
   // arrow.src = '/images/triangle_down.svg';

    var annotations = today.map(function(old) {
	//var showDate = ComUtil.date.curDate("YYYY-MM-DD");
        return {
            type: 'line',
            id: 'dashLine',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            yScaleID: 'y-axis-0',
            value: old,
            borderColor: '#aaaaaa',
            borderWidth: 1,
            borderDash:[2,3],
            yMin: 0,
            yMax: 1000,
            label: {
                enabled: false,
                position: "top",
				content: '현재',
                backgroundColor:'rgb(102, 102, 102)',
                fontSize:11
            }
        }
    });

	options4.annotation.annotations = annotations;


    //자문계좌 적립액 차트
    var lineChartObj = new Chart(ctx4, {
        type :'line',
        data : chartData,
        options : options4
    });

	var xFullSize = lineChartObj.chartArea.right - lineChartObj.chartArea.left;
	var perSize = xFullSize / chartData.datasets[0].data.length;
	if(ComUtil.null(chartData.datasets[1].data.length, 1) == 1){
		detailData.imgXpic = -100;	// 우선 화면에서 사라지게 함 
		//detailData.imgXpic = 0;	// 우선 화면에서 사라지게 함 
	}
	else{
		if(!ComUtil.isNull(chartData.datasets[1].data)){
			var len = chartData.datasets[1].data.length;
			var bojung = 3;
			switch(len){
				case 2 : bojung = -3;
						break;
				case 3 : bojung = 0;
						break;
				case 4 : bojung = 2.3;
						break;
				case 5 : bojung = 5;
						break;
				case 6 : bojung = 7.5;
						break;
				case 7 : bojung = 10;
						break;
				default : bojung = 2.4(len-3);
						break;
			}
	
			//좌표 위 '현재' 텍스트 좌측으로 좀 더 위치 보정 하기 위해 끝에 -3을 붙임.		
			detailData.imgXpic = perSize * (ComUtil.null(chartData.datasets[1].data.length, 1) - 1) + bojung - 3;
		}

	}
	//detailData.imgXpic = ComUtil.null(chartData.datasets[1].data.length, 1) == 1 ? 0 : detailData.imgXpic; 
	gfn_log(chartData.datasets[0].data.length);
	gfn_log(lineChartObj.chartArea);
}




PENSION11M01.init();
