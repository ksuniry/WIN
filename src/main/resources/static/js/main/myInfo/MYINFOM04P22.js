/**
* 파일명 		: MYINFOM04P22.js
* 업무		: 회원탈퇴  > 자문계약해지 (c-04-22)
* 설명		: 자문계약해지
* 작성자		: 배수한
* 최초 작성일자	: 2021.05.25
* 수정일/내용	: 
*/
var MYINFOM04P22 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM04P22.variable = {
	sendData		: {
						acnt_no : ""
						}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
MYINFOM04P22.events = {
	'click #btnOrder'										: 'MYINFOM04P22.event.clickBtnOrder'
	,'click .accordion-head'								: 'MYINFOM04P22.event.clickAccordionHead'	// 접고펼치기
	//,'click li[id^="OwnAcntRow_"], li[id^="NewAcntRow_"]'	: 'MYINFOM04P22.event.clickAcntRow'
}

MYINFOM04P22.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM04P22');
	
	$("#pTitle").text("주문내용확인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-04-22";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM04P22.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM04P22.location.pageInit = function() {
	var sParams = sStorage.getItem("MYINFOM04P22Params");
	if(!ComUtil.isNull(sParams)){
		MYINFOM04P22.variable.initParamData = sParams;
		MYINFOM04P22.variable.detailData = sParams;
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
	}
	
	// 상세 셋팅 
	MYINFOM04P22.location.displayDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 계약해지 주문하기
MYINFOM04P22.tran.accountWithdrawal = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "accountWithdrawal";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/account_withdrawal";
	inputParam.data 	= MYINFOM04P22.variable.sendData;
	inputParam.callback	= MYINFOM04P22.callBack; 
	
	gfn_Transaction( inputParam );
	
	//MYINFOM04P22.callBack("accountWithdrawal", {result:'ok'}, "success");
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 주문하기 버튼 클릭시
MYINFOM04P22.event.clickBtnOrder = function(e) {
 	e.preventDefault();	

	if($('#chOk').is(':checked') == false){
		MYINFOM04P22.variable.sendData.account_sell_and_terminate_agree_yn = "N";
		gfn_alertMsgBox('자문계약해지에 대한 동의여부를<br>체크해 주시기 바랍니다.');
		return false;
	}
	else{
		MYINFOM04P22.variable.sendData.account_sell_and_terminate_agree_yn = "Y";
	}
	
	var inputParam = {};
	inputParam.callback = MYINFOM04P22.callBack.popPassword;
	inputParam.title = "계좌개설 시 설정한<br>비밀번호를 입력해주세요";
	gfn_callPwdPopup(inputParam);
	
}

// Accordion
MYINFOM04P22.event.clickAccordionHead = function(e) {
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
MYINFOM04P22.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 주문내용 확인 조회
	if(sid == "selectAcntOrderInfo"){
		MYINFOM04P22.variable.detailData = result;
		
		// 상세 셋팅 
		MYINFOM04P22.location.displayDetail();
		return;
	}
	
	
	// 해지 주문요청
	if(sid == "accountWithdrawal"){
		// "ok" : 해지해야할 계좌정보 존재
		// "non" : 해지해야할 계좌정보 없음 (탈퇴처리됨) ==> 결국 OK
		
		/*if(ComUtil.null(result.result, 'fail').toUpperCase() != "OK" || ComUtil.null(result.result, 'fail').toUpperCase() !='NON') {
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()));
			if(!ComUtil.isNull(result.acnt_order_list)){
				MYINFOM04P22.variable.detailData = result;
				MYINFOM04P22.location.displayDetail();
			}
			return;
		}*/
		gfn_log('MYINFOM04P22.callback sid :::  ' + sid);
		
		//if(result.result == 'non'){
		if(ComUtil.null(result.result, 'fail').toUpperCase() == "OK"){
			gfn_log("ok!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			// 알럿 필요
			gfn_alertMsgBox(ComUtil.null(result.message, "자문계약해지가 완료 처리 되었습니다."), '', function(){
				gfn_log('MYINFOM04P22  gfn_closePopup :::  ');
				gfn_closePopup({result:true});	// 
			});
		}
		// 남은 계좌를 다시 보여준다.  
		else {
			gfn_log("no ok!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + result.result);
			gfn_alertMsgBox(ComUtil.null(result.message, gfn_helpDeskMsg()), '', function(){
				if(!ComUtil.isNull(result.acnt_order_list)){
					MYINFOM04P22.variable.detailData = result;
					MYINFOM04P22.location.displayDetail();
				}
			});
			
		}
		
		
	}
}

// 비밀번호 입력후 팝업 콜백함수 
MYINFOM04P22.callBack.popPassword = function(returnParam){
	if(ComUtil.isNull(returnParam)){
		return;
	}
	
	
	if(!ComUtil.isNull(returnParam.pwd)){
		MYINFOM04P22.variable.sendData.pin = MYINFOM04P22.variable.initParamData.pin;
		MYINFOM04P22.variable.sendData.pwd = returnParam.pwd;
		MYINFOM04P22.variable.sendData.acnt_order_list = MYINFOM04P22.variable.detailData.acnt_order_list;
		  
		gfn_log(' MYINFOM04P22.callBack.popPassword !!!!!' + returnParam.pwd);
		// 주문요청
		MYINFOM04P22.tran.accountWithdrawal();
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM04P22.location.displayDetail = function(){
	var detailData = MYINFOM04P22.variable.detailData;
	
	
	MYINFOM04P22.location.displayList();
}	


// 주문내용 리스트 표시
MYINFOM04P22.location.displayList = function(){

	var detailData = MYINFOM04P22.variable.detailData;
	
	// 초기화
	$('#divOrderList').html('');
	gfn_log("MYINFOM04P22.location.displayList 초기화!!!");
	
	if(gfn_isNull(detailData.acnt_order_list)){
		gfn_closePopup({msg:"해지가능한 계좌가 없습니다.<br>" + gfn_helpDeskMsg()});
		return;
	}
	if(detailData.acnt_order_list.length == 0){
		gfn_closePopup({msg:"해지가능한 계좌가 없습니다.<br>" + gfn_helpDeskMsg()});
		return;
	}
	
	var _template = $("#_dumyOrder").html();
	var template = Handlebars.compile(_template);
	
	var _template2 = $("#_dumyFund").html();
	var template2 = Handlebars.compile(_template2);
	
	$.each( detailData.acnt_order_list, function(index, item){
		item.idx = index + 1;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		
		// kb add '01'
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.blnc_amt_dis = ComUtil.number.addCommmas(item.blnc_amt);
		item.order_fund_list = ComUtil.null(item.order_fund_list, []);
		
		item.fund_cnt = item.order_fund_list.length;
		
		item.acnt_type_nm = gfn_getAcntTypeNm(item.acnt_type);
		
		if("1" == item.order_gbn_cd){
			item.orderClass = "buy";
			item.orderText = "매수";
			item.orderText2 = "매수가능";
			//item.dpst_amt_dis = ComUtil.number.addCommmas(item.dpst_amt);
			item.dpst_amt_dis = ComUtil.number.addCommmas(item.tot_order_amt);
		}
		else if("2" == item.order_gbn_cd){
			item.orderClass = "sell";
			item.orderText = "매도";
			item.orderText2 = "매도";
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
		
		$.each( item.order_fund_list, function(index, item2){
			item2.idx = index;
			
			item2.order_amt_dis = ComUtil.number.addCommmas(item2.order_amt);
			
			
			var html2 = template2(item2);
			$('#ulOrderList_' + item.idx).append(html2);
		});
	});
}



MYINFOM04P22.init();
