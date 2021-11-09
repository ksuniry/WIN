package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/advice_execution")
public class AdviceExecutionController {
	
	@RequestMapping(value = "/advice_contract/ADVCEXC12S01")
    /**
     * 자문계약 화면 (e-12-01)
     * @return
     */
	public ModelAndView goADVCEXC12S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC12S01");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/advice_contract/ADVCEXC13S01")
	/**
	 * 자문계약 완료화면 (e-13-01)
	 * @return
	 */
	public ModelAndView goADVCEXC13S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC13S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC13P02")
	/**
	 * 투자권유문서 팝업 (e-13-02)
	 * @return
	 */
	public ModelAndView goADVCEXC13P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC13P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC13P03")
	/**
	 * 투자자문계약서 팝업 (e-13-03)
	 * @return
	 */
	public ModelAndView goADVCEXC13P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC13P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC13P04")
	/**
	 * 로보어드바이저 유의사항 팝업 (e-13-04)
	 * @return
	 */
	public ModelAndView goADVCEXC13P04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC13P04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC13P05")
	/**
	 * 머플러 위험고지 팝업 (e-13-05)
	 * @return
	 */
	public ModelAndView goADVCEXC13P05(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC13P05");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC14S01")
	/**
	 * 이체대상 계좌번호 입력 (e-14-01)
	 * @return
	 */
	public ModelAndView ADVCEXC14S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC14S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC14S02")
	/**
	 * 이체신청확인 (e-14-02)
	 * @return
	 */
	public ModelAndView ADVCEXC14S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC14S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC14S03")
	/**
	 * 이체대상 계좌번호 확인 완료 (e-14-03)
	 * @return
	 */
	public ModelAndView ADVCEXC14S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC14S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/advice_contract/ADVCEXC14P04")
	/**
	 * 이체신청유의사항 팝업 (e-14-04)
	 * @return
	 */
	public ModelAndView ADVCEXC14P04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("adviceExecution/adviceContract/ADVCEXC14P04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
}
