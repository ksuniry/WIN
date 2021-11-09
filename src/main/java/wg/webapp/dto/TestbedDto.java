package wg.webapp.dto;

import lombok.Getter;
import lombok.Setter;
public class TestbedDto {
	
	@Getter @Setter
	/**
	 * Access Token
	 */
	private String accessToken;
	
	@Getter @Setter
	/**
	 * Refresh Token
	 */
	private String refreshToken;
}
