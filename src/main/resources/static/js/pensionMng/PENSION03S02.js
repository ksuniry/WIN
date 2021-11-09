/**
* 파일명 		: PENSION03S02.js
* 업무		: 연금관리 > 추가저축  (new_m-03-02.html)
* 설명		: 저축 대비 연금수령액 시뷸레이션 결과를 보여준다.
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/

var PENSION03S02 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION03S02.variable = {
	sendData		: {
						pay_amt_cd : "1"		// 1:세액공제한도/2:연간압입한
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,chart 			: {}						// 차트 변수값 저장소
	,showMenu		: false						// default : true
}

/* 이벤트 정의 */
PENSION03S02.events = {
	 'click #navi a' 						: 'PENSION03S02.event.clickTab'
	,'click #chooseBox > li'				: 'PENSION03S02.event.changeChoice'
}

PENSION03S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION03S02');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-02";
	gfn_azureAnalytics(inputParam);
	
	PENSION03S02.location.pageInit();
}


// 화면내 초기화 부분
PENSION03S02.location.pageInit = function() {
	// 차트 영역 셋팅
	PENSION03S02.location.initChart();
	
	// 차트의 맥스값 구하기  	
	PENSION03S02.tran.selectInit();
	
	// 추가저축 조회 	
	PENSION03S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 차트의 맥스값 구하기 
PENSION03S02.tran.selectInit = function() {
	
	PENSION03S02.variable.sendData.pay_amt_cd = '2';
	
	var inputParam 		= {};
	inputParam.sid 		= "simulationRecvAmtChartInit";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/simulation_recv_amt_chart";
	inputParam.data 	= PENSION03S02.variable.sendData;
	inputParam.callback	= PENSION03S02.callBack;
	inputParam.bAsync	= false; 
	
	gfn_Transaction( inputParam );
	PENSION03S02.variable.sendData.pay_amt_cd = '1';
}

// 추가저축 조회 
PENSION03S02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "simulationRecvAmtChart";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/simulation_recv_amt_chart";
	inputParam.data 	= PENSION03S02.variable.sendData;
	inputParam.callback	= PENSION03S02.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

/*tab 영역 클릭시*/ 
PENSION03S02.event.clickTab = function(e){
	e.preventDefault();

	var linkUrl = "";
	var page = $(this).data('link'); 
	
	switch(page){
		case 'addSave' 			: linkUrl = "/pension_mng/PENSION03S02"; break;	// 추가저축  
		case 'limitSave' 		: linkUrl = "/pension_mng/PENSION03S03"; break;	// 저축한도 
		//case 'changeProd' 		: linkUrl = "/pension_mng/PENSION03S04"; break; // 상품변경
		case 'adviceHistory' 	: linkUrl = "/pension_mng/PENSION03S05"; break;	// 자문이력
		default : return; 
	}

	ComUtil.moveLink(linkUrl, false);
}

/*납입기간 변경시*/
PENSION03S02.event.changeChoice = function(e){
	e.preventDefault();
	
	if($(this).children().hasClass("is_active") !== true){
        $(this).children().addClass("is_active");
        $(this).siblings().children().removeClass("is_active");

		PENSION03S02.variable.sendData.pay_amt_cd = $(this).data("paycd");
		// 추가저축 조회
		PENSION03S02.tran.selectDetail();
    }else{
    }


}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION03S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "simulationRecvAmtChartInit"){
		PENSION03S02.variable.vertical_maximum = result.pnsn_recv_amt_graph.vertical_maximum;
	}
	
	if(sid == "simulationRecvAmtChart"){
		PENSION03S02.variable.detailData = result;
		gfn_setDetails(PENSION03S02.variable.detailData, $('#f-content'));
		
		$('#chartPaycd1').hide();
		$('#chartPaycd2').hide();
		gfn_log("PENSION03S02.variable.sendData.pay_amt_cd : " + PENSION03S02.variable.sendData.pay_amt_cd );
		$('#chartPaycd'+PENSION03S02.variable.sendData.pay_amt_cd).show();
		
		PENSION03S02.location.printChart(result);
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 차트 그리기
PENSION03S02.location.printChart = function(result) {
	var chartInfo = result.pnsn_recv_amt_graph;
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
	// options 셋팅
	//var maxValue = parseInt(chartInfo.vertical_maximum);
	var maxValue = parseInt(PENSION03S02.variable.vertical_maximum);
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100 + 1) * 100;}
	PENSION03S02.variable.chart.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	PENSION03S02.variable.chart.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	// data 셋팅
	PENSION03S02.variable.chart.data.datasets[0].label = chartInfo.chart[0].legend_name;
	PENSION03S02.variable.chart.data.datasets[0].data = chartInfo.chart[0].value;
	PENSION03S02.variable.chart.data.datasets[0].backgroundColor = chartInfo.chart[0].color;
	
	PENSION03S02.variable.chart.data.datasets[1].label = chartInfo.chart[1].legend_name;
	PENSION03S02.variable.chart.data.datasets[1].data = chartInfo.chart[1].value;
	PENSION03S02.variable.chart.data.datasets[1].backgroundColor = chartInfo.chart[1].color;
	
	PENSION03S02.variable.chart.data.labels = chartInfo.labels;


