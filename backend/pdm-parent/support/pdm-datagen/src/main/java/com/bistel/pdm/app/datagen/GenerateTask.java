package com.bistel.pdm.app.datagen;

import com.bistel.pdm.app.datagen.context.Context;
import com.bistel.pdm.app.datagen.model.Machine;
import com.bistel.pdm.app.datagen.provider.DoubleRandomValue;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.RecursiveAction;

public class GenerateTask extends RecursiveAction {

    private Context context;
    private boolean async = true;
    private Machine machine;

    public GenerateTask(Context context, Machine machine) {
        this.context = context;
        this.machine = machine;
    }

    @Override
    protected void compute() {
        String filePath = this.machine.getFilePath();

        try {
            // e.g.
            // fab,area,eqp,param,value,datatypecode,frequencycount,maxfrequency,rpm,timestamp
            for (String param : this.machine.getParameters()) {

//                Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String timestampString = dateFormat.format(new Date());

                String sbLine;
                if(this.machine.getDataTypeCode().equalsIgnoreCase("RMS")){
                    DoubleRandomValue dbl = new DoubleRandomValue();
                    sbLine = timestampString + "," +
                            this.machine.metaString() + "," +
                            param + "," +
                            this.machine.getDataTypeCode() + ",1.6," +
                            dbl.getRandomValue() + "\n";
                } else {
                    sbLine = timestampString + "," +
                            this.machine.metaString() + "," +
                            param + "," +
                            this.machine.getDataTypeCode() + ",1.6,0.234223," +
                            genWaveValue() + "," +
                            genWaveValue() + "," +
                            this.machine.getFrequencyCount() + "," +
                            this.machine.getMaxFrequency() + "," +
                            this.machine.getRpm() + "\n";
                }

                context.getSink().process(filePath, sbLine);
            }

            //context.getSink().close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String genWaveValue() {
        StringBuilder sb = new StringBuilder();

        DoubleRandomValue rv = new DoubleRandomValue();
        for (int i = 0; i < 5000; i++) {
            sb.append(rv.getRandomValue()).append("^");
        }
        sb.setLength(sb.length() - 1);

        return sb.toString();
    }

    public boolean isAsync() {
        return async;
    }

    public void setAsync(boolean async) {
        this.async = async;
    }
}
