package org.happy.insrance.controller.bean;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ChapterDetail {

    private String chapterId;

    //课时号，从1开始
    private int chapterNumber;

    @Builder.Default
    private String chapterName="";

    private long createTime;

    private long updateTime;

    @Builder.Default
    private List<PartDetail> partList=new ArrayList<>();

}
