/**
* 파일명 		: ORDREXE01P01.js
* 업무		: 거래 > 주문내용확인 (o-01-01)
* 설명		: 주문내용확인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.22
* 수정일/내용	: 
*/
var ORDREXE01P01 = CommonPageObject.clone();

/* 화면내 변수  */
ORDREXE01P01.variable = {
	sendData		: {
						acnt_no : ""
						}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
ORDREXE01P01.events = {
	'click #btnOrder'										: 'ORDREXE01P01.event.clickBtnOrder'
	,'click .accordion-head'								: 'ORDREXE01P01.event.clickAccordionHead'	// 접고펼치기
	//,'click li[id^="OwnAcntRow_"], li[id^="NewAcntRow_"]'	: 'ORDREXE01P01.event.clickAcntRow'
	,'click #orderConfirim'									: 'ORDREXE01P01.event.clickOrderConfirm'
	,'click button[id^="btnCase"]'							: 'ORDREXE01P01.event.clickMsgPopClose'			// msg 팝업 닫기
}

ORDREXE01P01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ORDREXE01P01');
	
	//$("#pTitle", $('#po0101-content')).text("주문내용확인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "o-01-01";
	gfn_azureAnalytics(inputParam);
	
	ORDREXE01P01.location.pageInit();
}


// 화면내 초기화 부분
ORDREXE01P01.location.pageInit = function() {
	var sParams = sStorage.getItem("ORDREXE01P01Params");
	if(!ComUtil.isNull(sParams)){
		ORDREXE01P01.variable.initParamData = sParams;
		ORDREXE01P01.variable.sendData.acnt_no = sParams.acnt_no;
	}
	
	{
		// Accordion
        $('.accordion-head', $('#po0101-content')).click(function(){
            if($(this).children('i').hasClass('arr_down') === true){
                $(this).next().show();
                $(this).children('i').removeClass('arr_down').addClass('arr_up');
            }else{
                $(this).next().hide();
                $(this).children('i').removeClass('arr_up').addClass('arr_down');
            }
        });


		$('.dim', $('#msgPopup')).on("click",function(e){
			ORDREXE01P01.event.clickMsgPopClose(e);
		});
	}
	
	ORDREXE01P01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주문내용 확인 조회
ORDREXE01P01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectAcntOrderInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_acnt_order_info";
	//inputParam.data 	= ORDREXE01P01.variable.sendData;
	inputParam.data 	= {};
	inputParam.callback	= ORDREXE01P01.callBack; 
	
	gfn_Transaction( inputParam );
}

// 주문하기
ORDREXE01P01.tran.updateAcntOrderInfo = function() {
	//gfn_alertMsgBox("주문하기");
	//return;
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAcntOrderInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_acnt_order_info";
	inputParam.data 	= ORDREXE01P01.variable.sendData;
	inputParam.callback	= ORDREXE01P01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 주문하기 버튼 클릭시
ORDREXE01P01.event.clickBtnOrder = function(e) {
 	e.preventDefault();	

	gfn_confirmMsgBox("주문을 진행할까요?", '', function(returnData){
		if(returnData.result == 'Y'){
			ORDREXE01P01.location.callOrderComfirmPop();
		}
	});
	
}

// Accordion
ORDREXE01P01.event.clickAccordionHead = function(e) {
 	e.preventDefault();

	if($(this).children('i').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).children('i').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).children('i').removeClass('arr_up').addClass('arr_down');
    }
}



//'매수 주문' 진행. Before 체크박스 없이 팝업 -> After 체크박스 체크 후 팝업
ORDREXE01P01.event.clickOrderConfirm = function() {
	
	if($('input:checkbox[id="agree1"]').is(':checked') == false){
		gfn_alertMsgBox("주요 확인내용을 체크해 주시길 바랍니다.", '', function(){
		});
		return;
	}
	
	
	var idx = $('#orderConfirim').data('idx');
	var data = $('#orderDetail_'+idx).data();
	data.over_dpst_order_agree_yn = 'N';
	$('#orderDetail_'+idx).data(data);
	
	// 다른 체크할 사항이 있는지 확인  
	ORDREXE01P01.location.callOrderComfirmPop();
}

//확인 버튼 컬러체인지 toggle
ORDREXE01P01.event.toggleBtnColour = function() {

	var check = $('#orderConfirim').hasClass('disabled');
	
	if(check == true){
		$('#orderConfirim').removeClass('disabled');	
	}else{
		$('#orderConfirim').addClass('disabled');
	}

}


// msg 팝업 닫기
ORDREXE01P01.event.clickMsgPopClose = function(e) {
 	e.preventDefault();	

	$("#msgPopup").hide();
	$('#buyApprovalConfirm').hide();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ORDREXE01P01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 주문내용 확인 조회
	if(sid == "selectAcntOrderInfo"){
		ORDREXE01P01.variable.detailData = result;
		
		// 상세 셋팅 
		ORDREXE01P01.location.displayDetail();
		return;
	}
	
	
	// 주문요청
	if(sid == "updateAcntOrderInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		// 알럿 필요
		//gfn_alertMsgBox(ComUtil.null(result.message, "주문 완료 처리 되었습니다."), '', function(){
			// 상세 셋팅
			var sParams = {};
			sParams.order_no = ComUtil.null(result.order_no,'');
			sStorage.setItem("ORDREXE02P01Params", sParams);
			
			var sParam = {};
			sParam.url = '/pension_execution/order/ORDREXE02P01';	// 주문내역확인 화면이동
			gfn_callPopup(sParam, function(){
				gfn_closePopup();
			});
				
		//});
	}
}

