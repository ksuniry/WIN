package wg.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
@RequestMapping(value = "/pension_advice")
public class PensionAdviceController {
	
	@RequestMapping(value = "/dashBoard/DASHBRD01S00")
    /**
     * 연금 메인화면(통합연금포털 미가입시)
     * @return
     */
	public ModelAndView goDASHBRD01S00(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD01S00");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "/dashBoard/DASHBRD01S01")
	/**
	 * 연금 메인화면
	 * @return
	 */
	public ModelAndView goDASHBRD01S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD01S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/dashBoard/DASHBRD01P02")
	/**
	 * 연금 메인화면 >> 동그레미
	 * @return
	 */
	public ModelAndView goDASHBRD01P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD01P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/dashBoard/DASHBRD02S01")
	/**
	 * 내연금
	 * @return
	 */
	public ModelAndView goDASHBRD02S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD02S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD02P02")
	/**
	 * 내연금 상세보기 팝업
	 * @return
	 */
	public ModelAndView goDASHBRD02P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD02P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/dashBoard/DASHBRD02P03")
	/**
	 * 내연금 상세보기 팝업 >> 퇴직연금 상세 팝업
	 * @return
	 */
	public ModelAndView goDASHBRD02P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD02P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD02P04")
	/**
	 * 내연금 상세보기 팝업 >> 퇴직연금 상세 팝업
	 * @return
	 */
	public ModelAndView goDASHBRD02P04(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD02P04");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD03P06")
	/**
	 * 마이머플러플랜 2단계 >> 기대수익률 위함산출기준 팝업
	 * @return
	 */
	public ModelAndView goDASHBRD03P06(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD03P06");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD03P07")
	/**
	 * 마이머플러플랜 3단계 >> 연금자산관리 은퇴주기별 3단계 팝업
	 * @return
	 */
	public ModelAndView goDASHBRD03P07(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD03P07");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD07P02")
	/**
	 * 내연금 상세보기 팝업 >> 머플러 로보어드바이저제안 월평균 예상수령액
	 * @return
	 */
	public ModelAndView goDASHBRD07P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD07P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD08P02")
	/**
	 * 내연금 상세보기 팝업 >> 머플러플랜 자세히 보기
	 * @return
	 */
	public ModelAndView goDASHBRD08P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD08P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}


	@RequestMapping(value = "/dashBoard/DASHBRD08P03")
	/**
	 * 내연금 상세보기 팝업 >> 머플러 연금자산관리 기본정책
	 * @return
	 */
	public ModelAndView goDASHBRD08P03(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD08P03");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/dashBoard/DASHBRD08P07")
	/**
	 * 내연금 상세보기 팝업 >> 마이머플러 자문 설명팝업(1,2,3단계)
	 * @return
	 */
	public ModelAndView goDASHBRD08P07(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/dashBoard/DASHBRD08P07");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	
	@RequestMapping(value = "/invest_propensity/INVPROP03S01")
	/**
	 * 자문계약안내
	 * @return
	 */
	public ModelAndView goINVPROP03S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP03S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}		
	
	@RequestMapping(value = "/invest_propensity/INVPROP04S01")
	/**
	 * 투자성향분석 시작하기 화면 (d-04-01)
	 * @return
	 */
	public ModelAndView goINVPROP04S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP04S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "/invest_propensity/INVPROP04P02")
	/**
	 * 투자자 정보확인 화면 (d-04-02)
	 * @return
	 */
	public ModelAndView goINVPROP04P02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP04P02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}	
	
	@RequestMapping(value = "/invest_propensity/INVPROP05S01")
	/**
	 * 투자성향분석 입력 화면
	 * @return
	 */
	public ModelAndView goINVPROP05S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP05S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/invest_propensity/INVPROP06S01")
	/**
	 * 투자성향분석 결과 화면
	 * @return
	 */
	public ModelAndView goINVPROP06S01(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP06S01");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	@RequestMapping(value = "/invest_propensity/INVPROP06S02")
	/**
	 * 투자성향분석 결과 화면(서비스불가)
	 * @return
	 */
	public ModelAndView goINVPROP06S02(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("pensionAdvice/investPropensity/INVPROP06S02");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
}
