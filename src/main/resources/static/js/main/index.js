/**
* 파일명 		: INDEX.js
* 업무		: 네이티브 진입화면
* 설명		: 사용자의 상태값에 따라 분기한다. 
* 작성자		: 배수한
* 최초 작성일자	: 2021.01.12
* 수정일/내용	: 
*/
var INDEX = CommonPageObject.clone();

/* 화면내 변수  */
INDEX.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: true								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
INDEX.events = {
}

INDEX.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INDEX');
	
	//$("#pTitle").text("자주묻는질문");
	gfn_OnLoad();
	INDEX.location.pageInit();
}


// 화면내 초기화 부분
INDEX.location.pageInit = function() {
	// app 버젼체크
	//debugger;
	gfn_getAppVersion({screenId:"INDEX"});
	
}


INDEX.callBack.noticePop = function(returnParam){
	// 화면이동
	INDEX.location.moveMainPage();
}

INDEX.callBack.native = function(result){
	var key = result.key;
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 스크랩핑 호출시 
	if(key == 'versionInfo'){
		// app 버젼 체크후 구버젼이면 'advice' 로 변경
		//if(!gfn_isLocal()){
			if(!gfn_checkAppVersion()){
				gfn_setUserInfo('status', 'advice');
			}
			
			// 공지메세지가 있는지 여부
			var noticeYn = ComUtil.null($('#noticeYn').val(), 'N');
			if(noticeYn == 'Y'){
				var sParam = {};
				sParam.callback = INDEX.callBack.noticePop();
				gfn_callNoticePopup();
			}
			else{
				// 화면이동
				INDEX.location.moveMainPage();
			}
		//}
	}
}


// 로그인 사용자의 상태에 따라 메인화면 이동
INDEX.location.moveMainPage = function(){
	var pageType = ComUtil.null($('#pageType').val(), 'm');
	
	if(pageType == 'w'){
		return;
	}
	
	pageType = ComUtil.null(gfn_getUserInfo('status', false), pageType);
	
	var url = "";
	var homeUrl = "";
	
	switch(pageType){
		case 'i' : url = "/pension_advice/dashBoard/DASHBRD01S00";
				   homeUrl = "/pension_advice/dashBoard/DASHBRD01S00";
			break;
		case 'd' : url = "/pension_advice/dashBoard/DASHBRD01S01";
				   homeUrl = "/pension_advice/dashBoard/DASHBRD01S01";
			break;
		case 'advice' : url = "/pension_advice/dashBoard/DASHBRD01S01";
				   homeUrl = "/pension_advice/dashBoard/DASHBRD01S01";
			break;
		case 't' : url = "/advice_execution/advice_contract/ADVCEXC13S01";
				   homeUrl = "/pension_mng/PENSION01M00";
			break;
		case 'trans' : url = "/advice_execution/advice_contract/ADVCEXC13S01";
				   homeUrl = "/advice_execution/advice_contract/ADVCEXC13S01";
			break;
		/*case 'm' : url = "/pension_mng/PENSION01M00";
				   homeUrl = "/pension_mng/PENSION01M00";
			break;
		case 'mng' : url = "/pension_mng/PENSION01M00";
				   homeUrl = "/pension_mng/PENSION01M00";
			break;*/
		case 'm' : url = "/pension_mng/PENSION11M01";
				   homeUrl = "/pension_mng/PENSION11M01";
			break;
		case 'mng' : url = "/pension_mng/PENSION11M01";
				   homeUrl = "/pension_mng/PENSION11M01";
			break;
		case 'wait' : url = "/pension_mng/PENSION11M01";
				   homeUrl = "/pension_mng/PENSION11M01";
			break;
		//case 'wait' : url = "/wait_progress/WAITPRO01S01";
		//		   homeUrl = "/wait_progress/WAITPRO01S01";
			break;
		default  : url = "/pension_mng/PENSION01M00";
				   homeUrl = "/pension_mng/PENSION01M00";
			break;
	}
	
	sStorage.setItem('homeUrl', homeUrl);
	
	// 타입에 따른 화면 이동보다 우선 이동되어야 하는경우 
	var exceptionType = ComUtil.null($('#exceptionType').val(), '');
	
	if(!ComUtil.isNull(exceptionType)){
		if(exceptionType == 'except_lifeplan'){
			url = "/my_info/MYINFOM03S20";
			gfn_pushHitory(homeUrl);
		}
	}
	
	ComUtil.moveLink(url, false);
}



INDEX.init();
