package com.bistel.a3.portal.domain.pdm.enums;

public enum ParamType {
    Velocity("Velocity"),
    Acceleration("Acceleration"),
    Enveloping("Enveloping");

    private final String name;

    private ParamType(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        // (otherName == null) check is not needed because name.equals(null) returns false
        return name.equals(otherName);
    }

    public String toString() {
        return this.name;
    }
}