// 비밀번호 입력후 팝업 콜백함수 
ORDREXE01P01.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		ORDREXE01P01.variable.sendData.acnt_order_list = ORDREXE01P01.variable.detailData.acnt_order_list;
		ORDREXE01P01.variable.sendData.pwd = returnParam.pwd;
		  
		// 주문요청
		ORDREXE01P01.tran.updateAcntOrderInfo();
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
ORDREXE01P01.location.displayDetail = function(){
	var detailData = ORDREXE01P01.variable.detailData;
	
	
	ORDREXE01P01.location.displayList();
}	


ORDREXE01P01.location.moveGuidePage = function(){
	
	var detailData = ORDREXE01P01.variable.detailData;
	
	if(gfn_isNull(detailData.acnt_wait_list)){
		gfn_alertMsgBox('가능한 주문정보가 없습니다.', '', function(){
			gfn_closePopup();
		});
		return;
	}
	if(detailData.acnt_wait_list.length == 0){
		gfn_alertMsgBox('가능한 주문정보가 없습니다.', '', function(){
			gfn_closePopup();
		});
		return;		
	}
	
	var sParams = {};
	sParams.acnt_wait_list = ORDREXE01P01.variable.detailData.acnt_wait_list;
	sStorage.setItem("ORDREXE01P02Params", sParams);
	
	var sParam = {};
	sParam.url = '/pension_execution/order/ORDREXE01P02';	// 주문내역안내 화면이동
	gfn_callPopup(sParam, function(){
		gfn_closePopup();
	});
}

// 주문내용 리스트 표시
ORDREXE01P01.location.displayList = function(){

	var detailData = ORDREXE01P01.variable.detailData;
	
	// 초기화
	$('#divOrderList').html('');
	
	if(gfn_isNull(detailData.acnt_order_list)){
		ORDREXE01P01.location.moveGuidePage();
		return;
	}
	if(detailData.acnt_order_list.length == 0){
		ORDREXE01P01.location.moveGuidePage();
		return;		
	}
	
	var _template = $("#_dumyOrder").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyFund").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each( detailData.acnt_order_list, function(index, item){
		item.idx = index + 1;
		
		// testData
		//item.over_dpst_order_agree_yn = 'Y';
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		// kb add '01'
		item.acnt_no_pt = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.blnc_amt_dis = ComUtil.number.addCommmas(item.blnc_amt);			// 잔액
		item.tot_order_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);	// 주문총액
		item.fund_cnt = item.order_fund_list.length;
		
		item.acnt_type_nm = gfn_getAcntTypeNm(item.acnt_type);
		
		if("1" == item.order_gbn_cd){
			item.orderClass = "buy";
			item.orderText = "매수";
			item.orderText2 = "주문합계";
			//item.dpst_amt_dis = ComUtil.number.addCommmas(item.dpst_amt);
			item.dpst_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);
		}
		if("2" == item.order_gbn_cd){
			item.orderClass = "sell";
			item.orderText = "매도";
			item.orderText2 = "주문합계";
			item.dpst_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);
		}
		else if("3" == item.order_gbn_cd){
			item.orderClass = "";
			item.orderText = "해지";
			item.orderText2 = "해지";
			item.dpst_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);
		}
		
		var html = template(item);
		$('#divOrderList').append(html);
		$('#orderDetail_'+item.idx).data(item);
		
		$.each( item.order_fund_list, function(index, item2){
			item2.idx = index;
			
			item2.order_amt_dis = ComUtil.number.addCommmas(item2.order_amt);
			
			
			var html2 = template2(item2);
			$('#ulOrderList_' + item.idx).append(html2);
		});
	});
}




ORDREXE01P01.location.callOrderComfirmPop = function() {
	
	var detailData = ORDREXE01P01.variable.detailData;
	
	var checkCnt = 0;
	$.each($('div[id^="orderDetail_"]').get().reverse(), function(index, item){
		var detailInfo = $(item).data();
		
		if(detailInfo.over_dpst_order_agree_yn == 'Y'){
			$('#orderText').addClass(detailInfo.orderClass);
			$('#orderConfirim').data('idx', detailInfo.idx);
			gfn_setDetails(detailInfo, $('#buyApprovalConfirm'));
			
			// 체크박스 초기화
			$('input:checkbox[id="agree1"]').attr('checked', false);
			$('#orderConfirim').addClass('disabled');
			//ORDREXE01P01.event.toggleBtnColour();
			
			$("#msgPopup").show();
			$("#buyApprovalConfirm").show();
			checkCnt++;
		}
	});
	
	if(checkCnt == 0){
		// 더이상 체크활것이 없으니 비번 입력후 주문 조회
		var inputParam = {};
		inputParam.callback = ORDREXE01P01.callBack.popPassword;
		inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
		gfn_callPwdPopup(inputParam);
		
	}
	
}


ORDREXE01P01.init();
