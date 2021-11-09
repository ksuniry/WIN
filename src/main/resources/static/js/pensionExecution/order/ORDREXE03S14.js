/**
* 파일명 		: ORDREXE03S14.js
* 업무		: 거래 > 내 주문내역 (c-03-14)
* 설명		: 내 주문내역 리스트
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.15
* 수정일/내용	: 
*/
var ORDREXE03S14 = CommonPageObject.clone();

/* 화면내 변수  */
ORDREXE03S14.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: false								// 해더영역 존재여부 default 는 false  popUp은 true
	,noBack			: false								// 해더영역 뒤로가기 버튼 존재여부 default 는 false
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
ORDREXE03S14.events = {
	//'click #btnOrder'									: 'ORDREXE03S14.event.clickBtnOrder'
	'click li[id^="order_"]'							: 'ORDREXE03S14.event.clickAcntRow'
}

ORDREXE03S14.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ORDREXE03S14');
	
	$("#pTitle").text("내 주문내역");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-14";
	gfn_azureAnalytics(inputParam);
	
	ORDREXE03S14.location.pageInit();
}


// 화면내 초기화 부분
ORDREXE03S14.location.pageInit = function() {
	//var detailData = sStorage.getItem("PENSEXEDATA");
	
	ORDREXE03S14.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주문내용 확인 조회
ORDREXE03S14.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectCustomerOrderList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_customer_order_list";
	inputParam.data 	= {};
	inputParam.callback	= ORDREXE03S14.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 주문하기 버튼 클릭시
// order 클릭시
ORDREXE03S14.event.clickAcntRow = function(e) {
 	e.preventDefault();

	var data = $(this).data();
	
	sStorage.setItem("ORDREXE03S15Params", data);
	ComUtil.moveLink("/pension_execution/order/ORDREXE03S15");
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ORDREXE03S14.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 주문내용 확인 조회
	if(sid == "selectCustomerOrderList"){
		ORDREXE03S14.variable.detailData = result;
		
		// 상세 셋팅 
		ORDREXE03S14.location.displayDetail();
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
ORDREXE03S14.location.displayDetail = function(){
	var detailData = ORDREXE03S14.variable.detailData;
	
	
	
	
	ORDREXE03S14.location.displayList();
}	

// 주문내용 리스트 표시
ORDREXE03S14.location.displayList = function(){
	var detailData = ORDREXE03S14.variable.detailData;
	
	// 초기화
	$('#divOrderList').html('');
	
	if(gfn_isNull(detailData.order_list)){
		$('#divOrderList').append('<div class="no_result"><p>주문내역이 없습니다.</p></div>');
		return;
	}
	
	detailData.orderCnt = ComUtil.null(detailData.order_list.length, 0);
	$('#divOrderList').append('<p class="total_box">총<span id="orderCnt"></span>건</p>');
	$('#orderCnt').html(detailData.orderCnt);
	
	var _template = $("#_dumyOrder").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.order_list, function(index, item){
		item.idx = index + 1;
		
		item.order_dt_txt = ComUtil.string.dateFormatHan(item.order_dt);
		item.order_dis = ComUtil.number.addCommmas(item.order_amt);
		
		if("1" == item.order_gbn_cd){
			item.orderClass = "buy";
			item.orderText = "매수";
		}
		else if("2" == item.order_gbn_cd){
			item.orderClass = "sell";
			item.orderText = "매도";
		}
		
		var html = template(item);
		$('#divOrderList').append(html);
		
		$('#order_' + item.idx).data(item);
	});
}



ORDREXE03S14.init();
