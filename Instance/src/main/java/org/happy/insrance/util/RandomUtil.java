package org.happy.insrance.util;

import java.util.Random;

public class RandomUtil {

    /**
     * 创建随机序列
     * @param prefix 随机数前缀
     * @param suffix 随机数后缀
     * @return
     */
    public static String generateRandomId(String prefix, String suffix){
        Random random=new Random();
        long randNum=random.nextLong();
        //目前只要正整数
        if(randNum< 0L){
            randNum=-randNum;
        }

        return prefix+randNum+suffix;

    }

}
