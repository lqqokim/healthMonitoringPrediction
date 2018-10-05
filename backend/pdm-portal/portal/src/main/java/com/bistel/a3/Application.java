package com.bistel.a3;

import com.bistel.a3.portal.service.impl.AcubedUserDetailsService;
import org.glassfish.jersey.client.ClientConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.velocity.VelocityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * Created by yohan on 9/11/15.
 */
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class, VelocityAutoConfiguration.class})
@ImportResource("classpath:/META-INF/spring/container-config.xml")
@EnableAsync
//@ComponentScan("com.bistel.a3.portal.cors")
public class Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private static final String RESOURCE_ID = "acubed-portal";

    @Configuration
    @EnableResourceServer
    protected static class ResourceServer extends ResourceServerConfigurerAdapter {
        @Override
        public void configure(HttpSecurity http) throws Exception {
            http.headers().frameOptions().sameOrigin();
            http.authorizeRequests().
            		antMatchers("/service/socket/**").permitAll().
            		antMatchers("/service/notificationmessages/**").permitAll().
                    antMatchers("/service/datagenerator/**").permitAll().
                    antMatchers("/service/**").authenticated().
                    antMatchers("/console/**").permitAll().
                    antMatchers("/**").permitAll();
        }

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
            resources.resourceId(RESOURCE_ID);
        }
    }

    @Configuration
    @EnableAuthorizationServer
    protected static class OAuth2Config extends AuthorizationServerConfigurerAdapter {
        @Autowired
        private AuthenticationManager authenticationManager;

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.authenticationManager(authenticationManager);
        }

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients.inMemory().
                    withClient("acubed-trusted-frontend").authorizedGrantTypes("password").
                    scopes("read", "write").resourceIds(RESOURCE_ID).
                    accessTokenValiditySeconds(3600 * 24).secret("bistel01");
        }
    }

    @Configuration
    @EnableWebMvcSecurity
    protected static class SecurityConfig extends WebSecurityConfigurerAdapter {
        private UserDetailsService userDetailsService;

        @Bean
        public UserDetailsService userDetailsService() {
            return new AcubedUserDetailsService();
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.userDetailsService(userDetailsService());
        }

        @Bean
        @Override
        public AuthenticationManager authenticationManagerBean() throws Exception {
            return super.authenticationManagerBean();
        }
    }

    @Configuration
    protected static class PortalConfig {
        private static Logger logger = LoggerFactory.getLogger(PortalConfig.class);

        @Bean
        public ServletRegistrationBean portalServlet() {
            XmlWebApplicationContext applicationContext = new XmlWebApplicationContext();
            applicationContext.setConfigLocation("classpath:/META-INF/spring/portal-config.xml");
            ServletRegistrationBean bean = new ServletRegistrationBean(new DispatcherServlet(applicationContext), "/service/*");
            bean.setName("portal");
            bean.setLoadOnStartup(1);
            logger.info("Intialized portal.");
            return bean;
        }

        @Bean
        public ClientConfig clientConfig() {
            ClientConfig clientConfig = new org.glassfish.jersey.client.ClientConfig();
            return clientConfig;
        }
    }
}
