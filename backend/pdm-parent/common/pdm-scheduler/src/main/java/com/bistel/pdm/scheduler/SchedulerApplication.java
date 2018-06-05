package com.bistel.pdm.scheduler;

import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.ext.Provider;
import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 *  The single JAX-RS app for the scheduler.
 *
 */
@ApplicationPath("")
public class SchedulerApplication extends Application {
    private static final Logger log = LoggerFactory.getLogger(SchedulerApplication.class);

    private Set<Class<?>> classes;

    @Override
    public Set<Class<?>> getClasses() {
        if (classes == null) {
            classes = doGetClasses();
        }
        return classes;
    }

    private Set<Class<?>> doGetClasses() {
        String packages = "com.bistel.pdm.scheduler.service";

        log.info("Creating JAX-RS from endpoints in package(s) {}", packages);
        Objects.requireNonNull(packages);

        Set<Class<?>> classes = new HashSet<>();
        for (String thePackage : packages.split(",")) {
            Reflections reflections = new Reflections(thePackage);

            classes.addAll(getClassesInPackageAnnotatedBy(thePackage, reflections, Path.class));
            classes.addAll(getClassesInPackageAnnotatedBy(thePackage, reflections, Produces.class));
            classes.addAll(getClassesInPackageAnnotatedBy(thePackage, reflections, Provider.class));
        }

        log.debug("Found JAX-RS resources: {}", classes);
        return classes;
    }

    private static Collection<Class<?>> getClassesInPackageAnnotatedBy(
            String thePackage,
            Reflections reflections,
            Class<? extends Annotation> annotation) {

        // Filter classes actually in subpackages
        return reflections.getTypesAnnotatedWith(annotation).stream().
                filter(c -> c.getPackage().getName().equals(thePackage)).
                collect(Collectors.toList());
    }
}
