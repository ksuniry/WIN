package wg.webapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import wg.webapp.interceptor.LoggerInterceptor;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter{

	@Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggerInterceptor())
                .addPathPatterns("/**/*.ppe");
    }
}