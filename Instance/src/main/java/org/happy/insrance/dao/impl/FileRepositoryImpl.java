package org.happy.insrance.dao.impl;

import lombok.extern.slf4j.Slf4j;
import org.happy.insrance.dao.FileRepository;
import org.springframework.stereotype.Repository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

@Repository
@Slf4j
public class FileRepositoryImpl implements FileRepository {

    //目前支持图片和文本文件管理
    //文件系统根目录为./fs
    final private static String ROOT = "fs";
    //图像路径
    final private String IMAGE_ROOT = ROOT + File.separator + "img";
    //文件路径
    final private String JSON_ROOT = ROOT + File.separator + "json";

    @Override
    public BufferedImage readImage(String imageName) throws Exception {
        //生成正式的图像路径
        String imagePath = IMAGE_ROOT + File.separator + imageName;
        log.info("Read image event. imageName=" + imagePath);
        //读取图像
        return ImageIO.read(new File(imagePath));
    }

    @Override
    public void saveImage(byte[] imageBytes, String imageName) throws Exception {
        //生成正式的图像路径
        String imagePath = IMAGE_ROOT + File.separator + imageName;
        log.info("Save image event. imageName=" + imagePath);
        // 创建输出流
        BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(imagePath));
        outputStream.write(imageBytes);
        outputStream.flush();
        outputStream.close();

    }


    /**
     * 若存在则删除照片，若不存在，则抛出异常
     *
     * @param imageName
     * @throws Exception
     */
    @Override
    public void deleteImage(String imageName) throws Exception {
        log.info("Delete image event. imageName=" + imageName);
        String imagePath = IMAGE_ROOT + File.separator + imageName;
        File imgFile = new File(imagePath);
        if (!imgFile.delete()) {
            throw new Exception("The image to delete not exist or delete failed.");
        }
    }
}
