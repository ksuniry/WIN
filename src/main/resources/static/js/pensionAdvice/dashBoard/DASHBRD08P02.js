/**
* 파일명 		: DASHBRD08P02.js (pension-D-08-02)
* 업무		: 연금자문 대시보드 > 머플러플랜 > 머플러플랜 자세히 보기
* 설명		: 머플러플렌 자세히 보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.30
* 수정일/내용	: 
*/
var DASHBRD08P02 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD08P02.variable = {
	sendData		: {
		retr_avg_exp_amt : ""							// 은퇴 후 월평균 생활비
	}							
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,tabIdx			: '1'								// 1/2/3
	,chart2_1 		: {}								// 2단계 현재차트
	,chart2_2 		: {}								// 2단계 제안차트
	,chart3 		: {}								// 중간차트(연금준비율)
	,lock 			: false								// 중복클릭 제거용
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD08P02.events = {
	 'click a[id^="btnPopup_P03_"], i[id^="btnPopup_P03_"]'	: 'DASHBRD08P02.event.clickPopup'
	,'change #myAnn08P02'								: 'DASHBRD08P02.event.changeMyAnn'
	,'click #tabList1 li'								: 'DASHBRD08P02.event.changeTab1'
	,'click #tabList3 li'								: 'DASHBRD08P02.event.changeTab3'
	,'click #btnTab1_2, #btnTab1_3'						: 'DASHBRD08P02.event.clickBtnTab1'
	,'click li[id^="se"]'								: 'DASHBRD08P02.event.clickProductPopup'
	//,'click li[id^="se"]'								: 'DASHBRD08P02.event.clickDetailAcntView'
}



DASHBRD08P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD08P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-08-02";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD08P02.location.pageInit();
}


// 화면내 초기화 부분
DASHBRD08P02.location.pageInit = function() {
    //accor
    //$(document).off("click", '.accor_title').on("click",'.accor_title',function(){
    $('.accor_title' , $('#P82-content')).click(function(){
        if($(this).find('.ico').hasClass('arr_down') === true){
            $(this).next().show();
            $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
        }else{
            $(this).next().hide();
            $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
        }
    });

	//tab sticky
    $('#DASHBRD08P02_top').scroll(function() {
        sticky();
    });

    function sticky() {
        if($('#DASHBRD08P02_top').scrollTop() > 97){
            $('#DASHBRD08P02_top').addClass('sticky');
        }else{
            $('#DASHBRD08P02_top').removeClass('sticky');
        }
    };

	// 머플러 고객운용계좌란 무엇인가요 
	$('.tooltip').click(function(){
        $(this).removeClass('show');
    });

	// 높이 지정 
	var windowHeight = $(window).height();
    var tabScroll = windowHeight - 226 ;
    $('.tab_height').height(tabScroll);	


	// 차트 영역 셋팅
	DASHBRD08P02.location.initChart2();	// 2단계
	DASHBRD08P02.location.initChart3();	// 3단계
	
	// 초기조회
	DASHBRD08P02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 머플러 월평균 예상수령액 조회 (현재/제안)
DASHBRD08P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "mufflerPlan";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/muffler_plan";
	inputParam.data 	= DASHBRD08P02.variable.sendData;
	inputParam.callback	= DASHBRD08P02.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 최상단 탭이동
DASHBRD08P02.event.changeTab1 = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('.tab_hl').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab-panel').hide();
        $('#tabPanel-'+index).show();
		$('.popup_content').scrollTop(98);  // 상단으로 이동!
    }
}

// 최상단 탭 이동 버튼 클릭
DASHBRD08P02.event.clickBtnTab1 = function(e) {
	e.preventDefault();
	
	var targetId = $(this).data('target');
	$('#'+targetId).click();
}

// 3단계 탭이동
DASHBRD08P02.event.changeTab3 = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('.tab_hl').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab-panel-second').hide();
        $('#season-'+index).show();
    }
}

