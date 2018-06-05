from restclient.MiTest import *

server = '172.19.10.1'
server = '192.168.8.36'
r = RestClient(server, 8080, True)
h = get_token_header(get_token(r, 'YOHAN', '1'))

prefix = 'portal/service'
start = to_timestamp('2017-04-01')
end = to_timestamp('2017-04-02')
fromto = 'fromdate=%d&todate=%d' % (start, end)
fabId = 'fab1'
areaId = 3
eqpId = 70
paramId = 72
measureTrxId = 1501129

### Monitoring (5/5)
# r.get('{}/plants'.format(prefix), h)
# r.get('{}/plants/{}/shopstatus?{}'.format(prefix, fabId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqpstatus?{}'.format(prefix, fabId, areaId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/paramstatus?{}'.format(prefix, fabId, areaId, eqpId, fromto), h)
# r.get('{}/plants/{}/nodetree'.format(prefix, fabId), h)
# r.get('{}/plants/{}/shops/{}/variance'.format(prefix, fabId, areaId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/variance'.format(prefix, fabId, areaId, eqpId), h)

### MonitoringDetail (11/12)
# r.get('{}/plants/{}/shops/{}/eqps/{}/params/{}/detail'.format(prefix, fabId, areaId, eqpId, paramId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/params/{}/trendmultiple?{}'.format(prefix, fabId, areaId, eqpId, paramId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/params/{}/trendmultiplespec?{}'.format(prefix, fabId, areaId, eqpId, paramId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/params/{}/trendmultiplespecconfig?{}'.format(prefix, fabId, areaId, eqpId, paramId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/maintenance?{}'.format(prefix, fabId, areaId, eqpId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/params/{}/measurements?{}'.format(prefix, fabId, areaId, eqpId, paramId, fromto), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/rpm'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/timewave'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/spectrum'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/analysis'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/modelmeasurement'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)

### ReportAlarm (2/3)
# r.get('{}/plants/{}/alarmreport?{}'.format(prefix, fabId, fromto), h)
# r.get('{}/plants/{}/eqps/{}/eqpinfo'.format(prefix, fabId, eqpId), h)

### Health (5/5)
# r.get('{}/plants/{}/shops/{}/eqps/{}/healthindex'.format(prefix, fabId, areaId, eqpId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/contourchart'.format(prefix, fabId, areaId, eqpId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/effectchart'.format(prefix, fabId, areaId, eqpId), h)
# r.get('{}/plants/{}/shops/{}/eqps/{}/contribute'.format(prefix, fabId, areaId, eqpId), h)
# r.get('{}/plants/{}/healthmodels'.format(prefix, fabId), h)


### manual task 
date = '2017-04-01'
day = 1
# r.get('{}/manual/datapump/base'.format(prefix), h)
# r.get('{}/manual/datapump?date={}&day={}'.format(prefix, date, day), h)
# r.get('{}/manual/createfeature?date={}&day={}'.format(prefix, date, day), h)
# r.get('{}/manual/createhealth?date={}&day={}'.format(prefix, date, day), h)
# r.get('{}/manual/createstat?date={}&day={}'.format(prefix, date, day), h)


### file write test
s, d = r.get('{}/plants/{}/shops/{}/eqps/{}/rawdata/{}/timewave'.format(prefix, fabId, areaId, eqpId, measureTrxId), h)
wprint(dumps(d), 'eqp(%d).measureTrx(%d).timewave' % (eqpId, measureTrxId))
