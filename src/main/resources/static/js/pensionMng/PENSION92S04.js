/**
* 파일명 		: PENSION92S04.js (m-12-04)
* 업무		: 내 연금 정보			
* 설명		: 내 연금 정보		
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.04
* 수정일/내용	: 
*/
var PENSION92S04 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION92S04.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION92S04.events = {
	 'change #myAnn' 									: 'PENSION92S04.event.changeMyAnn'
 	,'click  i[id^="tooltipIco_"]' 						: 'PENSION92S04.event.clickTooltipIco'
}

PENSION92S04.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION92S04');	
	
	$("#pTitle").text("내 연금 정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-04";
	gfn_azureAnalytics(inputParam);
	
	PENSION92S04.location.pageInit();
}


// 화면내 초기화 부분
PENSION92S04.location.pageInit = function() {
	
	//tooltip
	$('.tooltip').click(function(){
	    $(this).removeClass('show');
	});
	
		
	 //Tab
	 $('#tablist01 .tab-label-item:nth-child(1) a').addClass('is_active');
	 $('#tabPanel-1').show();
	
	 $("#tablist01 .tab-label-item a").on("click", function(e){
	     e.preventDefault();
	
	     //label
	     var target = $(this).attr("href");
	     $("#tablist01 .tab-label-item a").removeClass("is_active");
	     $(this).addClass("is_active");
	
	     //panel
	     $(".tab-panel").hide();
	     $(target).show();
		
		// 처음 탭이 눌린 것처럼 trigger 발생
		$('#tablist02 .is_active').trigger("click");
	});
	
	{
		// 탭 클릭시 탭전환
		$('body').off("click", '#tablist02 .tab-label-item a').on("click", '#tablist02 .tab-label-item a', function(e){
			e.preventDefault();
			
			//label
			var target = $(this).attr("href");
			$("#tablist02 .tab-label-item a").removeClass("is_active");
			$(this).addClass("is_active");
			
			//panel
			$(".tab-panel-second").hide();
			$(target).show();
	    });
		
		// 탭 클릭시 slider
		$('body').off("click", '#tablist02 .tab-label-item').on("click", '#tablist02 .tab-label-item', function(e){
			var idx = $(this).data('idx');
			//var cIdx = $('#tablist02 .is_active').data('currentslide');		// 현재 선택된 나이
			
			/*try{
				$('#slider-for-'+idx).slick("unslick");
				$('#slider-nav-'+idx).slick("unslick");
			} catch(error){
				gfn_log(error);
			}	*/
			
	        //slick 1기  
	        $('#slider-for-'+ idx).slick({
	            slidesToShow: 1,
	            slidesToScroll: 1,
	            arrows: false,
	            fade: true,
	            asNavFor: '#slider-nav-'+idx,
				adaptiveHeight: true
	        });
	        $('#slider-nav-'+ idx).slick({
	            slidesToShow: 5,
	            slidesToScroll: 5,
	            asNavFor: '#slider-for-'+idx,
	            arrows: false,
	            dots: false,
	            centerMode: true,
	            centerPadding:'0px',
	            focusOnSelect: true,
	            infinite: false,
	            swipeToSlide: true
	        });

			/*$('.slider-nav').slick('slickGoTo', cIdx);

			$('.slider-nav').on('afterChange', function(event, slick, currentSlide){
				$('#tablist02 .is_active').data('currentslide', currentSlide);
			});  */                  
	    });

	}
	
	// 차트 초기
	PENSION92S04.location.initChart();
	
	// 내 연금 정보 조회
	PENSION92S04.tran.selectMyPension();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION92S04.tran.selectMyPension = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionMngDetailList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pension";
	inputParam.data 	= PENSION92S04.variable.sendData;
	inputParam.callback	= PENSION92S04.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 국민연금 포함여부
PENSION92S04.event.changeMyAnn = function(e){
	
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}	
	
	if(ComUtil.isNull(PENSION92S04.variable.detailData)){
		return;
	}
	
	// Bar 차트 그리기
	PENSION92S04.location.displayBarChart();
}

