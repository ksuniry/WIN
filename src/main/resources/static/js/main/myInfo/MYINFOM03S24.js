/**
* 파일명 		: MYINFOM03S24.js
* 업무		: 메인 > 내정보 > 통합포털회원가입 입력 (c-03-24)
* 설명		: 통합포털회원가입 입력
* 작성자		: 배수한
* 최초 작성일자	: 2021.02.25
* 수정일/내용	: 
*/
var MYINFOM03S24 = CommonPageObject.clone();

/* 화면내 변수  */
MYINFOM03S24.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,headType		: 'normal'							// 해더영역 디자인    default 는 normal
	,showMenu		: false								//
	,sidoData		: {}									// 통합연금포털 전용 시도 코드
	,gunguData		: {}									// 통합연금포털 전용 시군구 코드
}

/* 이벤트 정의 */
MYINFOM03S24.events = {
	 'click #btnCallEnter'					: 'MYINFOM03S24.event.clickBtnCallEnter'
	 ,'click #btnCancelEnter'				: 'MYINFOM03S24.event.clickBtnCancelEnter'
	 ,'change #addressSido'					: 'MYINFOM03S24.event.changeSido'
	 //,'change #userPw'						: 'MYINFOM03S24.event.changeUserPw'
}

MYINFOM03S24.init = function(){

	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('MYINFOM03S24');
	
	$("#pTitle").text("통합연금포털 회원정보 입력");
	gfn_OnLoad();
	
	//MS Azure Analytics
	var inputParam = {};
	inputParam.screenName = "c-03-24";
	gfn_azureAnalytics(inputParam);
	
	MYINFOM03S24.location.pageInit();
}


// 화면내 초기화 부분
MYINFOM03S24.location.pageInit = function() {

	// 통합연금포털 아이디 조회 	
	//MYINFOM03S24.tran.selectDetail();
	
	$('#userNm').html(gfn_getUserInfo("userNm"));
	$('#userPn').html(ComUtil.string.format(gfn_getUserInfo("userPn", true), 'tel'));
	$('#userEmail').html(gfn_getUserInfo("userEmail"));
	
	// 시도, 군구 초기 셋팅
	MYINFOM03S24.location.setSigungu();
	gfn_setSelectBoxByJson(MYINFOM03S24.variable.sidoData, 'addressSido');
	gfn_setSelectBoxByJson(MYINFOM03S24.variable.gunguData['g'], 'addressGunGu');
}


////////////////////////////////////////////////////////////////////////////////////
// 거래
// 연금관리 메인 상세내역 조회 
MYINFOM03S24.tran.selectDetail = function() {
	/*
	var inputParam 		= {};
	inputParam.sid 		= "myPnsnList";
	inputParam.target 	= "api";
	inputParam.url 		= "/pension_mng/my_pnsn_list";
	inputParam.data 	= {};
	inputParam.callback	= MYINFOM03S24.callBack; 
	
	gfn_Transaction( inputParam );
	*/
}




////////////////////////////////////////////////////////////////////////////////////
// 이벤트

// 통합포털 회원가입 페이지로 이동
MYINFOM03S24.event.clickBtnCallEnter = function(e) {
 	e.preventDefault();
	
	MYINFOM03S24.location.callEnterOtherSite();
}

// 통합포털 회원가입 취소
MYINFOM03S24.event.clickBtnCancelEnter = function(e) {
 	e.preventDefault();

	gfn_historyClear();
	gfn_goMain();
}

// 시도에 따른 시군구 셋팅
MYINFOM03S24.event.changeSido = function(e) {
 	e.preventDefault();

	var sido = $(this).val();
	
	gfn_setSelectBoxByJson(MYINFOM03S24.variable.gunguData["g"+sido], 'addressGunGu');
}

/*
// 첫번째 비밀번호 변경시 
MYINFOM03S24.event.changeUserPw = function(e) {
 	e.preventDefault();

	// 확인 비밀번호 초기화
	$('#userPw2_keypad').val('');
	$('#userPw').val('');
}
*/
////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
MYINFOM03S24.callBack = function(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	// 상세조회
	if(sid == "myPnsnList"){
		
	}
}


