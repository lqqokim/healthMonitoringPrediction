package com.bistel.a3.portal.domain.pdm.enums;

public enum FaultFreqsType {
    shaft(0),
    bearing(2),
    gearWheel(3),
    disc(4),
    belt(5),
//    chainWheel(6),
//    chain(7),
//    connectFixedClutch(8),
//    connectVariableClutch(9),
//    connectRatioExchange(10),
    impeller(11),
    electricalRotor(14),
    electricalStator(15),
//    guideVein(16),
//    screw(17),
//    measPoint(18),
//    stayColumn(19),
//    planetGear(22),
//    sleaveBearing(23),
//    fanWeel(24),
    pumpWeel(25),
//    francisWeel(26),
//    kaplanWeel(27),
//    windTurbinOld(28),
//    planetGearOld(29),
//    connectRatioExchangeOld(30),
    unknown(99);

    private int type;
    FaultFreqsType(int type) {
        this.type = type;
    }

    public int type() {
        return type;
    }
}