/*	
	PENSION03S02.variable.chart.data.datasets[0].data = [210, 170, 100, 100, 100, 210, 220, 230, 210, 210,
             190,190,185,185,220,170, 170,170, 170,170,
             240,240,240,200,200, 180, 160,160,160,160,
             90,90,90,90,90,90,90,90,90,90,90];
    // label: '연금저축/개인IRP'
	PENSION03S02.variable.chart.data.datasets[1].data = [210, 170, 100, 100, 100, 210, 220, 230, 210, 210,
             190,190,185,185,220,170, 170,170, 170,200,
             240,240,240,200,200, 180, 160,160,160,200,
             90,90,90,90,90,90,90,90,90,90,90];
	PENSION03S02.variable.chart.data.labels = ['160세','161세','162세','163세','164세','165세','166세','167세','168세','169세',
        '70세', '71세','172세','173세','174세','175세','176세','177세','178세','179세',
        '80세', '81세','182세','183세','184세','185세','186세','187세','188세','189세',
        '90세', '91세','192세','193세','194세','195세','196세','197세','198세','199세',
        '100세'];
*/

	var ctbar = document.getElementById('myBarChart'+PENSION03S02.variable.sendData.pay_amt_cd).getContext('2d');
	PENSION03S02.variable.chart.myChart = new Chart(ctbar, {
        type :'bar',
        data : PENSION03S02.variable.chart.data,
        options : PENSION03S02.variable.chart.options
    });
    //PENSION03S02.variable.chart.myChart.update();
	
}


// 차트 초기
PENSION03S02.location.initChart = function(){
	
	
	// options
    PENSION03S02.variable.chart.options ={
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
                    min:60,
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


	//PENSION03S02.variable.chart.data = {};
	PENSION03S02.variable.chart.data ={
        labels: ['60세','61세','62세','63세','64세','65세','66세','67세','68세','69세',
        '70세', '71세','72세','73세','74세','75세','76세','77세','78세','79세',
        '80세', '81세','82세','83세','84세','85세','86세','87세','88세','89세',
        '90세', '91세','92세','93세','94세','95세','96세','97세','98세','99세',
        '100세'],
        datasets: [{
            label: '개인연금',
            data: [210, 170, 100, 100, 100, 210, 220, 230, 210, 210,
             190,190,185,185,220,170, 170,170, 170,170,
             240,240,240,200,200, 180, 160,160,160,160,
             90,90,90,90,90,90,90,90,90,90,90],
            backgroundColor: 'rgb(153, 153, 153)', // gray
            borderColor: "#ffffff",
            borderWidth:0
        },{
            label: '연금저축/개인IRP',
            data: [0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,70,80,80,80,80,
            20, 20, 20, 40, 40, 40,40,40,10,200,
            35,35,35,35,0,0,0,0,0,0,0],
            backgroundColor: 'rgb(255, 149, 43)', //orange
            borderColor: "#ffffff",
            borderWidth:0
        }]
    }

	/*var ctbar = document.getElementById('myBarChart_0302').getContext('2d');
	PENSION03S02.variable.chart.myChart = new Chart(ctbar, {
        type :'bar',
        data : PENSION03S02.variable.chart.data,
        options : PENSION03S02.variable.chart.options
    });*/
}


PENSION03S02.init();
