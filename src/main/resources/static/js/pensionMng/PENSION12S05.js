/**
* 파일명 		: PENSION12S05.js 
* 업무			: 웰컴보드 > 신규 메인 화면 > 내가 받을 연금 (m-12-05)
* 설명			: 내가 받을 연금 
* 작성자		: 
* 최초 작성일자	: 
* 수정일/내용	: 
*/
var PENSION12S05 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION12S05.variable = {
	sendData		: {}							// 조회시 조건
	,detailData		: {}							// 조회 결과값
	,initParamData	: {}							// 이전화면에서 받은 파라미터
	,headType		: 'normal'						// 해더영역 디자인    default 는 normal
	,showMenu		: false							// default : true
}

/* 이벤트 정의 */
PENSION12S05.events = {
	 'change #myAnn'							: 'PENSION12S05.event.changeMyAnn'
	,'click div[id^="tooltip_"]'				: 'PENSION12S05.event.closeTooltip'			// 툴팁 가리기
}

PENSION12S05.init = function(){
	
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION12S05');
	
	$("#pTitle").text("내가 받을 연금");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-05";
	gfn_azureAnalytics(inputParam);
	
	PENSION12S05.location.pageInit();
}


// 화면내 초기화 부분
PENSION12S05.location.pageInit = function() {
	
	// 연금관리 메인 상세내역 조회 	
	PENSION12S05.tran.selectDetail();
	
	{	
		//$('#tabPanel-1').show();
		$('#tabPanel-11').show();
		$('#tablist02 .tab-label-item:nth-child(1) a').addClass('is_active');
		
		
		
		//$('#tablist02 .tab-label-item:nth-child(1) a').trigger('click');
		

		//debugger;

		$("#tablist02 .tab-label-item a").on("click", function(e){
			e.preventDefault();
			
			//label
			var target = $(this).attr("href");
			$("#tablist02 .tab-label-item a").removeClass("is_active");
			$(this).addClass("is_active");

			//panel
			$(".tab-panel-second").hide();
			$(target).show();
 			
			//$('#tablist02 .is_active').trigger("click");
		
			PENSION12S05.location.displayRoadmap($(this).data('idx'));
		});
		
		//
		
		// roadmap slider
		$('#tablist02 .tab-label-item').on("click", function(event){

			var idx = $('#tablist02 .is_active').data("idx");				// 몇기
			var cIdx = $('#tablist02 .is_active').data('currentslide');		// 현재 선택된 나이 
            
			$('.slider-for').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                //asNavFor: '.slider-nav',
                adaptiveHeight: true
            });

            $('.slider-nav').slick({
                slidesToShow: 5,
                slidesToScroll: 5,
                asNavFor: '.slider-for',
                arrows: false,
                dots: false,
                centerMode: true,
                centerPadding:'0px',
                focusOnSelect: true,
                infinite: false,
                swipeToSlide: true
            });

			$('.slider-nav').slick('slickGoTo', cIdx);

			$('.slider-nav').on('afterChange', function(event, slick, currentSlide){
				$('#tablist02 .is_active').data('currentslide', currentSlide);
			});

        });
	}
	
	// 차트 초기
	PENSION12S05.location.initChart();

	// 연금관리 메인 상세내역 조회 	
	//PENSION12S05.tran.selectDetail();
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 상세내역 조회 
PENSION12S05.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "reservedAmtDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pension";	// 내 연금 정보
	inputParam.data 	= PENSION12S05.variable.sendData;
	inputParam.callback	= PENSION12S05.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
///////////////////////////////////////////////////////////////////////////////////

// 국민연금 선택 여부
PENSION12S05.event.changeMyAnn = function(e) {
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	var detailData = PENSION12S05.variable.detailData;
	
	if(ComUtil.isNull(detailData)){
		return;
	}
	
	
	$('#myAnn').attr('disabled', true);
	setTimeout(function(){
		// 디스플레이 변경(국민연금포함여부)
		$('#myAnn').removeAttr('disabled');
	}, 1000);
	
	
	// 국민연금 관련 데이터 셋팅
	PENSION12S05.location.setMyAnnData();
	gfn_setDetails(PENSION12S05.variable.detailData, $('#divMyAnn'));
	
	// 받을연금 탭만 다시 셋팅
	PENSION12S05.location.displayChart();
}

