package com.bistel.pdm.app.datagen;

import com.bistel.pdm.app.datagen.context.Context;
import com.bistel.pdm.app.datagen.model.Machine;
import com.bistel.pdm.app.datagen.output.FileSink;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractGenerator implements Generator {

    protected String type;

    @Override
    public void generate() {
        Context context = buildContext();
        generate(context);
    }

    protected abstract void generate(Context context);


    private Context buildContext() {
        return new Context(createMachine(), new FileSink());
    }

    private List<Machine> createMachine() {
        List<Machine> machines = new ArrayList<>();

        for (int i = 0; i < 1; i++) {
            String area = "area" + i;
            for (int j = 0; j < 4; j++) {
                String eqpName = "eqp" + j;
                String dirPath = "./data/fab/" + area + "/" + eqpName + "/";
                String filePath = dirPath + "sensor.log";
                machines.add(new Machine(area, eqpName, filePath, type));
            }
        }

        return machines;
    }
}
