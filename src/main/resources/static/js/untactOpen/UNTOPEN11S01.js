/**
* 파일명 		: UNTOPEN11S01.js (E-11-01)
* 업무		: 비대면계좌개설 > 계좌개설 완료 화면
* 설명		: 계좌개설 완료 화면
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.12
* 수정일/내용	: 
*/
var UNTOPEN11S01 = CommonPageObject.clone();

/* 화면내 변수  */
UNTOPEN11S01.variable = {
	sendData		: {
						fund_no : ""			// 펀드 번호
					  }							// 조회시 조건
	,detailData		: {}						// 조회 결과값
	,initParamData	: {}						// 이전화면에서 받은 파라미터
	,noBack			: false						// 상단 백버튼 존재유무
	,showMenu		: false								//
	,screenType		: 'account_fin'					// 애드브릭스 이벤트값
	,screenFType	: 'account_fin'					// 페이스북 이벤트값
}

/* 이벤트 정의 */
UNTOPEN11S01.events = {
	 'click #btnNext' 								: 'UNTOPEN11S01.event.clickBtnNext'
	//,'click li[id^="fundInfo_"]'					: 'UNTOPEN11S01.event.goFundDetail'
}

UNTOPEN11S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('UNTOPEN11S01');
	
	$("#pTitle").text("");	// 계좌개설 완료
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "e-11-01";
	gfn_azureAnalytics(inputParam);
	
	UNTOPEN11S01.location.pageInit();
}


// 화면내 초기화 부분
UNTOPEN11S01.location.pageInit = function() {
	
	var sParams = sStorage.getItem("UNTOPEN11S01Params");
	if(ComUtil.isNull(sParams)){
		gfn_alertMsgBox("정상적인 접근이 아닙니다.", '', function(){
			$('#btnNext').attr('disabled', true);
			return;
		});
	}
	
	if(ComUtil.isNull(sParams.new_acnt_list)){
		gfn_finishView( {msg:'비정상적으로 비대면 계좌 개설이 진행되었습니다.  앱을 재실행하시고 비대면 계좌개설을 진행하세요.'});
	}
	
	if(sParams.new_acnt_list.length == 0){
		gfn_finishView( {msg:'비정상적으로 비대면 계좌 개설이 진행되었습니다.  앱을 재실행하시고 비대면 계좌개설을 진행하세요.'});
	}
	
	sParams.new_acnt_cnt = sParams.new_acnt_list.length;
	
	UNTOPEN11S01.variable.detailData = sParams;
	UNTOPEN11S01.variable.initParamData = sParams;
	
	UNTOPEN11S01.location.displayDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래

////////////////////////////////////////////////////////////////////////////////////
// 이벤트
UNTOPEN11S01.event.clickBtnNext = function(e) {
	
	
	ComUtil.moveLink('/advice_execution/advice_contract/ADVCEXC12S01', false); // 자문계약으로 화면이동
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
UNTOPEN11S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

UNTOPEN11S01.location.displayDetail = function(){
	var detailData = UNTOPEN11S01.variable.detailData;
	
	gfn_setDetails(detailData, $('#f-content'));
	
	// 초기화
	$('#divNewAcntList').html('');
	
	if(gfn_isNull(detailData.new_acnt_list)){
		//$('#no_result').show();
		return;
	}
	
	//$('#no_result').hide();

	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.new_acnt_list, function(index, item){
		item.idx = index + 1;
		
		item.companyImgSrc = gfn_getImgSrcByCd(item.kftc_agc_cd, 'C');
		item.acnt_no_dis = ComUtil.pettern.acntNo(ComUtil.null(item.acnt_no, '') + gfn_getAddAcntNoByCd(item.kftc_agc_cd));
		
		item.acnt_type_nm = gfn_getAcntTypeNm(item.acnt_type);
		
		var html = template(item);
		$('#divNewAcntList').append(html);
		$('#divNewAcnt_' + item.idx).data(item);
	});	
}


UNTOPEN11S01.init();
