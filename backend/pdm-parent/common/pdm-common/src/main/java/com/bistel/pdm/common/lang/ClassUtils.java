package com.bistel.pdm.common.lang;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 *  Class utilility methods.
 *
 */
public final class ClassUtils {
    private static final Class<?>[] NO_TYPES = new Class<?>[0];
    private static final Object[] NO_ARGS = new Object[0];

    private ClassUtils() {}

    public static <T> Class<T> loadClass(String className) {
        try {
            @SuppressWarnings("unchecked")
            Class<T> theClass = (Class<T>) forName(className);
            return theClass;
        } catch (ClassNotFoundException cnfe) {
            throw new IllegalStateException("No valid " + className + " exists", cnfe);
        }
    }

    public static <T> Class<? extends T> loadClass(String className, Class<T> superClass) {
        try {
            return forName(className).asSubclass(superClass);
        } catch (ClassNotFoundException cnfe) {
            throw new IllegalStateException("No valid " + superClass + " binding exists", cnfe);
        }
    }

    private static Class<?> forName(String implClassName) throws ClassNotFoundException {
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        if (cl == null) {
            cl = ClassUtils.class.getClassLoader();
        }
        return Class.forName(implClassName, true, cl);
    }

    public static <T> T loadInstanceOf(Class<T> clazz) {
        return loadInstanceOf(clazz.getName(), clazz);
    }

    public static <T> T loadInstanceOf(String implClassName, Class<T> superClass) {
        return loadInstanceOf(implClassName, superClass, NO_TYPES, NO_ARGS);
    }

    public static <T> T loadInstanceOf(String implClassName,
                                       Class<T> superClass,
                                       Class<?>[] constructorTypes,
                                       Object[] constructorArgs) {
        try {
            Class<? extends T> configClass = loadClass(implClassName, superClass);
            Constructor<? extends T> constructor = configClass.getConstructor(constructorTypes);
            return constructor.newInstance(constructorArgs);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException e) {
            throw new IllegalArgumentException("No valid " + superClass + " binding exists", e);
        } catch (InvocationTargetException ite) {
            throw new IllegalStateException("Could not instantiate " + superClass + " due to exception",
                    ite.getCause());
        }
    }

    public static boolean classExists(String implClassName) {
        try {
            forName(implClassName);
            return true;
        } catch (ClassNotFoundException ignored) {
            return false;
        }
    }
}
