package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/untact_open")
public class UntactOpenController {
	
	
	
	@RequestMapping(value = "/UNTOPEN01S01")
    /**
     * 비대면계좌개설 초기화면 ( e-01-01 )
     * @return
     */
	public ModelAndView goUNTOPEN01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN01S01");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	
	@RequestMapping(value = "/UNTOPEN02S01")
	/**
	 * 비대면계좌개설 두번째 ( e-02-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN02P03")
	/**
	 * 비대면계좌개설 오류팝업 (기계좌 존재시) ( e-02-03 )
	 * @return
	 */
	public ModelAndView goUNTOPEN02P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN02P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN02P04")
	/**
	 * 비대면계좌개설 오류팝업 (영업시간 오버) ( e-02-04 )
	 * @return
	 */
	public ModelAndView goUNTOPEN02P04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN02P04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN02P06")
	/**
	 * KB 투자성향분석 안내팝업 ( e-02-06 )
	 * @return
	 */
	public ModelAndView goUNTOPEN02P06(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN02P06");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN02P07")
	/**
	 * KB 투자성향분석  ( e-02-07 )
	 * @return
	 */
	public ModelAndView goUNTOPEN02P07(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN02P07");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN03S01")
	/**
	 * 비대면계좌개설 주민번호입력 ( e-03-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN043S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN04S01")
	/**
	 * 비대면계좌개설 신분증찰영 ( e-04-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN05S01")
	/**
	 * 비대면계좌개설 가입자격선택 ( e-05-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN05S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN05S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN06S01")
	/**
	 * 비대면계좌개설 이메일/주소입력 ( e-06-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN06S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN06S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN06P02")
	/**
	 * 비대면계좌개설 이메일/주소검색 ( e-06-02 )
	 * @return
	 */
	public ModelAndView goUNTOPEN06P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN06P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN07S01")
	/**
	 * 비대면계좌개설 계좌별한도입력( e-07-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN07S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN07S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/UNTOPEN07P02")
	/**
	 * 비대면계좌개설 오류팝업 (납입한도 미달) ( e-07-02 )
	 * @return
	 */
	public ModelAndView goUNTOPEN07P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN07P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/UNTOPEN07P03")
	/**
	 * 비대면계좌개설 오류팝업 (납입한도 초과) ( e-07-03 )
	 * @return
	 */
	public ModelAndView goUNTOPEN07P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN07P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "UNTOPEN07P04")
	/**
	 * 납입한도 안내 팝업 (e-07-04)
	 * @return 
	 */
	public ModelAndView goUNTOPEN07P04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN07P04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	
	
	@RequestMapping(value = "/UNTOPEN09S01")
	/**
	 * 비밀번호 입력 ( e-09-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN09S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN09S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/UNTOPEN10S01")
	/**
	 * 계좌번호 입력(1월송금) ( e-10-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN10S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN10S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/UNTOPEN10S02")
	/**
	 * 1원입금 입금자 확인 ( e-10-02 )
	 * @return
	 */
	public ModelAndView goUNTOPEN10S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN10S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/UNTOPEN10P03")
	/**
	 * 1원입금 오류안내 팝업 ( e-10-03 )
	 * @return
	 */
	public ModelAndView goUNTOPEN10P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN10P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "/UNTOPEN11S01")
	/**
	 * 개설완료안내 ( e-11-01 )
	 * @return
	 */
	public ModelAndView goUNTOPEN11S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("untactOpen/UNTOPEN11S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	

}
