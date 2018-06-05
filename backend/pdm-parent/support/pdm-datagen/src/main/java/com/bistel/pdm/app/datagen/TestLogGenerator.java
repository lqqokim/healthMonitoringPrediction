package com.bistel.pdm.app.datagen;

import com.bistel.pdm.app.datagen.context.Context;

import java.util.concurrent.ForkJoinPool;

public class TestLogGenerator extends AbstractGenerator {

    private boolean async = false;
    private Integer threadCount = Runtime.getRuntime().availableProcessors();

    @Override
    public void generate(Context context) {
        InitTask task = new InitTask(context);
        task.setAsync(async);
        if (async) {
            ForkJoinPool forkJoinPool = new ForkJoinPool(threadCount);
            forkJoinPool.invoke(task);
        } else {
            task.compute();
        }
    }

    public boolean isAsync() {
        return async;
    }

    public void setAsync(boolean async) {
        this.async = async;
    }

    public void setDataType(String type){
        this.type = type;
    }

    public Integer getThreadCount() {
        return threadCount;
    }

    public void setThreadCount(Integer threadCount) {
        this.threadCount = threadCount;
    }
}