// 툴팁 가리기
PENSION12S05.event.closeTooltip = function(e) {
	$(this).removeClass('show');
}


// 계좌별 상세화면 호출 
PENSION12S05.event.clickDetailView = function(e) {
	e.preventDefault();
	
	var sParams = {};
	sParams = $(this).data();
	sStorage.setItem("DASHBRD02P04Params", sParams);
	
	var sParam = {};
	sParam.url = "/pension_advice/dashBoard/DASHBRD02P04";	// 종류별 연금 상세보기
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSION12S05.callBack = function(sid, result, success){
	
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
	
	// 내 연금 정보
	if(sid == "reservedAmtDetail"){
		PENSION12S05.variable.detailData = result;
		
		// 셋팅
		PENSION12S05.location.setDetails();
		
		// 숫자 또르르..
		ComUtil.number.setDigitCount('#noti_pay_dis', 200, 1200);
	}
	
	//데이터 조회 후 첫 월 평균 연금 수령액 표시
	$("#avg_mon_recv_dis").text(PENSION12S05.variable.detailData.section_recv_amt_list[0].avg_mon_recv_dis);
	$("#avg_mon_recv_unit").text(PENSION12S05.variable.detailData.section_recv_amt_list[0].avg_mon_recv_unit);
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 나의 연금 영역 표시
PENSION12S05.location.setDetails = function(){
	var detailData = PENSION12S05.variable.detailData;
	
	// 날짜셋팅
	detailData.idx_date = ComUtil.string.dateFormat(detailData.idx_date);
	
	// 수익률 이미지 변경
	if(parseFloat(detailData.prsn_retr_pnsn_rvnu_rate) > 0){
		$('#rateImg').attr('src', "/images/img_rateUp.png");		// 수익률 + 일 때
	}
	else{
		$('#rateImg').attr('src', "/images/img_rateDown.png");		// 수익률 - 일 때
	}
	
	// 국민연금 관련 데이터 셋팅
	PENSION12S05.location.setMyAnnData();
	
	gfn_setDetails(detailData, $('#f-content'));
	
	
	// 차트 그리기
	//PENSION12S05.location.displayChartCircle();
	PENSION12S05.location.displayChart();
	
	// 보유 연금상품 리스트 목록 그리기
	//PENSION12S05.location.displayProductGroupList();
	
	// 은퇴 Roadmap 1기/2기/3기
	PENSION12S05.location.displayRoadmap('1');		// 1기
	//PENSION12S05.location.displayRoadmapAll();
	
	//최초 1기를 고정(하드코딩 하여) 셋팅 하기 때문에
	//slider 함수를 한 번 별도로 호출 한다.
	//이후에는 클릭 함수 ' $('#tablist02 .tab-label-item').on("click" ' 에서 호출  
	var cIdx = $('#tablist02 .is_active').data('currentslide');
	
	$('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        //asNavFor: '.slider-nav',
        adaptiveHeight: true
    });

    $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 5,
        asNavFor: '.slider-for',
        arrows: false,
        dots: false,
        centerMode: true,
        centerPadding:'0px',
        focusOnSelect: true,
        infinite: false,
        swipeToSlide: true
    });

	$('.slider-nav').slick('slickGoTo', cIdx);
	
}


