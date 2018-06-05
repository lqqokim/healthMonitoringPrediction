package com.bistel.a3.portal.util;

import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.util.Map;

public class TransactionUtil {
    public static PlatformTransactionManager getTransactionManger(Map<String, PlatformTransactionManager> trMgrs, String fabId) {
        return trMgrs.get(fabId + "TR");
    }

    public static TransactionStatus getTransactionStatus(PlatformTransactionManager manager) {
        return getTransactionStatus(manager, TransactionDefinition.PROPAGATION_REQUIRED);
    }

    public static TransactionStatus getTransactionStatus(PlatformTransactionManager manager, int transactionDef) {
        DefaultTransactionDefinition def = getTransactionDef(transactionDef);
        return manager.getTransaction(def);
    }

    private static DefaultTransactionDefinition getTransactionDef(int transactionDef) {
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(transactionDef);

        return def;
    }
}