// 안변경시 
DASHBRD08P02.event.changeMyAnn = function(e) {
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	$('#myAnn08P02').attr('disabled', true);
	
	
	setTimeout(function(){
		// 디스플레이 변경(현재/제안)
		$('#myAnn08P02').removeAttr('disabled');
	}, 1000);
	DASHBRD08P02.location.printChart3();
	
}

// 팝업호출
DASHBRD08P02.event.clickPopup = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
	var url = "";
	
	switch(link){
		case 'myPensionRetr'	:	url = "/pension_advice/dashBoard/DASHBRD08P02";		// 퇴직연금 상세보기
			break;
		case 'question'			:	url = "/pension_advice/dashBoard/DASHBRD08P03";		// 머플러 연금자산관리 기본정책 상세보기
			break;
		case 'riskReturn'		:	url = "/pension_advice/dashBoard/DASHBRD03P06";		// 기대수익률 위함산출기준 팝업
			break;
		case 'step3'			:	url = "/pension_advice/dashBoard/DASHBRD03P07";		// 은퇴주기별 3단계
			break;
		default 				: 
			break;
	}
	
	var sParam = {};
	sParam.url = url;
	
	// 팝업호출
	gfn_callPopup(sParam, function(){});
}


// 계좌별 상세화면 대신 알럿 
DASHBRD08P02.event.clickProductPopup = function(e) {
	e.preventDefault();
	
	gfn_alertMsgBox('자세한 내용은 자문계약 후<br>보실 수 있습니다.');
}

