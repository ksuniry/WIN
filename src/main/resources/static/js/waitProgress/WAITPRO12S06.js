/**
* 파일명 		: WAITPRO12S06.js (W-02-06)
* 업무		: 자문대기 계좌상세 자문취소			
* 설명		: 자문대기 계좌상세 자문취소			
* 작성자		: 정의진
* 최초 작성일자	: 2021.05.03
* 수정일/내용	: 
*/
var WAITPRO12S06 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO12S06.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
WAITPRO12S06.events = {
	 'click #btnSolution'									: 'WAITPRO02S06.event.clickBtnSolution'
	,'click li[id^="prdRow_"]'							: 'WAITPRO12S06.event.clickMoveDetail'
}

WAITPRO12S06.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO12S06');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-06";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO12S06.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO12S06.location.pageInit = function() {
	
	// sStorage에 있는 값 받아오기
	var sParams = sStorage.getItem("WAITPRO12S06Params");
	if(!ComUtil.isNull(sParams)){
		
		WAITPRO12S06.variable.initParamData = sParams;
		WAITPRO12S06.variable.sendData.acnt_uid = sParams.orgn_acnt_uid;
		WAITPRO12S06.variable.sendData.advc_gbn_cd = sParams.advc_gbn_cd;
		WAITPRO12S06.variable.sendData.acnt_status = sParams.acnt_status;
		// sStorage.clear();
	}
	
    //tab
    $('.tablist li:nth-child(1) a').addClass('is_active');
    $('#panel-1').show();

    $('.tablist li').click(function(){
        var index = ($(this).index())+1;
        var active = $(this).children('a').hasClass('is_active');
        if(active !== true){
            $(this).children('a').addClass('is_active');
            $(this).siblings().children('a').removeClass('is_active');
            $('.tab_panel').hide();
            $('#panel-'+index).show();
        }
    });

    function modalClose(){
	    $('#msgPopup').hide();
	}
	
	$('.modal-page-btn button, .dim').on("click",modalClose);
	
	modalClose();

	// 차트 셋팅하기 
	WAITPRO12S06.location.initChart();
	
	// 조회하기
	WAITPRO12S06.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
WAITPRO12S06.tran.selectDetail = function() {

	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitCancelList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_cancel";
	inputParam.data 	= WAITPRO12S06.variable.sendData;
	inputParam.callback	= WAITPRO12S06.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 문제해결 버튼 클릭 시
WAITPRO12S06.event.clickBtnSolution = function(e) {
	e.preventDefault();
	
    $('#msgPopup').show();
}



////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO12S06.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionWaitCancelList"){
		WAITPRO12S06.variable.detailData = result;
		// 상세 셋팅 
		WAITPRO12S06.location.displayDetail();
				
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO12S06.location.displayDetail = function(){
	var detailData = WAITPRO12S06.variable.detailData;

	// 은행로고
	detailData.orgn_companyImgSrc = gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C');
	
	gfn_setDetails(detailData, $('#f-content'))
}

WAITPRO12S06.location.displayChart = function(){
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

        //data2
        var data2={
            labels: ['주식'],
            datasets: [{
                label: '# of Votes',
                data: [30,10,100-50],
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

        var ctx2 = document.getElementById('myCircle').getContext('2d');
        new Chart(ctx2, {
            type :'doughnut',
            data : data2,
            options : options3
        });

}

WAITPRO12S06.location.initChart = function(){
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

	WAITPRO12S06.location.displayChart();
	
}



WAITPRO12S06.init();
