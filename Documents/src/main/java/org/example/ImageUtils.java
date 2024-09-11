package org.example;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;

public class ImageUtils {
    public static String imageToBase64(String imagePath) {
        File file = new File(imagePath);
        try (FileInputStream imageInFile = new FileInputStream(file)) {
            // Reading a image file from file system
            byte imageData[] = new byte[(int) file.length()];
            imageInFile.read(imageData);

            // Converting image byte array into Base64 String
            return Base64.getEncoder().encodeToString(imageData);
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    }

    public static void main(String[] args) {
        String imagePath = "C:/Users/anton/Downloads/Big Image.png";
        String base64Image = imageToBase64(imagePath);
        System.out.println(base64Image);
    }
}