// 계좌별 상세화면 호출 
DASHBRD08P02.event.clickDetailAcntView = function(e) {
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
DASHBRD08P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 머플러플랜 조회
	if(sid == "mufflerPlan"){
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
		
		DASHBRD08P02.variable.detailData = result;
		
		// 상세화면 그리기
		DASHBRD08P02.location.displayDetail();
		
		// 초기 탭 선택 
		$('#tabPanel-1').show();
		$('#season-1').show();
		//$('#tabList1 li:first-child').trigger('click');
		//$('#tabList3 li:first-child').trigger('click');
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
DASHBRD08P02.location.displayDetail = function(){
	var detailData = DASHBRD08P02.variable.detailData;
	
	// 상세 셋팅전 html 관련 셋팅
	//detailData.payment_distribute_expl 		= ComUtil.string.convertHtml(detailData.payment_distribute_expl);
	
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#P82-content'));
	
	// 1단계 계좌배분 그리드 그리기
	DASHBRD08P02.location.displayAcntList('crnt', detailData.crnt_acnt_info_list);	// 현재계좌정보
	DASHBRD08P02.location.displayAcntList('ppsl', detailData.ppsl_acnt_info_list);	// 제안계좌정보
	
	// 차트 그리기
	DASHBRD08P02.location.printChart2();
	DASHBRD08P02.location.printChart3();
	
	// 왜 연금을 이런순서로 받아야 하나 박스리스트 그리기
	DASHBRD08P02.location.displayWhyList(detailData.wthrw_product_list);	// 제안계좌정보
	
	// 3단계 하단 탭 그리기
	DASHBRD08P02.location.displayDetail3();
}

// 계좌정보 리스트 그리기
DASHBRD08P02.location.displayAcntList = function(type, acntList){
	if(ComUtil.isNull(acntList)){
		return;
	}
	
	var preId = type + "AcntList_";
	// 상품명
	var _template1 = $("#_dumyResult1").html();
	var template1 = Handlebars.compile(_template1);
	// 금액
	var _template2 = $("#_dumyResult2").html();
	var template2 = Handlebars.compile(_template2);

	$.each( acntList, function(index, item){
		item.idx = index;
		item.acntId = type+"Acnt_"+item.idx;
		if(item.product == '개인IRP' || type == 'ppsl'){
			item.product = '*' + item.product;
		}
		
		var html1 = template1(item);
		$('#' + preId + '0').append(html1);
		
		var html2 = template2(item);
		$('#' + preId + '1').append(html2);
	});		
}

// 왜 연금을 이런순서로 받아야 하나 박스리스트 그리기
DASHBRD08P02.location.displayWhyList = function(whyList){
	if(ComUtil.isNull(whyList)){
		return;
	}
	
	var _template = $("#_dumyWhyBox").html();
	var template = Handlebars.compile(_template);
	
	$.each( whyList, function(index, item){
		item.idx = index;
		
		item.product_desc = ComUtil.string.convertHtml(item.product_desc);
		
		var html = template(item);
		$('#divWhyBoxList_3').append(html);	// 1단계에서 3단계에 바로 입력
	});
	
	var _templateBtn = $("#_dumyWhyButton").html();
	var templateBtn = Handlebars.compile(_templateBtn);
	$('#divWhyBoxList_3').append(templateBtn);	// 1단계에서 3단계에 바로 입력
	
	
	// 셋팅복사  1,2 단계에서 없어져서 ..  바로 3단계에 입력
	//$('#divWhyBoxList_2').append($('#divWhyBoxList_1').html());
	//$('#divWhyBoxList_3').append($('#divWhyBoxList_1').html());
}

// 3단계 하단 탭 그리기
DASHBRD08P02.location.displayDetail3 = function() {
	var detailData = DASHBRD08P02.variable.detailData;
	
	$.each(detailData.section_list, function(index, item){
		item.idx = index + 1;
		// tab 내 상세 셋팅
		gfn_setDetails(item, $('#season-' + item.idx));
		
		
		var _template = $("#_dumy3Result").html();
		var template = Handlebars.compile(_template);
	
		$.each( item.prdt_list, function(indexP, itemP){
			itemP.idx = indexP;
			itemP.prefix = "se" + item.idx;
			
			gfn_log("itemP.division ::  " + itemP.division);
			
			itemP.division = ComUtil.string.replaceAll(itemP.division, '상품', '');
			
			/*if("신규" == itemP.division){	itemP.diviClass = "new";}
			if("운용" == itemP.division){	itemP.diviClass = "keep";}
			if("이체" == itemP.division){	itemP.diviClass = "keep";}
			if("해지" == itemP.division){	itemP.diviClass = "keep";}
			if("유지" == itemP.division){	itemP.diviClass = "keep";}*/
			
			if((itemP.division).indexOf("신규") == 0) {	itemP.diviClass = "type02";}
			else if((itemP.division).indexOf("운용") == 0){	itemP.diviClass = "type01";}
			else if((itemP.division).indexOf("이체") == 0){	itemP.diviClass = "type01";}
			else if((itemP.division).indexOf("해지") == 0){	itemP.diviClass = "";}
			else if((itemP.division).indexOf("유지") == 0){	itemP.diviClass = "type01";}
			else if((itemP.division).indexOf("보유") == 0){	itemP.diviClass = "type01";}
			else {	itemP.diviClass = "type01";}
			
			itemP.companyImgSrc = gfn_getImgSrcByCd(itemP.company_kftc_cd, 'C');
			
			itemP.acnt_type_nm = gfn_getAcntTypeNm(itemP.prdt_acnt_type);		// 경로때문에 추가
			
			var html = template(itemP);
			$('#seList_' + item.idx).append(html);
			
			$('#' + itemP.prefix + "_" + itemP.idx).data(itemP);
		});	
	});
}



// 차트 그리기
DASHBRD08P02.location.printChart2 = function() {
	var detailData = DASHBRD08P02.variable.detailData;
	var chart2_1 = DASHBRD08P02.variable.chart2_1;
	var chart2_2 = DASHBRD08P02.variable.chart2_2;
	
	
	
	chart2_1.data.datasets[0].data[0] = detailData.crnt_stck_rate; 
	chart2_1.data.datasets[0].data[1] = detailData.crnt_bond_rate; 
	chart2_1.data.datasets[0].data[2] = detailData.crnt_cash_rate;
	 
	chart2_2.data.datasets[0].data[0] = detailData.ppsl_stck_rate; 
	chart2_2.data.datasets[0].data[1] = detailData.ppsl_bond_rate; 
	chart2_2.data.datasets[0].data[2] = detailData.ppsl_cash_rate; 
	

	
	new Chart(DASHBRD08P02.variable.chart2_1.ctx, {
        type :'doughnut',
        data : DASHBRD08P02.variable.chart2_1.data,
        options : DASHBRD08P02.variable.chart2_1.options
    });

	new Chart(DASHBRD08P02.variable.chart2_2.ctx, {
        type :'doughnut',
        data : DASHBRD08P02.variable.chart2_2.data,
        options : DASHBRD08P02.variable.chart2_1.options
    });

}


DASHBRD08P02.location.printChart3 = function() {
	var detailData = DASHBRD08P02.variable.detailData;
	var chartInfo = null;
	var typeLabel = "";
	
	// 자문 데이터는 무조건 나오는것 
	chartInfo = detailData.tot_pnsn_mon_recv_graph;
	/*
	if($('#myAnn08P02').is(":checked")){
		chartInfo = detailData.pnsn_mon_recv_graph;
		typeLabel = "현재";
	}
	else{
		chartInfo = detailData.tot_pnsn_mon_recv_graph;
		typeLabel = "제안";
	}
	*/
	
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
		
	var minimum = 0;
    var first 	= detailData.section_list[0].start_age + '세'; // 1기
    var second 	= detailData.section_list[1].start_age + '세'; // 2기
    var third 	= detailData.section_list[2].start_age + '세'; // 3기

    var ctx = document.getElementById('p3Chart').getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, 0, 450);

	//DASHBRD08P02.variable.chart3.ctx = ctx;
    
    gradient.addColorStop(0, 'rgba(255, 149, 43, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	
    

    var getIcon = function(index, startAge){
        return{
            index:index,
            start:startAge
        };
    }
    var icon =[
        getIcon(1, first),
        getIcon(2, second), 
        getIcon(3, third)
    ];

	DASHBRD08P02.variable.chart3.data.icon = icon;

	var annoLine = [first,second,third];
    var annotations = annoLine.map(function(date, index) {
        return {
            type: 'line',
            id: 'vline' + index,
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: date,
            borderColor: 'rgb(102, 102, 102)',
            borderWidth: 1,
            label: {
                enabled: false,
                position: "top",
                content: [index+1]+'기',
                backgroundColor:'rgb(102, 102, 102)',
                fontSize:11,
                // yAdjust: -20,
            }
        }
    });

	DASHBRD08P02.variable.chart3.options.annotation.annotations = annotations;
	
	
	/*var arrow = new Image();
    //arrow.src = '/images/triangle.svg';*/

	const originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw : function() {

            //draw line
            originalLineDraw.apply(this, arguments);
            var chart = this.chart;
            var icon = chart.config.data.icon;
            var ctx = chart.chart.ctx;
            var xaxis = chart.scales['x-axis-0'];
            var yaxis = chart.scales['y-axis-0'];
            ctx.save();
            
                var xaxis = chart.scales['x-axis-0'];
                var yaxis = chart.scales['y-axis-0'];

                icon.forEach(ele => {

                    var i = ele.index;

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
                    
                    //icon position
                    var xStartPixel = xaxis.getPixelForValue(ele.start); // x점
                    var yEndPixel = yaxis.getPixelForValue(minimum); // y하위점
                
                    //center
                    var xCenter = xStartPixel - 11;
                    var yBottom = yEndPixel - 5;

                    //ctx.drawImage(arrow, xCenter, yBottom, 22, 23);

                    //btn
                
                    ctx.beginPath();
                    ctx.fillStyle = "#666666";
                    ctx.roundedRectangle(xStartPixel, 6 , 30, 20, 10);
                    ctx.fill();

                    ctx.font = "12px Arial";
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.fillText(i+"기", xStartPixel + 14, 21);


                })
            ctx.restore();
                
        }
    });    
    Chart.pluginService.register(originalLineDraw);
	
	var maxValue = parseInt(chartInfo.vertical_maximum);
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else { stepSize = parseInt(parseInt(maxValue / 4 * 100) / 1000) * 10;}
	DASHBRD08P02.variable.chart3.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	DASHBRD08P02.variable.chart3.options.scales.yAxes[0].ticks.stepSize = stepSize;

	DASHBRD08P02.variable.chart3.data.labels 			= chartInfo.labels;
	DASHBRD08P02.variable.chart3.data.datasets[0].label	= '자문';
	DASHBRD08P02.variable.chart3.data.datasets[0].data	= chartInfo.chart[1].value;
	DASHBRD08P02.variable.chart3.data.datasets[0].backgroundColor	= gradient;
	
	// 현제 데 이 터 일단 삭제  
	if(DASHBRD08P02.variable.chart3.data.datasets.length == 2){
		DASHBRD08P02.variable.chart3.data.datasets.pop();
	}
	// 현재 수령액 체크가 되어 있는 경우
	if($('#myAnn08P02').is(":checked")){
		gradientL2 = ctx.createLinearGradient(0, 0, 0, 450);
	
	    gradientL2.addColorStop(0, 'rgba(40, 209, 80, 0.8)');  
        gradientL2.addColorStop(0.5, 'rgba(40, 209, 80, 0.1)');  
        gradientL2.addColorStop(1, 'rgba(255, 255, 255, 0)');  

		var muffler_chartInfo = {};
		muffler_chartInfo.label	= '현재';
		muffler_chartInfo.data	= chartInfo.chart[0].value;
		muffler_chartInfo.backgroundColor	= gradientL2;
		DASHBRD08P02.variable.chart3.data.datasets.push(muffler_chartInfo);
	}
    

	new Chart(ctx, {
        type :'line',
        data : DASHBRD08P02.variable.chart3.data,
        options : DASHBRD08P02.variable.chart3.options
    });
	
}



