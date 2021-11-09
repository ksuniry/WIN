package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/board_mng_old")
public class BoardMngController {
	
	@RequestMapping(value = "/qna_mng")
    /**
     * qna 화면
     * @return
     */
	public ModelAndView qnaList(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("boardMng/qnaMng");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/BOARDMN01S01")
	/**
	 * faq 화면
	 * @return
	 */
	public ModelAndView goBOARDMN01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("boardMng/BOARDMN01S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/BOARDMN01S02")
	/**
	 * faq 화면
	 * @return
	 */
	public ModelAndView goBOARDMN01S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("boardMng/BOARDMN01S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}

}
