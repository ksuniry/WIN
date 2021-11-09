/**
* 파일명 		: PENSION12S01.js 
* 업무		: 웰컴보드 > 신규 메인 화면 > 적립액 상세보기 (m-12-01)
* 설명		: 적립액 상세보기 화면 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.03
* 수정일/내용	: 
*/
var PENSION12S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION12S01.variable = {
	sendData		: {}							// 조회시 조건
	,detailData		: {}							// 조회 결과값
	,initParamData	: {}							// 이전화면에서 받은 파라미터
	,headType		: 'normal'						// 해더영역 디자인    default 는 normal
	,showMenu		: false							// default : true
}

/* 이벤트 정의 */
PENSION12S01.events = {
	 'change #longTerm'					: 'PENSION12S01.event.changeLongTerm'
	,'change #acnt_longTerm'    		: 'PENSION12S01.event.changeAcntLongTerm'
	,'change #acntList'					: 'PENSION12S01.event.changeList'
    ,'click #tabList_12S01 li' 			: 'PENSION12S01.event.changeTab'
    ,'click li[id^="acntDetail_"]' 		: 'PENSION12S01.event.clickAcntDetail'
}


PENSION12S01.event.changeList = function() {
	var test = $(this).prop("data-idx");
	alert(test);
}

PENSION12S01.init = function(){
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION12S01');
	
	$("#pTitle").text("적립액 상세보기");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION12S01.location.pageInit();
}


// 화면내 초기화 부분
PENSION12S01.location.pageInit = function() {
	$("#tabPanel-1").show();
	$("#tabPanel-2").hide();	
	
	
	{	
		//'계좌 리스트' 셀렉트 박스 클릭시 이벤트
		$("#selectDropTitle").click(function(){
	        $(".select-ico").addClass("arr_up");
	        $(".select-dropmenu").toggleClass("showMenu");
	        
	    });

		$(document).mouseup(e => {
            if (!$('.select-wrap').is(e.target) && $('.select-wrap').has(e.target).length === 0){
                $('#selectDropTitle').removeClass('active');
                $(".select-dropmenu").removeClass("showMenu");
                $(".select-ico").removeClass("arr_up");
            }
        });
	}
	

	// 연금관리 메인 상세내역 조회 	
	PENSION12S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 상세내역 조회 
PENSION12S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "reservedAmtDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/reserved_amt_detail";	// 적립액 상세보기
	inputParam.data 	= {};
	inputParam.callback	= PENSION12S01.callBack; 
	
	gfn_Transaction( inputParam );
}


// 탭이동시 조회
PENSION12S01.event.changeTab = function(e) {
	e.preventDefault();
	
	/*if(PENSION12S01.variable.lock){
		gfn_log("tab lock ing~~");
		return;
	}*/

	var index = ($(this).index())+1;
	PENSION12S01.variable.tabIdx = index;
    var active = $(this).children('.tab-label-item a').hasClass('is_active');

    if(active !== true){
        $(this).children('.tab-label-item a').addClass('is_active');
        $(this).siblings().children('.tab-label-item a').removeClass('is_active');
    }
	
	if(index == "1"){
		$("#tabPanel-1").show();
		$("#tabPanel-2").hide();
		$("#lineChart2").show();
		$("#lineChart3").hide();	
	}else if(index == "2"){
		$("#tabPanel-2").show();
		$("#tabPanel-1").hide();
		$("#lineChart3").show();
		$("#lineChart2").hide();
	}
	
	/*setTimeout(function(){
		// 디스플레이 변경(현재/제안)
		PENSION12S01.location.displayDetail();
	}, 1000);*/

}