// 국민연금 관련 데이터 셋팅
PENSION12S05.location.setMyAnnData = function(){
	var detailData = PENSION12S05.variable.detailData;
	
	if($('#myAnn').is(":checked")){
		detailData.recv_dis = detailData.tot_recv_dis;				// 수령할 총 연금
		detailData.recv_unit = detailData.tot_recv_unit;			// 수령할 총 연금
		detailData.mon_recv_dis = detailData.tot_mon_recv_dis;		// 월평균 수령액
		detailData.mon_recv_unit = detailData.tot_mon_recv_unit;	// 월평균 수령액
		detailData.chartInfo = detailData.tot_pnsn_recv_graph;
	}
	else{
		detailData.recv_dis = detailData.prsn_recv_dis;				// 수령할 총 연금
		detailData.recv_unit = detailData.prsn_recv_unit;			// 수령할 총 연금
		detailData.mon_recv_dis = detailData.prsn_mon_recv_dis;		// 월평균 수령액
		detailData.mon_recv_unit = detailData.prsn_mon_recv_unit;	// 월평균 수령액
		detailData.chartInfo = detailData.prsn_pnsn_recv_graph;
	}
}

// tab2 그리기
PENSION12S05.location.displayRoadmapAll = function(){
	PENSION12S05.location.displayRoadmap('1');		// 1기
	PENSION12S05.location.displayRoadmap('2');		// 2기
	PENSION12S05.location.displayRoadmap('3');		// 3기
}

// 은퇴 Roadmap 그리기
PENSION12S05.location.displayRoadmap = function(idx){

	var detailData = PENSION12S05.variable.detailData;
	
	if(ComUtil.isNull(detailData.section_recv_amt_list)){
		return;
	}
	
	$('#tabPanel-11').html('');
	
	//기수별 월 평균 연금수령액이 다르기 때문에 상단 월 평균 연금수령액 각각 표시
	if(idx == 1) {
		$("#avg_mon_recv_dis").text(detailData.section_recv_amt_list[0].avg_mon_recv_dis);
		$("#avg_mon_recv_unit").text(detailData.section_recv_amt_list[0].avg_mon_recv_unit);
	}else if(idx == 2) {
		$("#avg_mon_recv_dis").text(detailData.section_recv_amt_list[1].avg_mon_recv_dis);
		$("#avg_mon_recv_unit").text(detailData.section_recv_amt_list[1].avg_mon_recv_unit);
	}else if(idx == 3) {
		$("#avg_mon_recv_dis").text(detailData.section_recv_amt_list[2].avg_mon_recv_dis);
		$("#avg_mon_recv_unit").text(detailData.section_recv_amt_list[2].avg_mon_recv_unit);
	}
	
	
	// 현재 선택되어진 기수의 데이터 저장
	detailData.roadMapData = detailData.section_recv_amt_list[idx-1];
	detailData.roadMapData.idx = idx;
	// 기수별 필요데이터 셋팅
	PENSION12S05.location.setRoadmapData();
	
	// top
	var _templateTop = $("#_dumyRoadMapTop").html();

	var templateTop = Handlebars.compile(_templateTop);

	var htmlTop = templateTop(detailData.roadMapData);

	//$('#tabPanel-1'+idx).append(htmlTop);
	$('#tabPanel-11').append(htmlTop);
	
	// roadmap item
	var _templateItem = $("#_dumyRoadMapItem").html();
	var templateItem = Handlebars.compile(_templateItem);
	
	$.each( detailData.roadMapData.age_status_list, function(index, item){
		item.idx = index + 1;
		
		// 준비상태  -1 : 부족, 1 : 적정
		if('-1' == item.stus_cd){
			item.stus_class = "lack";		// 부족
			item.retr_rdy_rate = parseInt((item.mon_recv_amt / item.mon_liv_amt) * 100);
		}
		else{
			item.stus_class = "plenty";		// 적정
		}
		
		item.age2 = ComUtil.string.replaceAll(item.age, '세', '');
		
		var htmlItem = templateItem(item);
		$('#sliderItem_' + idx).append(htmlItem);
	});
}


