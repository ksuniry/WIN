package wg.webapp.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jmx.support.RegistrationPolicy;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import wg.webapp.util.ValueMap;

@Configuration
@MapperScan(value="wg.webapp.mapper.home", sqlSessionFactoryRef="homeSqlSesseionFactory")
@PropertySource("classpath:/application.yml")
@EnableTransactionManagement
@EnableMBeanExport(registration=RegistrationPolicy.IGNORE_EXISTING)
public class HomeDatabaseConfiguration {
	@Autowired
	private ApplicationContext applicationContext;
	
	/**
	 * home 테이블 설정
	 */
	@Bean
	@ConfigurationProperties(prefix="spring.home.datasource")
	public DataSource homeDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	public SqlSessionFactory homeSqlSesseionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setVfs(SpringBootVFS.class);
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:/mapper/home/sql-*.xml"));
		sqlSessionFactoryBean.setConfiguration(homeMybatisConfig());
		sqlSessionFactoryBean.setTypeHandlersPackage("wg.home.typeHandler");
		sqlSessionFactoryBean.setTypeAliases(new Class<?>[] {ValueMap.class});
		return sqlSessionFactoryBean.getObject();
	}

	@Bean
	public SqlSessionTemplate homeSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
		SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactory);
		return template;
	}

	@Bean
	public PlatformTransactionManager homeTransactionManager() throws Exception {
		return new DataSourceTransactionManager(homeDataSource());
	}

	@Bean
	@ConfigurationProperties(prefix="mybatis.home.configuration")
	public org.apache.ibatis.session.Configuration homeMybatisConfig() {
		return new org.apache.ibatis.session.Configuration();
	}

}
