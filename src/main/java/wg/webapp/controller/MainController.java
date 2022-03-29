package wg.webapp.controller;

import java.net.URI;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.util.SystemUtil;

@Controller
public class MainController {
	
	
	
	/**
	 * 테스트 화면 thymeleaf 테스트화면은 ModelAndView에서 /thymeleaf를 붙여야함
	 * @return
	 */
	@RequestMapping(value = "/")
	public ModelAndView goThymeleafIndex(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("thymeleafView/index");
		/*
		mav.addObject("pageType", request.getParameter("pageType"));
		mav.addObject("noticeYn", request.getParameter("noticeYn"));
		mav.addObject("exceptionType", request.getParameter("exceptionType"));
		mav.addObject("serviceId", request.getParameter("service_id"));
		params.setActiveToken(request.getParameter("accessToken"));
		params.setRefreshToken(request.getParameter("refreshToken"));
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		*/
		return mav;
	}
	
	/**
	 * 테스트 화면
	 * @return
	 */
	@RequestMapping(value = "/index")
	public ModelAndView goIndex(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("winIndex");
		/*
		mav.addObject("pageType", request.getParameter("pageType"));
		mav.addObject("noticeYn", request.getParameter("noticeYn"));
		mav.addObject("exceptionType", request.getParameter("exceptionType"));
		mav.addObject("serviceId", request.getParameter("service_id"));
		params.setActiveToken(request.getParameter("accessToken"));
		params.setRefreshToken(request.getParameter("refreshToken"));
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		*/
		return mav;
	}
	
	/**
	@RequestMapping(value = "/oauth/2.0/authorize")
	/**
	 * 설정	C-02-06
	 * @return
	public ResponseEntity goMYINFOM02S061(HttpServletRequest request, @ModelAttribute("params") PensionMngDto params, @RequestParam Map<String, String> paramMap) throws Exception {
		
		System.out.println("x-user-ci :: " + request.getHeader("x-user-ci"));
		System.out.println("x-api-tran-id :: " + request.getHeader("x-api-tran-id"));
		
		String url = "http://localhost:8101/oauth/authorize";
		
		paramMap.put("api_tran_id", request.getHeader("x-api-tran-id"));
		paramMap.put("user_ci", request.getHeader("x-user-ci"));
		HttpSession session = request.getSession();
		session.setAttribute("param", paramMap);
		
//		UriComponentsBuilder uri = UriComponentsBuilder.fromHttpUrl(url);
//		for(String key : paramMap.keySet()) {
//			uri.queryParam(key, paramMap.get(key));
//		}
//		uri.queryParam("api_tran_id", request.getHeader("x-api-tran-id"));
		
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
		httpHeaders.add("x-user-ci", request.getHeader("x-user-ci"));
		httpHeaders.setLocation(new URI("http://localhost:8001/oauth/authorize"));
		//httpHeaders.setLocation(new URI((uri.build()).toString()));
		//return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
		ResponseEntity responseEntity = ResponseEntity.status(HttpStatus.SEE_OTHER).headers(httpHeaders).body(paramMap);
		return responseEntity;
	}	
	*/
}