// 기수별 필요데이터 셋팅
PENSION12S05.location.setRoadmapData = function(){
	var roadMapData = PENSION12S05.variable.detailData.roadMapData;
	
	if(ComUtil.isNull(roadMapData)){
		return;
	}
	
	roadMapData.sAge	= ComUtil.string.replaceAll(roadMapData.recv_strt_age, '세', '');
	roadMapData.eAge	= ComUtil.string.replaceAll(roadMapData.recv_end_age, '세', '');
	
	var type = roadMapData.section_nm;
	switch(type){
		case '1기'	:
			roadMapData.tooltip_txt	= "은퇴시점부터 국민연금이 개시되기 전 까지의 소득단절구간을 의미합니다. 은퇴시점에 따라 사람마다 차이는 나지만 통상적으로 55~65세 구간에 발생되며 연금소득이 집중적으로 필요한 시기이며 은퇴설계시 연금소득이 집중될수 있도록 설계가 필요한  구간입니다.";
			break;
		case '2기'	:
			roadMapData.tooltip_txt	= "여행, 운동, 여가생활 등 활동적인 노후생활 구간입니다. 국민연금을 받지만 충분치 않기에 원활한 노후생활을 하기워해 추가적인  연금 소득이 필요한 시기입니다.";
			break;
		case '3기'	:
			roadMapData.tooltip_txt	= "사회활동의 폭이 좁아지고 건강에 문제가 발생하는 시기입니다. 일반적인 생활비는 감소하는 반면 의료비가 증가합니다. 경우에 따라사는 장기 간병비용이 발생할 수 있기 때문에 정기적인 연금소득을 유지하는 것이 중요합니다.";
			break;
		default		:
			break;
	}
	
}

//tooltip
PENSION12S05.location.tooltip = function(idx){
	$(`#tooltip_`+idx).toggleClass('show');
}

// 차트 그리기
/*PENSION12S05.location.displayChartCircle = function(){
	var detailData = PENSION12S05.variable.detailData;
	
	// draw options
    var options ={
        maintainAspectRatio: false,
        cutoutPercentage: 82,
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

    //data
    var data={
        labels: ['내 연금'],
        datasets: [{
            label: '# of Votes',
            data: [60,25,15],
            backgroundColor: [
                '#28d150',
                '#fdf26a',
                '#ff952b'
            ],
            borderWidth:0,
            hoverBackgroundColor:[
                '#28d150',
                '#fdf26a',
                '#ff952b'

            ]
        }]
    };

	data.datasets[0].data[0]		= ComUtil.null(detailData.ntnl_pnsn_cpst_rate, 0);	// 국민연금구성비율
	data.datasets[0].data[1]		= ComUtil.null(detailData.retr_pnsn_cpst_rate, 0);	// 퇴직연금구성비율
	data.datasets[0].data[2]		= ComUtil.null(detailData.prsn_pnsn_cpst_rate, 0);	// 개인연금구성비율




    var ctx2 = document.getElementById('bigCircle').getContext('2d');
    new Chart(ctx2, {
        type :'doughnut',
        data : data,
        options : options
    });

}*/


