package wg.webapp.controller;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.mapper.home.TestMapper;
import wg.webapp.util.SystemUtil;

@RestController
public class CallbackController {
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private TestMapper testMapper;
	
	
	
	@RequestMapping(value = "/oauth/2.0/authorize")
	/**
	 * 설정	C-02-06
	 * @return
	 */
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
	
	@RequestMapping(value = "/oauth/authorize")
	/**
	 * 설정	C-02-06
	 * @return
	 */
	public ModelAndView goMYINFOM02S06(HttpServletRequest request, @RequestParam  Map<String, String> params) throws Exception {
		ModelAndView mav = new ModelAndView("template/authorize");
		
		HttpSession session = request.getSession();
		Map<String, String> aaa = (Map<String, String>)session.getAttribute("param");
		
		System.out.println("x-user-ci :: " + request.getHeader("x-user-ci"));
		System.out.println("x-api-tran-id :: " + request.getHeader("x-api-tran-id"));
		
		aaa.put("accessToken", "11");
		aaa.put("refreshToken", "11");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", aaa);
		
		return mav;
	}
	
	@RequestMapping(value = "/callback/oauth/2.0/authorize")
    /**
     * 테스트 화면
     * @return
     */
	public ModelAndView callbackAuthorize(HttpServletRequest request, @RequestParam Map<String, String> paramMap) throws Exception {
		
		ModelAndView mav = new ModelAndView("template/authorize");
		
		paramMap.put("accessToken", "11");
		paramMap.put("refreshToken", "11");
		//paramMap.put("user_ci", "66940qr4/MJpwGlJ12i97ac38/UF+Db44VdKVHmlQ/6YxKqzwJl1Oe9rZfKJkB7ZErDQtAOjdXyxVwiszUrHMg==");
		
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", paramMap);
		
		return mav;
    }

}
