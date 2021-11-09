/**
* 파일명 		: PENSEXE01P02.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 자문계좌정보 (t-01-02)
* 설명		: 자문계좌정보
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.03
* 수정일/내용	: 
*/
var PENSEXE01P02 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE01P02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,chartCrnt 		: {}								// 현재 도우넛 차트
	,chartPpsl 		: {}								// 제안 도우넛 차트
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
	,showMenu		: false								//
}

/* 이벤트 정의 */
PENSEXE01P02.events = {
	 'click #btnPopCloseOk'								: 'PENSEXE01P02.event.clickBtnPopCloseOk'
	,'click li[id^="fundItem_"]'						: 'PENSEXE01P02.event.clickFundItem'
}

PENSEXE01P02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE01P02');
	
	$("#pTitle").text("자문계좌정보");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-01-02";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE01P02.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE01P02.location.pageInit = function() {
	var sParams = sStorage.getItem("PENSEXE01P02Params");
	
	
	if(!ComUtil.isNull(sParams)){
		gfn_log(sParams);
		PENSEXE01P02.variable.detailData = sParams;		// 조회가 없기 때문에 바로 셋팅
		sStorage.setItem('PENSEXE01P02Params', null);
		
		// 메뉴링크를 타고 온 경우
		if( ComUtil.null(PENSEXE01P02.variable.detailData.oScreenId, "") == "MYINFOM03S30"){
			$('#divBtnClose').show();
		} 
		else{
			$('#divBtnCloseOk').show();
		}
	}
	
	
	{
		//Tab
        $('.tab-label-item:nth-child(1) a', $('#P02-content')).addClass('is_active');
        $('#tabPanel-1', $('#P02-content')).show();

        $(".tab-label-item a", $('#P02-content')).on("click", function(e){
            e.preventDefault();

            //label
            var target = $(this).attr("href");
            $(".tab-label-item a").removeClass("is_active");
            $(this).addClass("is_active");

            //panel
            $(".tab-panel").hide();
            $(target).show();
        });
	}
	
	
	
	
	// 차트 영역 셋팅
	PENSEXE01P02.location.initChart();
	
	// 셋팅
	PENSEXE01P02.location.displayDetail();
	
	// 자문구분코드  1: [변경], 2: [이체], 3: [유지], 4:[연계], 5:[신규], 9:[해지]
	// 화면접근정보 통지
	var inputParam = {};
	if(PENSEXE01P02.variable.detailData.advc_gbn_cd == '1'){
		inputParam.event 	= 'approval_3';
	}
	else if(PENSEXE01P02.variable.detailData.advc_gbn_cd == '2'){
		inputParam.event 	= 'approval_2';
	}
	else if(PENSEXE01P02.variable.detailData.advc_gbn_cd == '5'){
		inputParam.event 	= 'approval_4';
	}
	else{
		return;
	}
	gfn_enterScreen(inputParam);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
/*
// 연금관리 메인 상세내역 조회 (이화면은 조회 없음)
PENSEXE01P02.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE01P02.callBack; 
	
	//gfn_Transaction( inputParam );
}
*/



////////////////////////////////////////////////////////////////////////////////////
// 이벤트

PENSEXE01P02.event.clickBtnPopCloseOk = function(e) {
 	// 창 닫을때 부모창으로 값 넘기기
	var returnData = {};
	returnData.confirmYn = "Y";
    gfn_closePopup(returnData);
}



