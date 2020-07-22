package org.happy.insrance.service.impl;

import org.happy.insrance.dao.FileRepository;
import org.happy.insrance.service.StaticResourceService;
import org.happy.insrance.util.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;

@Service
public class StaticResourceServiceImpl implements StaticResourceService {

    @Autowired
    private FileRepository fileRepository;

    @Override
    public BufferedImage getImage(String imageName) throws Exception{
        return fileRepository.readImage(imageName);
    }

    @Override
    public void saveImage(byte[] imageBytes, String imageName) throws Exception{
        fileRepository.saveImage(imageBytes, imageName);
    }

    @Override
    public String saveImage(byte[] imageBytes) throws Exception{
        //生成文件号
        String imageId = RandomUtil.generateRandomId("cover_", ".jpg");
        //保存
        fileRepository.saveImage(imageBytes, imageId);
        return imageId;
    }


    @Override
    public void deleteImage(String imageName) throws Exception{
        fileRepository.deleteImage(imageName);
    }
}
