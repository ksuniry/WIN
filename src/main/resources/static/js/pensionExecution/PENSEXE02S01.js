/**
* 파일명 		: PENSEXE02S01.js
* 업무		: 거래 (연금실행)> 머플러 자문안 > 투자설명서확인 (t-02-01)
* 설명		: 투자설명서확인
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.03
* 수정일/내용	:  
*/
var PENSEXE02S01 = CommonPageObject.clone();

/* 화면내 변수  */
PENSEXE02S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,screenType		: 'approval_5'						// 애드브릭스 이벤트값
	,screenFType	: 'approval_total'					// 페이스북 이벤트값
}

/* 이벤트 정의 */
PENSEXE02S01.events = {
	 'click p[id^="investTitle_"]'						: 'PENSEXE02S01.event.clickFundList'
	,'change input:checkbox[id^="ckSub_"]'				: 'PENSEXE02S01.event.changeSbuCheck'
	,'change #ckOk'										: 'PENSEXE02S01.event.changeCkOk'
	,'click #btnPortfolioOk'							: 'PENSEXE02S01.event.clickBtnPortfolioOk'
	,'click #popCloseOk, #popCloseCancel'				: 'PENSEXE02S01.event.popClose'		// 알림메세지창 숨김
}

PENSEXE02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('PENSEXE02S01');
	
	$("#pTitle").text("투자설명서 확인");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "t-02-01";
	gfn_azureAnalytics(inputParam);
	
	PENSEXE02S01.location.pageInit();
}


// 화면내 초기화 부분
PENSEXE02S01.location.pageInit = function() {
	
	PENSEXE02S01.variable.detailData = sStorage.getItem("PENSEXEDATA");
	// 테스트 data s
	//PENSEXE02S01.variable.detailData = {};
	//PENSEXE02S01.variable.detailData.invt_fund_list = [{idx:1}, {idx:2}];	
	// 테스트 data e
	PENSEXE02S01.variable.detailData.fundCnt = PENSEXE02S01.variable.detailData.invt_fund_list.length;

	// 고객센터 관련 내역 셋팅  	
	PENSEXE02S01.location.displayDetail();
	
	// 퍼블 이벤트 셋팅
	{
		$('.invest-slide').slick({
            infinite: false,
            dots: true,
            arrows: false,
            centerPadding: '20px',
            slidesToShow: 1.05,
            pauseOnFocus: false
        });
	}
	
	//t-02-01 스크롤 사이즈
    var windowHeight = $(window).height();
    var txtHeight = $('.t_02_01 .txt_2x').height() + 40;
    $('.t_02_01 .box_color').height(windowHeight - txtHeight - 198);
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
PENSEXE02S01.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myMainPnsnInfo";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_main_pnsn_info";
	inputParam.data 	= {};
	inputParam.callback	= PENSEXE02S01.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 승인버튼 
PENSEXE02S01.event.clickBtnPortfolioOk = function(e) {
 	e.preventDefault();


	// 주요확인 내용 체크
	if($('input:checkbox[id="ckOk"]').is(':checked') == false){
		gfn_alertMsgBox("<span>주요내용을 확인을 해야 합니다. <br>체크한 후 진행해 주시길 바랍니다</span>");
		return;
	}
	

	// 펀드별 간이투자설명서 확인 여부 체크
	if($('input:checkbox[id^="ckSub_"]').length == $('input:checkbox[id^="ckSub_"]:checked').length){
		
		sStorage.setItem("PENSEXEDATA", PENSEXE02S01.variable.detailData);
		
		ComUtil.moveLink('/pension_execution/PENSEXE02S02');	// 주요내용확인 화면으로 이동
	}
	else{
		// 안내창 팝업 호출
		$('#divPopConfirm').show();
	}

}

// 삼성펀드링크
PENSEXE02S01.event.clickFundList = function(e) {
 	e.preventDefault();
	
	var item = $(this).closest('.box_r').data();
	
	var inputParam = {};
	inputParam.fund_no 		= item.prdt_cd;
	
	// 펀드링크 호출
	gfn_callFundDetail(inputParam);
	
	/*
	var url = "https://m.fundsolution.co.kr/SPFM43000MASS.do?mode=fnList6&FUND_CD="+item.prdt_cd+"&cntSubM=load";
	
	var inputParam = {};
	inputParam.url 			= url;
	inputParam.screenId 	= "PENSEXE02S01";
	inputParam.objId	 	= item.prdt_cd;
	inputParam.inYn		 	= "Y";
	inputParam.type		 	= "link";
	
	gfn_otherLinkOpen(inputParam);
	*/
}

// 투자펀드별 간이투자설명서 확인
PENSEXE02S01.event.changeSbuCheck = function(e) {
 	e.preventDefault();
	
	var item = $(this).closest('.invest-slide-item').data();
	var idx = $(this).data('idx');
	
	var invt_fund_list = PENSEXE02S01.variable.detailData.invt_fund_list; 
	
	if(!ComUtil.isNull(invt_fund_list[idx-1].smpl_invt_expl_chk_dt)){
		invt_fund_list[idx-1].smpl_invt_expl_chk_dt = '';
		$(this).attr("checked", false);
		return;
	}
	else{
		//var url = gfn_getTranUrl({target:"appweb"}) + "/investDoc/" + item.prdt_cd + ".pdf";
		var url = gfn_getDownloadUrl() + "?prd_cd=" + item.prdt_cd;
		
		
		var inputParam = {};
		inputParam.url 			= url;
		inputParam.screenId 	= "PENSEXE02S01";
		inputParam.objId	 	= idx;
		inputParam.inYn		 	= "Y";
		inputParam.type		 	= "pdf";
		
		gfn_otherLinkOpen(inputParam);
	}
}


// 주요내용체크박스 클릭시
PENSEXE02S01.event.changeCkOk = function(e) {
 	e.preventDefault();

	if($(this).is(':checked')){
		PENSEXE02S01.variable.detailData.import_content_check_yn = 'Y';
	}
	else{
		PENSEXE02S01.variable.detailData.import_content_check_yn = 'N';
	}
}



// 안내메세지 확인 / 취소 버튼 클릭시
PENSEXE02S01.event.popClose = function(e) {
 	e.preventDefault();

	var id = $(this).attr('id');
	
	if(id == "popCloseOk"){
		PENSEXE02S01.variable.detailData.smpl_invt_expl_all_chk_yn = "N";		// 전체케여여부 포기
		sStorage.setItem("PENSEXEDATA", PENSEXE02S01.variable.detailData);
		
		ComUtil.moveLink('/pension_execution/PENSEXE02S02');	// 주요내용확인 화면으로 이동
	}
	
	$('#divPopConfirm').hide();
}


////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
PENSEXE02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	
	if(sid == "myMainPnsnInfo"){
		PENSEXE02S01.variable.detailData = result;
	}
}

