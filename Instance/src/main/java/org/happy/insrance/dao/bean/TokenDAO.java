package org.happy.insrance.dao.bean;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDAO {

    private String tokenId;

    //新增过期时间
    private long expireDate;

}
