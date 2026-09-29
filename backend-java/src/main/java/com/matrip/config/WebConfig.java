package com.matrip.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*");
    }

    @Override
    public void addViewControllers(org.springframework.web.servlet.config.annotation.ViewControllerRegistry registry) {
        // Redireciona a raiz (/) para o arquivo index.html servido estaticamente
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obter os caminhos absolutos normalizados sem barras duplas
        String baseDir = Paths.get("..").toAbsolutePath().normalize().toString().replace("\\", "/");
        String webDir = "file:" + baseDir + "/web/";
        String uploadsDir = "file:" + baseDir + "/backend-java/uploads/";

        // Registrar os manipuladores de recursos estáticos com cache desabilitado (0s) para desenvolvimento
        registry.addResourceHandler("/css/**").addResourceLocations(webDir + "css/").setCachePeriod(0);
        registry.addResourceHandler("/js/**").addResourceLocations(webDir + "js/").setCachePeriod(0);
        registry.addResourceHandler("/img/**").addResourceLocations(webDir + "img/").setCachePeriod(0);
        registry.addResourceHandler("/paginas/**").addResourceLocations(webDir + "paginas/").setCachePeriod(0);
        registry.addResourceHandler("/uploads/**").addResourceLocations(uploadsDir).setCachePeriod(0);
        
        // Mapear raiz do projeto para servir o index.html
        registry.addResourceHandler("/**").addResourceLocations(webDir).setCachePeriod(0);
    }
}
