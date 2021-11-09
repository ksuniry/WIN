package wg.webapp.response;

//@ApiModel(value="CommonResDto", description = "결과값")
//@Getter @Setter
//@AllArgsConstructor
//@NoArgsConstructor
public class CommonResponse {
	
	/**
	 * 성공 결과값
	 */
	public final static String SUCCESS = "ok";
	/**
	 * 에러 결과값
	 */
	public final static String ERROR = "error";
	/**
	 * 실패 결과값
	 */
	public final static String FAIL = "fail";
	
//	@ApiModelProperty(value="결과", required = true, example = "ok")
//	@JsonProperty("result")
//	private String result;
//	
//	@ApiModelProperty(value="메시지", required = true, example = "완료되었습니다.")
//	@JsonProperty("message")
//	private String message;
}
