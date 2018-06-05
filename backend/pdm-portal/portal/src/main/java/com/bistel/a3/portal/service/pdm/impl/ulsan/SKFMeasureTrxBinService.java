package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.pdm.ulsan.MeasureTrxMapper;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.enums.BinDataType;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.service.pdm.IDataMigrationService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.*;

@Service
@ConditionalOnExpression("!${run.standard}")
public class SKFMeasureTrxBinService implements IDataMigrationService {
    private static Logger logger = LoggerFactory.getLogger(IDataMigrationService.class);

    private static int mEUType = 2;
    private static int mScaling = 1;

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Override
    public List<List<Object>> getTimewaveData(String fabId, Long measurementId) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        MeasureTrxWithBin data = mapper.selectMeasureTrxWithBinById(BinDataType.TIMEWAVE.cd(), measurementId);
        if(data == null) return new ArrayList<>();

        return makeTimewaveList(data);
    }

    @Override
    public List<List<Double>> getSpectrumData(String fabId, Long measureTrxId) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        MeasureTrxWithBin data = mapper.selectMeasureTrxWithBinById(BinDataType.SPECTRUM.cd(), measureTrxId);
        if(data == null) return new ArrayList<>();

        return makeSpectrumList(data);
    }

    @Override
    public Map<Long, List<List<Object>>> getTimewaveMap(String fabId, List<MeasureTrx> measureTrx) {
        return new HashMap<>();
    }

    private List<List<Double>> makeSpectrumList(MeasureTrxWithBin data) {
        double[] fftdata = getSpectrum(data.getBinary(), data.getSpectra_line(), data.getScale_factor());
        Integer euType = data.getEu_type();
        double[][] convertedData = convertRawData(fftdata, data.getEnd_freq(), data.getSpectra_line(), mEUType, mScaling, euType, euType == 7 ? 2 : 3);

        List<List<Double>> result = new ArrayList<>();
        for(double[] d : convertedData) {
            result.add(Arrays.asList(d[0], d[1]));
        }
        return result;
    }

    private List<List<Object>> makeTimewaveList(MeasureTrxWithBin data) {
        double[] fftdata = getTimewaveData(data.getBinary(), data.getScale_factor());
        double maxTime = data.getSpectra_line() / data.getEnd_freq();
        double interval = maxTime / (fftdata.length - 1);

        List<List<Object>> result = new ArrayList<>();
        for(int i=0; i<fftdata.length; i++) {
            result.add(Arrays.asList(i, fftdata[i]));
        }
        return result;
    }

    private double getFactor1(int mEUType) {
        double factor1;
        switch (mEUType) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 8:
            {
                factor1 = 1.0;
                break;
            }
            case 1:
            case 7:
            {
                factor1 = 9.81;
                break;
            }
            case 3:
            case 5:
            {
                factor1 = 25.4;
                break;
            }
            default:
            {
                factor1 = 0;
                break;
            }
        }
        return factor1;
    }

    private  double[][] convertRawData(double[] fftData, double dbEndFreq, Integer spectraLines, int mEUType, int mScaling, int euType, int scaling) {
        double factor2 = Double.NaN;

        double factor1 = getFactor1(mEUType);

        int num = 0;
        switch (euType) {
            case 1:
            case 7:
            {
                factor1 = factor1 / 9.81;
            }
            case 2:
            case 4:
            case 6:
            {
                switch (euType) {
                    case 4:
                    {
                        num = num + 1;
                        break;
                    }
                    case 6:
                    {
                        num = num + 2;
                        break;
                    }
                }

                switch (mEUType) {
                    case 3:
                    case 4:
                    {
                        num = num - 1;
                        break;
                    }
                    case 5:
                    case 6:
                    {
                        num = num - 2;
                        break;
                    }
                }

                switch (mScaling) {
                    case 1:
                    {
                        factor2 = 1;
                        break;
                    }
                    case 2:
                    {
                        factor2 = 0.5;
                        break;
                    }
                    case 3:
                    {
                        factor2 = Math.sqrt(2);
                        break;
                    }
                    default:
                    {
                        factor2 = 0;
                        break;
                    }
                }

                switch (scaling) {
                    case 1:
                    {
                        factor2 = factor2 * 1;
                        break;
                    }
                    case 2:
                    {
                        factor2 = factor2 * 2;
                        break;
                    }
                    case 3:
                    {
                        factor2 = factor2 / Math.sqrt(2);
                        break;
                    }
                    default:
                    {
                        factor2 = 0;
                        break;
                    }
                }
            }
        }

        double endFreq = 6.28318530717959 * dbEndFreq / spectraLines / 1000;
        double[][] spectraData = new double[spectraLines][];

        for (int i = 0; i < spectraLines; i++) {
            spectraData[i] = new double[] {(i + 1d) / spectraLines * dbEndFreq, (factor2 * factor1 * fftData[i]) / Math.pow(endFreq * (i + 1), Math.abs(num))};
        }

        return spectraData;
    }

    private double[] getTimewaveData(byte[] rawData, double scaleFactor) {
        double[] fftdata = new double[rawData.length / 2];
        for(int i=0; i<fftdata.length; i++) {
            int  data = (rawData[i*2] & 0xFF | (rawData[i*2+1] & 0xFF) << 8);
            if((data & 0x8000) > 0) {
                data = data - 0x10000;
            }
            fftdata[i] = scaleFactor * data;
        }

        return fftdata;
    }

    private double[] getSpectrum(byte[] rawData, Integer spectraLines, double scaleFactor) {
        double[] fftdata = new double[spectraLines];
        for(int i=0; i<fftdata.length; i++) {
            fftdata[i] = scaleFactor * (rawData[i*2] & 0xFF | (rawData[i*2+1] & 0xFF) << 8);
        }
        return fftdata;
    }
}
