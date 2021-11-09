/**
* 파일명 		: DASHBRD02P02.js (pension-D-02-02)
* 업무		: 연금자문 대시보드 > 상세보기
* 설명		: 내연금 상세보기
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.24
* 수정일/내용	: 
*/
var DASHBRD02P02 = CommonPageObject.clone();

/* 화면내 변수  */
DASHBRD02P02.variable = {
	sendData		: {}							
	,detailData		: {}								// 조회 결과값
	,chart 			: {}								// 차트 변수값 저장소
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
DASHBRD02P02.events = {
	 'click li[id^="liPrdt"]'							: 'DASHBRD02P02.event.clickDetailView'
	//,'click a[id^="btnP02Popup_"]'						: 'DASHBRD02P02.event.clickMovePoint'
}

DASHBRD02P02.init = function(){
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('DASHBRD02P02');
	
	//$("#pTitle").text("투자성향분석"); // 팝업은 필요없음
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "d-02-02";
	gfn_azureAnalytics(inputParam);
	
	DASHBRD02P02.location.pageInit();
}


// 상단이동
var goToTop = $('.to_top');

// 화면내 초기화 부분
DASHBRD02P02.location.pageInit = function() {
	// 팝업 상단이동
	/*
    $('.popup_wrap').scroll(function() {
        scrollFunctionInpop();
    });

    function scrollFunctionInpop() {
		gfn_log("$('.popup_wrap').scrollTop() :: " + $('.popup_wrap').scrollTop());
        if($('.popup_wrap').scrollTop() > 80){
            goToTop.show();
            goToTop.click(function(){
                event.preventDefault();
                $('.popup_wrap').scrollTop(0);
            });
            
        }else{
            goToTop.hide();
        }
    }
    */


	// 차트 영역 셋팅
	DASHBRD02P02.location.initChart();
	
	// 초기조회
	DASHBRD02P02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 로그인 후 연금자문 대시보드 화면 초기 조회
DASHBRD02P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myPensionCurInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_advice/my_pension_detail";
	inputParam.data 	= DASHBRD02P02.variable.sendData;
	inputParam.callback	= DASHBRD02P02.callBack; 
	
	gfn_Transaction( inputParam );
}



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 팝업호출
DASHBRD02P02.event.clickMovePoint = function(e) {
	e.preventDefault();
	
	var link = $(this).data('link');
}

 
// 계좌별 상세화면 호출 
DASHBRD02P02.event.clickDetailView = function(e) {
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
DASHBRD02P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 내연금 상세조회
	if(sid == "myPensionCurInfo"){
		//if(ComUtil.isNull(result.user_nm)){
		//	gfn_alertMsgBox("연금자문 초기값을 받지 못했습니다.");
		//	return;
		//}
		
		DASHBRD02P02.variable.detailData = result;
		DASHBRD02P02.variable.detailData.pnsnPointId = "";
		
		// 상세화면 그리기
		DASHBRD02P02.location.displayDetail();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세화면 그리기
DASHBRD02P02.location.displayDetail = function(){
	var detailData = DASHBRD02P02.variable.detailData;
	
	if(ComUtil.null(detailData.my_tot_pnsn_amt) != ComUtil.null(detailData.ntnl_pnsn_pay_amt)){
	//if(detailData.ntnl_pnsn_cpst_rate != "100"){
		$('#mp_earning_rate').show();
		// 내 연금 수익률 이미지 셋팅
		//<img src="/images/icon_sun.svg" alt="수익률이 좋습니다">
		//<img src="/images/icon_rain.svg" alt="수익률이 좋지 않습니다">
		if(detailData.prsn_retr_pnsn_rvnu_rate > 0){
			$('#imgYearRate').attr('src', '/images/icon_sun.svg');	
			$('#imgYearRate').attr('alt', '수익률이 좋습니다');
		}
		else{
			$('#imgYearRate').attr('src', '/images/icon_rain.svg');	
			$('#imgYearRate').attr('alt', '수익률이 좋지 않습니다');
		}
		$('#imgYearRate').show();
	}
	
	
	// 상세내역 셋팅
	gfn_setDetails(DASHBRD02P02.variable.detailData, $('#P02-content'));
	
	// 숫자 또르르
	ComUtil.number.setDigitCount('#my_tot_pnsn_amt', 200, 1200);
	
	// 상품목록 그리드 그리기
	DASHBRD02P02.location.displayProdList('Retr');	// 퇴직연금
	DASHBRD02P02.location.displayProdList('Save');	// 연금저축
	DASHBRD02P02.location.displayProdList('Insr');	// 연금보험
	DASHBRD02P02.location.displayProdList('Etc');	// 기타
	
	
	// chart
	DASHBRD02P02.location.displayChart();
}

// 상품별 리스트 그리기
DASHBRD02P02.location.displayProdList = function(typeId){
	// 초기화
	$('#ulList'+typeId).html('');
	
	var detailData = DASHBRD02P02.variable.detailData;
	
	var prdList = null;
	var pnsnPointId = "";
	
	
	switch(typeId){
		case 'Retr'		: prdList = detailData.prsn_retire_prdt_list;
						  pnsnPointId = "";
			break;
		case 'Save'		: prdList = detailData.pnsn_save_prdt_list;
						  pnsnPointId = "divSave";
			break;
		case 'Insr'		: prdList = detailData.pnsn_insr_prdt_list;
						  pnsnPointId = "divInsr";
			break;
		case 'Etc'		: prdList = detailData.etc_prdt_list;
						  pnsnPointId = "divEtc";
			break;
	}
	
	if(ComUtil.isNull(prdList) || prdList.length == 0){
		$('#div'+typeId).hide();
		return;
	}
	
	if(ComUtil.isNull(detailData.pnsnPointId)){
		detailData.pnsnPointId = pnsnPointId;
		$('#btnP02Popup_pnsn').attr("href", '#' + pnsnPointId);
	}
	
	$('#div'+typeId).show();
	
	$('#divRetr_tit1').show();
	$('#divRetr_tit2').show();
	
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	$.each( prdList, function(index, item){
		item.idx = index;
		item.typeId = typeId;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.company_kftc_cd, 'C');
		
		var html = template(item);
		$('#ulList'+typeId).append(html);
		
		$('#liPrdt'+typeId+item.idx).data(item);
	});	
}



// chart
DASHBRD02P02.location.displayChart = function(){
	var detailData = DASHBRD02P02.variable.detailData;
	
	// draw options
    var optionsBigCircle ={
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
    var dataBigCircle={
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

	
	dataBigCircle.datasets[0].data[0] = detailData.ntnl_pnsn_cpst_rate; // 국민연근비율
	dataBigCircle.datasets[0].data[1] = detailData.retr_pnsn_cpst_rate; // 퇴직연금비율
	dataBigCircle.datasets[0].data[2] = detailData.prsn_pnsn_cpst_rate; // 개인연금비율




    var ctx2 = document.getElementById('bigCircle').getContext('2d');
    new Chart(ctx2, {
        type :'doughnut',
        data : dataBigCircle,
        options : optionsBigCircle
    });
}



// 차트 초기
DASHBRD02P02.location.initChart = function(){
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




DASHBRD02P02.init();
