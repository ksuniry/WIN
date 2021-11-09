package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/open_banking")
public class openBankingController {
	
	@RequestMapping(value = "OPENBNK01S01")
    /**
     * 오픈뱅킹 신청화면(OB-01-01)
     * @return
     */
	public ModelAndView goOPENBNK01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("openBanking/OPENBNK01S01");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "OPENBNK02S01")
	/**
	 * 오픈뱅킹 결과 화면(OB-02-01)
	 * @return
	 */
	public ModelAndView goOPENBNK02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("openBanking/OPENBNK02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
}