// 포트폴리오  클릭시
PENSEXE01P02.event.clickFundItem = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	
	var inputParam = {};
	inputParam.fund_no 		= data.prdt_cd;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSEXE01P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){
		PENSEXE01P02.variable.detailData = result;
		
		// 
		PENSEXE01P02.location.displayDetail();
				
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSEXE01P02.location.displayDetail = function(){
	var detailData = PENSEXE01P02.variable.detailData;
	
	$('#div_acnt_advc_cntnt_expl').html(detailData.acnt_advc_cntnt_expl);	// 계좌자문내용설명
	detailData.acnt_type_nm = gfn_getAcntTypeNm(detailData.acnt_type);		// 계좌구분명 
	
	
	$('#acnt_advc_ttl').html(ComUtil.string.convertHtml(detailData.acnt_advc_ttl));
	
	$('#orgn_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C'));
	$('#chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	$('#new_chng_fncl_agc_img').attr('src', gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C'));
	
	// 자문구분코드가 신규일때 처리 
	if(detailData.advc_gbn_cd == '5'){
		$('#divNew').show();
		$('#divNow').hide();
		$('#divNewPort').show();
		$('#divNowPort').hide();
	}
	else{
		$('#divNew').hide();
		$('#divNow').show();
		$('#divNewPort').hide();
		$('#divNowPort').show();
	}
	
	// 포트폴리오 영역 보여주기 여부 
	if(detailData.advc_efft_no == "1"){
		$('#disPortfolio_title').hide();
		$('#disPortfolio_tab').hide();
		$('#disNoPortfolio_title').show();
	}
	else if(detailData.advc_efft_no == "2"){
		$('#disPortfolio_title').show();
		$('#disPortfolio_tab').show();
		$('#disNoPortfolio_title').hide();
		
		// 포트폴리오 차트 그리기
		PENSEXE01P02.location.printChart();
		
		// 제한 포트폴리오 상품목록 그리기
		PENSEXE01P02.location.displayProdList();
	}
	else{
		$('#disPortfolio_title').hide();
		$('#disPortfolio_tab').hide();
		$('#disNoPortfolio_title').show();
	}
	
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#P02-content'));
}


// 제한 포트폴리오 상품목록 그리기
PENSEXE01P02.location.displayProdList = function(){
	var detailData = PENSEXE01P02.variable.detailData;
	
	$('#ulPortfolioPrdtList').html('');
	
	detailData.ptflPrdtCnt = "0"; // 포트폴리오 리스트 초기값
	
	if(ComUtil.isNull(detailData.advc_ptfl_prdt_list)){
		return;
	}
	
	if(detailData.advc_ptfl_prdt_list.length > 0){
		var _template = $("#_dumyPrdtList").html();
		var template = Handlebars.compile(_template);
		
		detailData.ptflPrdtCnt = detailData.advc_ptfl_prdt_list.length;
		
		$.each( detailData.advc_ptfl_prdt_list, function(index, item){
			item.idx = index + 1;
			
			var html = template(item);
			$('#ulPortfolioPrdtList').append(html);
			$('#fundItem_' + item.idx).data(item);
		});	
	}
}

// 포트폴리오 도우넛 차트 그리기
PENSEXE01P02.location.printChart = function() {
	var detailData = PENSEXE01P02.variable.detailData;
		
	PENSEXE01P02.variable.chartCrnt.data.datasets[0].data[0] = detailData.crnt_stck_rate;
	PENSEXE01P02.variable.chartCrnt.data.datasets[0].data[1] = detailData.crnt_bond_rate;
	PENSEXE01P02.variable.chartCrnt.data.datasets[0].data[2] = detailData.crnt_cash_rate;
	
	PENSEXE01P02.variable.chartPpsl.data.datasets[0].data[0] = detailData.ppsl_stck_rate;
	PENSEXE01P02.variable.chartPpsl.data.datasets[0].data[1] = detailData.ppsl_bond_rate;
	PENSEXE01P02.variable.chartPpsl.data.datasets[0].data[2] = detailData.ppsl_cash_rate;
	
	//if(ComUtil.null(detailData.crnt_stck_rate, 0) + ComUtil.null(detailData.crnt_bond_rate, 0) + ComUtil.null(detailData.crnt_cash_rate, 0) > 0){
	if(detailData.advc_gbn_cd == '5'){
		$('#divCrntChart').hide();
		$('#divCrntPer').hide();
		$('#divNoJoin').show();
	}
	else{
		$('#divCrntChart').show();
		$('#divCrntPer').show();
		$('#divNoJoin').hide();
		
	    var crntChart = new Chart(PENSEXE01P02.variable.chartCrnt.ctx, {
	        type :'doughnut',
	        data : PENSEXE01P02.variable.chartCrnt.data,
	        options : PENSEXE01P02.variable.chartCrnt.options
	    });
	}

    var ppslChart = new Chart(PENSEXE01P02.variable.chartPpsl.ctx, {
        type :'doughnut',
        data : PENSEXE01P02.variable.chartPpsl.data,
        options : PENSEXE01P02.variable.chartPpsl.options
    });

	
}


// doughnut 차트 초기셋팅
PENSEXE01P02.location.initChart = function(){
	var detailData = PENSEXE01P02.variable.detailData;
	
	var ctxCrnt = document.getElementById('P02_myCircleCrnt').getContext('2d');
	var ctxPpsl = null;
	
	// 자문구분코드가 신규일때 처리 
	if(detailData.advc_gbn_cd == '5'){
		ctxPpsl = document.getElementById('P02_myCirclePpslNew').getContext('2d');
	}
	else{
		ctxPpsl = document.getElementById('P02_myCirclePpsl').getContext('2d');
	}
	
	PENSEXE01P02.variable.chartCrnt.ctx = ctxCrnt;
	PENSEXE01P02.variable.chartPpsl.ctx = ctxPpsl;
	
	// round corners
    Chart.pluginService.register({
        afterUpdate: function (chart) {
            if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
                var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
                arc.round = {
                    x: (chart.chartArea.left + chart.chartArea.right) / 2,
                    y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                    radius: (chart.outerRadius + chart.innerRadius) / 2,
                    thickness: (chart.outerRadius - chart.innerRadius) / 2,
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

	// options
    PENSEXE01P02.variable.chartCrnt.options ={
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
	
    PENSEXE01P02.variable.chartPpsl.options ={
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
	PENSEXE01P02.variable.chartCrnt.data ={
		labels: ['현재'],
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
	
	PENSEXE01P02.variable.chartPpsl.data ={
		labels: ['제안'],
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


PENSEXE01P02.init();