// 네이티브 호출후 콜백함수 
MYINFOM03S24.callBack.native = function(result){
	var key = result.key;
	gfn_log('key :::::::::::  ' + key);
	if(ComUtil.isNull(key)){
		gfn_log('callback set key!!! plz..');
		return;
	}
	
	// 키패드 호출 
	if(key == 'keyPad'){
		// 길이체크 최소 8 / 최대 20
		var valId = ComUtil.string.replaceAll(result.id, '_keypad', '');  // 실제 값을 저장할 아이디
		var valObj = $('#' + valId);
		
		if(8 > result.cnt){
			$('#' + result.id).val('');
			valObj.val('');
			gfn_alertMsgBox("8자리 이상 입력하시길 바랍니다.");
			return;
		}
		return;
	}
	
	
	//  통합연금포탈 회원가입
	if(key == 'lifeplanJoin'){
		if(ComUtil.null(result.passYn, 'N') == 'N'){
			gfn_alertMsgBox(result.msg, '', function(){});
			return;
		}
		
		gfn_historyClear();
		gfn_goMain();
	}
}


////////////////////////////////////////////////////////////////////////////////////
// 지역함수

// 상세 셋팅
MYINFOM03S24.location.displayDetail = function(){
	var detailData = MYINFOM03S24.variable.detailData;
	
	// 상세내역 셋팅
	gfn_setDetails(detailData, $('#f-content'));
}

// 통합연금포탈 회원가입
MYINFOM03S24.location.callEnterOtherSite = function(){
	
	// 패스워드가 모두 저장 된 경우 시작
	/* 
	if(!ComUtil.null($('#userPw').data('checkok'), false)){
		return;
	}
	*/
	// 필수값 체크
	if(!ComUtil.validate.check($('#f-content')))
	{
		gfn_log("ComUtil.validate.check false ::::::::::::::::::::::::::::::::");
		return false;
	}
	
	var inputParam = {};
	gfn_makeInputData($('#f-content'), inputParam, '');
	//inputParam.key = 'lifeplanJoin';			// 통합연금포탈 
	//inputParam.userId = $('#userId').val();
	//inputParam.userPw = $('#userPw').val();
	
	gfn_log("gfn_enterOtherSite inputParam ::::::::::::::::::::::::::::::::");
	gfn_log(inputParam);
	
	gfn_enterOtherSite(inputParam);
}



