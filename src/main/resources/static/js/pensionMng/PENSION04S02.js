/**
* 파일명 		: PENSION04S02.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 자문내용 (m-04-02)
* 설명		: 자산배분승인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.04
* 수정일/내용	: 
*/
var PENSION04S02 = CommonPageObject.clone();

/* 화면내 변수  */
PENSION04S02.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,initParamData	: {}								// 이전화면에서 받은 파라미터
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
PENSION04S02.events = {
	 'click #btnPortfolioOk'							: 'PENSION04S02.event.clickBtnPortfolioOk'
	 ,'click li[id^="fundInfo_"]'						: 'PENSION04S02.event.goFundDetail'
	 ,'click div[id^="accordion_"]'						: 'PENSION04S02.event.clickAccordion'
}

PENSION04S02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSION04S02');
	
	$("#pTitle").text("자문내용");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "m-04-02";
	gfn_azureAnalytics(inputParam);
	
	PENSION04S02.location.pageInit();
}


// 화면내 초기화 부분
PENSION04S02.location.pageInit = function() {
	PENSION04S02.variable.initParamData = sStorage.getItem("PENSION04S02Params");
	PENSION04S02.variable.sendData.ptfl_seq_no = PENSION04S02.variable.initParamData.ptfl_seq_no;	// 자문계약 일련 번호
	
	$('#join_date').html(PENSION04S02.variable.initParamData.join_date);
	
	// 지난 자문 내역 조회			
	PENSION04S02.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 지난 자문 내역 조회 
PENSION04S02.tran.selectDetail = function() {
	var inputParam 		= {};
	inputParam.sid 		= "customerContractInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/customer_contract_info";
	inputParam.data 	= PENSION04S02.variable.sendData;
	inputParam.callback	= PENSION04S02.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 펀드상세조회 화면 이동
PENSION04S02.event.goFundDetail = function(e) {
	e.preventDefault();
	
	sStorage.setItem("PENSION04S01Params", $(this).data());
	
	var url = "/pension_mng/PENSION04S01";
	ComUtil.moveLink(url);
}

// 승인버튼 
PENSION04S02.event.clickBtnPortfolioOk = function(e) {
 	e.preventDefault();

	gfn_historyBack();
}

// 펼치기 
PENSION04S02.event.clickAccordion = function(e) {
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
PENSION04S02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "customerContractInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				
			});
			return;
		}
		PENSION04S02.variable.detailData = result;
		
		PENSION04S02.location.displayDetail()		
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSION04S02.location.displayDetail = function(){
	var detailData = PENSION04S02.variable.detailData;
	
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
	
	//var _btnHtml = $("#_dumyBtn").html();
	//var btnHtml = Handlebars.compile(_btnHtml);
	
	
	$.each( acnt_list, function(index, item){
		item.idx = index + 1;
		if('4|5|'.indexOf(item.advc_gbn_cd) == -1){
			return;
		}
		
		item.acnt_type_nm = gfn_getAcntTypeNm(item.acnt_type);
		 
		// kb 01 add
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		item.fundTotCnt = '0';
		if(!ComUtil.isNull(item.advc_ptfl_prdt_list)){
			item.fundTotCnt = item.advc_ptfl_prdt_list.length;
		}
		
		var html = template(item);
		$('#divPortfolioAnn').append(html);
		
		// 펀드비중
		if(!ComUtil.isNull(item.advc_ptfl_prdt_list)){
			
			$.each( item.advc_ptfl_prdt_list, function(index2, item2){
				item2.idx = index2 + 1;
				item2.fncl_agc_nm = item.fncl_agc_nm;
				item2.acnt_uid = item.acnt_uid;
				item2.fund_no = item2.prdt_cd;
				
				var html2 = templateFund(item2);
				$('#ulFundList_'+item.idx).append(html2);
				$('#fundInfo_'+item2.idx ,$('#ulFundList_'+item.idx)).data(item2);
			});
		}
	});	
	
	//$('#divPortfolioAnn').append(_btnHtml);
}	





PENSION04S02.init();
