/**
* 파일명 		: PENSION01M00.js (m-01) m-01-01
* 업무		: 웰컴보드 > 메인화면 
* 설명		: 연금관리 메인화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.13
* 수정일/내용	: 2020.12.07 (디자인수정사항반영)
*/
var PENSION01M00 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION01M00.variable = {
	chartInfo 		: {}
	,detailData		: {}								// 조회 결과값
	,noHead			: false								// 해더영역 존재여부 default 는 false
	,headType		: 'dash'
	,showMenu		: true								// default : true
}

/* 이벤트 정의 */
PENSION01M00.events = {
	 'click div[name^="divBannerItem_"]'	: 'PENSION01M00.event.clickBanner'
	,'change #myAnn'						: 'PENSION01M00.event.changeMyAnn'
	,'click #goMyAnn' 						: 'PENSION01M00.event.goMyAnn'		// 나의 월평균 퇴직연금
	,'click #addPay' 						: 'PENSION01M00.event.goAddPay'		// 추가납입
	,'click #revPlan' 						: 'PENSION01M00.event.goRevPlan'	// 자산배분
	,'click #faqList, #faqList2'			: 'PENSION01M00.event.gofaqList'	// FAQ
	,'click #user_nm' 						: 'PENSION01M00.event.reset'		// reset
	,'click #btnDetail'						: 'PENSION01M00.event.goDetailInfo'	// 기수 상세화면이동
	,'click #myChart'						: 'PENSION01M00.event.goDetailInfo2'	// 기수 상세화면이동
}

PENSION01M00.init = function(){
	
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION01M00');
	
	$("#pTitle").text("연금관리");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-01-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION01M00.location.pageInit();
}