// 계좌 선택시 
PENSION12S01.event.clickAcntDetail = function(e) {
	e.preventDefault();
	
	$("#selectDropTitle > p").text($(this).text());
    $("#acntListArea").removeClass("showMenu");
    $(".select-ico").removeClass("arr_up");

	//셀렉트 박스에서 선택된 계좌의 인덱스 전달
	PENSION12S01.variable.acntDetailIdx = $(this).data('idx') -1;
	PENSION12S01.location.displayAcnt($(this).data());
	PENSION12S01.location.displayChart2(PENSION12S01.variable.acntDetailIdx);
	//뱃지 변경
	PENSION12S01.location.changeStatusBadge($(this).data(), $('#tabPanel-2'));
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 장기추이 체크박스 변경
PENSION12S01.event.changeLongTerm = function(e) {

 	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	if(ComUtil.isNull(PENSION12S01.variable.detailData)){
		return;
	}
	
	PENSION12S01.location.displayMyPension();
}

// 계좌별 적립액 장기추이 체크 박스 
PENSION12S01.event.changeAcntLongTerm = function(e) {
	e.preventDefault();
	var idx = ComUtil.null(PENSION12S01.variable.acntDetailIdx, 0);
	PENSION12S01.location.displayChart2(idx);
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSION12S01.callBack = function(sid, result, success){
	
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
	
	// 적립액 상세보기
	if(sid == "reservedAmtDetail"){
		PENSION12S01.variable.detailData = result;
		
		// 셋팅
		PENSION12S01.location.displayMyPension();
		
		// 숫자 또르르..
		ComUtil.number.setDigitCount('#noti_pay_dis', 200, 1200);
		
		// 계좌별 적립액 탭 선택 
		$('#acntDetail_1').trigger('click');
	}
}

////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 나의 연금 영역 표시
PENSION12S01.location.displayMyPension = function(){
	var detailData = PENSION12S01.variable.detailData;
	
	
	// 초기화
	$("#acntListArea").html('');
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.reserved_amt_detail_list, function(index, item){
		item.idx = index + 1;
		
		var html = template(item);
		$("#acntListArea").append(html);
		$('#acntDetail_' + item.idx).data(item);
	});
	
	
	gfn_setDetails(detailData.reserved_amt_detail_total, $('#tabPanel-1'));
	
	
	// '적립액 합계' 차트 그리기
	PENSION12S01.location.displayChart();
	
	//뱃지 변경
	PENSION12S01.location.changeStatusBadge(detailData.reserved_amt_detail_total, $('#tabPanel-1'));
	
	// '계좌별 적립액' 차트 그리기
	//PENSION12S01.location.displayChart2();
}


// 계좌선택이 변경 되면 화면에 셋팅한다.
PENSION12S01.location.displayAcnt = function(acntData){
	gfn_setDetails(acntData, $('#tabPanel-2'));
}


// '적립액 합계' 차트 그리기
PENSION12S01.location.displayChart = function(){
	var detailData = PENSION12S01.variable.detailData.reserved_amt_detail_total;
	var chartInfo  = null;
	
	if($('#longTerm').is(":checked")){
		chartInfo = detailData.long_term_trend_chart;
	}
	else{
		chartInfo = detailData.short_term_trend_chart;
	}
	
	
	if( ComUtil.isNull(chartInfo) ){
		return;
	}
	
	 //data4
    var data4={
        labels: ['21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31'],
        datasets: [{
            label: '목표적립액',
            data: [50,50,100,100,150,200,220,220,220],
            borderColor: '#ff952b', // 21-06-14 수정
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
            borderColor: '#28d150', // 21-06-14 수정
            borderWidth: 2,
            backgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            borderWidth:2,
            lineTension:0,
            }
        ]
    };


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
                    stepSize:50,
				    beginAtZero:true,
				    callback: function(value, index, values) {
				        value = value.toString();
				        value = value.split(/(?=(?:...)*$)/);
				        value = value.join(',');
				        return value + '만원';
				    }
                },
                gridLines:{
                    color:'#dddddd'
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

	/* 차트에 뿌려줄 데이터 
	 * 설명 : 현재 화면 기준에서는 lable은 X좌표의 년,월 이며,  
	 * data는 그래프(그래픽) 표시 될 수 있도록 값을 담는다.
	 *
	 * [0] 목표적립액, [1] 실제적립액 (뿌려주는 그래프 선이 2개이기 때문에 2개)
     * 더 늘어나면 해당 부분이 늘어나면 된다. (값이 존재 한다는 전제하에)
	 */
	data4.labels = chartInfo.labels;
	
	data4.datasets[0].lable 	= chartInfo.chart[0].legend_name;
	data4.datasets[0].data 		= chartInfo.chart[0].value;

	//테스트 중에는 datasets[1]번의 Parameter는 있으나 실제 데이터가 없어서 화면 녹색 표시가 안됨.
	//아래는 테스트 데이터를 넣어 봄.
	//data4.datasets[1].data = [120, 170, 200, 600, 850];
	
	data4.datasets[1].lable 	= chartInfo.chart[1].legend_name;
	data4.datasets[1].data 		= chartInfo.chart[1].value;
	

	//bg color
    const ctx4 = document.getElementById('lineChart2').getContext('2d');

	const originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
            draw : function() {
                originalLineDraw.apply(this, arguments);
                var chart = this.chart;
                var ctx = chart.chart.ctx;

				var now = chart.options.annotation.annotations[0].value;

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

                //const xPoint = today.xAxes;//**; 현재 x 축 위치값
                
                ctx.beginPath();
                ctx.fillStyle = "#333333";
                //ctx.roundedRectangle(100, 30 , 37, 20, 10);  // 첫번째 100자리에 xPoint
				ctx.roundedRectangle(xaxis.getPixelForValue(now), 30 , 37, 20, 10); 
                ctx.fill();

                ctx.font = "bold 12px Arial";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                //ctx.fillText("현재", 100 + 17, 45);   // 첫번째 100자리에 xPoint
				 ctx.fillText("현재", xaxis.getPixelForValue(now) + 17, 45);   
            }
        });

	// max / stepSize 샛팅하기
	// max / stepSize 샛팅하기
	var maxValue = parseInt(chartInfo.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options4.scales.yAxes[0].ticks.min			= chartInfo.vertical_minimum;
	options4.scales.yAxes[0].ticks.max			= maxValue;
	options4.scales.yAxes[0].ticks.stepSize		= stepSize;

	 //점선 그리기 
	/*var today = [data4.labels[ComUtil.null(data4.datasets[0].data.length, 1) - 12]];*/
	var today = [data4.labels[ComUtil.null(data4.datasets[1].data.length, 1) - 1]];
	 
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
                content: '현재',
                backgroundColor:'rgb(102, 102, 102)',
                fontSize:11
            }
        }
     });

	options4.annotation.annotations = annotations;

	if(!ComUtil.isNull(PENSION12S01.variable.lineChartObj)){
		var lineChartObj = PENSION12S01.variable.lineChartObj;
		lineChartObj.destroy();
	}
    //자문계좌 적립액 차트
    var lineChartObj = new Chart(ctx4, {
        type :'line',
        data : data4,
        options : options4
    });

	PENSION12S01.variable.lineChartObj = lineChartObj;
}


