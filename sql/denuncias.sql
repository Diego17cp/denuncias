-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: denuncias
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adjunto`
--

DROP TABLE IF EXISTS `adjunto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adjunto` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `denuncia_id` int unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `adjunto_denuncia_id_foreign` (`denuncia_id`),
  CONSTRAINT `adjunto_denuncia_id_foreign` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adjunto`
--

LOCK TABLES `adjunto` WRITE;
/*!40000 ALTER TABLE `adjunto` DISABLE KEYS */;
INSERT INTO `adjunto` VALUES (1,1,'uploads/1/1758297726_3f2e897554acefc0295e.docx','2025-09-19 11:02:06','2025-09-19 11:02:06',NULL);
/*!40000 ALTER TABLE `adjunto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(100) NOT NULL,
  `estado` enum('1','0') NOT NULL,
  `area` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,'TUÑOQUE J. MARTHA L.','40346175','$2y$10$y.nroOGlH7CJw/CBFEWum.Yip7iWAaw9qF5.wauOhqPHyF4bXzIXO','super_admin','1','SGITP',NULL,NULL,NULL);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ambiental_cause`
--

DROP TABLE IF EXISTS `ambiental_cause`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ambiental_cause` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ambiental_cause`
--

LOCK TABLES `ambiental_cause` WRITE;
/*!40000 ALTER TABLE `ambiental_cause` DISABLE KEYS */;
INSERT INTO `ambiental_cause` VALUES (1,'Emisiones de Gases y Humos'),(2,'Vertimiento de Liquidos'),(3,'Vertimiento de Solidos'),(4,'Material Particulado'),(5,'Ruidos');
/*!40000 ALTER TABLE `ambiental_cause` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denounce`
--

DROP TABLE IF EXISTS `denounce`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denounce` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(36) NOT NULL,
  `reception_media` varchar(30) NOT NULL,
  `date` date NOT NULL,
  `has_previous_denounce` tinyint(1) NOT NULL DEFAULT '0',
  `has_response` tinyint(1) NOT NULL DEFAULT '0',
  `directed_entity` varchar(50) NOT NULL,
  `entity_response` varchar(50) NOT NULL,
  `comunication_media` varchar(50) NOT NULL,
  `source` varchar(50) NOT NULL,
  `keep_identity` tinyint(1) NOT NULL DEFAULT '0',
  `address` varchar(250) NOT NULL,
  `reference` varchar(250) NOT NULL,
  `facts_description` text NOT NULL,
  `ambiental_promise` varchar(15) NOT NULL,
  `proof_description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denounce`
--

LOCK TABLES `denounce` WRITE;
/*!40000 ALTER TABLE `denounce` DISABLE KEYS */;
/*!40000 ALTER TABLE `denounce` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denounce_action`
--

DROP TABLE IF EXISTS `denounce_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denounce_action` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_denounce` int unsigned NOT NULL,
  `id_denounce_status` smallint unsigned NOT NULL,
  `description` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_denounce` (`id_denounce`),
  KEY `id_denounce_status` (`id_denounce_status`),
  CONSTRAINT `denounce_action_id_denounce_foreign` FOREIGN KEY (`id_denounce`) REFERENCES `denounce` (`id`) ON DELETE CASCADE,
  CONSTRAINT `denounce_action_id_denounce_status_foreign` FOREIGN KEY (`id_denounce_status`) REFERENCES `denounce_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denounce_action`
--

LOCK TABLES `denounce_action` WRITE;
/*!40000 ALTER TABLE `denounce_action` DISABLE KEYS */;
/*!40000 ALTER TABLE `denounce_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denounce_ambiental_cause`
--

DROP TABLE IF EXISTS `denounce_ambiental_cause`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denounce_ambiental_cause` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_ambiental_cause` smallint unsigned NOT NULL,
  `id_denounce` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `denounce_ambiental_cause_id_ambiental_cause_foreign` (`id_ambiental_cause`),
  KEY `denounce_ambiental_cause_id_denounce_foreign` (`id_denounce`),
  CONSTRAINT `denounce_ambiental_cause_id_ambiental_cause_foreign` FOREIGN KEY (`id_ambiental_cause`) REFERENCES `ambiental_cause` (`id`) ON DELETE CASCADE,
  CONSTRAINT `denounce_ambiental_cause_id_denounce_foreign` FOREIGN KEY (`id_denounce`) REFERENCES `denounce` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denounce_ambiental_cause`
--

LOCK TABLES `denounce_ambiental_cause` WRITE;
/*!40000 ALTER TABLE `denounce_ambiental_cause` DISABLE KEYS */;
/*!40000 ALTER TABLE `denounce_ambiental_cause` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denounce_status`
--

DROP TABLE IF EXISTS `denounce_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denounce_status` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denounce_status`
--

LOCK TABLES `denounce_status` WRITE;
/*!40000 ALTER TABLE `denounce_status` DISABLE KEYS */;
INSERT INTO `denounce_status` VALUES (1,'REGISTRADO'),(2,'RECIBIDO'),(3,'ATENDIDO');
/*!40000 ALTER TABLE `denounce_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia`
--

DROP TABLE IF EXISTS `denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tracking_code` varchar(20) NOT NULL,
  `denunciante_id` int unsigned DEFAULT NULL,
  `motivo_id` int unsigned NOT NULL,
  `motivo_otro` varchar(255) DEFAULT NULL,
  `es_anonimo` tinyint(1) NOT NULL,
  `denunciado_id` int unsigned DEFAULT NULL,
  `descripcion` text NOT NULL,
  `estado` varchar(20) NOT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `fecha_incidente` date NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `denuncia_denunciante_id_foreign` (`denunciante_id`),
  KEY `denuncia_denunciado_id_foreign` (`denunciado_id`),
  CONSTRAINT `denuncia_denunciado_id_foreign` FOREIGN KEY (`denunciado_id`) REFERENCES `denunciado` (`id`) ON DELETE SET NULL,
  CONSTRAINT `denuncia_denunciante_id_foreign` FOREIGN KEY (`denunciante_id`) REFERENCES `denunciante` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia`
--

LOCK TABLES `denuncia` WRITE;
/*!40000 ALTER TABLE `denuncia` DISABLE KEYS */;
INSERT INTO `denuncia` VALUES (1,'TD0C3E74FFBD5221B346',1,3,NULL,0,1,'PRIMERA PRUEBA EN LA LAPTOP PARA DENUNCIAS CORRUPCION ','registrado',NULL,'2025-09-19','corrupcion','2025-09-19 11:02:06','2025-09-19 11:02:06',NULL);
/*!40000 ALTER TABLE `denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denunciado`
--

DROP TABLE IF EXISTS `denunciado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denunciado` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','CE','RUC') DEFAULT NULL,
  `representante_legal` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denunciado`
--

LOCK TABLES `denunciado` WRITE;
/*!40000 ALTER TABLE `denunciado` DISABLE KEYS */;
INSERT INTO `denunciado` VALUES (1,'CRUZ C. PILLICA C.','72322323','DNI',NULL,NULL,NULL,NULL,'2025-09-19 11:02:06','2025-09-19 11:02:06',NULL);
/*!40000 ALTER TABLE `denunciado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denunciante`
--

DROP TABLE IF EXISTS `denunciante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denunciante` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `documento` varchar(20) NOT NULL,
  `tipo_documento` enum('DNI','CE','RUC') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `sexo` enum('M','F') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denunciante`
--

LOCK TABLES `denunciante` WRITE;
/*!40000 ALTER TABLE `denunciante` DISABLE KEYS */;
INSERT INTO `denunciante` VALUES (1,'GARCILAZO L. JUAN A.',NULL,'72389238','DNI',NULL,NULL,NULL,NULL,'nellfuep@gmail.com','987654321','987654321','M','2025-09-19 11:02:06','2025-09-19 11:02:06',NULL);
/*!40000 ALTER TABLE `denunciante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_type`
--

DROP TABLE IF EXISTS `document_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_type` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_type`
--

LOCK TABLES `document_type` WRITE;
/*!40000 ALTER TABLE `document_type` DISABLE KEYS */;
INSERT INTO `document_type` VALUES (1,'DNI'),(2,'RUC');
/*!40000 ALTER TABLE `document_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_admin`
--

DROP TABLE IF EXISTS `historial_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_admin` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `administrador_id` int unsigned NOT NULL,
  `afectado_id` int unsigned NOT NULL,
  `accion` varchar(50) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `historial_admin_administrador_id_foreign` (`administrador_id`),
  KEY `historial_admin_afectado_id_foreign` (`afectado_id`),
  CONSTRAINT `historial_admin_administrador_id_foreign` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historial_admin_afectado_id_foreign` FOREIGN KEY (`afectado_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_admin`
--

LOCK TABLES `historial_admin` WRITE;
/*!40000 ALTER TABLE `historial_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int NOT NULL,
  `batch` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2025-09-05-165124','App\\Database\\Migrations\\CreateDenunciasTables','default','App',1758297326,1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `motivo`
--

DROP TABLE IF EXISTS `motivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motivo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motivo`
--

LOCK TABLES `motivo` WRITE;
/*!40000 ALTER TABLE `motivo` DISABLE KEYS */;
INSERT INTO `motivo` VALUES (1,'Acceso a ventajas indebidas (incluye soborno nacional y transnacional)','Cuando el servidor propicia, solicita o acepta alguna ventaja o beneficio indebido (regalos, donaciones a título personal, bienes, incentivos, cortesías o favores). Incluye el soborno a un servidor público extranjero para obtener o retener un negocio u otra ventaja indebida en la realización de actividades económicas o comerciales internacionales.',NULL,NULL,NULL),(2,'Invocación de influencias en el Estado','Cuando el servidor utiliza o simula su capacidad de influencia en el sector público para obtener un beneficio o una ventaja irregular.',NULL,NULL,NULL),(3,'Mantener intereses en conflicto','Cuando el servidor mantiene vínculos familiares, comerciales, institucionales o laborales que podrían afectar el manejo imparcial de los asuntos a su cargo y las relaciones de la entidad con actores externos.',NULL,NULL,NULL),(4,'Obstrucción al acceso a la información pública','Cuando el servidor se rehúsa a entregar información pública solicitada por los conductos regulares que no sea reservada, confidencial o secreta, de acuerdo con las normas vigentes.',NULL,NULL,NULL),(5,'Abuso de autoridad','Cuando el servidor comete u ordena un acto arbitrario alegando el cumplimiento de sus funciones.',NULL,NULL,NULL),(6,'Favorecimiento indebido','Cuando el servidor utiliza su cargo para favorecer irregularmente a alguna persona por un interés particular o por un interés ajeno al cumplimiento de sus funciones.',NULL,NULL,NULL),(7,'Apropiación o uso indebido de recursos, bienes o información del Estado','Cuando el servidor se adueña o utiliza de manera indebida dinero, recursos (incluyendo el tiempo asignado a la función pública), bienes o información del Estado.',NULL,NULL,NULL),(8,'Otros','Cualquier acto contrario a la Ley del Código de Ética de la Función Pública o conducta indebida no contemplada en las categorías anteriores, incluyendo irregularidades administrativas, conflictos de interés no declarados, u otros actos que comprometan la integridad de la función pública.',NULL,NULL,NULL);
/*!40000 ALTER TABLE `motivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_doc_type` smallint unsigned NOT NULL,
  `is_natural_person` tinyint(1) NOT NULL,
  `doc_number` varchar(11) NOT NULL DEFAULT 'NO TIENE',
  `trade_name` varchar(150) NOT NULL,
  `name` varchar(45) NOT NULL,
  `paternal_surname` varchar(45) NOT NULL,
  `mother_surname` varchar(45) NOT NULL,
  `legal_representator` varchar(250) NOT NULL DEFAULT 'NO ESPECIFICA',
  `address` varchar(250) NOT NULL,
  `fixed_phone` varchar(10) NOT NULL DEFAULT 'NO TIENE',
  `first_phone` char(9) NOT NULL DEFAULT 'NO TIENE',
  `second_phone` char(9) NOT NULL DEFAULT 'NO TIENE',
  `email` varchar(150) NOT NULL DEFAULT 'NO TIENE',
  `departament` varchar(20) NOT NULL,
  `province` varchar(20) NOT NULL,
  `distric` varchar(45) NOT NULL DEFAULT 'JOSÉ LEONARDO ORTIZ',
  PRIMARY KEY (`id`),
  KEY `id_doc_type` (`id_doc_type`),
  CONSTRAINT `person_id_doc_type_foreign` FOREIGN KEY (`id_doc_type`) REFERENCES `document_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_denounce`
--

DROP TABLE IF EXISTS `person_denounce`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_denounce` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_person` int unsigned NOT NULL,
  `id_denounce` int unsigned NOT NULL,
  `is_affected` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `person_denounce_id_person_foreign` (`id_person`),
  KEY `person_denounce_id_denounce_foreign` (`id_denounce`),
  CONSTRAINT `person_denounce_id_denounce_foreign` FOREIGN KEY (`id_denounce`) REFERENCES `denounce` (`id`) ON DELETE CASCADE,
  CONSTRAINT `person_denounce_id_person_foreign` FOREIGN KEY (`id_person`) REFERENCES `person` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_denounce`
--

LOCK TABLES `person_denounce` WRITE;
/*!40000 ALTER TABLE `person_denounce` DISABLE KEYS */;
/*!40000 ALTER TABLE `person_denounce` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proof`
--

DROP TABLE IF EXISTS `proof`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proof` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_denounce` int unsigned NOT NULL,
  `path` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proof_id_denounce_foreign` (`id_denounce`),
  CONSTRAINT `proof_id_denounce_foreign` FOREIGN KEY (`id_denounce`) REFERENCES `denounce` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proof`
--

LOCK TABLES `proof` WRITE;
/*!40000 ALTER TABLE `proof` DISABLE KEYS */;
/*!40000 ALTER TABLE `proof` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento_denuncia`
--

DROP TABLE IF EXISTS `seguimiento_denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento_denuncia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `denuncia_id` int unsigned NOT NULL,
  `administrador_id` int unsigned NOT NULL,
  `comentario` text NOT NULL,
  `estado` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seguimiento_denuncia_denuncia_id_foreign` (`denuncia_id`),
  KEY `seguimiento_denuncia_administrador_id_foreign` (`administrador_id`),
  CONSTRAINT `seguimiento_denuncia_administrador_id_foreign` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seguimiento_denuncia_denuncia_id_foreign` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento_denuncia`
--

LOCK TABLES `seguimiento_denuncia` WRITE;
/*!40000 ALTER TABLE `seguimiento_denuncia` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguimiento_denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `paternal_surname` varchar(50) NOT NULL,
  `mother_surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Informatica','MDJLO','MDJLO','informatica@gmail.com','ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-19 11:03:51