// 네이티브 호출후 콜백함수 
PENSEXE02S01.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 외부링크 호출 
	if(key == 'otherLinkOpen'){
		gfn_log("setOtherLinkOpen :: " + result.type);
		gfn_log("passYn :: " + result.passYn);
		gfn_log("idx :: " + result.objId);
		
		if(result.type == "link"){
			//result.objId
		}
		
		if(result.type == "pdf"){
			//result.objId
			var invt_fund_list = PENSEXE02S01.variable.detailData.invt_fund_list; 	// 투자펀드목록
			var idx = parseInt(result.objId);
			
			if(result.passYn == 'Y'){
				invt_fund_list[idx-1].smpl_invt_expl_chk_dt = ComUtil.date.curDate('YYYYMMDDHHmmss');
				$('#ckSub_' + idx).attr("checked", true);
			}
			else{
				invt_fund_list[idx-1].smpl_invt_expl_chk_dt = "";
				$('#ckSub_' + idx).attr("checked", false);
			}
		}
	}
}
/*
PENSEXE02S01.callBack.setOtherLinkOpen = function(resultData){
	gfn_log("setOtherLinkOpen :: " + resultData.type);
	gfn_log("passYn :: " + resultData.passYn);
	gfn_log("idx :: " + resultData.objId);
	
	if(resultData.type == "link"){
		//resultData.objId
	}
	
	if(resultData.type == "pdf"){
		//resultData.objId
		var invt_fund_list = PENSEXE02S01.variable.detailData.invt_fund_list; 	// 투자펀드목록
		var idx = parseInt(resultData.objId);
		
		if(resultData.passYn == 'Y'){
			invt_fund_list[idx-1].smpl_invt_expl_chk_dt = ComUtil.date.curDate('YYYYMMDDHHmmss');
			$('#ckSub_' + idx).attr("checked", true);
		}
		else{
			invt_fund_list[idx-1].smpl_invt_expl_chk_dt = "";
			$('#ckSub_' + idx).attr("checked", false);
		}
	}
	
}
*/