// 툴팁 클릭시 보이기
PENSION92S04.event.clickTooltipIco = function(){
	var idx = $(this).data('idx');
    $(`#${'tootip-'+idx}`).toggleClass('show');
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION92S04.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionMngDetailList"){
		PENSION92S04.variable.detailData = result;
		
		// 상세 셋팅 
		PENSION92S04.location.displayDetail();
				
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSION92S04.location.displayDetail = function(){
	var detailData = PENSION92S04.variable.detailData;
	
	// 날짜셋팅
	detailData.idx_date = ComUtil.string.dateFormat(detailData.idx_date);
	
	// 연금 수익률 이미지 셋팅
	if(detailData.prsn_retr_pnsn_rvnu_rate >= 0){
		detailData.rate_img = '../../images/img_rateUp.png';
	}else{		
		detailData.rate_img = '../../images/img_rateDown.png';
	}
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	// 보유 연금상품 셋팅
	PENSION92S04.location.displayProductGroup();
	
	// 은퇴 Roadamp
	PENSION92S04.location.displayRoadmap();
	
	// 차트 그리기
	PENSION92S04.location.displayChart();
	
	// Bar 차트 그리기
	PENSION92S04.location.displayBarChart();
	

}

// 보유 연금 상품 셋팅
PENSION92S04.location.displayProductGroup = function(){
	var detailData = PENSION92S04.variable.detailData;
	
	// 반복구 템플릿 설정
	var _template = $("#_dumyPrdtList").html();
	var template = Handlebars.compile(_template);
	
	// 퇴직연금
	if(!ComUtil.isNull(detailData.prsn_retire_prdt_list)){
		// 이름 설정
		var item = {};
		item.title = "퇴직연금";
		item.type = "retire";
		var html = template(item);
		$('#pensionList').append(html);
		
		PENSION92S04.location.displayProduct(item.type, detailData.prsn_retire_prdt_list );

	}
	
	// 연금저축
	if(!ComUtil.isNull(detailData.prsn_irp_prdt_List)){
		// 이름 설정
		var item = {};
		item.title = "연금저축";
		item.type = "saving";
		var html = template(item);
		$('#pensionList').append(html);
		
		PENSION92S04.location.displayProduct(item.type, detailData.pnsn_insr_prdt_list );

	}
	
	// 연금보험
	if(!ComUtil.isNull(detailData.pnsn_insr_prdt_list)){
		// 이름 설정
		var item = {};
		item.title = "연금보험";
		item.type = "ins";
		var html = template(item);
		$('#pensionList').append(html);
		
		PENSION92S04.location.displayProduct(item.type, detailData.pnsn_insr_prdt_list );

	}
	
	// 기타상품
	if(!ComUtil.isNull(detailData.etc_prdt_list)){
		// 이름 설정
		var item = {};
		item.title = "기타상품";
		item.type = "etc";
		var html = template(item);
		$('#pensionList').append(html);
		
		PENSION92S04.location.displayProduct(item.type, detailData.etc_prdt_list );

	}
}

// 보유 연금상품의 리스트 그리기
PENSION92S04.location.displayProduct = function(type , prdt_list){
	var _template2 = $("#_dumyPensionList").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each(prdt_list, function(index, item){
			
		item.idx = index + 1;													// index 1 추가
		item.type = type;													// type 추가
		item.product_img = gfn_getImgSrcByCd(item.company_kftc_cd, 'C');		// 은행로고 설정
		
		var html = template2(item);
		$('#list_'+item.type).append(html);
		
		if(item.rvnu_rate <= 0){
			$('#'+item.type+'_rate_'+item.idx).attr('class','minus');			// 상승률의 +/- 여부에 따라 클래스명 변경
		}
	});
	
}

// 은퇴 Roadmap 그리기
PENSION92S04.location.displayRoadmap = function(){
	var detailData = PENSION92S04.variable.detailData;
	
	if(ComUtil.isNull(detailData.section_recv_amt_list)){
		return;
	}
	
	// 반복구 템플릿 설정
	var _template = $("#_dumyTabList").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyAgeDetail").html();
	var template2 = Handlebars.compile(_template2);
		
	$.each(detailData.section_recv_amt_list, function(index, item){
		item.idx = index + 1;																	// idx 설정
		item.tab_idx = (index + 1) * 11;														// tab클릭시 필요한 idx설정
		item.recv_strt_age2 = ComUtil.string.replaceAll(item.recv_strt_age, '세', '');			// 60세 -> 60
		item.recv_end_age2 = ComUtil.string.replaceAll(item.recv_end_age, '세', '');				// 60세 -> 60
		
		$.each(item.age_status_list, function(index2, item2){
			item2.age2 = ComUtil.string.replaceAll(item2.age, '세', '');							// 60세 -> 60
		});
		
		var html2 = template2(item);
		$('#tab-panel-contents').append(html2);													// 탭 아래 내용을 템플릿에 복사
		
		var html = template(item);
		$('#tablist02').append(html);															// 탭 상단 내용을 템플릿에 복사
		
		$('#tooltipIco_' + item.idx).data('idx',item.idx);										// 툴팁 아이콘에 idx 부여
		
	});
	
	// 첫번째 탭을 조회
    $('#tablist02 #tab-label-item-1 a').addClass('is_active');
    $('#tabPanel-11').show();

	// 툴팁 내용 변경하기
	$('#tabPanel-11 .tooltip-txt').html(
		'은퇴시점부터 국민연금이 개시되기 전 까지의 소득단절구간을 의미합니다. 은퇴시점에 따라 사람마다 차이는 나지만 통상적으로 55~65세 구간에 발생되며 연금소득이 집중적으로 필요한 시기이며 은퇴설계시 연금소득이 집중될수 있도록 설계가 필요한  구간입니다.'
	);
	$('#tabPanel-22 .tooltip-txt').html(
		'여행, 운동, 여가생활 등 활동적인 노후생활 구간입니다. 국민연금을 받지만 충분치 않기에 원활한 노후생활을 하기워해 추가적인  연금 소득이 필요한 시기입니다.'
	);
	$('#tabPanel-33 .tooltip-txt').html(
		'은퇴시점부터 국민연금이 개시되기 전 까지의 소득단절구간을 의미합니다. 은퇴시점에 따라 사람마다 차이는 나지만 통상적으로 55~65세 구간에 발생되며 연금소득이 집중적으로 필요한 시기이며 은퇴설계시 연금소득이 집중될수 있도록 설계가 필요한  구간입니다.'
	);
	
	
}



// 차트 그리기
PENSION92S04.location.displayChart = function(){
	var detailData = PENSION92S04.variable.detailData;
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
        }

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
        }

		// 데이터 설정
		data.datasets[0].data[0]		= ComUtil.null(detailData.ntnl_pnsn_cpst_rate, 0);	// 국민연금구성비율
		data.datasets[0].data[1]		= ComUtil.null(detailData.retr_pnsn_cpst_rate, 0);	// 퇴직연금구성비율
		data.datasets[0].data[2]		= ComUtil.null(detailData.prsn_pnsn_cpst_rate, 0);	// 개인연금구성비율

        var ctx2 = document.getElementById('bigCircle').getContext('2d');
        new Chart(ctx2, {
            type :'doughnut',
            data : data,
            options : options
        });
}


