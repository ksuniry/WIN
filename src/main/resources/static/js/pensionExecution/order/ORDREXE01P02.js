/**
* 파일명 		: ORDREXE01P02.js
* 업무		: 거래 > 주문안내화면 (o-01-02)
* 설명		: 주문안내화면
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.22
* 수정일/내용	: 
*/
var ORDREXE01P02 = CommonPageObject.clone();

/* 화면내 변수  */
ORDREXE01P02.variable = {
	sendData		: {
						acnt_no : ""
						}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
ORDREXE01P02.events = {
	'click #btnAcntCopy'										: 'ORDREXE01P02.event.clickBtnAcntCopy'
}

ORDREXE01P02.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('ORDREXE01P02');
	
	$("#pTitle").text("주문내용확인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "o-01-02";
	gfn_azureAnalytics(inputParam);
	
	ORDREXE01P02.location.pageInit();
}


// 화면내 초기화 부분
ORDREXE01P02.location.pageInit = function() {
	var sParams = sStorage.getItem("ORDREXE01P02Params");
	if(!ComUtil.isNull(sParams)){
		ORDREXE01P02.variable.initParamData = sParams;
		ORDREXE01P02.variable.detailData = sParams;
		ORDREXE01P02.location.displayDetail();
	}
	else{
		ORDREXE01P02.tran.selectDetail();
	}
	
	ORDREXE01P02.variable.detailData.userNm = gfn_getUserInfo('userNm', true);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 주문내용 확인 조회
ORDREXE01P02.tran.selectDetail = function() {
	var inputParam 		= {};
	inputParam.sid 		= "selectAcntOrderInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_execute/select_acnt_order_info";
	inputParam.data 	= {};
	inputParam.callback	= ORDREXE01P02.callBack; 
	
	gfn_Transaction( inputParam );
}


////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 주문하기 버튼 클릭시
ORDREXE01P02.event.clickBtnAcntCopy = function(e) {
 	e.preventDefault();

	
	var item = $(this).closest('.section-inner').data();
	ComUtil.string.clipboardCopy(ComUtil.string.replaceAll(item.acnt_no_dis, '-', ''));
	
	//gfn_alertMsgBox("계좌번호가 복사되었습니다.", '', function(){});
	gfn_log("계좌번호가 복사되었습니다.");
	gfn_toastMsgBox({msg:"계좌번호가 복사되었습니다."});
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
ORDREXE01P02.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	// 주문내용 확인 조회
	if(sid == "selectAcntOrderInfo"){
		ORDREXE01P02.variable.detailData = result.acnt_wait_list;
		
		ORDREXE01P02.location.displayDetail();
		return;
	}
	
	
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
ORDREXE01P02.location.displayDetail = function(){
	var detailData = ORDREXE01P02.variable.detailData;
	
	
	gfn_setDetails(detailData, $('#P0102-content'));
	
	// init
	$('#divWaitOrderList').html('');
	
	var _template = $("#_dumyAcnt").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.acnt_wait_list, function(index, item){
		item.idx = index + 1;
		
		item.acnt_no_dis 	= ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		item.companyImgSrc 	= gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		item.mon_pay_dis 	= ComUtil.number.addCommmas(item.mon_pay_amt);
		
		item.acnt_type_nm 	= gfn_getAcntTypeNm(item.acnt_type);
		item.user_nm 		= gfn_getUserInfo('userNm', true);	// 예금주명
		
		var html = template(item);
		$('#divWaitOrderList').append(html);
		$('#rowAcnt_' + item.idx).data(item);
	});
}	



ORDREXE01P02.init();
