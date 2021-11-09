/**
* 파일명 : /js/cmm/pageReadyInit.js
 */

var CommonPageObject = {
	init : function() {},
	
	/*화면내 변수*/
	variable : {},
	
	/*event 이벤트 정의 영역*/
	events : {},
	
	/*event 이벤트 함수 영역*/
	event : {},
	
	/*지역  함수 영역*/
	location : {},
	
	/*거래호출  함수 영역*/
	tran : {},
	
	/*callBack 콜백 정의 영역*/
	callBack : {},
	
	eventBind : function(screenObj){
		let removeToast;
		
		var screenId = screenObj;
		if(typeof screenId == 'string'){
			screenObj = window[screenId];
			// 키패드 초기화
			ComUtil.keyPad.init(screenId);
		}
		
		// 토큰초기화
		gfn_initToken();
		
		// 개발자도구등 잠굼 
		gfn_lock();
		
		// 사용자정보조회
		if(ComUtil.isNull(sStorage.getItem('gUserInfo')) && !ComUtil.isNull(sStorage.getItem('accessToken'))){
			gfn_setUInfoInit();
		}
		
		// 시스템 가능여부 체크 
		gfn_checkSystem(screenId);
		
		// 화면접근방지
		if(gfn_protectPageByStatus(screenId)){
			return false;
		}
		
		// 푸쉬로 화면이동 하면 안되는 화면리스트 등록 및 애드브릭스 이벤트  추가  
		gfn_setProtectPage(screenId);
		
		// 팝업창 닫기 이벤트 바인드.
		var curScreenId = sStorage.getItem("gCurPopupId");
		var curScreenOjb = $('#'+curScreenId);
		if(curScreenOjb.length > 0){	// popup 화면이면
			$(".popup_close", curScreenOjb).on("click", function(e) {
				
			    gfn_closePopup();
			});
			
			sStorage.setItem("gCurPopupId", "");
			screenObj.variable.popupYn = 'Y';
		}
		else{							// 일반화면이면
			// 해더영역 초기화
			screenObj.variable.popupYn = 'N';
			gfn_setHeader(screenObj);
		}
		
		
		
		// 상단위로 가기 버튼 삽입 s
		$('a[id^="btnToTop_"]').hide();
		var gotoTopId = 'btnToTop_'+screenId;
		var gotoTopHtml = '\
		<a href="#" class="to_top" id="'+gotoTopId+'" style="display:none;">\
	        <i class="ico"></i>\
	        <span class="blind">최상단으로 이동</span>\
	    </a>';

		if(curScreenOjb.length > 0){
			curScreenOjb.append(gotoTopHtml);
			$('#'+gotoTopId).data('sid', curScreenId);
			// 팝업 상단이동
            $('.popup_wrap', curScreenOjb).scroll(function(event) {
            //curScreenOjb.scroll(function() {
				event.preventDefault();
				gfn_scrollFunctionPop(screenId, curScreenOjb);
            });
		}
		else{
			$('body').append(gotoTopHtml);
			$(window).scroll(function(event) {
				event.preventDefault();
				gfn_scrollFunction(screenId);
	        });
		}
		// 상단위로 가기 버튼 삽입 e
		

		//gfn_setGotoTop();
		/*
		*/
		
		if ( screenObj.events ){
			var keyList = Object.keys(screenObj.events);
			
			$(keyList).each(function(idx, key){
				var keys = $.trim(key);
				var pos = keys.indexOf(' ');
				var evt = keys.substring(0, pos);
				var selecter = keys.substring(pos+1);
				var func = screenObj.events[keyList[idx]];
				var nameList = func.split('.').slice(1);
				var targetFunc = screenObj;
				nameList.forEach(function(name, idx) {
					targetFunc = targetFunc[name];
				});
				
				//$(document).off(evt, selecter).on(evt, selecter, targetFunc);
				$('body').off(evt, selecter).on(evt, selecter, targetFunc);
				if('click' == evt){
					if(selecter.startsWith('#btn')){
						$(selecter).on(evt, gfn_btnClickEvent);
					}
				}
				else{
				}
				//curScreenOjb.off(evt, selecter).on(evt, selecter, targetFunc);
			});
		}
		
		
		// 스크립트용 특수문자 사용 막기 
		$(document).off("keyup", 'input, textarea').on("keyup",'input, textarea',function(e){
			var value = $(this).val();
			var arr_char = new Array();
		
			//arr_char.push("'");
			arr_char.push("\"");
			arr_char.push("<");
			arr_char.push(">");
				
		
			for(var i=0 ; i<arr_char.length ; i++)
			{
				if(value.indexOf(arr_char[i]) != -1)
				{
					//gfn_alertMsgBox("<, >, \" 특수문자는 사용하실 수 없습니다.");
					gfn_alertMsgBox("<, >, ', \" 특수문자는 사용하실 수 없습니다.");
					
					value = value.substr(0, value.indexOf(arr_char[i]));
					$(this).val(value);
				}
			}
		});
		
		$(document).off("change", 'input, textarea').on("change",'input, textarea',function(e){
			var value = $(this).val();
			var arr_char = new Array();
		
			//arr_char.push("'");
			arr_char.push("\"");
			arr_char.push("<");
			arr_char.push(">");
				
		
			for(var i=0 ; i<arr_char.length ; i++)
			{
				if(value.indexOf(arr_char[i]) != -1)
				{
					//gfn_alertMsgBox("<, >, \" 특수문자는 사용하실 수 없습니다.");
					gfn_alertMsgBox("<, >, ', \" 특수문자는 사용하실 수 없습니다.");
					
					value = value.substr(0, value.indexOf(arr_char[i]));
					$(this).val(value);
				}
			}
		});
		
		
		$("input:text[amtOnly]").on("keyup", function() {
		    $(this).val(ComUtil.number.addCommmas($(this).val().replace(/[^0-9]/g,"")));
		});
		$("input:text[numberOnly]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^0-9]/g,""));
		});
		$("input:text[engOnly]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^a-zA-Z]*$/,""));
		});
		$("input:text[numEng]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^a-zA-Z0-9]*$/,""));
		});
		$("input:text[numEngDot]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^a-zA-Z0-9.]*$/,""));
		});
		$("input:text[email]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^a-zA-Z0-9.@]*$/,""));
		});
		$("input:text[mid]").on("keyup", function() {
		    $(this).val($(this).val().replace(/[^a-zA-Z0-9~!@\#$%<>^&*\()\-=+_\’]*$/,""));
		});
		if(!gfn_isOper()){
			/*$(document).off("click", '.popup_header>h2>span').on("click",'.popup_header>h2>span',function(e){
			    gfn_alertMsgBox(gfn_getScreenId(), '', function(){});
				return;
			});*/
			$(document).off("dblclick", '.popup_header').on("dblclick",'.popup_header',function(e){
			    gfn_alertMsgBox(gfn_getScreenId(), '', function(){});
				return;
			});
			$(document).off("dblclick", '#page_head').on("dblclick",'#page_head',function(e){
			    gfn_alertMsgBox(gfn_getScreenId(), '', function(){});
				return;
			});
		}
		
		$(document).off("keydown", 'input').on("keydown",'input',function(e){
			if(e.keyCode === 13) {
				$(this).blur();
			}
		});
		
		$("#imsiToken").on("blur", function() {
			var token = $(this).val();
			if(token.length != 232){
				gfn_alertMsgBox("올바른 토큰길이가 아닙니다.!!");
				return false;
			}
			else{
				$('#accessToken').val($(this).val());
				$('#refreshToken').val($(this).val());
			}
			
		});
		
		// 임시 토큰 셋팅하는것... 일단 보류 
		/*
		$(document).on("keyup", function(event) {
			//debugger;
			if($('#tokenBar').is(":visible")){
				return false;
			}
			
			if(event.keyCode == '16'){
				$('#imsiToken').val(event.key);
			}
			else{
				var tmp = $('#imsiToken').val() + event.key;
				// shift 키 + control 키 + ''
				if($('#imsiToken').val() + event.key == "ShiftControltoken1234"){
					$('#tokenBar').show();
					var tokenInfo = sStorage.getItem('accessToken');
					$('#imsiToken').val(token);
					$('#accessToken').val(token);
					$('#refreshToken').val(token);
				}
				else{
					$('#imsiToken').val(tmp);
				}
			}
		});
		*/

		
		if(!ComUtil.isNull(Handlebars)){
			
			Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
				
				if(ComUtil.isNull(options)){
					options = v2;
				}
				
	
			    switch (operator) {
			        case '==':
			            return (v1 == v2) ? options.fn(this) : options.inverse(this);
			        case '===':
			            return (v1 === v2) ? options.fn(this) : options.inverse(this);
			        case '!=':
			            return (v1 != v2) ? options.fn(this) : options.inverse(this);
			        case '!==':
			            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
			        case '<':
			            return (v1 < v2) ? options.fn(this) : options.inverse(this);
			        case '<=':
			            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
			        case '>':
			            return (v1 > v2) ? options.fn(this) : options.inverse(this);
			        case '>=':
			            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
			        case '&&':
			            return (v1 && v2) ? options.fn(this) : options.inverse(this);
			        case '||':
			            return (v1 || v2) ? options.fn(this) : options.inverse(this);
			        case 'isNull':
			            return ComUtil.isNull(v1) ? options.fn(this) : options.inverse(this);
			        case 'isNotNull':
			            return !ComUtil.isNull(v1) ? options.fn(this) : options.inverse(this);
			        case 'indexOf':
			            return ComUtil.string.isIndexOf(v1, v2) ? options.fn(this) : options.inverse(this);
			        default:
			            return options.inverse(this);
			    }
			});
		}
	},
	
	clone : function() {
		var me = this;
		return $.extend(true, {}, me);
	}
}