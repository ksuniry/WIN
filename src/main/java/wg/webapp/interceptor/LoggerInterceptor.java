package wg.webapp.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import wg.webapp.util.SystemUtil;

public class LoggerInterceptor extends HandlerInterceptorAdapter {

	Logger log = LoggerFactory.getLogger(this.getClass());

	/**
	 * 컨트롤러(즉 RequestMapping이 선언된 메서드 진입) 실행 직전에 동작.
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		log.debug("=======================  Request Start  =========================");
		log.debug("Request URI \t: " + request.getRequestURI());
		return super.preHandle(request, response, handler);
	}

	/**
	 * 컨트롤러 진입 후 view가 랜더링 되기 전 수행이 됩니다.
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		
		modelAndView.addObject("operEnv", SystemUtil.getOperEnv());
		
		log.debug("=======================  Request End  =========================");
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
	}

}
