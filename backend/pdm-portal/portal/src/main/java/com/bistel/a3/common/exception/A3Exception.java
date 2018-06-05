package com.bistel.a3.common.exception;

public class A3Exception extends RuntimeException {
    private static final long serialVersionUID = 1887998872401179797L;
    
    public A3Exception() {
        super();
    }
    
    public A3Exception(String errorMessage) {
        super(errorMessage);
    }
    
    public A3Exception(String errorMessage, Throwable th) {
        super(errorMessage, th);
    }

    public A3Exception(Throwable cause){
        super(cause);
    }
}