/**
* 파일명 		: PENSION02S01.html
* 업무		: 웰컴보드 > 자산배분 (pension-m-02-01, new_m-02-01)
* 설명		: 연금수령계획
* 작성자		: 배수한
* 최초 작성일자	: 2020.11.16
* 수정일/내용	: 
*/
var PENSION02S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION02S01.variable = {
	tabIdx : '1'
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// 
}

/* 이벤트 정의 */
PENSION02S01.events = {
	 'click #tablist > li'	 				: 'PENSION02S01.event.tabChange'
	,'click div[id^="box_"]'				: 'PENSION02S01.event.goAcntDetail'
}

PENSION02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION02S01');
	
	$("#pTitle").text("연금수령계획");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-02-01";
	gfn_azureAnalytics(inputParam);
	
	PENSION02S01.location.pageInit();
}


// 화면내 초기화 부분
PENSION02S01.location.pageInit = function() {
	// 전달받은 파라미터 셋팅
	var sParams = sStorage.getItem("sParams");
	if(!ComUtil.isNull(sParams)){
		PENSION02S01.variable.tabIdx = ComUtil.null(sParams.idx, "1");
	}
	sStorage.clear();

	// 연금수령계획 상세내역 조회
	PENSION02S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금수령계획 상세내역 조회 
PENSION02S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pnsnRecvPlan";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/pnsn_recv_plan";
	inputParam.data 	= {};
	inputParam.callback	= PENSION02S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 탭 클릭 이벤트
PENSION02S01.event.tabChange = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('a').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('.tab_panel').hide();
        $('#panel-'+index).show();
    }
}

// 자문 계좌 클릭시 상세화면으로 이동
PENSION02S01.event.goAcntDetail = function(e) {
	e.preventDefault();
	
	var data = $(this).data();
	if(ComUtil.null(data.advc_acnt_yn, 'N') == 'N'){
		return;
	}
	
	data.screenId = "PENSION02S01";
	sStorage.setItem("PENSION03S01Params", data);
	
	var url = "/pension_mng/PENSION03S01";
	ComUtil.moveLink(url);
}