// 화면내 초기화 부분
PENSION01M00.location.pageInit = function() {
	// 차트 영역 셋팅
	PENSION01M00.location.initChart();
	gfn_historyClear();
	sStorage.setItem('homeUrl', location.pathname);
	
	
	//$('#my_oprt_today_dis').val(ComUtils.);
	
	// 차트 초기화
	//chartUtil.init();
	//chartUtil.chartOn();
    /*
	var mbannerList = [
		{title:'<b>MC2 투자</b>이야기', category:'0', thumbnail_img_url:'/images/sample_slide2.png', thumbnail_img_alt:'투자이야기1', linkUrl:'/board_mng/qna_mng', board_idx:11}
		,{title:'<b>MC2 투자2</b>이야기', category:'0', thumbnail_img_url:'/images/sample_slide.png', thumbnail_img_alt:'투자이야기2', linkUrl:'/board_mng/BOARDFAQS01', board_idx:12}
		,{title:'<b>MC2 투자3</b>이야기', category:'0', thumbnail_img_url:'/images/sample_slide2.png', thumbnail_img_alt:'투자이야기3', linkUrl:'http://localhost:8001/html/new_m-02-03.html', board_idx:13}
		,{title:'<b>MC2 투자4</b>이야기', category:'0', thumbnail_img_url:'/images/sample_slide.png', thumbnail_img_alt:'투자이야기4', linkUrl:'http://localhost:8001/html/new_m-03-01.html', board_idx:14}
	];
	
	PENSION01M00.location.displayBanner(mbannerList, $('#div_m_slide'));
	
	var cbannerList = [
		{title:'<b>Study</b> Cafe', category:'1', thumbnail_img_url:'/images/sample_slide2.png', thumbnail_img_alt:'투자이야기1', linkUrl:'/pension_mng/PENSION02S02', desc:'리밸런싱은<br> 무엇이며 꼭 필요한가', board_idx:8}
		,{title:'<b>Study2</b> Cafe', category:'1', thumbnail_img_url:'/images/sample_slide.png', thumbnail_img_alt:'투자이야기2', linkUrl:'http://localhost:8001/html/new_m-02-02.html', board_idx:9}
		,{title:'<b>Study3</b> Cafe', category:'1', thumbnail_img_url:'/images/sample_slide2.png', thumbnail_img_alt:'투자이야기3', linkUrl:'http://localhost:8001/html/new_m-02-03.html', board_idx:8}
		,{title:'<b>Study4</b> Cafe', category:'1', thumbnail_img_url:'/images/sample_slide.png', thumbnail_img_alt:'투자이야기4', linkUrl:'http://localhost:8001/html/new_m-03-01.html', board_idx:9}
	];
	
	PENSION01M00.location.displayBanner(cbannerList, $('#div_c_slide'));
	PENSION01M00.location.slickBanner();
	*/

	// 연금관리 메인 상세내역 조회 	
	PENSION01M00.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSION01M00.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= PENSION01M00.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 국민연금 선택 여부
PENSION01M00.event.changeMyAnn = function(e) {
	if(!ComUtil.isNull(e)){
 		e.preventDefault();
	}
	
	if(ComUtil.isNull(PENSION01M00.variable.detailData)){
		return;
	}

	var my_save_pnsn_dis = "";	// 내가모은연금
	var my_recv_pnsn_dis = "";	// 내가받을연금
	var my_save_pnsn_unit = "";	// 내가모은연금단위
	var my_recv_pnsn_unit = "";	// 내가받을연금단위
	
	if($('#myAnn').is(":checked")){
		my_save_pnsn_dis = PENSION01M00.variable.detailData.my_save_tot_pnsn_dis;
		my_recv_pnsn_dis = PENSION01M00.variable.detailData.my_recv_tot_pnsn_dis;
		my_save_pnsn_unit = PENSION01M00.variable.detailData.my_save_tot_pnsn_unit;
		my_recv_pnsn_unit = PENSION01M00.variable.detailData.my_recv_tot_pnsn_unit;
	}
	else{
		my_save_pnsn_dis = PENSION01M00.variable.detailData.my_save_pnsn_dis;
		my_recv_pnsn_dis = PENSION01M00.variable.detailData.my_recv_pnsn_dis;
		my_save_pnsn_unit = PENSION01M00.variable.detailData.my_save_pnsn_unit;
		my_recv_pnsn_unit = PENSION01M00.variable.detailData.my_recv_pnsn_unit;
	}
	
	$('#my_save_pnsn_dis').html(my_save_pnsn_dis);
	$('#my_recv_pnsn_dis').html(my_recv_pnsn_dis);
	$('#my_save_pnsn_unit').html(my_save_pnsn_unit);
	$('#my_recv_pnsn_unit').html(my_recv_pnsn_unit);
}


// 배너클릭시 링크화면 호출
PENSION01M00.event.clickBanner = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	var sParam = {};
	
	if(data.category == '0'){	// 투자이야기
		sStorage.setItem("BORDIVS03P11Params", data);
		sParam.url = "/board_mng/BORDIVS03P11";	// 투자이야기 상세내역 보기화면 호출
	}
	else{
		sStorage.setItem("BORDSCF03P12Params", data);
		sParam.url = "/board_mng/BORDSCF03P12";	// 스터디카페 상세내역 보기화면 호출
	}
	
	gfn_callPopup(sParam, function(){});
}

// 나의 월평균 퇴직연금 화면 이동
PENSION01M00.event.goMyAnn = function(e) {
 	e.preventDefault();
	
	var url = "/pension_mng/PENSION02S02";
	ComUtil.moveLink(url);
	//gfn_alertMsgBox("나의 퇴직연금");
}

// 추가납입 화면 이동
PENSION01M00.event.goAddPay = function(e) {
 	e.preventDefault();
	
	var url = "/pension_mng/PENSION02S02";
	ComUtil.moveLink(url);
	//gfn_alertMsgBox("추가납입");
}
 
// 자산배분 화면 이동
PENSION01M00.event.goRevPlan = function(e) {
 	e.preventDefault();
	
	var url = "/pension_mng/PENSION02S02";
	ComUtil.moveLink(url);
	//gfn_alertMsgBox("자산배분");
}
 
