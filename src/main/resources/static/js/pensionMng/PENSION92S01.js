/**
* 파일명 		: PENSION92S01.js (m-12-01)
* 업무		: 적립액 상세보기				
* 설명		: 적립액 상세보기					
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.03
* 수정일/내용	: 
*/
var PENSION92S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION92S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION92S01.events = {
	 'change #checkTerm' 								: 'PENSION92S01.event.changeCheckTerm'
}

PENSION92S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION92S01');	
	
	$("#pTitle").text("적립액 상세보기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION92S01.location.pageInit();
}


// 화면내 초기화 부분
PENSION92S01.location.pageInit = function() {
	
	// 연금관리메인조회	
	PENSION92S01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION92S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionMngDetailList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/reserved_amt_detail";
	inputParam.data 	= {};
	inputParam.callback	= PENSION92S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 장기추이 체크박스 변경
PENSION92S01.event.changeCheckTerm = function(e){
 	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}	
	
	if(ComUtil.isNull(PENSION92S01.variable.detailData)){
		return;
	}
	
	// 차트 그리기
	PENSION92S01.location.displayChart();
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION92S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionMngDetailList"){
		PENSION92S01.variable.detailData = result;
		
		// 상세 셋팅 
		PENSION92S01.location.displayDetail();
		// 차트 그리기
		PENSION92S01.location.displayChart();
				
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSION92S01.location.displayDetail = function(){
	var detailData = PENSION92S01.variable.detailData;
	
	// 상세내역 세팅
	gfn_setDetails(detailData, $('#f-content'));

}

// 차트 그리기
PENSION92S01.location.displayChart = function(){
	var detailData = PENSION92S01.variable.detailData;
	var chartInfo = null;
	
	if($('#checkTerm').is(':checked')){
		chartInfo = detailData.long_term_trend_chart;
	}else{
		chartInfo = detailData.short_term_trend_chart;
	}
	
	if( ComUtil.isNull(chartInfo) ){
		return;
	}
			
	//bg color
    const ctx4 = document.getElementById('lineChart2').getContext('2d');

    //data4
    var data4={
        labels: ['21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31'],
        datasets: [{
            label: '목표적립액',
            data: [50,50,100,100,150,200,220,220,220],
            borderColor: '#888',
            borderWidth: 2,
            backgroundColor: 'transparent',
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
            backgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            borderWidth:2,
            lineTension:0,
            }
        ]
    }

	// 데이터 설정
	data4.labels = chartInfo.labels													// labels 셋팅 (x축)

	data4.datasets[0].label = chartInfo.chart[0].legend_name						// 목표적립액 label 셋팅
	data4.datasets[0].data = chartInfo.chart[0].value								// 목표적립액 data 셋팅
	
	data4.datasets[1].label = chartInfo.chart[1].legend_name						// 실제적립액 label 셋팅
	data4.datasets[1].data = chartInfo.chart[1].value								// 실제적립액 data 셋팅

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
        aspectRatio:3/2,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    fontColor:"#999999",
                    fontSize:10,
                    padding:5,
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90
                },
                gridLines:{
                    color:'#dddddd'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    fontColor:"#999999",
                    fontSize:10,
                    min:0,
                    max:300,
                    stepSize:50
                },
                gridLines:{
                    color:'#dddddd'
                }
            }]
        },
        animation: {
            easing: "easeInOutBack"
        }
    }
		
	// max / stepsize 설정하기
	var maxValue = parseInt(chartInfo.vertical_maximum / 10) * 10 * 1.2;
	var stepSize = 50;
	if(maxValue <= 50) {stepSize = 10;}
	else if(maxValue <= 100) {stepSize = 20;}
	else if(maxValue <= 300) {stepSize = 50;}
	else if(maxValue <= 500) {stepSize = 100;}
	else if(maxValue <= 1000) {stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options4.scales.yAxes[0].ticks.min			= chartInfo.vertical_minimum;
	options4.scales.yAxes[0].ticks.max			= maxValue;
	options4.scales.yAxes[0].ticks.stepSize		= stepSize;
	
	// 차트
	new Chart(ctx4, {
            type :'line',
            data : data4,
            options : options4
        });
	
}



PENSION92S01.init();
