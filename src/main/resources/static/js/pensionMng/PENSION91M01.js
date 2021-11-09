/**
* 파일명 		: PENSION91M01.js (m-11-01)
* 업무		: 연금관리 메인			
* 설명		: 연금관리 메인			
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.03
* 수정일/내용	: 
*/
var PENSION91M01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION91M01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'dash'							// 해더영역 디자인    default 는 normal
	,showMenu		: true								// default : true
}

/* 이벤트 정의 */
PENSION91M01.events = {
	  'click #moveDetail' 									: 'PENSION91M01.event.clickMoveDetail'
	 ,'click #increaseReserve' 								: 'PENSION91M01.event.clickIncreaseReserve'
	 ,'click #modifyPortfolio' 								: 'PENSION91M01.event.clickModifyPortfolio'

}

PENSION91M01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION91M01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-11-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION91M01.location.pageInit();
}


// 화면내 초기화 부분
PENSION91M01.location.pageInit = function() {
	
	// 연금관리메인조회	
	PENSION91M01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION91M01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionMngMainlist";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/main_dashboard";
	inputParam.data 	= {};
	inputParam.callback	= PENSION91M01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 목표미달율 클릭시
PENSION91M01.event.clickMoveDetail = function(e) {
	e.preventDefault();
	ComUtil.moveLink('/pension_mng/PENSION92S01'); // 상세 화면이동
}

// 연금수령액 늘리기 클릭시
PENSION91M01.event.clickIncreaseReserve = function(e) {
	e.preventDefault();
	ComUtil.moveLink('/pension_mng/PENSION92S04'); // 연금수려액 늘리기 화면이동
}

// 포트폴리오 변경하기 클릭시
PENSION91M01.event.clickModifyPortfolio = function(e) {
	e.preventDefault();
	ComUtil.moveLink('/pension_mng/PENSION92S01'); // 포트폴리오 변경하기 화면이동
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION91M01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionMngMainlist"){
		PENSION91M01.variable.detailData = result;
		
		// 상세 셋팅 
		PENSION91M01.location.displayDetail();
		// 차트 셋팅
		PENSION91M01.location.displayChart();
				
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSION91M01.location.displayDetail = function(){
	var detailData = PENSION91M01.variable.detailData;
	
	// 상세내역 세팅
	if(detailData.result == 'ok'){
		gfn_setDetails(detailData, $('#f-content'));
	}

	
}

// 차트 설정하기
PENSION91M01.location.initChart = function(){
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

// 차트 그리기
PENSION91M01.location.displayChart = function(){
	
	var detailData = PENSION91M01.variable.detailData;
	
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

        // 연금수령액
        var pensionGetData={
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

        // 포트폴리오
        var pensionPortData={
            labels: ['주식'],
            datasets: [{
                label: '# of Votes',
                data: [50, 10 ,100-50],
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

		pensionGetData.datasets[0].data[0] = detailData.retr_rdy_rate;		// 연금수령액 늘리기 차트 셋팅
		pensionPortData.datasets[0].data[0] = detailData.stck_rate; 		// 포트폴리오 변경하기 - 주식 비율 셋팅
		pensionPortData.datasets[0].data[1] = detailData.bond_rate;		// 포트폴리오 변경하기 - 채권 비율 셋팅
		pensionPortData.datasets[0].data[2] = detailData.cash_rate;		// 포트폴리오 변경하기 - 현금 비율 셋팅			
			

		// 연금수령액 늘리기 차트
        var ctx2 = document.getElementById('myCircle').getContext('2d');
        new Chart(ctx2, {
            type :'doughnut',
            data : pensionGetData,
            options : options3
        });
		
		
		// 포트폴리오 변경하기 차트
        var ctx3 = document.getElementById('myCircle2').getContext('2d');
        new Chart(ctx3, {
            type :'doughnut',
            data : pensionPortData,
            options : options3
        });

        //bg color
        const ctx4 = document.getElementById('lineChart').getContext('2d'),
            chartBgGradient01 = ctx4.createLinearGradient(0, 0, 0, 200),
            chartBgGradient02 = ctx4.createLinearGradient(0, 0, 0, 200);

            chartBgGradient01.addColorStop(0, 'rgba(153, 153, 153, 0.9)');
            chartBgGradient01.addColorStop(0.5, 'rgba(153, 153, 153, 0.4)');
            chartBgGradient01.addColorStop(0.7, 'rgba(153, 153, 153, 0.05)');
            chartBgGradient01.addColorStop(1, 'rgba(153, 153, 153, 0)');

            chartBgGradient02.addColorStop(0, 'rgba(255, 149, 43, 0.9)');
            chartBgGradient02.addColorStop(0.5, 'rgba(255, 149, 43, 0.4)');
            chartBgGradient02.addColorStop(0.7, 'rgba(255, 149, 43, 0.05)');
            chartBgGradient02.addColorStop(1, 'rgba(255, 149, 43, 0)');


        //data4
        var pensionAccumData={
            labels: ['30','35','40','45','50','55','60'],
            datasets: [{
                label: '목표적립액',
                data: [50,50,100,100,150,200,250],
                borderColor: '#888',
                borderWidth: 2,
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
                borderColor: '#ff952b',
                borderWidth: 2,
                backgroundColor: chartBgGradient02,
                //pointBackgroundColor: '#ff952b',
                pointBackgroundColor: 'transparent',
                pointBorderColor: 'transparent',
                pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
                borderWidth:2,
                lineTension:0,
                }
            ]
        }


		//자문계좌 적립액 차트 셋팅
		pensionAccumData.labels = detailData.pay_graph["labels"]								// labels 셋팅
		pensionAccumData.datasets[0].label = detailData.pay_graph["chart"][0].legend_name		// 목표적립액 label 셋팅
		pensionAccumData.datasets[1].label = detailData.pay_graph["chart"][1].legend_name		// 실제적립액 label 셋팅
		pensionAccumData.datasets[0].data = detailData.pay_graph["chart"][0].value				// 목표적립액 value 셋팅
		pensionAccumData.datasets[1].data = detailData.pay_graph["chart"][1].value				// 실제적립액 value 셋팅


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
                    display: false,
                    ticks: {
                        min:0,
                        max:300,
                        stepSize:50,
                    }
                }]
            },
            animation: {
                easing: "easeInOutBack"
            }
        }
				

        //자문계좌 적립액 차트
        new Chart(ctx4, {
            type :'line',
            data : pensionAccumData,
            options : options4
        });
}




PENSION91M01.init();