////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
PENSEXE02S01.location.displayDetail = function(){
	var detailData = PENSEXE02S01.variable.detailData;
	
	gfn_setDetails(detailData, $('#f-content'));
	
	if(!ComUtil.isNull(detailData.invt_fund_list)){
		//PENSEXE02S01.location.displayInvtFundSlide();
		PENSEXE02S01.location.displayInvtFundList();
	}
}	


PENSEXE02S01.location.displayInvtFundList = function(){
	var detailData = PENSEXE02S01.variable.detailData;
	
	var divObj = $('#investList');
	divObj.html('');
	
	
	var _template = $("#_dumyInvestList").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.invt_fund_list, function(index, item){
		item.idx = index + 1;
		
		if(item.pre_fee_rate == 0){
			item.pre_fee_txt = "선취수수료 없음";
		}
		else{
			item.pre_fee_txt = item.pre_fee_dis + " " + item.pre_fee_unit;
		}
		
		if(!ComUtil.isNull(item.smpl_invt_expl_chk_dt)){
			$('#ckSub_'+item.idx).attr('checked', true);
		}
		 
		var html = template(item);
		$(divObj).append(html);
		
		
		//item.desc_keyword1 = "해외주식|국내주식|아몰랑";
		//item.desc_keyword2 = "해외주식1|국내주식2|아몰랑3";	
		if(!ComUtil.isNull(item.desc_keyword1)){
			item.desc_keyword1_list = "";
			var arrDescKeyword1 = item.desc_keyword1.split("|");
			item.desc_keyword1_list = "<span class='fund-label'>펀드</span> ";	// 현재는 펀드가 들어오기 때문에 고정값으로 처리해준다.
			$.each(arrDescKeyword1, function(index, keyword){
				item.desc_keyword1_list += "<span class='fund-type'>"+keyword+"</span> ";
			});
			
			$('#desc_keyword1_list_'+item.idx).html(item.desc_keyword1_list);
		}
		
		if(!ComUtil.isNull(item.desc_keyword2)){
			item.desc_keyword2_list = "";
			var arrDescKeyword2 = item.desc_keyword2.split("|");
			$.each(arrDescKeyword2, function(index, keyword){
				if(keyword.indexOf('주식') > -1){
					classNm = "type01";
				}
				else if(keyword.indexOf('연금') > -1){
					classNm = "type01";
				}
				else if(keyword.indexOf('온라인') > -1){
					classNm = "type02";
				}
				else{
					classNm = "";
				}
				item.desc_keyword2_list += "<span class='percent-name "+classNm+"'>"+keyword+"</span> ";
			});
			$('#desc_keyword2_list_'+item.idx).html(item.desc_keyword2_list);
		}
		
		
		$('#divInvestList_' + item.idx).data(item);
	});
	
}

/*
PENSEXE02S01.location.displayInvtFundSlide = function(){
	var detailData = PENSEXE02S01.variable.detailData;
	
	var divObj = $('#invest_slide');
	divObj.html('');
	
	
	var _template = $("#_dumyInvestSlide").html();

	var template = Handlebars.compile(_template);
	
	
	$.each( detailData.invt_fund_list, function(index, item){
		item.idx = index + 1;
		var html = template(item);
		$(divObj).append(html);
		
		if(!ComUtil.isNull(item.smpl_invt_expl_chk_dt)){
			$('#ckSub_'+item.idx).attr('checked', true);
		}
	});
	
	
	$('#invest_slide').slick({
        infinite: false,
        dots: true,
        arrows: false,
        centerMode: true,
        centerPadding: '15px',
        slidesToShow: 1,
        adaptiveHeight: true
    });
}
*/



PENSEXE02S01.init();
