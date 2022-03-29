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
	gfn_OnLoad();
	INDEX.location.pageInit();
}


// 화면내 초기화 부분
INDEX.location.pageInit = function() {
	alert('1');
}


// 로그인 사용자의 상태에 따라 메인화면 이동
INDEX.location.moveMainPage = function(){
	
}



INDEX.init();
