package org.happy.insrance.dao.bean;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class UserDAO {

    @Id
    public String userId;

    public String userName;

    public String password;

    @Builder.Default
    public List<TokenDAO> tokenDAOList=new ArrayList<>();

    public String avatar;

    @Builder.Default
    public List<String> learningList=new ArrayList<>();

    @Builder.Default
    public List<String> teachingList=new ArrayList<>();


}
