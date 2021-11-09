package wg.webapp.dto;

import lombok.Getter;
import lombok.Setter;

public class PensionMngDto {
	
	@Getter @Setter
	/**
	 * Active Token
	 */
	private String activeToken;
	
	@Getter @Setter
	private String accessToken;
	
	@Getter @Setter
	/**
	 * Refresh Token
	 */
	private String refreshToken;

	@Getter @Setter
	/**
	 * 저축금액코드 : 추가저축
	 */
	private String payAmtCd;
	
}