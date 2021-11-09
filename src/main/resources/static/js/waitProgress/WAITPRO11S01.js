/**
* 파일명 		: WAITPRO11S01.js (W-11-01)
* 업무		: 자문대기 대시보드
* 설명		: 자문대기 대시보드
* 작성자		: 정의진
* 최초 작성일자	: 2021.04.28
* 수정일/내용	: 
*/
var WAITPRO11S01 = CommonPageObject.clone();

/* 화면내 변수  */
WAITPRO11S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'dash'							// 해더영역 디자인    default 는 normal
	,showMenu		: true								//
}

/* 이벤트 정의 */
WAITPRO11S01.events = {
	 'click #showIcoUnexec' 							: 'WAITPRO11S01.event.clickShowIcoUnexec'
	,'click li[id^="prdRow_"]'							: 'WAITPRO11S01.event.clickMoveDetail'
}

WAITPRO11S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('WAITPRO11S01');
	
	$("#pTitle").text("");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "w-01-01";
	gfn_azureAnalytics(inputParam);
	
	WAITPRO11S01.location.pageInit();
}


// 화면내 초기화 부분
WAITPRO11S01.location.pageInit = function() {
	
	// 연금대기메인조회 조회  	
	WAITPRO11S01.tran.selectDetail();
	
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
WAITPRO11S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pensionWaitProdlist";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_wait/pension_wait_main";
	inputParam.data 	= {};
	inputParam.callback	= WAITPRO11S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 툴팁보기 클릭시
WAITPRO11S01.event.clickShowIcoUnexec = function(e) {
	e.preventDefault();
	
    $('.question_note').addClass('show');
    setTimeout(function(){ 
        $('.question_note').removeClass('show');
    }, 3000);
}

// 상세화면이동 클릭시
WAITPRO11S01.event.clickMoveDetail = function(e) {
	e.preventDefault();
	
	var data = $(this).data();
	// 2: 이체, 9:해지 5:신규
	if(data.advc_gbn_cd == '5'){
		sStorage.setItem("WAITPRO12S06Params", data);
		ComUtil.moveLink('/wait_progress/WAITPRO12S06'); //신규상세 화면이동
	}
	else{
		sStorage.setItem("WAITPRO12S01Params", data);
		ComUtil.moveLink('/wait_progress/WAITPRO12S01'); // 상세 화면이동
	}
	
} 

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
WAITPRO11S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "pensionWaitProdlist"){
		WAITPRO11S01.variable.detailData = result;
		
		// 상세 셋팅 
		WAITPRO11S01.location.displayDetail();
				
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
WAITPRO11S01.location.displayDetail = function(){
	var detailData = WAITPRO11S01.variable.detailData;
	
	// 상세내역 세팅
	gfn_setDetails(detailData, $('#f-content'))
	
	
	// 초기화
	
	var _template = $("#_dumyUnexecList").html();
	var template = Handlebars.compile(_template);
	
	$.each( detailData.unexec_list, function(index, item){
		item.idx = index + 1;
		
		item.orgn_companyImgSrc = gfn_getImgSrcByCd(item.orgn_kftc_agc_cd, 'C');
		item.chng_companyImgSrc = gfn_getImgSrcByCd(item.chng_kftc_agc_cd, 'C');
		
		// 상태태그
		item.status_tag = item.status_tag.split('|');
			
		var html = template(item);
		$('#prdListWait').append(html);
		
		$('#prdRow_' + item.idx).data(item);
	});
	
}



WAITPRO11S01.init();
