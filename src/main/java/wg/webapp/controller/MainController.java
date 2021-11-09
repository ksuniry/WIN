package wg.webapp.controller;

import java.net.URI;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
public class MainController {
	
	@RequestMapping(value = "/")
    /**
     * index 화면
     * @return
     */
    public String indexPage() {
        return "index";
    }
	
	
	
	@RequestMapping(value = "/index")
	/**
	 * 테스트 화면
	 * @return
	 */
	public ModelAndView goIndex(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/index");
		
		mav.addObject("pageType", request.getParameter("pageType"));
		mav.addObject("noticeYn", request.getParameter("noticeYn"));
		mav.addObject("exceptionType", request.getParameter("exceptionType"));
		mav.addObject("serviceId", request.getParameter("service_id"));
		params.setActiveToken(request.getParameter("accessToken"));
		params.setRefreshToken(request.getParameter("refreshToken"));
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/main")
	/**
	 * 테스트 화면
	 * @return
	 */
	public String tilesMain(@ModelAttribute("params") PensionMngDto params) throws Exception {
		
		return "board/qnaMng";
	}
	
	@RequestMapping(value = "/my_info/MYINFOM02S01")
	/**
	 * 내 연금계좌	C-02-01
	 * @return
	 */
	public ModelAndView goMYINFOM02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM02S02")
	/**
	 * 내 자문내역	C-02-02
	 * @return
	 */
	public ModelAndView goMYINFOM02S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM02S03")
	/**
	 * 내정보	C-02-03
	 * @return
	 */
	public ModelAndView goMYINFOM02S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM02S06")
	/**
	 * 설정	C-02-06
	 * @return
	 */
	public ModelAndView goMYINFOM02S06(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S06");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S07")
	/**
	 * 약관 및 이용동의	C-03-07
	 * @return
	 */
	public ModelAndView goMYINFOM03S07(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S07");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}	
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S30")
	/**
	 * 메뉴 > 내 자문 내역 > 마이머플러 자문안 (c-03-30)
	 * @return
	 */
	public ModelAndView goMYINFOM03S30(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S30");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S31")
	/**
	 * 메뉴 > 내정보  > 회원탈퇴안내1 (c-03-31)
	 * @return
	 */
	public ModelAndView goMYINFOM03S31(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S31");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM03S32")
	/**
	 * 메뉴 > 내정보  > 회원탈퇴확인 (c-03-32)
	 * @return
	 */
	public ModelAndView goMYINFOM03S32(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S32");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM03S33")
	/**
	 * 메뉴 > 내정보  > 회원탈퇴안내2 (c-03-33)
	 * @return
	 */
	public ModelAndView goMYINFOM03S33(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S33");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM04P22")
	/**
	 * 메뉴 > 내정보  > 회원탈퇴  > 자문계약해지 (c-04-22)
	 * @return
	 */
	public ModelAndView goMYINFOM04P22(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM04P22");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM05S01")
	/**
	 * 메뉴 > 내정보  > 회원탈퇴확인 (c-05-01)
	 * @return
	 */
	public ModelAndView goMYINFOM05S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM05S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	
	
	
	
	
	
	@RequestMapping(value = "/help_desk/HELPDES02S04")
	/**
	 * 고객센터	C-02-04
	 * @return
	 */
	public ModelAndView goHELPDES02S04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES02S04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/help_desk/HELPDES03S01")
	/**
	 * 고객센터 > 자주묻는질문  	C-03-01
	 * @return
	 */
	public ModelAndView goHELPDES03S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/help_desk/HELPDES03S02")
	/**
	 * 고객센터 > 서비스이용안내  	C-03-02
	 * @return
	 */
	public ModelAndView goHELPDES03S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES03S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/help_desk/HELPDES03S03")
	/**
	 * 고객센터 > 1:1 문의  	C-03-03
	 * @return
	 */
	public ModelAndView goHELPDES03S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES03S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/help_desk/HELPDES03S04")
	/**
	 * 고객센터 > 소비자보호제도안내  	C-03-04
	 * @return
	 */
	public ModelAndView goHELPDES03S04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES03S04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/help_desk/HELPDES02S10")
	/**
	 * 고객센터 > 라이센스  	C-02-10
	 * @return
	 */
	public ModelAndView goHELPDES02S10(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/helpDesk/HELPDES02S10");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/board_mng/BORDFAQ04S01")
	/**
	 * faq 화면
	 * @return
	 */
	public ModelAndView goBORDFAQ04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDFAQ04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/board_mng/BORDFAQ04S02")
	/**
	 * faq 화면
	 * @return
	 */
	public ModelAndView goBORDFAQ04S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDFAQ04S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/board_mng/qna_mng")
    /**
     * qna 화면
     * @return
     */
	public ModelAndView qnaList(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("main/boardMng/qnaMng");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	
	
	
	@RequestMapping(value = "/board_mng/BORDNOT02S05")
	/**
	 * 공지사항	C-02-05
	 * @return
	 */
	public ModelAndView goBORDNOT02S05(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDNOT02S05");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/board_mng/BORDNOT03P05")
	/**
	 * 공지사항 상세		C-03-05
	 * @return
	 */
	public ModelAndView goBORDNOT03P05(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDNOT03P05");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	@RequestMapping(value = "/board_mng/BORDPUS01P01")
	/**
	 * 공지사항 상세		C-03-05
	 * @return
	 */
	public ModelAndView goBORDPUS01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDPUS01P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	

	@RequestMapping(value = "/board_mng/BORDIVS08S01")
	/**
	 * 투자이야기	C-08-01
	 * @return
	 */
	public ModelAndView goBORDIVS08S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDIVS08S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/board_mng/BORDIVS03P11")
	/**
	 * 투자이야기 상세		C-03-11
	 * @return
	 */
	public ModelAndView goBORDIVS03P11(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDIVS03P11");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/board_mng/BORDSCF09S01")
	/**
	 * 스터디카페	C-09-01
	 * @return
	 */
	public ModelAndView goBORDSCF09S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDSCF09S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/board_mng/BORDSCF03P12")
	/**
	 * 스터디카페 상세		C-03-12
	 * @return
	 */
	public ModelAndView goBORDSCF03P12(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/boardMng/BORDSCF03P12");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}

	
	
	
	
	@RequestMapping(value = "/popup/CMMPINN01P01")
	/**
	 * 핀번호 확인 공통팝업	C-03-12
	 * @return
	 */
	public ModelAndView goCMMPINN01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("popup/CMMPINN01P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/popup/CMMGITP02P01")
	/**
	 * 깃플상탐 공통팝업	
	 * @return
	 */
	public ModelAndView goCMMGITP02P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("popup/CMMGITP02P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/popup/CMMEVNT03P01")
	/**
	 * 공지사항 이벤트 공통팝업	
	 * @return
	 */
	public ModelAndView goCMMEVNT03P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("popup/CMMEVNT03P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/popup/CMMPWDK09P02")
	/**
	 * 핀번호 확인 공통팝업	E-09-02
	 * @return
	 */
	public ModelAndView goCMMPWDK09P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("popup/CMMPWDK09P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/popup/CMMSYSE01P01")
	/**
	 * 시스템 강제 종료 팝업	a-01-01
	 * @return
	 */
	public ModelAndView goCMMSYSE01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("popup/CMMSYSE01P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/my_info/MYINFOM02S07")
	/**
	 * 연금데이터 관리	C-02-07
	 * @return
	 */
	public ModelAndView goMYINFOM02S07(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S07");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S20")
	/**
	 * 연금포털 연결하기 로그인 화면	C-03-20
	 * @return
	 */
	public ModelAndView goMYINFOM03S20(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S20");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S21")
	/**
	 * 연금포털 가입하기 화면	C-03-21
	 * @return
	 */
	public ModelAndView goMYINFOM03S21(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S21");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S22")
	/**
	 * 연금포털 가입하기 화면2	C-03-22
	 * @return
	 */
	public ModelAndView goMYINFOM03S22(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S22");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM03S23")
	/**
	 * 통합포털회원가입 약관동의​	 C-03-23
	 * @return
	 */
	public ModelAndView goMYINFOM03S23(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S23");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/my_info/MYINFOM03S24")
	/**
	 * 통합포털회원가입 입력​ C-03-24
	 * @return
	 */
	public ModelAndView goMYINFOM03S24(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S24");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/my_info/MYINFOM03S25")
	/**
	 * 통합포털회원가입 입력​ C-03-25
	 * @return
	 */
	public ModelAndView goMYINFOM03S25(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM03S25");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	//@RequestMapping(value = "/oauth/2.0/authorize")
	/**
	 * 설정	C-02-06
	 * @return
	 */
	public ResponseEntity goMYINFOM02S061(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params, @RequestParam Map<String, String> paramMap) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S06");
		
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setLocation(new URI("http://localhost:8001/my_info/MYINFOM02S06"));
		return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
	}
	/*
	public ModelAndView goMYINFOM02S061(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params, @RequestParam Map<String, String> paramMap) throws Exception {
		ModelAndView mav = new ModelAndView("main/myInfo/MYINFOM02S06");
		
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	 */
}
