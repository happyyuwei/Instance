package org.happy.insrance.controller.bean;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class ChapterInfo {

    private String chapterId;

    //课时号，从1开始
    private int chapterNumber;

    @Builder.Default
    private String chapterName="";

    //没用上时间
    private long createTime;

    private long updateTime;
}

