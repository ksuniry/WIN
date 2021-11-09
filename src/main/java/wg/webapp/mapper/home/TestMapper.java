package wg.webapp.mapper.home;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import wg.webapp.util.ValueMap;

@Mapper
public interface TestMapper {

	//==========================================================================
	//
	//  Study Cafe
	//
	//==========================================================================
	
	/**
	 * QnA 리스트 조회
	 * @param params 
	 * @return
	 */
//	List<QnADto> selectMyQnAList(@Param("eid") String eid);
	List<ValueMap> selectMyQnAList(ValueMap paramMap);

	/**
	 * by uUidㅕ
	 * @param params 
	 * @return
	 */
	ValueMap selectMyToken(ValueMap paramMap);
	
	/**
	 * by user name 
	 * @param params 
	 * @return
	 */
	ValueMap selectMyTokenByName(ValueMap paramMap);

	/**
	 * QnA 리스트 개수 조회
	 * @param params StudyCafe DTO
	 * @return
	 */
//	int selectMyQnATotalCount(@Param("eid") String eid);
	
	/**
	 * QnA 등록
	 * @param eid 사용자 EID
	 * @param params QnA 내용
	 */
//	void insertMyQnA(@Param("eid") String eid, @Param("params") InsertQnADto params);
}
