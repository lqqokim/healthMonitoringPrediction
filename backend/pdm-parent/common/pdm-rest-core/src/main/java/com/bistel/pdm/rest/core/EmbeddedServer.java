package com.bistel.pdm.rest.core;

import io.undertow.Undertow;
import io.undertow.servlet.Servlets;
import io.undertow.servlet.api.DeploymentInfo;
import org.jboss.resteasy.cdi.CdiInjectorFactory;
import org.jboss.resteasy.plugins.server.undertow.UndertowJaxrsServer;
import org.jboss.resteasy.spi.ResteasyDeployment;
import org.jboss.weld.environment.servlet.Listener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.ws.rs.core.Application;

/**
 *  undertow rest server
 *
 */
public class EmbeddedServer {
    private static final Logger log = LoggerFactory.getLogger(EmbeddedServer.class);

    private boolean serverRunning = false;
    private UndertowJaxrsServer undertowJaxrsServer;

    private String contextPath = "/app";
    private String deploymentName = "app";
    private String appPath = "/api";
    private Class<? extends Application> resourcesClass;

    public EmbeddedServer(final String host, final Integer port) {
        Undertow.Builder serverBuilder = Undertow.builder().addHttpListener(port, host);
        this.undertowJaxrsServer = new UndertowJaxrsServer().start(serverBuilder);
        serverRunning = true;
    }

    public EmbeddedServer contextPath(final String contextPath) {
        this.contextPath = contextPath;
        return this;
    }

    public EmbeddedServer deploymentName(final String deploymentName) {
        this.deploymentName = deploymentName;
        return this;
    }

    public EmbeddedServer appPath(final String appPath) {
        this.appPath = appPath;
        return this;
    }

    public EmbeddedServer resourcesClass(final Class<? extends Application> resourcesClass) {
        this.resourcesClass = resourcesClass;
        return this;
    }

    private DeploymentInfo deployApplication() {
        final ResteasyDeployment deployment = new ResteasyDeployment();
        deployment.setInjectorFactoryClass(CdiInjectorFactory.class.getName());
        deployment.setApplicationClass(resourcesClass.getName());
        return this.undertowJaxrsServer.undertowDeployment(deployment, appPath);
    }

    public void start() throws ServletException {
        final DeploymentInfo deploymentInfo = deployApplication()
                .setClassLoader(EmbeddedServer.class.getClassLoader())
                .setContextPath(contextPath)
                .setDeploymentName(deploymentName)
                .addListeners(Servlets.listener(Listener.class));

        this.undertowJaxrsServer.deploy(deploymentInfo);
    }

    public void shutdown() {
        if (!serverRunning) {
            return;
        }

        if (undertowJaxrsServer != null) {
            undertowJaxrsServer.stop();
            log.info("PdM rest-server shutdown complete.");
        }

        serverRunning = false;
    }
}
