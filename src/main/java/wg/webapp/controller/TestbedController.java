package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.dto.TestbedDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/admin")
public class TestbedController {
	
	@RequestMapping(value = "/testbed")
	/**
	 * 테스트베드 페이지
	 * @return
	 */
	public ModelAndView testbed(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("admin/testbed");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}

	
	@RequestMapping(value="/test")
	/**
	 * iFrame 페이지 테스트용
	 * @param testbed list 이름,accessToken,refreshToken이 담긴 DTO
	 * @return
	 * @throws Exception
	 */
    public ModelAndView test(TestbedDto testbed) throws Exception{
        ModelAndView mav = new ModelAndView("admin/testbedView");
        
        mav.addObject("testbed", testbed);
        
        return mav;
    }
}