// tab click trigger 용
PENSION02S01.event.chageTab = function(e) {
	e.preventDefault();
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSION02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	/*if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
		gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
		return;
	}*/
	
	// 연금수령계획 상세내역 조회 
	if(sid == "pnsnRecvPlan"){
		PENSION02S01.variable.detailData = result;
		
		var listLength = 0;
		if(!ComUtil.isNull(result.pnsn_recv_plan_list)){
			listLength = result.pnsn_recv_plan_list.length;
		}
			
		if(0 == listLength){
			$('#no_result').show();
			$('#tablist').hide();
			$('#divPanel').hide();
		}
		else{
			$('#no_result').hide();
			$('#tablist').show();
			$('#divPanel').show();
			// 탭영역 그리기
			PENSION02S01.location.displayTab(result.pnsn_recv_plan_list);
			
			// 페널영역 그리기
			PENSION02S01.location.displayPanel(result.pnsn_recv_plan_list);
			
			//$('#tab_'+PENSION02S01.variable.tabIdx).trigger("click");
			//$('#tab_'+PENSION02S01.variable.tabIdx).click();
			$('#tab_'+PENSION02S01.variable.tabIdx).children('a').addClass('is_active');
			$('.tab_panel').hide();
			$('#panel-'+PENSION02S01.variable.tabIdx).show();
		}
		
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 탭영역 그리기
PENSION02S01.location.displayTab = function(planlist){
	
	var html = "";

	$.each( planlist, function(index, item){
		var idx = index +1;
		//html += '<li id="tab'+item.recv_seq+'"><a href="#panel-'+item.recv_seq+'" role="tab" id="#panel-'+item.recv_seq+'">'+item.recv_seq+'기</a></li>'
		html += '<li id="tab_'+idx+'"><a href="#panel-'+idx+'" role="tab" id="#panel-'+idx+'">'+idx+'기</a><span id="errCnt_'+idx+'"></span></li>'
	});	
	
	$('#tablist').html(html);
	
	// 패널영역에 부모 생성
	
}

// 페널영역(다수) 그리기
PENSION02S01.location.displayPanel = function(planlist){
	
	// 초기화
	$('#divPanel').html('');
	
	if(ComUtil.isNull(planlist)){
		return;
	}

	var _template = $("#_dumyPanel").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( planlist, function(index, item){
		item.idx = index+1; 
		item.pnsn_recv_age = ComUtil.string.replaceAll(item.pnsn_recv_age, '세', '');
		var html = template(item);
		$('#divPanel').append(html);
		
		PENSION02S01.location.displayProdList(item.pnsn_prdt_list, $('#prdtInfo_'+item.idx), item.idx);
		
	});	
}	

// 패널내 상품리스트 그리기
PENSION02S01.location.displayProdList = function(prdtlist, divObj, pIdx){
	if(ComUtil.isNull(prdtlist)){
		return;
	}
	
	var detailData = PENSION02S01.variable.detailData;
	
	detailData.pnsn_recv_plan_list[pIdx-1].warningCnt = 0;
	
	var _template = $("#_dumyPrdtInfo").html();
	var template = Handlebars.compile(_template);
	
	$.each( prdtlist, function(index, item){
		item.idx = index+1;
		item.pIdx = pIdx;
		
		
		item.rvnu_rate = parseFloat(isNaN(item.rvnu_rate) ? '0' : item.rvnu_rate);
		item.rvnu_addplus = (item.rvnu_rate > 0) ? '+' : '';
		item.addPlusClass = (item.rvnu_rate >= 0) ? '' : 'under';
		
		item.new_dt = ComUtil.string.dateFormat(item.new_dt);
		
		
		//oprt_status_cd - 0:정상, 1: 경고, 2:심각, 3: 대기, 4: 잠김
		//item.oprt_status_cd = '219';
		var oprtInfo = {};
		if(ComUtil.null(item.advc_acnt_yn, 'N') == 'N'){
			oprtInfo = gfn_getOprtStatusInfo('99');
		}
		else{
			oprtInfo = gfn_getOprtStatusInfo(item.oprt_status_cd, pIdx);
		}
		$.extend(item, oprtInfo);
		
		if("000" != item.oprt_status_cd){
			detailData.pnsn_recv_plan_list[pIdx-1].warningCnt++;
		}
		
		
		var html = template(item);
		$(divObj).append(html);
		
		// 운영상태코드에 따라 아이콘 변경
		$('#sit_' + pIdx + '_' + item.idx).addClass(oprtInfo.operStatusClass);
		$('#box_' + pIdx + '_' + item.idx).addClass(oprtInfo.operStatusBoxClass);
		
		$('#box_' + pIdx + '_' + item.idx).data(item);
	});
	
	if(detailData.pnsn_recv_plan_list[pIdx-1].warningCnt > 0){
		$('#errCnt_' + pIdx).html(detailData.pnsn_recv_plan_list[pIdx-1].warningCnt);
	}
	else{
		$('#errCnt_' + pIdx).remove();
	}
}

// 운영상태코드에 따른 값 추출
/*
PENSION02S01.location.getOprtStatusNm = function(oprt_status_cd){
	var oprtInfo = {};
	
	switch(oprt_status_cd){
		case '0' : oprtInfo.statusText 	= "정상";
		           oprtInfo.addClass	= "";
		           oprtInfo.addBoxClass	= "";
			break; 
		case '1' : oprtInfo.statusText 	= "경고";
		           oprtInfo.addClass	= "warning";
		           oprtInfo.addBoxClass	= "box_lock";
			break; 
		case '2' : oprtInfo.statusText 	= "심각";
		           oprtInfo.addClass	= "serious";
		           oprtInfo.addBoxClass	= "box_lock";
			break; 
		case '3' : oprtInfo.statusText 	= "대기";
		           oprtInfo.addClass	= "wait";
		           oprtInfo.addBoxClass	= "box_lock";
			break; 
		case '4' : oprtInfo.statusText 	= "잠김";
		           oprtInfo.addClass	= "lock";
		           oprtInfo.addBoxClass	= "box_lock";
			break; 
		case '99' : oprtInfo.statusText 	= "자문 전";
		           oprtInfo.addClass	= "";
		           oprtInfo.addBoxClass	= "other";
			break; 
		default	 : break;
	}
	
	return oprtInfo;
}
*/


PENSION02S01.init();
