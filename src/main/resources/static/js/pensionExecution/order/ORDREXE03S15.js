/**
* 파일명 		: ORDREXE03S15.js
* 업무		: 거래 > 주문결과확인 (c-03-15)
* 설명		: 주문결과확인
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.15
* 수정일/내용	: 
*/
var ORDREXE03S15 = CommonPageObject.clone();

/* 화면내 변수  */
ORDREXE03S15.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: false								// 해더영역 존재여부 default 는 false  popUp은 true
	,noBack			: false								// 해더영역 뒤로가기 버튼 존재여부 default 는 false
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								// default : true
}

/* 이벤트 정의 */
ORDREXE03S15.events = {
	'click #btnOk'											: 'ORDREXE03S15.event.clickBtnConfirm'	// 확인, 건너뛰기
	,'click #btnRetry'										: 'ORDREXE03S15.event.clickBtnRetry'	// 다시시도
	,'click .accordion-head'								: 'ORDREXE03S15.event.clickAccordion'	// 아코디언
	//,'click #btnCancel'										: 'ORDREXE03S15.event.clickbtnCancel'	// 건너뛰기
	//,'click li[id^="OwnAcntRow_"], li[id^="NewAcntRow_"]'	: 'ORDREXE03S15.event.clickAcntRow'
}

ORDREXE03S15.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ORDREXE03S15');
	
	$("#pTitle").text("주문 내용");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-15";
	gfn_azureAnalytics(inputParam);
	
	ORDREXE03S15.location.pageInit();
}


// 화면내 초기화 부분
ORDREXE03S15.location.pageInit = function() {
	var sParams = sStorage.getItem("ORDREXE03S15Params");
	if(!ComUtil.isNull(sParams)){
		ORDREXE03S15.variable.initParamData = sParams;
		ORDREXE03S15.variable.sendData.order_no = sParams.order_no;
		
		ORDREXE03S15.tran.selectDetail();
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주문내용 확인 조회
ORDREXE03S15.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "selectCustomerOrderDetail";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_customer_order_detail";
	inputParam.data 	= ORDREXE03S15.variable.sendData;
	inputParam.callback	= ORDREXE03S15.callBack;
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 확인 버튼 클릭시
ORDREXE03S15.event.clickBtnConfirm = function(e) {
 	e.preventDefault();

	gfn_historyBack();
}

// 확인 버튼 클릭시
ORDREXE03S15.event.clickBtnRetry = function(e) {
 	e.preventDefault();

	// 실패한것만 보내야하나?
	ORDREXE03S15.variable.sendData = {};
	
	
	
	// 주문요청
	ORDREXE03S15.tran.updateAcntOrderInfo();
}

// 아코디언 클릭시
ORDREXE03S15.event.clickAccordion = function(e) {
 	e.preventDefault();

	if($(this).children('i').hasClass('arr_down') === true){
        $(this).next().show();
        $(this).children('i').removeClass('arr_down').addClass('arr_up');
    }else{
        $(this).next().hide();
        $(this).children('i').removeClass('arr_up').addClass('arr_down');
    }
}


// 계좌 클릭시
/*
ORDREXE03S15.event.clickAcntRow = function(e) {
 	e.preventDefault();

	var data = $(this).data();
	
	if("3|4".indexOf(data.advc_gbn_cd) > -1){
		return;
	}
	var url = "/pension_execution/PENSEXE01P02";	// 자문계좌정보 
	
	sStorage.setItem("PENSEXE01P02Params", data);
	
	//ComUtil.moveLink(url);
	
	var sParam = {};
	sParam.url = url;
	gfn_callPopup(sParam, function(){});
}
*/

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ORDREXE03S15.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 주문내용 확인 조회
	if(sid == "selectCustomerOrderDetail"){
		ORDREXE03S15.variable.detailData = result;
		
		// 상세 셋팅 
		ORDREXE03S15.location.displayDetail();
		return;
	}
	
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
ORDREXE03S15.location.displayDetail = function(){
	var detailData = ORDREXE03S15.variable.detailData;
	
	
	ORDREXE03S15.location.displayList();
}	

// 주문내용 리스트 표시
ORDREXE03S15.location.displayList = function(){
	var detailData = ORDREXE03S15.variable.detailData;
	
	// 초기화
	$('#divOrderList').html('');
	
	if(gfn_isNull(detailData.acnt_order_list)){
		
		return;
	}
	
	var _template = $("#_dumyOrder").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyFund").html();
	var template2 = Handlebars.compile(_template2);
	
	var failCnt = 0;
	
	$.each( detailData.acnt_order_list, function(index, item){
		item.idx = index + 1;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		// kb add '01'
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.blnc_amt = ComUtil.number.addCommmas(item.blnc_amt);
		item.dpst_amt = ComUtil.number.addCommmas(item.dpst_amt);
		item.tot_order_amt = ComUtil.number.addCommmas(item.tot_order_amt);
		
		item.acnt_type_nm = gfn_getAcntTypeNm(item.acnt_type);
		
		if("1" == item.order_gbn_cd){
			item.orderClass = "buy";
			item.orderText = "매수";
		}
		else if("2" == item.order_gbn_cd){
			item.orderClass = "sell";
			item.orderText = "매도";
		}
		
		
		item.fundCnt = 0;
		if(!gfn_isNull(item.order_fund_list)){
			item.fundCnt = item.order_fund_list.length;
		}
		
		var html = template(item);
		$('#divOrderList').append(html);
		
		
		$.each( item.order_fund_list, function(index, item2){
			item2.idx = index;
			item2.order_amt = ComUtil.number.addCommmas(item2.order_amt);
			item2.order_status = ComUtil.null(item2.order_status, '0');  // fail
			
			if(item2.order_status != '2'){
				failCnt++;
			}
			
			// 0: 주문실패, 1 : 주문요청 , 2 : 주문완료, 3:주문생생, 4:해지요청, 5:예약주문
			if(item2.order_status == '0'){				// 실패
				item2.statusClass = 'fail';
				item2.statusText = '주문을 실행하지 못했습니다.';
			}
			else if(item2.order_status == '1'
				 || item2.order_status == '4'
				 || item2.order_status == '5'
			){			// 요청중
				//item2.statusClass = 'request';
				item2.statusClass = '';
				item2.statusText = '주문을 요청하고 있습니다.';
			}
			else if(item2.order_status == '2'){			// 완료
				//item2.statusClass = 'success';
				item2.statusClass = '';
				item2.statusText = '정상적으로 처리되었습니다.';
			}
			
			
			var html2 = template2(item2);
			$('#ulOrderList_' + item.idx).append(html2);
		});
	});
	
	
	$('.order_open').click(function(){
        if($(this).find('.ico').hasClass('arr_down') === true){
            $(this).next().show();
            $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
        }else{
            $(this).next().hide();
            $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
        }
    });
}



ORDREXE03S15.init();