//'계좌별' 적립액 차트 그리기
PENSION12S01.location.displayChart2 = function(idx){
	
	var detailData = PENSION12S01.variable.detailData;
	var chartInfo = null;

	if(ComUtil.isNull(idx)){
		idx = 0;
	}
	
	

	if($('#acnt_longTerm').is(":checked")){
		chartInfo = detailData.reserved_amt_detail_list[idx].long_term_trend_chart;
	}
	else{
		chartInfo = detailData.reserved_amt_detail_list[idx].short_term_trend_chart;
	}
	
	
	if( ComUtil.isNull(chartInfo) ){
		return;
	}
	
	//data5
    var data5={
        labels: ['21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31','21-01-31'],
        datasets: [{
	            label: '목표적립액',
	            data: [50,50,100,100,150,200,220,220,220],
	            borderColor: '#ff952b', // 21-06-14 수정
	            borderWidth: 2,
	            backgroundColor: 'transparent',
	            pointBackgroundColor: 'transparent',
	            pointBorderColor: 'transparent',
	            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
	            lineTension:0,
            },{
	            label: '현재평가액',
	            data: [10,40,30,120],
	            borderColor: '#28d150', // 21-06-14 수정
	            borderWidth: 2,
	            backgroundColor: 'transparent',
	            pointBackgroundColor: 'transparent',
	            pointBorderColor: 'transparent',
	            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
	            lineTension:0,
            }
        ]
    };

 	var options5 ={
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
                    stepSize:50,
				    beginAtZero:true,
				    callback: function(value, index, values) {
				        value = value.toString();
				        value = value.split(/(?=(?:...)*$)/);
				        value = value.join(',');
				        return value + '만원';
				    }
                }
            }]
        },
        animation: {
            easing: "easeInOutBack"
        },
		annotation: {
            drawTime: 'afterDatasetsDraw',
            annotations: annotations1
        }
    };


	data5.labels = chartInfo.labels;
	
	//임시 테스트용
	/*if(idx == 0){
		data5.datasets[0].data = [120, 170, 200, 600, 850, 1000];
		data5.datasets[1].data = [30, 100, 110, 150, 550, 700];
	}else if(idx == 1){
		data5.datasets[0].data = [500, 670, 800, 900, 1050];
		data5.datasets[1].data = [90, 130, 210, 670, 750];
	}else if(idx == 2){
		data5.datasets[0].data = [250, 300, 500, 800, 950];
		data5.datasets[1].data = [70, 250, 410, 650, 850];
	}*/
	
	/* 차트에 뿌려줄 데이터 
	 * 설명 : 현재 화면 기준에서는 lable은 X좌표의 년,월 이며,  
	 * data는 그래프(그래픽) 표시 될 수 있도록 값을 담는다.
	 * [0] 목표적립액, [1] 실제적립액 (뿌려주는 그래프 선이 2개이기 때문에 2개)
     * 더 늘어나면 해당 부분이 늘어나면 된다.
	 */
	
	// 목표적립액
	data5.datasets[0].lable 	= chartInfo.chart[0].legend_name;
	data5.datasets[0].data 		= chartInfo.chart[0].value;
	
	// 현재평가액
	data5.datasets[1].lable 	= chartInfo.chart[1].legend_name;
	data5.datasets[1].data 		= chartInfo.chart[1].value;
	
	
	const ctx5 = document.getElementById('lineChart3').getContext('2d');

	const originalLineDraw2 = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
            draw : function() {

                originalLineDraw2.apply(this, arguments);
                var chart = this.chart;
                var ctx2 = chart.chart.ctx;

				var now = chart.options.annotation.annotations[0].value;

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

                ctx2.save();
                
                ctx2.beginPath();
                ctx2.fillStyle = "#333333";
               	ctx2.roundedRectangle(xaxis.getPixelForValue(now), 30 , 37, 20, 10); 
                ctx2.fill();

                ctx2.font = "bold 12px Arial";
                ctx2.fillStyle = "#ffffff";
                ctx2.textAlign = "center";
				ctx2.fillText("현재", xaxis.getPixelForValue(now) + 17, 45);   
            }
        });


	// max / stepSize 샛팅하기
	// max / stepSize 샛팅하기
	var maxValue = parseInt(chartInfo.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options5.scales.yAxes[0].ticks.min			= chartInfo.vertical_minimum;
	options5.scales.yAxes[0].ticks.max			= maxValue;
	options5.scales.yAxes[0].ticks.stepSize		= stepSize;
	
	var today1 = [data5.labels[ComUtil.null(data5.datasets[1].data.length, 1) - 1]];

	var annotations1 = today1.map(function(old) {
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
                content: '현재',
                backgroundColor:'rgb(102, 102, 102)',
                fontSize:11
            }
        }
    });

    options5.annotation.annotations = annotations1;


	if(!ComUtil.isNull(PENSION12S01.variable.lineChartAcntObj)){
		var lineChartAcntObj = PENSION12S01.variable.lineChartAcntObj;
		lineChartAcntObj.destroy();
	}

    //자문계좌 적립액 차트
	var lineChartAcntObj = new Chart(ctx5, {
        type :'line',
        data : data5,
        options : options5
    });

	PENSION12S01.variable.lineChartAcntObj = lineChartAcntObj;
   
}


//뱃지 상태 변경 
PENSION12S01.location.changeStatusBadge = function(detailData, pObj){
	//var detailData = PENSION12S01.variable.detailData;
	
    var saveMsgStatus = detailData.save_msg_status;
	var causeMsgStatus = detailData.cause_msg_status;
	
	//적립 상태 뱃지
	if(saveMsgStatus == "-1"){
		$('#save_msg', pObj).attr('class','percent-name lock');
	}else if(saveMsgStatus == "1"){
		$('#save_msg', pObj).attr('class','percent-name over');
	}else{
		$('#save_msg', pObj).attr('class','');
	}
	
	//원인 상태 뱃지
	if(causeMsgStatus == "-1"){
		$('#cause_msg', pObj).attr('class','percent-name lock');
	}else if(causeMsgStatus == "1"){
		$('#cause_msg', pObj).attr('class','percent-name over');
	}else{
		$('#cause_msg', pObj).attr('class','');
	}
}




PENSION12S01.init();
