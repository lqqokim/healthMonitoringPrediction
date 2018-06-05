package com.bistel.pdm.app.datagen;

import com.bistel.pdm.app.datagen.context.Context;
import com.bistel.pdm.app.datagen.model.Machine;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.RecursiveAction;

public class InitTask extends RecursiveAction {

    private Context context;
    private boolean async = true;

    public InitTask(Context context) {
        this.context = context;
    }

    @Override
    protected void compute() {
        List<GenerateTask> tasks = new ArrayList<>(context.getMachines().size());

        for(Machine machine : context.getMachines()){
            GenerateTask task = new GenerateTask(context, machine);
            task.setAsync(async);
            tasks.add(task);
        }

        if (async) {
            invokeAll(tasks);
        } else {
            for (GenerateTask forkJoinTask : tasks) {
                forkJoinTask.compute();
            }
        }
        context.getSink().close();
    }

    public boolean isAsync() {
        return async;
    }

    public void setAsync(boolean async) {
        this.async = async;
    }
}