// 통합포털 전용 시군구 데이터 셋팅
MYINFOM03S24.location.setSigungu = function(){
	MYINFOM03S24.variable.sidoData		= {
						''	: '거주지역시도'
						,'009'	: '서울특별시'
						,'008'	: '부산광역시'
						,'006'	: '대구광역시'
						,'011'	: '인천광역시'
						,'005'	: '광주광역시'
						,'007'	: '대전광역시'
						,'010'	: '울산광역시'
						,'017'	: '세종특별자치시'
						,'001'	: '강원도'
						,'002'	: '경기도'
						,'003'	: '경상남도'
						,'004'	: '경상북도'
						,'012'	: '전라남도'
						,'013'	: '전라북도'
						,'014'	: '제주도'
						,'015'	: '충청남도'
						,'016'	: '충청북도'
						,'018'	: '해외'
					  };								// 통합연금포털 전용 시도 코드
	MYINFOM03S24.variable.gunguData		= {
		'g' : {	''	: '거주지역시군구'	}
		,'g009' : {
					"001":'강남구', 	"002":'강동구', "003":'강북구', "004":'강서구', 	"005":'관악구',  
					"006":'광진구', 	"007":'구로구', "008":'금천구', "009":'노원구', 	"010":'도봉구',  
					"021":'용산구', 	"022":'은평구', "023":'종로구', "024":'중구', 	"025":'중랑구', 
					"011":'동대문구', 	"012":'동작구', "013":'마포구', "014":'서대문구', 	"015":'서초구',  
					"016":'성동구', 	"017":'성부국', "018":'송파구', "019":'양천구', 	"020":'영등포구'  
				 }
		,'g008' : {
					"003":'기장군', 	"001":'강서구', 	"002":'금정구', 	"004":'남구', 	"005":'동구',  
					"006":'동래구', 	"007":'부산진구', 	"008":'북구', 	"009":'사상구', 	"010":'사하구', 
					"011":'서구', 	"012":'수영구', 	"013":'연제구', 	"014":'영도구', 	"015":'중구',  
					"016":'해운대구' 
				 }
		,'g006' : {
					"003":'달성군', "001":'남구', "002":'달서구', "004":'동구', "005":'북구',  
					"006":'서구', "007":'수성구', "008":'중구'
				 }
		,'g011' : {
					"001":'강화군', "002":'계양구', "009":'웅진군', "003":'남구', "004":'남동구', 
					"005":'동구', "006":'부평구', "007":'서구', "008":'연수구', "010":'중구'
				 }
		,'g005' : {
					"001":'광산군', "002":'남구', "003":'동구', "004":'북구', "005":'서구'
				 }
		,'g007' : {
					"001":'대덕구', "002":'동구', "003":'서구', "004":'유성구', "005":'중구'  
				 }
		,'g010' : {
					"001":'울주군', "002":'남구', "003":'동구', "004":'북구', "005":'중구'  
				 }
		,'g001' : {	// 강원도
					"001":'강릉시', "003":'동해시', "004":'삼척시', "005":'속초시', "009":'원주시',  
					"013":'춘천시', "014":'태백시', "002":'고성군', "006":'양구군', "007":'양양군',  
					"008":'영월군', "010":'인제군', "011":'정선군', "012":'철원군', "015":'평창군',  
					"016":'홍천군', "017":'화천군', "018":'횡성군'    
				 }
		,'g002' : {	// 경기도
					"002":'고양시', "005":'과천시', "006":'광명시', "007":'광주시', "008":'구리시',  
					"009":'군포시', "010":'김포시', "011":'남양주시', "012":'동두천시', "013":'부천시',  
					"016":'성남시', "019":'수원시', "023":'시흥시', "024":'안산시', "026":'안성시',  
					"027":'안양시', "029":'양주시', "031":'여주시', "033":'오산시', "034":'용인시',  
					"037":'의왕시', "038":'의정부시', "039":'이천시', "040":'파주시', "041":'평택시',  
					"042":'포천시', "043":'하남시', "044":'화성시', "001":'가평군', "030":'양평군',  
					"032":'연천군'   
				 }
		,'g003' : {	// 경상남도
					"001":'거제시', "004":'김해시', "006":'밀양시', "007":'사천시', "009":'양산시',  
					"011":'진주시', "013":'창원시', "018":'통영시', "002":'거창군', "003":'고성군',  
					"005":'남해군', "008":'산청군', "010":'의령군', "012":'창녕군', "019":'하동군',  
					"020":'함안군', "021":'함양군', "022":'합천군' 
				 }
		,'g004' : {	// 경상북도
					"001":'경산시', "002":'경주시', "004":'구미시', "006":'김천시', "007":'문경시',  
					"009":'상주시', "011":'안동시', "014":'영주시', "015":'영천시', "023":'포항시',  
					"003":'고령군', "005":'군위군', "008":'봉화군', "010":'성주군', "012":'영덕군',  
					"013":'영양군', "016":'예천군', "017":'울릉군', "018":'울진군', "019":'의성군',  
					"020":'청도군', "021":'청송군', "022":'칠곡군' 
				 }
		,'g012' : {	// 전라남도
					"004":'광양시', "006":'나주시', "008":'목포시', "011":'순천시', "013":'여수시',  
					"001":'강진군', "002":'고흥군', "003":'곡성군', "005":'구례군', "007":'담양군',  
					"009":'무안군', "010":'보성군', "012":'신안군', "014":'영광군', "015":'영양군',  
					"016":'완도군', "017":'장성군', "018":'장흥군', "019":'진도군', "020":'함평군',  
					"021":'해남군', "022":'화순군' 
				 }
		,'g013' : {	// 전라북도
					"002":'군산시', "003":'감제시', "004":'남원시', "009":'익산시', "012":'전주시',  
					"014":'정읍시', "001":'고창군', "005":'무주군', "006":'부안군', "007":'순창군',  
					"008":'완주군', "010":'임실군', "011":'장수군', "015":'진안군' 
				 }
		,'g014' : {	// 제주도
					"001":'서귀포시', "002":'제주시' 
				 }
		,'g015' : {	// 충청남도
					"001":'계룡시', "002":'공주시', "004":'논산시', "005":'당진시', "006":'보령시', 
					"008":'서산시', "010":'아산시', "012":'천안시', "003":'금산군', "007":'부여군',  
					"009":'서천군', "011":'예산군', "014":'청양군', "015":'태안군', "016":'홍성군' 
				 }
		,'g016' : {	// 충청북도
					"007":'제천시', "010":'청주시', "014":'충주시', "001":'괴산군', "002":'단양군',  
					"003":'보은군', "004":'영동군', "005":'옥천군', "006":'음성군', "008":'증평군',  
					"009":'진천군'
				 }
				  	  };								// 통합연금포털 전용 시군구 코드
}

MYINFOM03S24.init();
