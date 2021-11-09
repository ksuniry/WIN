package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/wait_progress")
public class WaitProgressController {
	
	@RequestMapping(value = "WAITPRO01S01")
    /**
     * 연금대기 메인화면(W-01-01)
     * @return
     */
	public ModelAndView goWAITPRO01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("waitProgress/WAITPRO01S01");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "WAITPRO01S01P01")
	/**
	 * 해지후 입금하기 w-01-01-pop-1
	 * @return
	 */
	public ModelAndView goWAITPRO01S01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO01S01P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "WAITPRO02S01")
	/**
	 * 연금대기  상세보기 화면(W-02-01)
	 * @return
	 */
	public ModelAndView goWAITPRO02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "WAITPRO01P01")
    /**
     * 연금대기 메인화면(W-01-01)
     * @return
     */
	public ModelAndView goWAITPRO01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("waitProgress/WAITPRO01P01");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	
	@RequestMapping(value = "WAITPRO02P01")
	/**
	 * 연금대기  상세보기 화면(W-02-01)
	 * @return
	 */
	public ModelAndView goWAITPRO02P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO02P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	@RequestMapping(value = "WAITPRO02S06")
	/**
	 * 연금대기  상세보기 (신규) 화면(W-02-06)
	 * @return
	 */
	public ModelAndView goWAITPRO02S06(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO02S06");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "WAITPRO02P08")
	/**
	 * 납입한도 조정안내 팝업 화면(W-02-08)
	 * @return
	 */
	public ModelAndView goWAITPRO02P08(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO02P08");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "WAITPRO03S01")
	/**
	 * 월 적립식 투자 현황 화면(W-03-01)
	 * @return
	 */
	public ModelAndView goWAITPRO03S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "WAITPRO04S01")
	/**
	 * 월 적립식 투자 현황 상세 화면(W-03-01)
	 * @return
	 */
	public ModelAndView goWAITPRO04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "WAITPRO03P01")
	/**
	 * 월 적립식 투자 현황 화면(W-03-01)
	 * @return
	 */
	public ModelAndView goWAITPRO03P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO03P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "WAITPRO04P01")
	/**
	 * 월 적립식 투자 현황 상세 화면(W-03-01)
	 * @return
	 */
	public ModelAndView goWAITPRO04P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("waitProgress/WAITPRO04P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
}
