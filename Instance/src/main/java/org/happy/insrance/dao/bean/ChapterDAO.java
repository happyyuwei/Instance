package org.happy.insrance.dao.bean;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ChapterDAO {


    @Id
    private String chapterId;

    @Builder.Default
    private String chapterName="";

    private long createTime;

    private long updateTime;

    @Builder.Default
    private List<PartDAO> partList=new ArrayList<>();



}
