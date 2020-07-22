package org.happy.insrance.controller.bean;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDetail {

    private String userName;

    private String userId;

    private String avatar;

    private List<String> learningList;

    private List<String> teachingList;

}
