package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/pension_mng")
public class PensionMngController {
	
	@RequestMapping(value = "/PENSION01M00")
    /**
     * 웰컴보드 메인 화면
     * @return
     */
	public ModelAndView goPENSION01M00(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("pensionMng/PENSION01M00");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/PENSION02S01")
	/**
	 * 웰컴보드 > 자산배분    연금수령계획 화면
	 * @return
	 */
	public ModelAndView goPENSION02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION03S01")
	/**
	 * 웰컴보드 > 자산배분 > 계좌 클릭    자문 계좌 상세정보  화면
	 * @return
	 */
	public ModelAndView goPENSION03S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/PENSION04S10")
	/**
	 * 웰컴보드 > 자산배분 > 자문 계좌 상세 > 계좌해지  화면
	 * @return
	 */
	public ModelAndView goPENSION04S10(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION04S10");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION02S02")
	/**
	 * 연근관리 화면
	 * @return
	 */
	public ModelAndView goPENSION02S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION02S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION03S02")
	/**
	 * 연근관리 > 추가저축 서브화면
	 * @return
	 */
	public ModelAndView goPENSION03S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION03S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION03S03")
	/**
	 * 연근관리 > 연금저축한도 서브화면
	 * @return
	 */
	public ModelAndView goPENSION03S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION03S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION03S04")
	/**
	 * 연근관리 > 상품구성변경 서브화면
	 * @return
	 */
	public ModelAndView goPENSION03S04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION03S04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION03S05")
	/**
	 * 연근관리 > 자문이력 서브화면
	 * @return
	 */
	public ModelAndView goPENSION03S05(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION03S05");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION04S01")
	/**
	 * 연근관리 > 자문계좌내 펀드 상세정보 조회화면
	 * @return
	 */
	public ModelAndView goPENSION04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION04S02")
	/**
	 * 연근관리 > 자문내역 상세 
	 * @return
	 */
	public ModelAndView goPENSION04S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION04S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/increase_saving")
    /**
     * 저축증가 화면
     * @return
     */
	public ModelAndView increaseSaving(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/increaseSaving");
		if(params.getPayAmtCd() == null || params.getPayAmtCd() == "") {
			params.setPayAmtCd("1");
		}
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/add_payment")
    /**
     * 추가 납입 화면
     * @return
     */
	public ModelAndView addPayment(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/addPayment");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }

	@RequestMapping(value = "/changeProduct")
    /**
     * 상품 변경 화면
     * @return
     */
	public ModelAndView changeProduct(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/changeProduct");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }

	@RequestMapping(value = "/adviceHistory.do")
    /**
     * 자문 이력 화면
     * @return
     */
	public ModelAndView adviceHistory(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/adviceHistory");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }

	@RequestMapping(value = "/terminateAdvice")
    /**
     * 자문 해지 화면
     * @return
     */
	public ModelAndView terminateAdvice(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/terminateAdvice");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	
	
	@RequestMapping(value = "/PENSION11M01")
    /**
     * 관리 메인 화면 (m-11-01)
     * @return
     */
	public ModelAndView goPENSION11M01(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("pensionMng/PENSION11M01");
				
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
       	mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/PENSION12S01")
	/**
	 * 관리 메인 > 적립액 상세보기
	 * @return
	 */
	public ModelAndView goPENSION12S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION12S02")
	/**
	 * 관리 메인 > 연금수령액 늘리기
	 * @return
	 */
	public ModelAndView goPENSION12S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION12S03")
	/**
	 * 관리 메인 > 포트폴리오 변경하기
	 * @return
	 */
	public ModelAndView goPENSION12S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION12S04")
	/**
	 * 관리 메인 > 내 연금 정보
	 * @return
	 */
	public ModelAndView goPENSION12S04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION12S05")
	/**
	 * 관리 메인 > 내 연금 정보
	 * @return
	 */
	public ModelAndView goPENSION12S05(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S05");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION12S06")
	/**
	 * 관리 메인 > 리밸런싱
	 * @return
	 */
	public ModelAndView goPENSION12S06(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION12S06");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	// test 
	@RequestMapping(value = "/PENSION91M01")
	/**
	 * 관리 메인 화면 (m-11-01)
	 * @return
	 */
	public ModelAndView goPENSION91M01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION91M01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION92S01")
	/**
	 * 관리 메인 > 적립액 상세보기
	 * @return
	 */
	public ModelAndView goPENSION92S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION92S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION92S02")
	/**
	 * 관리 메인 > 연금수령액 늘리기
	 * @return
	 */
	public ModelAndView goPENSION92S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION92S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION92S03")
	/**
	 * 관리 메인 > 포트폴리오 변경하기
	 * @return
	 */
	public ModelAndView goPENSION92S03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION92S03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/PENSION92S04")
	/**
	 * 관리 메인 > 내 연금 정보
	 * @return
	 */
	public ModelAndView goPENSION92S04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionMng/PENSION92S04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	

}
