package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/pension_execution")
public class PensionExecutionController {
	
	@RequestMapping(value = "/PENSEXE01S01")
    /**
     * 머플러 자문안 ( t-01-01 )
     * @return
     */
	public ModelAndView goPENSEXE01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE01S01");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	
	@RequestMapping(value = "/PENSEXE01P02")
	/**
	 * 자문게좌정보 ( t-01-02 )
	 * @return
	 */
	public ModelAndView goPENSEXE01P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE01P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/PENSEXE02S01")
	/**
	 * 투자설명서 확인 ( t-02-01 )
	 * @return
	 */
	public ModelAndView goPENSEXE02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSEXE02S02")
	/**
	 * 투자설명서 주요내용확인 ( t-02-02 )
	 * @return
	 */
	public ModelAndView goPENSEXE02S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE02S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/PENSEXE03S01")
	/**
	 * 자산배분승인 ( t-03-01 )
	 * @return
	 */
	public ModelAndView goPENSEXE03S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/PENSEXE04S01")
	/**
	 * 실행절차안내 ( t-04-01 )
	 * @return
	 */
	public ModelAndView goPENSEXE04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/PENSEXE05S01")
	/**
	 * 최종승인 ( t-05-01 )
	 * @return
	 */
	public ModelAndView goPENSEXE05S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/PENSEXE05S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/order/ORDREXE01P01")
	/**
	 * 주문내용확인 ( o-01-01 )
	 * @return
	 */
	public ModelAndView goORDREXE01P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/order/ORDREXE01P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/order/ORDREXE01P02")
	/**
	 * 주문안내화면 ( o-01-02 )
	 * @return
	 */
	public ModelAndView goORDREXE01P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/order/ORDREXE01P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/order/ORDREXE02P01")
	/**
	 * 주문완료 ( o-02-01 )
	 * @return
	 */
	public ModelAndView goORDREXE02P01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/order/ORDREXE02P01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/order/ORDREXE03S14")
	/**
	 * 내 주문내역 (c-03-14)
	 * @return
	 */
	public ModelAndView goORDREXE03S14(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/order/ORDREXE03S14");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/order/ORDREXE03S15")
	/**
	 * 주문내용확인2 ( c-03-15 )
	 * @return
	 */
	public ModelAndView goORDREXE03S15(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionExecution/order/ORDREXE03S15");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}

}
