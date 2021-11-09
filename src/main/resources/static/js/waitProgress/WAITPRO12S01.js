/**
* 파일명 		: WAITPRO12S01.js (W-02-01)
* 업무		: 자문대기 계좌상세
* 설명		: 자문대기 계좌상세
* 작성자		: 정의진
* 최초 작성일자	: 2021.04.29
* 수정일/내용	: 
*/
var WAITPRO12S01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO12S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,noBack			: false								// 상단 백버튼 존재유무
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
WAITPRO12S01.events = {	
	 'click #btnSolution'									: 'WAITPRO12S01.event.clickBtnSolution'			
	,'click .btnCapyAcnt'									: 'WAITPRO12S01.event.clickBtnCapyAcnt'
}

WAITPRO12S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO12S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-02-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO12S01.location.pageInit();
	
}


// 화면내 초기화 부분
WAITPRO12S01.location.pageInit = function() {
	
	// 전 화면에서 받은 파라미터 셋팅
	var sParams = sStorage.getItem("WAITPRO12S01Params");
	
	if(!ComUtil.isNull(sParams)){
		WAITPRO12S01.variable.sendData.orgn_acnt_uid = sParams.orgn_acnt_uid;
		WAITPRO12S01.variable.sendData.chng_acnt_uid = sParams.chng_acnt_uid;
		WAITPRO12S01.variable.sendData.advc_gbn_cd = sParams.advc_gbn_cd;
		
		WAITPRO12S01.variable.initParamData = sParams;
		sStorage.clear();
	}
	
	// tab
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

	// modal
    function modalClose(){
        $('.modal-page-wrap').hide();
    }
	
	modalClose();
    $('.modal-page-btn button, .dim').on("click",modalClose);
	
	// 문제해결 msg popup 초기화
	$('div[id^="msgCase_"]').hide();
	
	// 차트 셋팅하기 
	WAITPRO12S01.location.initChart();
	
	// 계좌이전/운용변경 내용 조회
	WAITPRO12S01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 계좌이전/운용변경 내용 조회
WAITPRO12S01.tran.selectDetail = function(){
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitTranList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_acnt_detail";
	inputParam.data 	= WAITPRO12S01.variable.sendData;
	inputParam.callback	= WAITPRO12S01.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 문제해결 버튼 클릭시
WAITPRO12S01.event.clickBtnSolution = function(){
	 $('.modal-page-wrap').show();
}

WAITPRO12S01.event.clickBtnCapyAcnt = function(){
	
	// 클립보드 복사
	//ComUtil.string.clipboardCopy(WAITPRO12S01.variable.detailData.orgn_acnt_no);
	ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(WAITPRO12S01.variable.detailData.chng_acnt_no_p, '-', ''));
	gfn_toastMsgBox("계좌번호가 복사되었습니다.");
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO12S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionWaitTranList"){
		
		WAITPRO12S01.variable.detailData = result;
		WAITPRO12S01.variable.detailData.chng_acnt_no_p = ComUtil.pettern.acntNo(WAITPRO12S01.variable.detailData.chng_acnt_no + gfn_getAddAcntNoByCd(WAITPRO12S01.variable.detailData.chng_kftc_agc_cd));
		WAITPRO12S01.location.displayDetail();
		WAITPRO12S01.location.displayChart();
		
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수
// 계좌이전/운용변경 내용 보기
WAITPRO12S01.location.displayDetail = function(){
	var detailData = WAITPRO12S01.variable.detailData;
	
	// 제목 셋팅
	WAITPRO12S01.location.setTitle();
	
	// 은행로고
	detailData.orgn_companyImgSrc = gfn_getImgSrcByCd(detailData.orgn_kftc_agc_cd, 'C');
	detailData.chng_companyImgSrc = gfn_getImgSrcByCd(detailData.chng_kftc_agc_cd, 'C');
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'))
	
	// 제안 포트폴리오 설정
	var _template = $("#_dumyFundList").html();
	var template = Handlebars.compile(_template);
	
	$.each(detailData.advc_ptfl_prdt_list, function(index, item){
		item.idx = index + 1;
		var html = template(item);
		$('#fundList').append(html);
	});
	
}


/*상태에 따라 텍스트와 클라스명 변경됩니다
case1 - prepare - <p class="title_2x"><span>계좌이전 준비중입니다</span></p>
case2 - ing - <p class="title_2x"><span>계좌이전이 진행중입니다</span></p>
case3 - fail - <p class="title_2x"><span>계좌이전이 실패하였습니다</span></p>
case4 - cancel - <p class="title_2x"><span>계좌이전을 취소하였습니다</span></p>*/

/*acnt_status
  - 01 : 자문실행전 
  - 02 : 입금대기 (신규 계자)
  - 09 : 계좌해지 (신규계좌)
  - 10 : 이전대기중 (신규 계자)
  - 11 : 이전신청 (구계좌)
  - 12 : 이전신청 실패 (구계좌)
  - 13 : 이전신청 예약 (구계좌)
  - 14 : 이전진행중 (구계좌)
  - 15 : 이전취소
  - 16 : 이전완료 (구계좌)
  - 17 : 이전재신청
  - 21 : 해지신청 (구계좌)
  - 22 : 해지완료 (구계좌)*/

// 제목 셋팅하기
WAITPRO12S01.location.setTitle = function(){
	var detailData = WAITPRO12S01.variable.detailData;
	var tMsg = "";
	var tClass = "";
	var tType = "";
	
	switch(detailData.acnt_status){ 
		case '02' : // 입금대기 (신규 계자)
			tMsg = "계좌이전 준비중입니다";
			tClass 	= "prepare";
			tType 	= "prepare";
			break;
		case '10' : // 이전대기중 (신규 계자)
		case '11' : // 이전신청 (구계좌)
		case '13' : // 이전신청 예약 (구계좌)
		case '14' : // 이전진행중 (구계좌)
			tMsg = "계좌이전이 진행중입니다";
			tClass 	= "ing";
			tType 	= "ing";
			break;
		case '17' : // 이전재신청
			tMsg = "계좌이전이 진행중입니다";
			tClass 	= "ing";
			tType 	= "reapply";
			break;
		case '12' : // 이전신청 실패 (구계좌)
			tMsg = "계좌이전이 실패하였습니다";
			tClass 	= "fail";
			tType 	= "fail";
			break;
		case '15' : // 이전취소
			tMsg = "계좌이전을 취소하였습니다";
			tClass 	= "cancel";
			tType 	= "cancel";
			break;
		case '21' : // 해지신청 (구계좌)
			tMsg 	= "해지신청이 진행중입니다다";
			tClass 	= "ing";
			tType 	= "terminate";
			break;
		default :
			break;
	}
	// 제목 클래스명 바꾸기
	$('.w_title').attr('class','w_title '+ tClass);	
	
	// 제목 내용 바꾸기
	detailData.title_msg = tMsg;
	
	// 문제해결 msg popup 내용 바꾸기
	$('#msgCase_' + tType).show(); 
	
}


// 차트 그리기
WAITPRO12S01.location.displayChart = function(){
	var detailData = WAITPRO12S01.variable.detailData;
	
	
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
                    data: [detailData.crnt_stck_rate, detailData.crnt_bond_rate,detailData.crnt_cash_rate],
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

            //data3
            var data3={
                labels: ['주식'],
                datasets: [{
                    label: '# of Votes',
                    data: [detailData.ppsl_stck_rate, detailData.ppsl_bond_rate,detailData.ppsl_cash_rate],
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

            var ctx3 = document.getElementById('myCircle2').getContext('2d');
            new Chart(ctx3, {
                type :'doughnut',
                data : data3,
                options : options3
            });
}
// 차트 셋팅
WAITPRO12S01.location.initChart = function(){
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
}


WAITPRO12S01.init();
