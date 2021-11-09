/**
* 파일명 		: PENSEXE03S01.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 자산배분승인 (t-03-01)
* 설명		: 자산배분승인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.04
* 수정일/내용	: 
*/
var PENSEXE03S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE03S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,screenType		: 'approval_6'						// 애드브릭스 이벤트값
}

/* 이벤트 정의 */
PENSEXE03S01.events = {
	 'click #btnPortfolioOk'							: 'PENSEXE03S01.event.clickBtnPortfolioOk'
	,'click .accordion-head'							: 'PENSEXE03S01.event.clickAccordion'
}

PENSEXE03S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE03S01');
	
	$("#pTitle").text("자산배분 승인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-03-01";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE03S01.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE03S01.location.pageInit = function() {
	PENSEXE03S01.variable.detailData = sStorage.getItem("PENSEXEDATA");
	// 테스트 data s
	//PENSEXE03S01.variable.detailData = {};
	//PENSEXE03S01.variable.detailData.own_acnt_list = [{idx:1}, {idx:2}];	
	//PENSEXE03S01.variable.detailData.new_acnt_list = [{idx:3}, {idx:4}];
	// 테스트 data e
	
	// 고객센터 관련 내역 셋팅  	
	PENSEXE03S01.location.displayDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSEXE03S01.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE03S01.callBack; 
	
	gfn_Transaction( inputParam );*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 승인버튼 
PENSEXE03S01.event.clickBtnPortfolioOk = function(e) {
 	e.preventDefault();

	ComUtil.moveLink('/pension_execution/PENSEXE04S01');	// 실행절차안내 화면으로 이동
}

// 접고펼치기 버튼 클릭시
PENSEXE03S01.event.clickAccordion = function(e) {
 	e.preventDefault();

	if($(this).children('i').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).children('i').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).children('i').removeClass('arr_up').addClass('arr_down');
    }
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSEXE03S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){		
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSEXE03S01.location.displayDetail = function(){
	var detailData = PENSEXE03S01.variable.detailData;
	
	var acnt_list = [];
	
	$('#divPortfolioAnn').html();
	
	/*if(!ComUtil.isNull(detailData.own_acnt_list)){
		acnt_list = acnt_list.concat(detailData.own_acnt_list);
	}*/
	
	if(!ComUtil.isNull(detailData.new_acnt_list)){
		acnt_list = acnt_list.concat(detailData.new_acnt_list);
	}
	
	var _template = $("#_dumyPortfolio").html();
	var template = Handlebars.compile(_template);
	
	var _templateFund = $("#_dumyFund").html();
	var templateFund = Handlebars.compile(_templateFund);
	
	
	$.each( acnt_list, function(index, item){
		item.idx = index + 1;
		if('4|5|'.indexOf(item.advc_gbn_cd) == -1){
			return;
		}
		
		// kb 01 add
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		item.acnt_type_nm	= gfn_getAcntTypeNm(item.acnt_type);
		
		item.fundTotCnt = '0';
		if(!ComUtil.isNull(item.advc_ptfl_prdt_list)){
			item.fundTotCnt = item.advc_ptfl_prdt_list.length;
		}
		
		var html = template(item);
		$('#divPortfolioAnn').append(html);
		
		// 펀드비중
		if(!ComUtil.isNull(item.advc_ptfl_prdt_list)){

			$.each( item.advc_ptfl_prdt_list, function(index2, item2){
				item2.fncl_agc_nm = item.fncl_agc_nm;
				
				var html2 = templateFund(item2);
				$('#ulFundList_'+item.idx).append(html2);
			});
		}
	});	
	
}	





PENSEXE03S01.init();
