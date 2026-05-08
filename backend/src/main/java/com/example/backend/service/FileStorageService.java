package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path productUploadDir;
    private final Path govIdUploadDir;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) throws IOException {
        Path baseUploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.productUploadDir = baseUploadDir.resolve("products");
        this.govIdUploadDir = baseUploadDir.resolve("gov_ids");
        Files.createDirectories(this.productUploadDir);
        Files.createDirectories(this.govIdUploadDir);
    }

    public String storeProductImage(MultipartFile file) throws IOException {
        return storeFile(file, this.productUploadDir, "/uploads/products/");
    }

    public String storeGovId(MultipartFile file) throws IOException {
        return storeFile(file, this.govIdUploadDir, "/uploads/gov_ids/");
    }

    private String storeFile(MultipartFile file, Path targetDir, String urlPrefix) throws IOException {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String extension = "";
        int extensionIndex = originalName.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = originalName.substring(extensionIndex);
        }

        String fileName = UUID.randomUUID() + extension;
        Path targetLocation = targetDir.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return urlPrefix + fileName;
    }
}
