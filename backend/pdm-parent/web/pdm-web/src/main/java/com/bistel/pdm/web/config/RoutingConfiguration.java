package com.bistel.pdm.web.config;

import com.bistel.pdm.web.handler.MasterInfoHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
@EnableWebFlux
public class RoutingConfiguration implements WebFluxConfigurer {

    @Bean
    public RouterFunction<ServerResponse> monoRouterFunction(MasterInfoHandler masterHandler) {
        return route(POST("/echo").and(accept(APPLICATION_JSON)), masterHandler::echo);
    }

//    @Bean
//    public RouterFunction<ServerResponse> monoRouterFunction(MasterInfoHandler hmpHandler) {
//        return route(GET("/hmp/{fabId}").and(accept(APPLICATION_JSON)), hmpHandler::listArea);
//                //.andRoute(GET("/{user}/customers").and(accept(APPLICATION_JSON)), hmpHandler::getUserCustomers)
//                //.andRoute(DELETE("/{user}").and(accept(APPLICATION_JSON)), hmpHandler::deleteUser);
//    }
}
