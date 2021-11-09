/**
* 파일명 		: PENSION12S04.js 
* 업무		: 웰컴보드 > 신규 메인 화면 > 내 연금 정보 상세보기 (m-12-04)
* 설명		: 내 연금 정보 상세보기 화면 
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.04
* 수정일/내용	: 
*/
var PENSION12S04 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION12S04.variable = {
	sendData		: {}							// 조회시 조건
	,detailData		: {}							// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION12S04.events = {
	 'change #longTerm'							: 'PENSION12S04.event.changeLongTerm'
	,'change #myAnn'							: 'PENSION12S04.event.changeMyAnn'
	,'click div[id^="tooltip_"]'				: 'PENSION12S04.event.closeTooltip'			// 툴팁 가리기
	//,'click li[id^="product_"]'					: 'PENSION12S04.event.clickDetailView'		// 연금상세정보 보기 화면으로 이동  (2021.05.31  김팀장님 요청으로 기능 제외)
}

PENSION12S04.init = function(){
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION12S04');
	
	$("#pTitle").text("내 연금 정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-12-04";
	gfn_azureAnalytics(inputParam);
	
	PENSION12S04.location.pageInit();
}


// 화면내 초기화 부분
PENSION12S04.location.pageInit = function() {
	{
		//Tab
		$('#tabList_12S04 .tab-label-item:nth-child(1) a').addClass('is_active');
		$('#tabPanel-1').show();

		$("#tabList_12S04 .tab-label-item a").on("click", function(e){
			e.preventDefault();

			//label
			var target = $(this).attr("href");
			
			if(target == '#tabPanel-2'){
				if(ComUtil.null(PENSION12S04.variable.detailData.my_advice_tot_amt, 0) == 0){
					gfn_alertMsgBox('현재 고객님께서 승인한 자문 안을 실행하지 않았습니다. <br> "자문내용 다시보기" 또는 "월 적립식 투자"를 다시 확인 해 보시길 바랍니다.');
					return;
				}
			}
			
			
			$("#tabList_12S04 .tab-label-item a").removeClass("is_active");
			$(this).addClass("is_active");
			
			//panel
			$(".tab-panel").hide();
			$(target).show();
			
		});

	}
	
	// 차트 초기
	PENSION12S04.location.initChart();

	// 연금관리 메인 상세내역 조회 	
	PENSION12S04.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 상세내역 조회 
PENSION12S04.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "reservedAmtDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pension";	// 내 연금 정보
	inputParam.data 	= PENSION12S04.variable.sendData;
	inputParam.callback	= PENSION12S04.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 장기추이 체크박스 변경
PENSION12S04.event.changeLongTerm = function(e) {
 	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	if(ComUtil.isNull(PENSION12S04.variable.detailData)){
		return;
	}
	
	PENSION12S04.location.displayMyPension();
}
 

// 툴팁 가리기
PENSION12S04.event.closeTooltip = function(e) {
	$(this).removeClass('show');
}


// 계좌별 상세화면 호출 
PENSION12S04.event.clickDetailView = function(e) {
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
PENSION12S04.callBack = function(sid, result, success){
	
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
		PENSION12S04.variable.detailData = result;
		
		// 셋팅
		PENSION12S04.location.setDetails();
		
		// 숫자 또르르..
		ComUtil.number.setDigitCount('#noti_pay_dis', 200, 1200);
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 나의 연금 영역 표시
PENSION12S04.location.setDetails = function(){
	var detailData = PENSION12S04.variable.detailData;
	
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
	PENSION12S04.location.setMyAnnData();
	
	gfn_setDetails(detailData, $('#f-content'));
	
	
	// 차트 그리기
	PENSION12S04.location.displayChartCircle();
	//PENSION12S04.location.displayChart();
	
	// 보유 연금상품 리스트 목록 그리기
	PENSION12S04.location.displayProductGroupList();
	
	// 자문계좌 연금상품 리스트 목록 그리기
	PENSION12S04.location.displayProductGroupList2();
	
	// 은퇴 Roadmap 1기/2기/3기
	//PENSION12S04.location.displayRoadmap('1');		// 1기
	//PENSION12S04.location.displayRoadmapAll();
	
}


// 국민연금 관련 데이터 셋팅
PENSION12S04.location.setMyAnnData = function(){
	var detailData = PENSION12S04.variable.detailData;
	
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

//tooltip
PENSION12S04.location.tooltip = function(idx){
	$(`#tooltip_`+idx).toggleClass('show');
}

// 차트 그리기
PENSION12S04.location.displayChartCircle = function(){
	var detailData = PENSION12S04.variable.detailData;

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

    //총 연금 Tab
    var data={
        labels: ['내 연금'],
        datasets: [{
	        label: '# of Votes',
	        data: [60,20,13,7],
	        backgroundColor: [
	            '#28d150',
	            '#fdf26a',
	            '#ff952b',
	            '#888888'
	        ],
	        borderWidth:0,
	        hoverBackgroundColor:[
	            '#28d150',
	            '#fdf26a',
	            '#ff952b',
	            '#888888'
	        ]
	    }]
    };

	data.datasets[0].data[0]		= ComUtil.null(detailData.ntnl_pnsn_cpst_rate, 0);	// 국민연금구성비율
	data.datasets[0].data[1]		= ComUtil.null(detailData.retr_pnsn_cpst_rate, 0);	// 퇴직연금구성비율
	data.datasets[0].data[2]		= ComUtil.null(detailData.prsn_pnsn_cpst_rate, 0);	// 개인연금구성비율
	data.datasets[0].data[3]		= ComUtil.null(detailData.etc_pnsn_cpst_rate, 0);	// 기타연금구성비율
	
	var ctx2 = document.getElementById('bigCircle').getContext('2d');
    new Chart(ctx2, {
        type :'doughnut',
        data : data,
        options : options
    });
	
	
	//자문계좌 연금 Tab
	var data2={
        labels: ['자문계좌 연금'],
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

	data2.datasets[0].data[0]		= ComUtil.null(detailData.pnsn_prdt_ratio_rate, 0);	// 연금저축
	data2.datasets[0].data[1]		= ComUtil.null(detailData.irp_prdt_ratio_rate, 0);	// 개인IRP
	data2.datasets[0].data[2]		= ComUtil.null(detailData.other_prdt_ratio_rate, 0);	// 기타


	var ctx3 = document.getElementById('bigCircle2').getContext('2d');
    new Chart(ctx3, {
        type :'doughnut',
        data : data2,
        options : options
    });

}


// 보유 연금상품 리스트 목록 그리기
PENSION12S04.location.displayProductGroupList = function(){
	var detailData = PENSION12S04.variable.detailData;
	
	
	var _template = $("#_dumyProductList").html();
	var template = Handlebars.compile(_template);
	
	// 퇴직연금 상품목록
	if(!ComUtil.isNull(detailData.prsn_retire_prdt_list)){
		var item = {};
		item.title = "퇴직연금";
		item.type = "retire";
		var html = template(item);
		$('#productList').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList($('#productList_'+item.type), item.type, detailData.prsn_retire_prdt_list);
	}
	
	// 연금저축 상품목록
	if(!ComUtil.isNull(detailData.pnsn_save_prdt_list)){
		var item = {};
		item.title = "연금저축";
		item.type = "save";
		var html = template(item);
		$('#productList').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList($('#productList_'+item.type), item.type, detailData.pnsn_save_prdt_list);
	}
	
	// 연금보험 상품목록
	if(!ComUtil.isNull(detailData.pnsn_insr_prdt_list)){
		var item = {};
		item.title = "연금보험";
		item.type = "insr";
		var html = template(item);
		$('#productList').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList($('#productList_'+item.type), item.type, detailData.pnsn_insr_prdt_list);
	}
	
	// 기타상품 목록
	if(!ComUtil.isNull(detailData.etc_prdt_list)){
		var item = {};
		item.title = "기타상품";
		item.type = "etc";
		var html = template(item);
		$('#productList').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList($('#productList_'+item.type), item.type, detailData.etc_prdt_list);
	}
	
}

// 보유 연금상품 리스트 그리기
PENSION12S04.location.displayProductList = function(oObj, type, prdt_list){
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

// 자문계좌 연금상품 리스트 목록 그리기
PENSION12S04.location.displayProductGroupList2 = function(){
	var detailData = PENSION12S04.variable.detailData;
	
	var _template2 = $("#_dumyProductList2").html();
	var template2 = Handlebars.compile(_template2);
	

	// 개인IRP 상품목록
	if(!ComUtil.isNull(detailData.retire_acnt_list)){
		var item = {};
		item.title = "개인IRP";
		item.type = "advice_retire";
		var html = template2(item);
		$('#productList2').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList2($('#productList2_'+item.type), item.type, detailData.retire_acnt_list);
	}
	
	//연금저축 목록
	if(!ComUtil.isNull(detailData.pnsn_acnt_list)){
		var item = {};
		item.title = "연금저축";
		item.type = "advice_pnsn";
		var html = template2(item);
		$('#productList2').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList2($('#productList2_'+item.type), item.type, detailData.pnsn_acnt_list);
	}
	
	//기타 목록 
	if(!ComUtil.isNull(detailData.other_acnt_list)){
		var item = {};
		item.title = "기타";
		item.type = "advice_other";
		var html = template2(item);
		$('#productList2').append(html);
		
		// 계좌리스트 그리기
		PENSION12S04.location.displayProductList2($('#productList2_'+item.type), item.type, detailData.other_acnt_list);
	}

}

// 자문계좌 연금 상품 리스트 그리기
PENSION12S04.location.displayProductList2 = function(oObj, type, prdt_list){

	var _templateD = $("#_dumyProductDetail2").html();
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

		$('#product2_'+item.type+'_'+item.idx).data(item);
	});
}




// 차트 초기
PENSION12S04.location.initChart = function(){
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




PENSION12S04.init();
