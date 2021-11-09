/**
* 파일명 		: PENSION03S04.html
* 업무		: 연금관리  > 상품구성변경 (new_m-03-04.html)
* 설명		: 상품구성변경 리스트 조회
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 
*/

var PENSION03S04 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION03S04.variable = {
	chart : {}
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
PENSION03S04.events = {
	 'click #navi a' 						: 'PENSION03S04.event.clickTab'
	//,'click #chooseBox > li'				: 'PENSION03S04.event.changeChice'
}

PENSION03S04.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION03S04');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-03-04";
	gfn_azureAnalytics(inputParam);
	
	PENSION03S04.location.pageInit();
}


// 화면내 초기화 부분
PENSION03S04.location.pageInit = function() {
	// 차트 영역 셋팅
	PENSION03S04.location.initChart();
	
	// 연금저축한도 조회 	
	PENSION03S04.tran.selectProductList();
}






////////////////////////////////////////////////////////////////////////////////////
// 거래
// 상품구성변경 리스트 조회 
PENSION03S04.tran.selectProductList = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "changePnsnProduct";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/change_pnsn_product";
	inputParam.data 	= {};
	inputParam.callback	= PENSION03S04.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

/*tab 영역 클릭시*/ 
PENSION03S04.event.clickTab = function(e){
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
/*
PENSION03S04.event.changeChice = function(e){
	e.preventDefault();
	
	if($(this).children().hasClass("is_active") !== true){
        $(this).children().addClass("is_active");
        $(this).siblings().children().removeClass("is_active");
    }else{
     
    }
}
*/


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
PENSION03S04.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "changePnsnProduct"){
		PENSION03S04.callBack.changePnsnProduct(result);
	}
}


// 상품구성변경 리스트 조회 콜백함수
PENSION03S04.callBack.changePnsnProduct = function(result){
	// 초기화
	$('#productList').html('');
	
	if(gfn_isNull(result.pnsn_list)){
		$('#no_result').show();
		return;
	}
	
	$('#no_result').hide();

	var _template = $("#_dumyProductList").html();

	var template = Handlebars.compile(_template);
	
	
	var selectBgColor = 'rgb(102, 102, 102)';
	
	$.each( result.pnsn_list, function(index, item){
		item.index = index;
		item.rvnu_addplus = (item.rvnu_rate > 0) ? '+' : '';
		
		var html = template(item);
		$('#productList').append(html);
		
		$('li', '#productList').last().data(item);
		
		var data={
            labels: ['주식'],
            datasets: [{
                label: '# of Votes',
                data: [item.stck_rate,100-50],
                backgroundColor: [
                    selectBgColor
                ],
                borderWidth:0,
                hoverBackgroundColor:[
                    selectBgColor
                ]
            }]
        }
		
        new Chart(document.getElementById('myChart_' + index).getContext('2d'), 
		{
            type :'doughnut',
            data : data,
            options : PENSION03S04.variable.chart.options
        });
	});	
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 차트 그리기
// 차트 초기
PENSION03S04.location.initChart = function(){
	// draw options
	
	Chart.pluginService.register({
        afterUpdate: function (chart) {
            if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
                var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
                arc.round = {
                    x: (chart.chartArea.left + chart.chartArea.right) / 2,
                    y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                    radius: (chart.outerRadius + chart.innerRadius) / 2,
                    thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
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
	
    PENSION03S04.variable.chart.options ={
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
}



PENSION03S04.init();
