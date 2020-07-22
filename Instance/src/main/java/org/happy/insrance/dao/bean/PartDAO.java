package org.happy.insrance.dao.bean;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartDAO {

    //小节标题
    @Builder.Default
    private String partName="";

    //内容
    @Builder.Default
    private String contentHTML="";

}