// 차트 초기
DASHBRD08P02.location.initChart2 = function(){
	var ctx2_1 = document.getElementById('myCircle').getContext('2d');
	var ctx2_2 = document.getElementById('myCircle2').getContext('2d');
	
	DASHBRD08P02.variable.chart2_1.ctx = ctx2_1;
	DASHBRD08P02.variable.chart2_2.ctx = ctx2_2;
	
	// round corners
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

	// options
    DASHBRD08P02.variable.chart2_1.options ={
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
	
	// data
	DASHBRD08P02.variable.chart2_1.data ={
		labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [30,10,60],
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
	}
	
	// data
	DASHBRD08P02.variable.chart2_2.data ={
		labels: ['주식'],
        datasets: [{
            label: '# of Votes',
            data: [40,40,20],
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
	}
	
}


DASHBRD08P02.location.initChart3 = function(){
	
	// option
	DASHBRD08P02.variable.chart3.options ={
		responsive: true,
        aspectRatio:3/2,
		tooltips: {
                    enabled: false
        },
        legend: {
            display: false,
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
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
                    fontColor: "#999999",
                    beginAtZero: true,
                    padding: 8,
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
                    beginAtZero: true,
                    padding: 3,
                }
            }],
            
        },
        elements: {
            point:{
                radius: 0
            }
        },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            annotations: null
        }
	}
	
	// data
	DASHBRD08P02.variable.chart3.data ={
		labels: ["60세","65세","70세","75세","80세","85세","90세"],
        datasets: [
        {
            label: '자문', 
            data: [800,	1000,500, 1200, 1400,1000,1100], 
            borderColor: '#ff952b', 
            borderWidth: 2,
            backgroundColor: null,
            lineTension: 0
            
        }
		,{
            label: '현재', 
            data: [500,	400 ,200, 400, 700, 800,700], 
            borderColor: '#28d150', 
            borderWidth: 2,
            backgroundColor: null,
            lineTension: 0
            
        }
		],
        icon : null
	}

}


DASHBRD08P02.location.tooltip = function(tooltipId) {
	$(`#${tooltipId}`).toggleClass('show');
}



DASHBRD08P02.init();