// 받을 연금 bar 차트 그리기
PENSION92S04.location.displayBarChart = function(){
	var detailData = PENSION92S04.variable.detailData;
	
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
    }

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
    }

	var graph = null;
	
	// 현재모든연금수령액차트
	if($('#myAnn').is(':checked')){
		// 차트 설정
		graph = detailData.tot_pnsn_recv_graph;
		data.labels = graph.labels;
		
		// 국민연금	
		data.datasets[0].label = graph.chart[0].legend_name;
		data.datasets[0].data = graph.chart[0].value;
		data.datasets[0].backgroundColor = graph.chart[0].color;
		
		// 퇴직연금
		data.datasets[1].label = graph.chart[1].legend_name;
		data.datasets[1].data = graph.chart[1].value;
		data.datasets[1].backgroundColor = graph.chart[1].color;
		
		// 개인연금
		data.datasets[2].label = graph.chart[2].legend_name;
		data.datasets[2].data = graph.chart[2].value;
		data.datasets[2].backgroundColor = graph.chart[2].color;
		
		// 수령 총 연금액 조회
		$('#prsn_recv_dis').html(detailData.tot_recv_dis);
		
		// 현재모든연금 월평균 수령액 조회
		$('#tot_mon_recv_dis').html(detailData.tot_mon_recv_dis);
			
	// 현재개인연금수령액차트
	}else{
		// 차트 설정
		graph = detailData.prsn_pnsn_recv_graph;
		data.labels = graph.labels;								
		
		// 퇴직연금
		data.datasets[1].label = graph.chart[0].legend_name;
		data.datasets[1].data = graph.chart[0].value;
		data.datasets[1].backgroundColor = graph.chart[0].color;
		
		// 개인연금
		data.datasets[2].label = graph.chart[1].legend_name;
		data.datasets[2].data = graph.chart[1].value;
		data.datasets[2].backgroundColor = graph.chart[1].color;
		
		// 국민연금 항목 삭제
		data.datasets.splice(0,1);	
		
		// 수령 개인/퇴직 연금액 조회
		$('#prsn_recv_dis').html(detailData.prsn_recv_dis);	
		
		// 현재개인/퇴직연금 월평균 수령액 조회
		$('#tot_mon_recv_dis').html(detailData.prsn_mon_recv_dis);
	}	
	
	// max / stepSize 설정하기
	
	
	
    var ctbar = document.getElementById('myBarChart').getContext('2d');
    new Chart(ctbar, {
        type :'bar',
        data : data,
        options : options
    });

}


// 차트 설정하기
PENSION92S04.location.initChart = function(){
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
                    //console.log(arc.round.startAngle)
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



PENSION92S04.init();
