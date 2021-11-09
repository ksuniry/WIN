package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/wait_progress")
public class WaitProgressController2 {
	
	@RequestMapping(value = "WAITPRO11S01")
    /**
     * 자문대기 대시보드 (W-01-01)
     * @return
     */
	public ModelAndView goUNTOPEN01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("waitProgress/WAITPRO11S01");
		
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "WAITPRO12S01")
    /**
     * 자문대기 계좌상세 (W-02-01)
     * @return
     */
	public ModelAndView goUNTOPEN12S06(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("waitProgress/WAITPRO12S01");
					
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	
	@RequestMapping(value = "WAITPRO12S06")
    /**
     * 자문대기 계좌상세 자문취소 (W-02-06)
     * @return
     */
	public ModelAndView goUNTOPEN12S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("waitProgress/WAITPRO12S06");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
}
