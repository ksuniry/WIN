package wg.webapp.util;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SystemUtil {
	
	/**
	 * 운영환경 profile 명칭
	 */
	private static final String OPERATION_ENVIRONMENT = "oper";
	/**
	 * 테스트 profile 명칭
	 */
	private static final String TEST_ENVIRONMENT = "test";
	/**
	 * 개발환경 profile 명칭
	 */
	private static final String DEVELOPMENT_ENVIRONMENT = "dev";
	/**
	 * 로컬환경 profile 명칭
	 */
	private static final String LOCAL_ENVIRONMENT = "local";
	
	/**
	 * 환경 정보
	 */
	private static Environment enviroment;
	
	@Autowired
	private Environment env;

	@PostConstruct
	private void initStatic() {
		enviroment = this.env;
	}
	
	/**
	 * 운영환경 여부 반환
	 * @return
	 */
	public static boolean isOperEnv() {
		return hasProfileName(OPERATION_ENVIRONMENT);
	}
	
	/**
	 * 개발환경 여부 반환
	 * @return
	 */
	public static boolean isDevEnv() {
		return hasProfileName(DEVELOPMENT_ENVIRONMENT);
	}
	
	/**
	 * 테스트환경 여부 반환
	 * @return
	 */
	public static boolean isTestEnv() {
		return hasProfileName(TEST_ENVIRONMENT);
	}
	
	/**
	 * 로컬환경 여부 반환
	 * @return
	 */
	public static boolean isLocalEnv() {
		return hasProfileName(LOCAL_ENVIRONMENT);
	}
	
	/**
	 * 로컬환경 여부 반환
	 * @return
	 */
	public static String getOperEnv() {
		String operEnv = "";
		if(isOperEnv()) {
			operEnv = OPERATION_ENVIRONMENT;
		}
		else if(isTestEnv()) {
			operEnv = TEST_ENVIRONMENT;
		}
		else if(isDevEnv()) {
			operEnv = DEVELOPMENT_ENVIRONMENT;
		}
		else {
			operEnv = LOCAL_ENVIRONMENT;
		}
		return operEnv;
	}
	
	/**
	 * Profile 명 가지고 있는지 여부 반환
	 * @param keyword 검색할 profile 명
	 * @return 존재 여부
	 */
	private static boolean hasProfileName(String keyword) {
		String[] activeProfiles = enviroment.getActiveProfiles();
		
		for(int index=0, num=activeProfiles.length; index<num; index++) {
			String profile = activeProfiles[index];
			
			if(profile.contentEquals(keyword)) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * property 반환
	 * @return
	 */
	public static String getProperty(String key) {
		return enviroment.getProperty(key);
	}
	
	/**
	 * 시스템정보 반환
	 * @return
	 */
	public static ValueMap getSystemInfo() {
		ValueMap sysInfo = new ValueMap();
		sysInfo.put("operEnv", getOperEnv());
		if(isLocalEnv()) {
			sysInfo.put("port", getProperty("server.port"));
			sysInfo.put("lip", getProperty("sinfo.lip"));
		}
		else {
			sysInfo.put("port", "");
			sysInfo.put("lip", "");
		}
		
		return sysInfo;
	}
}
