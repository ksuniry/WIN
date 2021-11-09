/**
* 파일명 		: MYINFOM02S01.js
* 업무		: 메인 > 내정보 > 내 연금계좌 (c-02-01)
* 설명		: 내 연금계좌
* 작성자		: 배수한
* 최초 작성일자	: 2020.12.01
* 수정일/내용	: 
*/
var MYINFOM02S01 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM02S01.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
}

/* 이벤트 정의 */
MYINFOM02S01.events = {
	 'click li[id^="acntRow_"]'			: 'MYINFOM02S01.event.clickAcntDetail'
	 ,'click #tabList>li'					: 'MYINFOM02S01.event.tabChange'
}

MYINFOM02S01.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM02S01');
	
	$("#pTitle").text("내 연금계좌");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-02-01";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM02S01.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM02S01.location.pageInit = function() {
	//accor
    $('.result_ask').click(function(){
        if($(this).find('.ico').hasClass('arr_down') === true){
            $(this).next().show();
            $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
        }else{
            $(this).next().hide();
            $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
        }
    });

	// 첫번째 탭 보이기
	$('#tabPanel-1').show();

	// 연금관리 메인 상세내역 조회 	
	MYINFOM02S01.tran.selectDetail();
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM02S01.tran.selectDetail = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM02S01.callBack; 
	
	gfn_Transaction( inputParam );
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// 탭 클릭 이벤트
MYINFOM02S01.event.tabChange = function(e) {
	e.preventDefault();
	
	var index = ($(this).index())+1;
    var active = $(this).children('a').hasClass('is_active');
    if(active !== true){
        $(this).children('a').addClass('is_active');
        $(this).siblings().children('a').removeClass('is_active');
        $('div[id^="tabPanel-"]').hide();
        $('#tabPanel-'+index).show();
    }
}

// 배너클릭시 링크화면 호출
MYINFOM02S01.event.clickAcntDetail = function(e) {
 	e.preventDefault();
	var data = $(this).data();
	
	if(data.read_cd == '0'){	// '-1 : 조회불가, 0 : 조회가능
		data.screenId = "MYINFOM02S01";
		sStorage.setItem("PENSION03S01Params", data);
		
		var url = "/pension_mng/PENSION03S01";
		ComUtil.moveLink(url);
	}
	
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){
MYINFOM02S01.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세조회
	if(sid == "myPnsnList"){
		MYINFOM02S01.variable.detailData = result;
		
		// 
		MYINFOM02S01.location.displayDetail();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM02S01.location.displayDetail = function(){
	var detailData = MYINFOM02S01.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
	
	
	MYINFOM02S01.location.displayPanel("#tabPanel-1", '연금저축');
	MYINFOM02S01.location.displayPanel("#tabPanel-2", 'IRP');
	MYINFOM02S01.location.displayPanel("#tabPanel-3", '다른연금');
}	


// 각 페널 셋팅
MYINFOM02S01.location.displayPanel = function(selecter, type){
	var detailData = MYINFOM02S01.variable.detailData;
	
	
	var _template = $("#_dumyResult").html();
	var template = Handlebars.compile(_template);
	
	var bAcntlist = false;
	
	$.each( detailData.pnsn_list, function(index, item){
		item.idx = index + 1;
		
		if(item.pnsn_typ_nm == type){
			item.acntTotCnt = 0;
			if(!ComUtil.isNull(item.pnsn_prdt_list)){
				item.acntTotCnt = item.pnsn_prdt_list.length;
				bAcntlist = true;
			}
			
			gfn_setDetails(item, $(selecter));
			
			if(!ComUtil.isNull(item.pnsn_prdt_list)){
				$.each( item.pnsn_prdt_list, function(index2, item2){
					item2.idx = index2 + 1;
					item2.prefix = $(selecter).attr('id'); 
					item2.otherClass = ('0' == item2.read_cd) ? '' : 'other';
					item2.rvnu_rate = parseFloat(item2.rvnu_rate);
					item2.rvnu_addplus = (item2.rvnu_rate > 0) ? '+' : '';
					item2.addPlusClass = (item2.rvnu_rate >= 0) ? 'over' : 'under';
					if(item2.rvnu_rate == 0){
						item2.addPlusClass = '';
					}
					
					item2.new_dt = ComUtil.string.dateFormat(item2.new_dt);
					item2.acnt_type_nm = gfn_getAcntTypeNm(item2.acnt_type);
					
					item2.companyImgSrc = gfn_getImgSrcByCd(item2.kftc_agc_cd, 'C');
		
					// 운영상태코드에 따른 값 추출
					//item2.oprt_status_cd = '219';
					var oprtInfo = gfn_getOprtStatusInfo(item2.oprt_status_cd);
					$.extend(item2, oprtInfo);
					
					var html = template(item2);
					$('#pList_' + $(selecter).data('idx')).append(html);
					//$(selecter).append(html);
					$("#acntRow_"+item2.prefix+"_"+item2.idx).data(item2);
				});
			}
		}
		
	});	
	
	
	if(bAcntlist){
		$('#nodata', $(selecter)).hide();
		$('#divData', $(selecter)).show();
	}
	else{
		$('#nodata', $(selecter)).show();
		$('#divData', $(selecter)).hide();
	}
}



MYINFOM02S01.init();
