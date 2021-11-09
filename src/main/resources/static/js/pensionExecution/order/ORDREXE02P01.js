/**
* 파일명 		: ORDREXE02P01.js
* 업무		: 거래 > 주문결과확인 (o-02-01)
* 설명		: 주문결과확인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.22
* 수정일/내용	: 
*/
var ORDREXE02P01 = CommonPageObject.clone();

/* 화면내 변수  */
ORDREXE02P01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
ORDREXE02P01.events = {
	'click #btnConfirm, #btnCancel'							: 'ORDREXE02P01.event.clickBtnConfirm'	// 확인, 건너뛰기
	,'click #btnRetry'										: 'ORDREXE02P01.event.clickbtnRetry'	// 다시시도
	,'click .accordion-head'								: 'ORDREXE02P01.event.clickAccordionHead'	// 접고펼치기
}

ORDREXE02P01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ORDREXE02P01');
	
	$("#pTitle").text("매수완료");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "o-02-01";
	gfn_azureAnalytics(inputParam);
	
	
	ORDREXE02P01.location.pageInit();
}


// 화면내 초기화 부분
ORDREXE02P01.location.pageInit = function() {
	//debugger;	// 20210521-02562146787
	var sParams = sStorage.getItem("ORDREXE02P01Params");
	if(!ComUtil.isNull(sParams)){
		ORDREXE02P01.variable.initParamData = sParams;
		ORDREXE02P01.variable.sendData.order_no = sParams.order_no;
		
		ORDREXE02P01.tran.selectDetail();
	}
	else{
		//ORDREXE02P01.variable.sendData.order_no = '20210115-09371505657';	// testdata
		//ORDREXE02P01.tran.selectDetail();
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주문내용 확인 조회
ORDREXE02P01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectAcntOrderInfo";
	inputParam.target 	= "api";
	//inputParam.url 		= "/pension_execute/select_acnt_order_info";
	inputParam.url 		= "/pension_execute/select_customer_order_detail";
	inputParam.data 	= ORDREXE02P01.variable.sendData;
	inputParam.callback	= ORDREXE02P01.callBack;
	
	gfn_Transaction( inputParam );
}

// 재 주문하기
ORDREXE02P01.tran.updateAcntOrderInfo = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "updateAcntOrderInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/update_acnt_order_info";
	inputParam.data 	= ORDREXE02P01.variable.sendData;
	inputParam.callback	= ORDREXE02P01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 확인 버튼 클릭시
ORDREXE02P01.event.clickBtnConfirm = function(e) {
 	e.preventDefault();


	//var url = "/pension_advice/dashBoard/DASHBRD01S01";	// 데쉬보드 메인으로 이동
	//var url = "/pension_mng/PENSION01M00";	// welcome 메인으로 이동
	//ComUtil.moveLink(url, false);
	
	gfn_closePopup();
}

// 확인 버튼 클릭시
ORDREXE02P01.event.clickbtnRetry = function(e) {
 	e.preventDefault();

	
	gfn_confirmMsgBox("주문을 다시 시도 할까요?", '', function(returnData){
		if(returnData.result == 'Y'){
			var inputParam = {};
			inputParam.callback = ORDREXE02P01.callBack.popPassword;
			inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
			gfn_callPwdPopup(inputParam);
		}
	});
	
	// 실패한것만 보내야하나?
	ORDREXE02P01.variable.sendData.acnt_order_list = ORDREXE02P01.variable.detailData.acnt_order_list;
	
	// 주문요청
	ORDREXE02P01.tran.updateAcntOrderInfo();
}


// Accordion
ORDREXE02P01.event.clickAccordionHead = function(e) {
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
ORDREXE02P01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 주문내용 확인 조회
	if(sid == "selectAcntOrderInfo"){
		ORDREXE02P01.variable.detailData = result;
		
		// 상세 셋팅 
		ORDREXE02P01.location.displayDetail();
		return;
	}
	
	
	// 주문요청
	if(sid == "updateAcntOrderInfo"){
		if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" ) {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
				// 어디로 가나??
			return;
		}
		
		
		ORDREXE02P01.variable.sendData.order_no = result.order_no;
		
		ORDREXE02P01.tran.selectDetail();
		
		// 알럿 필요
		/*gfn_alertMsgBox(ComUtil.null(result.message, "주문 완료 처리 되었습니다."), '', function(){
			// 상세 셋팅 
			ComUtil.moveLink('/pension_execution/order/ORDREXE02P01');	// 주문내역확인 화면이동
		});*/
	}
}

// 비밀번호 입력후 팝업 콜백함수 
ORDREXE02P01.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	if(!ComUtil.isNull(returnParam.pwd)){
		ORDREXE02P01.variable.sendData.acnt_order_list = ORDREXE02P01.variable.detailData.acnt_order_list;
		ORDREXE02P01.variable.sendData.pwd = returnParam.pwd;
		  
		// 주문요청
		ORDREXE02P01.tran.updateAcntOrderInfo();
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
ORDREXE02P01.location.displayDetail = function(){
	var detailData = ORDREXE02P01.variable.detailData;
	
	
	ORDREXE02P01.location.displayList();
}	

// 주문내용 리스트 표시
ORDREXE02P01.location.displayList = function(){
	var detailData = ORDREXE02P01.variable.detailData;
	
	// 초기화
	$('#P02_divOrderList').html('');
	
	if(gfn_isNull(detailData.acnt_order_list)){
		return;
	}
	
	var _template = $("#_dumyOrderP02").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyFundP02").html();
	var template2 = Handlebars.compile(_template2);
	
	var failCnt = 0;
	
	$.each( detailData.acnt_order_list, function(index, item){
		item.idx = index + 1;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.blnc_amt_dis = ComUtil.number.addCommmas(item.blnc_amt);
		item.dpst_amt_dis = ComUtil.number.addCommmas(item.dpst_amt);
		item.tot_order_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);
		
		item.acnt_type_nm 	= gfn_getAcntTypeNm(item.acnt_type);
		item.fund_cnt = item.order_fund_list.length;
		
		if("1" == item.order_gbn_cd){
			item.orderClass = "buy";
			item.orderText = "매수";
		}
		if("2" == item.order_gbn_cd){
			item.orderClass = "sell";
			item.orderText = "매도";
		}
		
		var html = template(item);
		$('#P02_divOrderList').append(html);
		
		$.each( item.order_fund_list, function(index, item2){
			item2.idx = index;
			item2.order_amt_dis = ComUtil.number.addCommmas(item2.order_amt);
			item2.order_status = ComUtil.null(item2.order_status, '0');  // fail
			
			//if(item2.order_status != '2'){
			if(item2.order_status == '0'){	// 0: 주문실패, 1 : 주문요청 , 2 : 주문완료, 3:주문생생, 4:해지요청, 5:예약주문 
				failCnt++;
			}
			
			var html2 = template2(item2);
			$('#P02_ulOrderList_' + item.idx).append(html2);
		});
	});
	
	// 버튼영역 셋팅
	if(failCnt == 0){
		$('#btnDivOk').show();
		$('#btnDivFail').hide();
	}
	else{
		$('#btnDivOk').hide();
		$('#btnDivFail').show();
	}
}



ORDREXE02P01.init();
