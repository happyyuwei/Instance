package org.happy.insrance.controller;

import org.happy.insrance.service.StaticResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;


@RestController
@RequestMapping("/rest/static/")
public class StaticController {

    @Autowired
    private StaticResourceService staticResourceService;

    @GetMapping("/img/{imageId}")
    @ResponseBody
    public void getImage(@PathVariable String imageId, HttpServletResponse response) throws Exception {
        BufferedImage image = staticResourceService.getImage(imageId);
        ImageIO.write(image, "jpg", response.getOutputStream());
    }

    @PostMapping("/img/upload")
    public String uploadImage(@RequestParam("file") MultipartFile image) throws Exception {
        return this.staticResourceService.saveImage(image.getBytes());

    }


}
