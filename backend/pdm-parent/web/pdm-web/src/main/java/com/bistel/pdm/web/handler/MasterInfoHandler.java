package com.bistel.pdm.web.handler;

import com.bistel.pdm.web.domain.Area;
import com.bistel.pdm.web.mapper.AreaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Component
public class MasterInfoHandler {

    @Autowired
    private AreaMapper areaMapper;

    public Mono<ServerResponse> echo(ServerRequest request) {
        return ServerResponse.ok().body(request.bodyToMono(String.class), String.class);
    }

//    public Mono<ServerResponse> listArea(ServerRequest request) {
//        Flux<Area> areaList = null; //areaMapper.findByName("");
//
//        return ok().contentType(APPLICATION_JSON).body(areaList, Area.class);
//    }
}