// 차트 그리기
PENSION12S05.location.displayChart = function(){
	var detailData = PENSION12S05.variable.detailData;
	var	chartInfo = detailData.chartInfo;
	
	if( ComUtil.isNull(chartInfo) ){
		return;
	}
	
	
	// bar options
	
    var options ={
        aspectRatio:4/3,
        tooltips: {
            enabled: false
        },
        responsible:false,
        scales: {
            xAxes: [{
                stacked: true,
                //barPercentage: 0.5,	// 아이폰에서 동작않함..  사용하지 마세요.
                display: true,
                beginAtZero: true,
                gridLines: {
                    display: false
                },
                ticks: {
                    min:60,
                    max:100,
                    autoSkip:true,
                    autoSkipPadding:10,
                    maxRotation:0,
                    fontColor: "#999999",
                },

            }],
            yAxes: [{
                stacked: true,
                display: true,
                gridLines: {
                    display: true,
                    borderDash:[2,5],
                    color:"#cccccc",
                    drawBorder: false
                },
                ticks:{
                    max: 300,
                    stepSize:75,
                    padding:12,
                    fontColor: "#999999",
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
    };

    var data ={
        labels: ['60세','61세','62세','63세','64세','65세','66세','67세','68세','69세',
        '70세', '71세','72세','73세','74세','75세','76세','77세','78세','79세',
        '80세', '81세','82세','83세','84세','85세','86세','87세','88세','89세',
        '90세', '91세','92세','93세','94세','95세','96세','97세','98세','99세',
        '100세'],
        datasets: [{
            label: '국민연금',
            data: [50,50,50,50,50,50,50,50,50,50,
            100,100,100,100,100,100,100,100,100,100,
            100,100,100,100,100,50,50,50,50,50,
            50,50,50,50,50,50,50,50,50,50],
            backgroundColor: 'rgb(40, 209, 80)', //green
            borderColor: "#ffffff",
            borderWidth:0
        },{
            label: '퇴직연금',
            data: [0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,70,70,70,70,70,
            20, 20, 20, 40, 40, 40,40,40,10,35,
            35,35,35,35,0,0,0,0,0,0,0],
            backgroundColor: 'rgb(253, 242, 106)', //yellow
            borderColor: "#ffffff",
            borderWidth:0
        },{
            label: '개인연금',
            data: [0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0, 20, 20, 20, 20, 20,
            20, 20, 20, 20, 20, 50,50,50,50,50,
            35,35,35,35,0,0,0,0,0,0,0],
            backgroundColor: 'rgb(255, 149, 43)', //orange
            borderColor: "#ffffff",
            borderWidth:0
        }]
    };
	
	var dataSample = {
            label: '국민연금',
            data: [50,50,50,50,50,50,50,50,50,50,
            100,100,100,100,100,100,100,100,100,100,
            100,100,100,100,100,50,50,50,50,50,
            50,50,50,50,50,50,50,50,50,50],
            backgroundColor: 'rgb(40, 209, 80)', //green
            borderColor: "#ffffff",
            borderWidth:0
        };
	/*
	*/
	
	data.datasets = [];
	data.labels = chartInfo.labels;

	$.each(chartInfo.chart, function(index, item){
		
		dataSample.label 			= item.legend_name;
		dataSample.data 			= item.value;
		dataSample.backgroundColor 	= gfn_getChartBackgroundColor(item.legend_name);
		
		
		data.datasets.push($.extend({}, dataSample));
	});
	
	// max / stepSize 샛팅하기
	var maxValue = parseInt(chartInfo.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	
	options.scales.yAxes[0].ticks.min			= chartInfo.vertical_minimum;
	options.scales.yAxes[0].ticks.max			= maxValue * 1.2;
	options.scales.yAxes[0].ticks.stepSize		= stepSize;
	

	if(!ComUtil.isNull(PENSION12S05.variable.ctbarObj)){
		var ctbarObj = PENSION12S05.variable.ctbarObj;
		ctbarObj.destroy();
	}
    //자문계좌 적립액 차트
    var ctbar = document.getElementById('monthAmtChart').getContext('2d');
    var ctbarObj = new Chart(ctbar, {
        type :'bar',
        data : data,
        options : options
    });

	PENSION12S05.variable.ctbarObj = ctbarObj;
	
}

// 보유 연금상품 리스트 그리기
PENSION12S05.location.displayProductList = function(oObj, type, prdt_list){
	var _templateD = $("#_dumyProductDetail").html();
	var templateD = Handlebars.compile(_templateD);
	
	$.each( prdt_list, function(index, item){
		item.idx = index + 1;
		item.type = type;
		
		item.compImgSrc = gfn_getImgSrcByCd(item.company_kftc_cd, 'C');
		
		// 수익률 이미지 변경
		if(parseFloat(item.rvnu_rate) > 0){
			item.rvnu_class = 'plus';
		}
		else{
			item.rvnu_class = 'minus';
		}
		
		var html = templateD(item);
		$(oObj).append(html);
		$('#product_'+item.type+'_'+item.idx).data(item);
	});
}




// 차트 초기
PENSION12S05.location.initChart = function(){
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
        }
    });

}


PENSION12S05.init();
