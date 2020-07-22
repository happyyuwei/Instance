package org.happy.insrance.dao;

import java.awt.image.BufferedImage;

/**
 * 文件服务接口
 */
public interface FileRepository {


    public BufferedImage readImage(String imageName) throws Exception;

    public void saveImage(byte[] imageBytes,String imageName) throws Exception;

    public void deleteImage(String imageName) throws Exception;

}
