package org.happy.insrance.service;

import java.awt.image.BufferedImage;

/**
 * 静态资源服务
 */
public interface StaticResourceService {

    public BufferedImage getImage(String imageName) throws Exception;

    public void saveImage(byte[] imageBytes, String imageName) throws  Exception;

    /**
     * 返回创建的图像ID
     * @param imageBytes
     * @return
     * @throws Exception
     */
    public String saveImage(byte[] imageBytes) throws  Exception;

    public void deleteImage(String imageName) throws Exception;

}
