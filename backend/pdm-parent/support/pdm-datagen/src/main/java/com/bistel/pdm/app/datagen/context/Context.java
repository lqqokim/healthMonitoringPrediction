package com.bistel.pdm.app.datagen.context;

import com.bistel.pdm.app.datagen.model.Machine;
import com.bistel.pdm.app.datagen.output.Sink;

import java.util.List;

public class Context {

    private Sink sink;
    private List<Machine> machines;

    public Context(List<Machine> machines, Sink sink) {
        this.machines = machines;
        this.sink = sink;
    }

    public Sink getSink() {
        return sink;
    }

    public List<Machine> getMachines() {
        return machines;
    }
}