// FAQ 화면 이동
PENSION01M00.event.gofaqList = function(e) {
 	e.preventDefault();
	
	// FAQ 화면 호출 ->  자주하는질문으로 바뀜
	//ComUtil.moveLink('/board_mng/BORDFAQ04S01');
	ComUtil.moveLink('/help_desk/HELPDES03S01');
}
 
PENSION01M00.event.reset = function(e) {
 	e.preventDefault();
	
	//gfn_alertMsgBox("reset click!!");
	//sessionStorage.clear();
} 

// 문제버튼 클릭시
PENSION01M00.event.goDetailInfo = function(e) {
 	e.preventDefault();
	
	var url = "/pension_mng/PENSION02S01";
	ComUtil.moveLink(url);
}

// 차크 클릭시
PENSION01M00.event.goDetailInfo2 = function(e) {
 	e.preventDefault();

	sStorage.setItem("sParams", {idx:1});	// 기수
	var url = "/pension_mng/PENSION02S01";
	ComUtil.moveLink(url);
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSION01M00.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){
		PENSION01M00.variable.detailData = result;
		
		// 복호화
		PENSION01M00.variable.detailData.user_nm = JsEncrptObject.decrypt(PENSION01M00.variable.detailData.user_nm);
		
		// 내연금정보 셋팅
		PENSION01M00.location.displayMyPension();
		
		// 리밸런싱 프로그래스바 표현
		PENSION01M00.location.displayRebalance();
		
		ComUtil.number.setDigitCount('#my_save_pnsn_dis', 200, 1200);
		
		// 차트 테스트 
		//PENSION01M00.location.testChart();
		
		// 차트 그리기
		PENSION01M00.location.displayChart();
		
		// 상단 배너 셋팅
		if(!ComUtil.isNull(result.ivs_bbs)){
			PENSION01M00.location.displayBanner(result.ivs_bbs, $('#div_m_slide'));
		}
		
		// 하단 배너 셋팅
		if(!ComUtil.isNull(result.scfe_bbs)){
			PENSION01M00.location.displayBanner(result.scfe_bbs, $('#div_c_slide'));
		}
		
		PENSION01M00.location.slickBanner();
		
		// 로딩창 제거 요청 브릿지 호출
		/*if(!ComUtil.isNull(sStorage.getItem('gUserInfo'))){
			gfn_finishLoading();
		}*/
		
		// 알람조회
		gfn_reloadAlarm();
		
		// order popup call
		PENSION01M00.location.callOrderPopup();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

PENSION01M00.location.slickBanner = function(){
	$('.cafe_slide').slick({
        arrows: false,
        dots:true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        //fade: true,
        //cssEase: 'linear'
    });

    $('.mc2_slide').slick({
        arrows: false,
        dots:true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        //fade: true,
        //cssEase: 'linear'
    });

	// 리밸런싱 툴팁조절
	const rebalWidth =  $('.progress').width();
    if(rebalWidth > 1){
        //alert('기본 퍼센트 충족');
    }else{
        $('.progress .tip').addClass('zero');
    }
}

// 나의 연금 영역 표시
PENSION01M00.location.displayMyPension = function(){
	gfn_setDetails(PENSION01M00.variable.detailData, $('#f-content'));
	
	PENSION01M00.event.changeMyAnn();
}


// 배너영역 표시
PENSION01M00.location.displayBanner = function(bannerList, divObj){
	// 초기화
	$('div', $(divObj)).remove();
	
	if(gfn_isNull(bannerList)){
		return;
	}

	var _template = $("#_dumyBanner").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( bannerList, function(index, item){
		item.idx = index + 1;
		var html = template(item);
		$(divObj).append(html);
		//$('#seResult_' + item.q_type).show();
		
		$('div', $(divObj)).last().data(item);
	});	
}	


// order popup call
PENSION01M00.location.callOrderPopup = function(){
	
	/*if(sStorage.getItem('endOrderYn') == 'Y'){
		return;
	}*/
	
	if(  ComUtil.null(PENSION01M00.variable.detailData.buy_order_yn, 'N') == 'Y'
	  || ComUtil.null(PENSION01M00.variable.detailData.sell_order_yn, 'N') == 'Y'
	  ){
		var sParam = {};
		sParam.url = '/pension_execution/order/ORDREXE01P01';
		gfn_callPopup(sParam, function(){
			//sStorage.setItem('endOrderYn', 'Y');
		});
	}
	
}


PENSION01M00.location.displayRebalance = function(){
	
	if(ComUtil.isNull(PENSION01M00.variable.detailData)){
		return;
	}
	
	var rate 		= PENSION01M00.variable.detailData.reblnc_bar_proc_rate;
	var remainDay 	= PENSION01M00.variable.detailData.reblnc_remn_prd;
	var startDay 	= PENSION01M00.variable.detailData.last_advc_dt;
	
	var html = '<div class="progress_bar">\
                    <div class="progress" style="width:'+rate+'%">\
                        <span class="tip"><span>'+remainDay+'</span>일</span>\
                    </div>\
                </div>\
                <div class="rebalance_info">\
                    <p class="rebalance_date">\
                        <span>'+startDay+'</span>\
                    </p>\
                    <p class="rebalance_txt">\
                        <span>리밸런싱(재조정)</span>\
                    </p>\
                </div>';

	$('#div_rebalance').html(html);
}


// 차트 그리기
PENSION01M00.location.displayChart = function(){
	var chartInfo = PENSION01M00.variable.detailData.my_pnsn_status_graph;
	
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
	//chart Axes
	var xMinimum = chartInfo.labels[0];
	var xMaximum = chartInfo.labels[chartInfo.labels.length-1];
	
	
	var maxValue = parseInt(chartInfo.vertical_maximum / 10) * 10;
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	//PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.max = maxValue; 
	PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	PENSION01M00.variable.chartInfo.options.scales.xAxes[0].ticks.max = xMaximum;
	PENSION01M00.variable.chartInfo.options.scales.xAxes[0].ticks.min = xMinimum;
	
	PENSION01M00.variable.chartInfo.data.labels = chartInfo.labels;
	
	
	$.each( chartInfo.chart, function(index, item){
		PENSION01M00.variable.chartInfo.data.datasets[index].label 			= item.legend_name;
		PENSION01M00.variable.chartInfo.data.datasets[index].data 			= item.value;
	});
	
	var ctx = document.getElementById('myChart').getContext('2d');
	new Chart(ctx, {
        type :'line',
        data : PENSION01M00.variable.chartInfo.data,
        options : PENSION01M00.variable.chartInfo.options
    });

	var warn_chk_list = PENSION01M00.variable.detailData.warn_chk_list;
	//$.each( warn_chk_list.reverse(), function(index, item){
	$.each( warn_chk_list, function(index, item){
		//if("1|2|3|4".indexOf(item.oprt_status_cd) > -1){
		if("000" != item.oprt_status_cd){
			var seqHtml = $('#pnsn_recv_seq').html();
			seqHtml = (ComUtil.isNull(seqHtml)) ? item.pnsn_recv_seq : seqHtml + ", " + item.pnsn_recv_seq;
			$('#pnsn_recv_seq').html(seqHtml);
			$('#chartWarning').show();
			
			if(ComUtil.isNull(sStorage.getItem("sParams"))){
				sStorage.setItem("sParams", {idx:parseInt(item.pnsn_recv_seq)});	// 기수
			}
		}
	});
}


// 차트 초기
PENSION01M00.location.initChart = function(){
	//chart yAxes
	var maximum = 200;
	var minimum = 0;
	
	//chart Axes
	var xMaximum = 90;
	var xMinimum = 55;
	
	
	var data={
	        labels: ["55","56","57","58","59","60",
	        "61","62","63","64","65","66","67","68","69","70",
	        "71","72","73","74","75","76","77","78","79","80",
	        "81","82","83","84","85","86","87","88","89","90",],
	        datasets: [{
	            label: '최초',
	            data: [100,	30, 100, 30, 20,100,	30, 100, 30, 20,100,	30, 100, 30, 20],
	            fill: false,
	            borderColor: '#999999', 
	            backgroundColor: '#999999', 
	            borderWidth: 1 ,
	            radius:0,
	        },
	        {
	            label: '현재', 
	            data: [150,	50,	120, 80, 80,150,	50,	120, 80, 80,150,	50,	120, 80, 80], 
	            fill: false,
	            borderColor: '#3ca455', 
	            backgroundColor: '#3ca455',
	            borderWidth: 1 ,
	            radius:0,
	        },{
	            label: '자문', 
	            data: [140,	70,	90, 100, 110,140,	70,	90, 100, 110,140,	70,	90, 100, 110],
	            fill: false,
	            borderColor: '#ff952b', 
	            backgroundColor: '#ff952b', 
	            borderWidth: 1 ,
	            radius:0,
	        }]
	}
	
	var options={
	    responsive: true,
	    aspectRatio:4/3,
	    tooltips: {
	        enabled: false
	    },
	    legend: {
	        display: false,
	    },
	    scales: {
	        xAxes: [{
	            display: true,
	            gridLines: {
	                display: false,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                // borderDash:[2,3],
	            },
	            ticks:{
	                //autoSkipPadding:40,
	                //autoSkip: false,
	                maxRotation:0,
	                maxTicksLimit: 5,
	                callback: function(value, index, values) {
	                    return value;
	                },
	                min:xMinimum,
	                max:xMaximum,
	            },
	           
	        }],
	        yAxes: [{
	            display: true,
	            gridLines: {
	                display: true,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                borderDash:[2,3],
	            },
	            ticks: {
	                min:minimum,
	                max:maximum,
	                stepSize:35
	            }
	        }]
	    }
	}
	
	PENSION01M00.variable.chartInfo.data = data;
	PENSION01M00.variable.chartInfo.options = options;
}

// 차트 그리기
PENSION01M00.location.displayChart_old = function(){
	var chartInfo = PENSION01M00.variable.detailData.my_pnsn_status_graph;
	var warn_chk_list = PENSION01M00.variable.detailData.warn_chk_list;
	
	if(ComUtil.isNull(chartInfo)){
		return;
	}
	
	var xMinimum = chartInfo.labels[0];
	var xMaximum = chartInfo.labels[chartInfo.labels.length-1];
	
	
	
	
	var icon =[];
	var annotations =[];
	if(!ComUtil.isNull(warn_chk_list)){
		//status
		var statusNormal = 0; // 정상
		var statusWait = 1; // 대기
		var statusWarn = 2; // 경고
		var statusSeri = 3; // 심각
		var statusLock = 4; // 잠김
		
		
		var getAnnotations = function(index, status, startAge, endAge) {
			var bgColor = 'rgb(255, 255, 255)';
			switch(status){
		        case statusNormal: 	bgColor = 'rgba(255, 255, 255, 0)'; break; 
		        case statusWait: 	bgColor = 'rgba(153, 153, 153, 0.3)'; break; 
		        case statusWarn: 	bgColor = 'rgba(255, 149, 43, 0.3)'; break; 
		        case statusSeri: 	bgColor = 'rgba(255, 149, 43, 0.3)'; break;
		        case statusLock: 	bgColor = 'rgba(153, 153, 153, 0.3)'; break;
		    }
			return {
		        borderColor: 'rgba(0, 0, 0, 0)',
		        borderWidth: 1,
		      	id: 'box' + index,
		        type: 'box',
		        xScaleID: 'x-axis-0',
		        yScaleID: 'y-axis-0',
		        xMin: startAge,
		        xMax: endAge,
		        backgroundColor:  bgColor,
		        onClick: function(e) {
					sStorage.setItem("sParams", {idx:index});	// 기수
					var url = "/pension_mng/PENSION02S01";
					ComUtil.moveLink(url);
		            //if(status != 0){
		            //    alert(index + "기");
		            //}

		        }
		    };
		};
		var getIcon = function(index,status, startAge, endAge){
		    return{
		        status:status,
		        start:startAge,
		        end:endAge
		    };
		}
		
		
		$.each( warn_chk_list, function(index, item){
			icon.push(getIcon(item.pnsn_recv_seq, item.oprt_status_cd , item.strt_age+"", item.end_age+""));
			annotations.push(getAnnotations(item.pnsn_recv_seq, parseInt(item.oprt_status_cd) , item.strt_age+"", item.end_age+""));
		});	
		
		
		PENSION01M00.variable.chartInfo.data.icon = icon;
		PENSION01M00.variable.chartInfo.options.annotation.annotations = annotations; 
	}
	
	
	var maxValue = parseInt(chartInfo.vertical_maximum);
	var stepSize = 50;
	if(maxValue <= 50) { stepSize = 10;}
	else if(maxValue <= 100) { stepSize = 20;}
	else if(maxValue <= 300) { stepSize = 50;}
	else if(maxValue <= 500) { stepSize = 100;}
	else if(maxValue <= 1000) { stepSize = 200;}
	else { stepSize = parseInt(maxValue / 5 / 100) * 100;}
	PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.max = parseInt(maxValue/100 +1)*100; 
	PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.stepSize = stepSize;
	
	PENSION01M00.variable.chartInfo.options.scales.xAxes[0].ticks.max = xMaximum;
	PENSION01M00.variable.chartInfo.options.scales.xAxes[0].ticks.min = xMinimum;
	
	PENSION01M00.variable.chartInfo.data.labels = chartInfo.labels;
	
	  
	$.each( chartInfo.chart, function(index, item){
		
		PENSION01M00.variable.chartInfo.data.datasets[index].label 			= item.legend_name;
		PENSION01M00.variable.chartInfo.data.datasets[index].data 			= item.value;
		//PENSION01M00.variable.chartInfo.data.datasets[index].borderColor 	= item.color;
		
	});	
	
	
    //new Chart(document.getElementById('myChart').getContext('2d'),
	var ctx = document.getElementById('myChart').getContext('2d');
	new Chart(ctx, {
        type :'line',
        data : PENSION01M00.variable.chartInfo.data,
        options : PENSION01M00.variable.chartInfo.options
    });
}

// 차트 초기
PENSION01M00.location.initChart_old = function(){
	
	//chart yAxes
	var maximum = 200;
	var minimum = 0;
	
	//chart Axes
	var xMaximum = 90;
	var xMinimum = 55;
	
	//status
	var statusNormal = 0; // 정상
	var statusWait = 1; // 대기
	var statusWarn = 2; // 경고
	var statusSeri = 3; // 심각
	var statusLock = 4; // 잠김
	
	var waiting = new Image();
	waiting.src = '/images/icon_waiting.svg';
	
	var warning = new Image();
	warning.src = '/images/icon_warning.svg';
	
	var serious = new Image();
	serious.src = '/images/icon_serious.svg';
	
	var lock = new Image();
	lock.src = '/images/icon_lock.svg';
	
	
	/*var icon =[
	    getIcon(1, 0 , '55세', '65세'),
	    getIcon(2, 1 , '65세', '85세'), 
	    getIcon(3, 2 , '85세', '95세')
	]*/
	
	var data={
	        labels: ["55세","65세",	"75세",	"85세",'95세'],
	        datasets: [{
	            label: '최초',
	            data: [100,	30, 100, 30, 20],
	            fill: false,
	            borderColor: '#999999', 
	            backgroundColor: '#999999', 
	            borderWidth: 1 ,
				radius:0
	        },
	        {
	            label: '현재', 
	            data: [150,	50,	120, 80, 80], 
	            fill: false,
	            borderColor: '#3ca455', 
	            backgroundColor: '#3ca455',
	            borderWidth: 1,
				radius:0 
	        },{
	            label: '자문', 
	            data: [140,	70,	90, 100, 110],
	            fill: false,
	            borderColor: '#ff952b', 
	            backgroundColor: '#ff952b', 
	            borderWidth: 1,
				radius:0 
	        }]
			,icon : []
	}
	var options={
	    responsive: true,
	    aspectRatio:4/3,
		tooltips: {
	        enabled: false
	    },
	    legend: {
	        display: false,
	    },
	    scales: {
	        xAxes: [{
	            display: true,
	            gridLines: {
	                display: false,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                // borderDash:[2,3],
	            },
	            ticks:{
	                //autoSkipPadding:40,
	                //autoSkip: false,
	                maxRotation:0,
	                maxTicksLimit: 5,
	                callback: function(value, index, values) {
	                    return value;
	                },
	                min:xMinimum,
	                max:xMaximum,
	            },
	        }],
	        yAxes: [{
	            display: true,
	            gridLines: {
	                display: true,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                borderDash:[2,3],
	            },
	            ticks: {
	                min:minimum,
	                max:maximum,
	                stepSize:35
	            }
	        }]
	    },
	    annotation: {
	        drawTime: "beforeDatasetsDraw",
	        events: ['click'],
	        annotations: []
	        //annotations: annotations
	    }
	}
	
	PENSION01M00.variable.chartInfo.data = data;
	PENSION01M00.variable.chartInfo.options = options;
	
	var afterDrawIcon = {
	    afterDraw: function() {
	
	    var originalLineDraw = Chart.controllers.line.prototype.draw;
	    // Extend the line chart, in order to override the draw function.
	    Chart.helpers.extend(Chart.controllers.line.prototype, {
	        draw : function() {
	        //draw line
	        originalLineDraw.apply(this, arguments);
	        
	        var chart = this.chart;
	        // Get the object that determines the region to highlight.
	        var icon = chart.config.data.icon;
	
			var ctx = chart.chart.ctx;
	        var xaxis = chart.scales['x-axis-0'];
	        var yaxis = chart.scales['y-axis-0'];
	        
	        //rounded corner
	        CanvasRenderingContext2D.prototype.roundedRectangle = function(x, y, width, height, rounded) {
	            const radiansInCircle = 2 * Math.PI
	            const halfRadians = (2 * Math.PI)/2
	            const quarterRadians = (2 * Math.PI)/4  
	            
	            // top left arc
	            this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
	            // line from top left to bottom left
	            this.lineTo(x, y + height - rounded)
	            // bottom left arc  
	            this.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)  
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
	        //position
	        //var yStartPixel = yaxis.getPixelForValue(maximum); // 완전 최상윗점
			//var yStartPixel = yaxis.getPixelForValue(PENSION01M00.variable.detailData.my_pnsn_status_graph.vertical_maximum); // 완전 최상윗점 
			var yStartPixel = yaxis.getPixelForValue(ComUtil.null(PENSION01M00.variable.chartInfo.options.scales.yAxes[0].ticks.max, maximum)); // 완전 최상윗점 
	        var yEndPixel = yaxis.getPixelForValue(minimum); // 완전 하위점 
	
	        // If the object exists.
	        if (icon !== undefined) {
	        
	
	                ctx.save();
	                //icon.forEach(ele => {
	                $.each(icon, function(index, ele){
	                
	                //icon position
	                var xStartPixel = xaxis.getPixelForValue(ele.start); // 개체 첫점
	                var xEndPixel = xaxis.getPixelForValue(ele.end); //
	                var xPixel = xStartPixel  + (xEndPixel - xStartPixel) * 0.43;
	                var yPixel = yaxis.getPixelForValue((maximum - minimum) * 0.8);
	
	                //bg transWhite
	                var xBoxStart = xStartPixel + 5;
	                var yBoxStart = yStartPixel + 5;
	                var xBoxEnd = (xEndPixel - xStartPixel) -10;
	                var yBoxEnd = yEndPixel - 17;
	
	                //btn
	                var xBtnStart = xBoxStart +10;
	                var yBtnStart = yBoxEnd - 25;
	                var xBtnEnd = xBoxEnd - 20;
	                var yBtnEnd = 26;
	
	                //center
	                var xCenter = xStartPixel  + ((xEndPixel - xStartPixel)/2);
	                var yTxt = yBtnStart +18;
	                
	                if(ele.status == statusNormal){
	                }else if(ele.status == statusWait){
	                    //line
	                    ctx.beginPath();
	                    ctx.moveTo(xStartPixel, yStartPixel);
	                    ctx.lineTo(xStartPixel, yEndPixel);
	                    ctx.stroke();
	
	                    //bg
	                    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	                    
	                    //icon
	                    var icoCenter = xCenter -11;
	                    var img = waiting;
	                    ctx.drawImage(img, icoCenter, 35, 22, 38);
	                }else if(ele.status == statusWarn){
	
	                    //line
	                    ctx.strokeStyle = "#999999";
	                    ctx.beginPath();
	                    ctx.moveTo(xStartPixel, yStartPixel);
	                    ctx.lineTo(xStartPixel, yEndPixel);
	                    ctx.stroke();
	
	                    //bg
	                    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	
	                    //icon
	                    var icoCenter = xCenter -12;
	                    var img = warning;
	                    ctx.drawImage(img, icoCenter, 32, 24, 41);
	                }else if(ele.status == statusSeri){
	                    //line
	                    ctx.strokeStyle = "#999999";
	                    ctx.beginPath();
	                    ctx.moveTo(xStartPixel, yStartPixel);
	                    ctx.lineTo(xStartPixel, yEndPixel);
	                    ctx.stroke();
	
	                    //bg
	                    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	
	                    //icon
	                    var icoCenter = xCenter -11;
	                    var img = serious;
	                    ctx.drawImage(img, icoCenter, 35, 22, 38);
	                }else{
	                    //line
	                    ctx.strokeStyle = "#999999";
	                    ctx.beginPath();
	                    ctx.moveTo(xStartPixel, yStartPixel);
	                    ctx.lineTo(xStartPixel, yEndPixel);
	                    ctx.stroke();
	
	                    //lock
	                    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	
	                    //icon
	                    var icoCenter = xCenter -11;
	                    var img = lock;
	                    ctx.drawImage(img, icoCenter, 35, 22, 38);
	                }
	            });
	          
	
	            function drawCenter(){
		            var xStartPoint = xaxis.getPixelForValue(0); 
		            var xEndPoint = xaxis.maxWidth;
		            var centerBoxPixelx = (xEndPoint + xStartPoint)/2;
		            var centerBoxPixely = (yEndPixel + yStartPixel)/2 - 18;

	                var grd = ctx.createLinearGradient(centerBoxPixelx, 0, 250, 0);
	                grd.addColorStop(0, "#ff6414");
	                grd.addColorStop(1, "#ff952b");
	
	                //btn
	                ctx.beginPath();
	                ctx.fillStyle = grd;
	                
	                ctx.roundedRectangle(centerBoxPixelx -60 , centerBoxPixely+10 , 120, 24, 5);
	                ctx.fill();
	
	                ctx.font = "11px Arial";
	                ctx.fillStyle = "#ffffff";
	                ctx.textAlign = "center";
	                ctx.fillText("문제를 확인해주세요", centerBoxPixelx, centerBoxPixely + 26);
	            }
	            drawCenter();
	            
	            ctx.restore();
	        }
	    }
	    });
	  }
	};
	
	Chart.pluginService.register(afterDrawIcon);
}



PENSION01M00.init();
