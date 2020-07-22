package org.happy.insrance.controller.bean;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartDetail {

    @Builder.Default
    private String partName="";

    @Builder.Default
    private String contentHTML="";

}
