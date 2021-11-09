package wg.webapp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;

import wg.webapp.dto.PensionMngDto;
import wg.webapp.mapper.home.TestMapper;
import wg.webapp.util.CommonUtils;
import wg.webapp.util.EAIUtil;
import wg.webapp.util.SystemUtil;
import wg.webapp.util.ValueMap;

@Controller
@RequestMapping(value = "/template")
public class TemplateController {
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private TestMapper testMapper;
	
	
	@RequestMapping(value = "template")
    /**
     * 테스트 화면
     * @return
     */
	public ModelAndView template(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("template/template");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }
	
	@RequestMapping(value = "template2")
	/**
	 * 테스트 화면
	 * @return
	 */
	public ModelAndView template2(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("template/template2");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	@RequestMapping(value = "templatePop")
	/**
	 * 테스트 화면
	 * @return
	 */
	public ModelAndView template_pop(@ModelAttribute("params") PensionMngDto params) throws Exception {
		ModelAndView mav = new ModelAndView("template/template_pop");
		
		mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
		return mav;
	}
	
	
	
	
	@RequestMapping(value = "select_map")
	/**
	 * 테스트 화면
	 * @return
	 */
	public String selectMap(HttpServletRequest request, HttpServletResponse response, @RequestHeader(value="Authorization") String token) throws Exception {
		boolean success = true;
    	ValueMap result = new ValueMap();
    	
    	ValueMap paramMap = new ValueMap();
    	paramMap.put("eid", token);
    	
    	List<ValueMap> ds_result = testMapper.selectMyQnAList(paramMap);
    	
//    	ValueMap ds_result = new ValueMap();
    	
//    	ds_result.put("a", 1);
//    	ds_result.put("b", 2);
//    	ds_result.put("c", 3);
		
    	result.put("success", success);
    	result.put("ds_result", ds_result);
    	response.setContentType("text/xml;charset=UTF-8");
    	response.getWriter().println(objectMapper.writeValueAsString(result));
		
		return null;
	}
	
	@RequestMapping(value = "selectAddress")
	/**
	 * 테스트 화면
	 * @return
	 */
	public String selectAddress(HttpServletRequest request, HttpServletResponse response, @RequestHeader(value="Authorization") String token) throws Exception {
		boolean success = true;
		ValueMap result = new ValueMap();
		
		//HashMap<String, Object> ds_address = new HashMap<String, Object>();
		List<ValueMap> ds_address = new ArrayList<ValueMap>();
		
		StringBuffer sb = new StringBuffer();
		sb.append("[       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106550000019635\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"100000047\",         \"bldngNm\": \"구룡초등학교\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06305\",         \"bldngHdNo\": \"263\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"655\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019990\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656\",         \"aptDngExtnt\": \"                    \"       }] ");
		
		ds_address = objectMapper.readValue(sb.toString(), ArrayList.class);
		
		result.put("success", success);
		result.put("ds_address", ds_address);
		response.setContentType("text/xml;charset=UTF-8");
		response.getWriter().println(objectMapper.writeValueAsString(result));
		
		return null;
	}
	
	
	@RequestMapping(value = "selectJunmun")
	/**
	 * 테스트 화면
	 * @return
	 */
	public String selectJunmun(HttpServletRequest request, HttpServletResponse response, @RequestHeader(value="Authorization") String token) throws Exception {
		boolean success = true;
		ValueMap result = new ValueMap();
		
		//HashMap<String, Object> ds_address = new HashMap<String, Object>();
		ValueMap ds_eai = new ValueMap();
		
		StringBuffer sb = new StringBuffer();
		sb.append("{   \"dataHeader\": {     \"category\": \"API\",     \"resultCode\": \"200\",     \"resultMessage\": \"정상\",     \"processFlag\": \"A\",     \"processCode\": \"0000\",     \"processMessage\": \"\",     \"processTime\": 250,     \"successCode\": \"0\"   },   \"dataBody\": {     \"tlDataLngth\": \"009680\",     \"rqsPg\": \"1\",     \"rspnsCnt\": \"0020\",     \"prprtData\": \"                  \",     \"rcrdCnF\": \"Y\",     \"rspnsCd\": \"2\",     \"tlCnt\": \"1000\",     \"inptData\": \"서울시 강남구\",     \"Record1\": [       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106550000019635\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"100000047\",         \"bldngNm\": \"구룡초등학교\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06305\",         \"bldngHdNo\": \"263\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"655\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019990\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019959\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"개포래미안포레스트\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656\",         \"aptDngExtnt\": \"101동~130동\"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019957\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656-1\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019957\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"656-2\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019957\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"657\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019957\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"658\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106560000019957\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"107698230\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06310\",         \"bldngHdNo\": \"264\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026400000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"658-2\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"602\",         \"bldngMngCd\": \"1168010300106550004019666\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"602\",         \"pstSq\": \"100000046\",         \"bldngNm\": \"개포동메디시스빌딩\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06305\",         \"bldngHdNo\": \"265\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100026500000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"655-4\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300106530000019607\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000012\",         \"bldngNm\": \"현대1차아파트\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06320\",         \"bldngHdNo\": \"303\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100030300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"653\",         \"aptDngExtnt\": \"101동~106동\"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300106520000019397\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000010\",         \"bldngNm\": \"우성3차아파트\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06319\",         \"bldngHdNo\": \"307\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100030700000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"652\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300106510001019239\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000090\",         \"bldngNm\": \"우성9차아파트\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06318\",         \"bldngHdNo\": \"311\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100031100000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"651-1\",         \"aptDngExtnt\": \"901동~902동\"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101740000019173\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000024\",         \"bldngNm\": \"개일초등학교\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"401\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100040100000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"174\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101730000019211\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000023\",         \"bldngNm\": \"개포고등학교\",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06324\",         \"bldngHdNo\": \"402\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100040200000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"173\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750004021095\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"106379514\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"175\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750003021083\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000017\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010110040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"지하\",         \"bnj\": \"175-3\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750004021095\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"106379514\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010100040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"    \",         \"bnj\": \"175-4\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750003021083\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000017\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010110040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"지하\",         \"bnj\": \"175-5\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750003021083\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000017\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010110040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"지하\",         \"bnj\": \"176-4\",         \"aptDngExtnt\": \"                    \"       },       {         \"siGunGu\": \"강남구\",         \"ldNm\": \"개포로\",         \"addrPstSq\": \"601\",         \"bldngMngCd\": \"1168010300101750003021083\",         \"addrMppngSq\": \"001\",         \"ldNmCd\": \"116803122001\",         \"bldngSbNo\": \"0\",         \"ldNmMppngSq\": \"601\",         \"pstSq\": \"100000017\",         \"bldngNm\": \"                                        \",         \"lglDngCd\": \"1168010300\",         \"nwPstNo\": \"06323\",         \"bldngHdNo\": \"403\",         \"eupMyeonDong\": \"개포동\",         \"sido\": \"서울\",         \"cmbntnBldngMngCd\": \"1168031220010110040300000\",         \"ri\": \"                    \",         \"eupMyeonSq\": \"01\",         \"nwAddr\": \"서울 강남구 개포로\",         \"addr\": \"서울 강남구 개포동\",         \"eupMyeon\": \"                    \",         \"undrgrndF\": \"지하\",         \"bnj\": \"176-5\",         \"aptDngExtnt\": \"                    \"       }     ]   } }");
		
		//ds_eai = objectMapper.readValue(sb.toString(), new TypeReference<ValueMap>(){});
		ds_eai = EAIUtil.convertValueMapOfString(sb.toString());
		ValueMap ds_dataBody = new ValueMap();
		//ds_dataBody = objectMapper.readValue(objectMapper.writeValueAsString(ds_eai.get("dataBody")), new TypeReference<ValueMap>(){});
		ds_dataBody = EAIUtil.getValueMapOfEaiObject("dataBody", ds_eai);
		
		result.put("success", success);
		result.put("ds_eai", ds_eai);
		result.put("ds_address", ds_dataBody.get("Record1"));
		response.setContentType("text/xml;charset=UTF-8");
		response.getWriter().println(objectMapper.writeValueAsString(result));
		
		return null;
	}
	
	@RequestMapping(value = "selectToken")
	/**
	 * 테스트 화면
	 * @return
	 */
	//public String selectToken(HttpServletRequest request, HttpServletResponse response, @RequestHeader(value="Authorization") String token) throws Exception {
	public String selectToken(@RequestBody ValueMap paramMap, HttpServletResponse response, @RequestHeader(value="Authorization") String token) throws Exception {
		boolean success = true;
    	ValueMap result = new ValueMap();
    	
    	//ValueMap paramMap =  CommonUtils.getRequestMap(request);
    	//ValueMap ds_detail = testMapper.selectMyToken(paramMap);
    	ValueMap ds_detail = testMapper.selectMyTokenByName(paramMap);
		
    	result.put("success", success);
    	result.put("ds_detail", ds_detail);
    	response.setContentType("text/xml;charset=UTF-8");
    	response.getWriter().println(objectMapper.writeValueAsString(result));
		
		return null;
	}
	
	
	@RequestMapping(value = "testMain")
    /**
     * 테스트 화면
     * @return
     */
	public ModelAndView testMain(@ModelAttribute("params") PensionMngDto params) throws Exception {
       	ModelAndView mav = new ModelAndView("template/testMain");
       	
       	mav.addObject("sysInfo", SystemUtil.getSystemInfo());
		mav.addObject("params", params);
		
        return mav;
    }

}
