-- MariaDB dump 10.19  Distrib 10.5.9-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	10.5.9-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `curricula`
--

DROP TABLE IF EXISTS `curricula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curricula` (
  `Program` varchar(10) NOT NULL,
  `Curriculum` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `Major` varchar(20) DEFAULT NULL,
  `Option` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`Program`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curricula`
--

LOCK TABLES `curricula` WRITE;
/*!40000 ALTER TABLE `curricula` DISABLE KEYS */;
INSERT INTO `curricula` VALUES ('BACA','{\"ARTS 1\": 3,\n\"COMM 10\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"COMA 101\": 3,\n\"HUM 100\": 3,\n\"SPCM 102\": 3,\n\"HK 11\": \"(2)\",\n\"ETHICS 1\": 3,\n\"STS 1\": 3,\n\"COMA 102\": 3,\n\"ENG 100\": 3,\n\"SPCM 101\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"ENG 101\": 3,\n\"ENG 104\": 3,\n\"HUM 101\": 3,\n\"THEA 101\": 3,\n\"THEA 102\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"COMA 103\": 3,\n\"COMA 192\": 3,\n\"SPCM 104\": 3,\n\"Major\": 9,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"COMA 190\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"Major\": 6,\n\"COMA 150\": 3,\n\"COMA 193\": 3,\n\"COMA 199\": 1,\n\"Elective\": 3,\n\"Major\": 6,\n\"COMA 200a\": 3,\n\"COMA 105\": 3,\n\"HUM 102\": 3,\n\"THEA 103\": 3,\n\"Elective\": 3,\n\"COMA 200\": 3,\n\"COMA 200a\": 3,\n\"PI 10\": 3,\n\"HUM 104\": 3,\n\"HUM 170\": 3,\n\"GE Elective\": 3,\n\"Elective\": 3,\n\"COMA 200\": 3}',NULL,NULL),('BAPHLO','{\"ARTS 1\": 3,\n\"ETHICS 1\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"STS 1\": 3,\n\"PHLO 11\": 3,\n\"PHLO 12\": 3,\n\"HK 11\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"PI 10\": 3,\n\"ECON 11\": 3,\n\"POSC 10\": 3,\n\"PHLO 150\": 3,\n\"PHLO 171\": 3,\n\"SPEC\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"COMM 10\": 3,\n\"PHLO 110\": 3,\n\"PHLO 112\": 3,\n\"PHLO 173\": 3,\n\"GE Elective\": 3,\n\"Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"PHLO 111\": 3,\n\"PHLO 120\": 3,\n\"GE Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"PHLO 174\": 3,\n\"PHLO 181\": 3,\n\"PHLO 195\": 3,\n\"PHLO 197\": 3,\n\"Elective\": 3,\n\"PHLO 113\": 3,\n\"PHLO 182\": 3,\n\"Elective\": 6,\n\"Elective\": 3,\n\"Specialized Course\": 3,\n\"PHLO 176\": 3,\n\"PHLO 178\": 3,\n\"Elective\": 3,\n\"Specialized Course\": 6,\n\"PHLO 160\": 3,\n\"PHLO 184\": 3,\n\"PHLO 185\": 3,\n\"PHLO 200\": 6}',NULL,NULL),('BASOC','{\"ETHICS 1\": 3, \"HIST 1\": 3, \"KAS 1\": 3, \"SOC 10\": 3, \"ANTH 10\": 3, \"PSY 10\": 3, \"HK 11\": \"(2)\", \"GE Elective\": 3, \"HIST 10\": 3, \"POSC 10\": 3,\n\"SOC 100\": 3,\n\"SOC 110\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"GE Elective\": 3,\n\"STS 1\": 3,\n\"ARTS 1\": 3,\n\"ECON 11\": 3,\n\"SOC 116\": 3,\n\"STAT 166\": 3,\n\"SOC 130\": 3,\n\"SOC 135\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"AERS 160\": 3,\n\"SOC 140\": 3,\n\"DSS Elective\": 3,\n\"DSS Elective\": 3,\n\"Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"GE Elective\": 3,\n\"PI 10\": 3,\n\"DSS Elective\": 3,\n\"DSS Elective\": 3,\n\"SOC 107\": 3,\n\"SOC 151\": 3,\n\"SOC 195\": 2,\n\"SOC 195.1\": 1,\n\"COMM 10\": 3,\n\"SOC 152\": 3,\n\"SOC 166\": 3,\n\"SOC 192\": 3,\n\"Elective\": 3,\n\"SOC 198\": 3,\n\"SOC 114\": 3,\n\"SOC 120\": 3,\n\"SOC 180\": 3,\n\"SOC 191\": 3,\n\"SOC 199\": 1,\n\"SOC 200\": 3,\n\"SOC 112\": 3,\n\"SOC 160\": 3,\n\"SOC 165\": 3,\n\"SOC 170\": 3,\n\"SOC 175\": 3,\n\"Elective\": 3,\n\"SOC 200\": 3}',NULL,NULL),('BSAC','{\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"MCB 11\": 3,\n\"MATH 27\": 3,\n\"ETHICS 1\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"HK 11\": \"(2)\",\n\"CHEM 19\": 3,\n\"MATH 28\": 3,\n\"BIO 30\": 3,\n\"AGRI 31\": 3,\n\"ARTS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"CHEM 43\": 3,\n\"CHEM 43.1\": 2,\n\"PHYS 72\": 4,\n\"PHYS 72.1\": 1,\n\"AGRI 21\": 3,\n\"AGRI 32\": 3,\n\"ECON 11\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"CHEM 32\": 3,\n\"CHEM 32.1\": 2,\n\"PHYS 71\": 4,\n\"PHYS 71.1\": 1,\n\"BOT 20\": 3,\n\"CMSC 12\": 3,\n\"AMAT 152\": 3,\n\"PI 10\": 3,\n\"NSTP 1\": \"(3)\",\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"CHEM 44\": 3,\n\"CHEM 44.1\": 2,\n\"STAT 162\": 3,\n\"AGRI 22\": 3,\n\"AAE 111\": 3,\n\"AAE 120\": 3,\n\"AGRI 61\": 3,\n\"GE Elective\": 3,\n\"CHEM 111\": 3,\n\"CHEM 131\": 4,\n\"CHEM 140\": 4,\n\"CHEM 161a\": 4,\n\"AGRI 51\": 3,\n\"AGRI 41\": 3,\n\"CHEM 111.1\": 2,\n\"CHEM 112\": 3,\n\"CHEM 137\": 3,\n\"CHEM 161b\": 3,\n\"CHEM 192\": 3,\n\"AGRI 42\": 3,\n\"SPECIALIZATION\": 3,\n\"CHEM 112.1\": 2,\n\"CHEM 115\": 3,\n\"CHEM 137.1\": 2,\n\"CHEM 161.1\": 2,\n\"COMM 10\": 3,\n\"SPECIALIZATION\": 3,\n\"SPECIALIZATION\": 3,\n\"CHEM 198\": 3,\n\"CHEM 133\": 4,\n\"CHEM 120\": 3,\n\"CHEM 199\": 1,\n\"AGRI 171\": 3,\n\"ACHM 200\": 3,\n\"STS 1\": 3,\n\"SPECIALIZATION\": 3,\n\"CHEM 180\": 3,\n\"CHEM 185\": 3,\n\"AGRI 199\": 1,\n\"ACHM 200\": 3,\n\"GE Elective\": 3,\n\"SPECIALIZATION\": 3}',NULL,NULL),('BSAMAT','{\"AMAT 19\": 3,\n\"MATH 36\": 5,\n\"BIO 11.1\": 2,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"ETHICS 1\": 3,\n\"HK 11\": \"(2)\",\n\"MATH 37\": 3,\n\"STAT 101\": 3,\n\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"ARTS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"AMAT 110\": 3,\n\"MATH 38\": 5,\n\"MATH 101\": 3,\n\"PHYS 51\": 4,\n\"PHYS 51.1\": 1,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"AMAT 105\": 3,\n\"AMAT 112\": 3,\n\"AMAT 152\": 3,\n\"AMAT 170\": 3,\n\"STS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"MATH 151\": 3,\n\"MATH 174\": 3,\n\"MATH 181\": 3,\n\"AMAT Major Elective\": 3,\n\"MATH Major Elective\": 3,\n\"COMM 10\": 3,\n\"GE Elective\": 3,\n\"MATH 155\": 3,\n\"MATH 175\": 3,\n\"MATH 195\": 3,\n\"AMAT Major Elective\": 3,\n\"MATH Major Elective\": 3,\n\"COMA 150\": 3,\n\"AMAT 198\": 3,\n\"AMAT 200\": 3,\n\"AMAT Major Elective\": 3,\n\"MATH Major Elective\": 3,\n\"PI 10\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"AMAT 200\": 3,\n\"AMAT 199\": 1,\n\"AMAT Major Elective\": 3,\n\"MATH Major Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3}',NULL,NULL),('BSAPHY','{\"PHYS 101\": 4,\n\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"MATH 27\": 3,\n\"ARTS 1\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"HK 11\": \"(2)\",\n\"PHYS 102\": 4,\n\"PHYS 111\": 4,\n\"MATH 28\": 3,\n\"COMA 150\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"APHY 10.1\": 1,\n\"APHY 101\": 3,\n\"PHYS 103\": 4,\n\"PHYS 112\": 4,\n\"ETHICS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"PHYS 104\": 4,\n\"PHYS 113\": 4,\n\"PHYS 121\": 3,\n\"PHYS 131\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"APHY 103\": 3,\n\"PHYS 115\": 4,\n\"PHYS 122\": 3,\n\"PHYS 132\": 3,\n\"PHYS 192.1\": 2,\n\"PI 10\": 3,\n\"PHYS 141\": 3,\n\"PHYS 151\": 3,\n\"PHYS 165\": 3,\n\"PHYS 195\": 3,\n\"COMM 10\": 3,\n\"APHYS Elective\": 3,\n\"PHYS Elective\": 3,\n\"APHY 198\": 3,\n\"APHY 200\": 3,\n\"PHYS 142\": 3,\n\"APHYS Elective\": 3,\n\"PHYS Elective\": 3,\n\"APHYS Elective\": 3,\n\"PHYS Elective\": 3,\n\"APHYS Elective\": 3,\n\"PHYS Elective\": 3,\n\"Elective\": 3,\n\"APHY 191\": 3,\n\"APHY 199\": 1,\n\"APHY 200\": 3,\n\"STS 1\": 3,\n\"APHYS Elective\": 3,\n\"PHYS Elective\": 3,\n\"Elective\": 3}',NULL,NULL),('BSBIO','{\"BIO 11.1\": 2,\n\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"MATH 25\": 3,\n\"MCB 11\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"ARTS 1\": 3,\n\"HK 11\": \"(2)\",\n\"BIO 14\": 5,\n\"CHEM 40\": 4,\n\"CHEM 40.1\": 1,\n\"BIO 30\": 3,\n\"STS 1\": 3,\n\"PI 10\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"BOT 14\": 3,\n\"ZOO 14\": 3,\n\"CHEM 160\": 3,\n\"BIO 150\": 4,\n\"GE Elective\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"PHYS 51\": 4,\n\"PHYS 51.1\": 1,\n\"BIO 101\": 3,\n\"CHEM 160.1\": 2,\n\"BIO 140\": 3,\n\"GE Elective\": 3,\n\"ABME 10\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"STAT 164\": 3,\n\"BIO 120\": 3,\n\"BIO 142\": 3,\n\"COMM 10\": 3,\n\"Major\": 3,\n\"Major\": 3,\n\"BIO 195\": 3,\n\"BIO 127\": 3,\n\"ETHICS 1\": 3,\n\"Major\": 3,\n\"Major\": 3,\n\"Elective\": 3,\n\"BIO 198\": 3,\n\"COMA 150\": 3,\n\"BIO 199\": 1,\n\"Major\": 3,\n\"Major\": 3,\n\"Major\": 3,\n\"Elective\": 3,\n\"BIO 200\": 3,\n\"Major\": 3,\n\"Elective\": 3,\n\"BIO 200\": 3}',NULL,NULL),('BSCHEM','{\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"MCB 11\": 3,\n\"MATH 27\": 3,\n\"HIST 1\": 3,\n\"KAS 1\": 3,\n\"ETHICS 1\": 3,\n\"HK 11\": \"(2)\",\n\"CHEM 19\": 3,\n\"CHEM 32\": 3,\n\"CHEM 32.1\": 2,\n\"MATH 28\": 3,\n\"PHYS 71\": 4,\n\"PHYS 71.1\": 1,\n\"ARTS 1\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"CHEM 43\": 3,\n\"CHEM 43.1\": 2,\n\"PHYS 72\": 4,\n\"PHYS 72.1\": 1,\n\"CMSC 12\": 3,\n\"AMAT 152\": 3,\n\"GE Elective\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"CHEM 44\": 3,\n\"CHEM 44.1\": 2,\n\"CHEM 111\": 3,\n\"STAT 162\": 3,\n\"PI 10\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"CHEM 161a\": 3,\n\"CHEM 111.1\": 2,\n\"CHEM 112\": 3,\n\"CHEM 137\": 3,\n\"CHEM 140\": 4,\n\"CHEM 161b\": 3,\n\"COMM 10\": 3,\n\"CHEM 112.1\": 2,\n\"CHEM 115\": 3,\n\"CHEM 137.1\": 2,\n\"CHEM 161.1\": 2,\n\"CHEM 180\": 3,\n\"CHEM 192\": 3,\n\"Elective\": 3,\n\"CHEM 198\": 3,\n\"CHEM 120\": 3,\n\"CHEM 131\": 4,\n\"CHEM 200\": 3,\n\"Elective\": 3,\n\"STS 1\": 3,\n\"CHEM 120.1\": 2,\n\"CHEM 171\": 3,\n\"CHEM 199\": 1,\n\"CHEM 200\": 3,\n\"Elective\": 3}',NULL,NULL),('BSCS','{\"CMSC 12\": 3,\n\"CMSC 56\": 3,\n\"MATH 27\": 3,\n\"ETHICS 1\": 3,\n\"STS 1\": 3,\n\"HK 11\": \"(2)\",\n\"CMSC 21\": 3,\n\"CMSC 57\": 3,\n\"MATH 28\": 3,\n\"ARTS 1\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"CMSC 22\": 3,\n\"CMSC 150\": 3,\n\"CMSC 123\": 3,\n\"CMSC 130\": 3,\n\"PI 10\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"CMSC 22\": 3,\n\"CMSC 100\": 3,\n\"CMSC 127\": 3,\n\"CMSC 131\": 3,\n\"STAT 101\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"CMSC 124\": 3,\n\"CMSC 125\": 3,\n\"CMSC 141\": 3,\n\"CMSC 170\": 3,\n\"CMSC 132\": 3,\n\"COMM 10\": 3,\n\"CMSC 128\": 3,\n\"CMSC 142\": 3,\n\"CMSC 137\": 3,\n\"CMSC 173\": 3,\n\"CMSC 180\": 3,\n\"GE Elective\": 3,\n\"CMSC 198\": 3,\n\"CMSC 190\": 1,\n\"CMSC 199\": 1,\n\"ENG 10\": 3,\n\"GE Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"CMSC 190\": 2,\n\"GE Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3,\n\"Elective\": 3}',NULL,NULL),('BSMATH','{\"MATH 20\": 3,\n\"MATH 36\": 5,\n\"BIO 11.1\": 2,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"ETHICS 1\": 3,\n\"HK 11\": \"(2)\",\n\"MATH 37\": 3,\n\"STAT 101\": 3,\n\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"ARTS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"MATH 38\": 5,\n\"MATH 101\": 3,\n\"PHYS 51\": 4,\n\"PHYS 51.1\": 1,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"MATH 103\": 3,\n\"MATH 138\": 3,\n\"MATH 141\": 3,\n\"MATH 152\": 3,\n\"STS 1\": 3,\n\"GE Elective\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"MATH 111\": 3,\n\"MATH 155\": 3,\n\"MATH 195\": 3,\n\"COMA 150\": 3,\n\"COMM 100\": 3,\n\"GE Elective\": 3,\n\"MATH 120\": 3,\n\"MATH 133\": 3,\n\"MATH 151\": 3,\n\"MATH Major Elective\": 3,\n\"PI 10\": 3,\n\"MATH 198\": 3,\n\"MATH 200\": 3,\n\"MATH 135\": 3,\n\"MATH 165\": 3,\n\"MATH 181\": 3,\n\"MATH Major Elective\": 3,\n\"MATH 200\": 3,\n\"MATH 192\": 3,\n\"MATH 199\": 1,\n\"Elective\": 3,\n\"Elective\": 3}',NULL,NULL),('BSMST','{\"MST 101a\": 1,\n\"BIO 11.1\": 2,\n\"CHEM 18\": 3,\n\"CHEM 18.1\": 2,\n\"PHYS 50\": 3,\n\"MATH 25\": 3,\n\"STS 1\": 3,\n\"PI 10\": 3,\n\"HK 11\": \"(2)\",\n\"MST 101b\": 1,\n\"BIO 14\": 5,\n\"CHEM 40\": 4,\n\"CHEM 40.1\": 1,\n\"AMAT 19\": 3,\n\"MATH 27\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"MST 101c\": 1,\n\"EDUC 102\": 3,\n\"EDUC 111\": 3,\n\"BIO 30\": 3,\n\"STAT 166\": 3,\n\"SPCM 156\": 3,\n\"ETHICS 1\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"MST 101d\": 1,\n\"DEVC 40\": 3,\n\"MST 40\": 3,\n\"EDUC 122\": 3,\n\"BOT 14\": 3,\n\"CHEM 160\": 3,\n\"PHYS 71\": 4,\n\"PHYS 71.1\": 1,\n\"COMA 150\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"MST 123\": 5,\n\"EDUC 144\": 3,\n\"BIO 150\": 4,\n\"MCB 11\": 3,\n\"ZOO 14\": 3,\n\"STAT 162\": 3,\n\"MST 195\": 3,\n\"MST 199\": 1,\n\"MST 200a\": 3,\n\"MATH 18\": 3,\n\"COMM 10\": 3,\n\"GE Elective\": 3,\n\"MST 190\": 3,\n\"MST 191\": 3,\n\"MST 200b\": 3,\n\"ARTS 1\": 3,\n\"GE Elective\": 3,\n\"HFDS 12\": 3,\n\"PHYS 72\": 4,\n\"PHYS 72.1\": 1,\n\"GE Elective\": 3}',NULL,NULL),('BSSTAT','{\"ETHICS 1\": 3,\n\"KAS 1\": 3,\n\"HIST 1\": 3,\n\"MATH 27\": 3,\n\"BIO 30\": 3,\n\"STAT 101\": 3,\n\"STAT 135\": 3,\n\"HK 11\": \"(2)\",\n\"ARTS 1\": 3,\n\"GE Elective\": 3,\n\"MATH 28\": 3,\n\"CMSC 12\": 3,\n\"STAT 162\": 3,\n\"STAT 182\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"STS 1\": 3,\n\"GE Elective\": 3,\n\"CMSC 21\": 3,\n\"ECON 11\": 3,\n\"STAT 144\": 3,\n\"STAT 168\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 1\": \"(3)\",\n\"GE Elective\": 3,\n\"MATH 182\": 3,\n\"CMSC 22\": 3,\n\"ABME 10\": 3,\n\"STAT 145\": 3,\n\"STAT 163\": 3,\n\"HK 12\": \"(2)\",\n\"HK 13\": \"(2)\",\n\"NSTP 2\": \"(3)\",\n\"COMM 10\": 3,\n\"Elective\": 3,\n\"STAT 146\": 3,\n\"STAT 173\": 3,\n\"STAT 175\": 3,\n\"STAT 181\": 3,\n\"Elective\": 3,\n\"CMSC 127\": 3,\n\"STAT 147\": 3,\n\"STAT 151\": 3,\n\"STAT 156\": 3,\n\"STAT 174\": 3,\n\"STAT 192.1\": 1,\n\"COMA 198\": 3,\n\"Elective\": 3,\n\"ENG 10\": 3,\n\"STAT 148\": 3,\n\"STAT 165\": 3,\n\"STAT 190\": 3,\n\"STAT 191\": 3,\n\"PI 10\": 3,\n\"STAT 157\": 3,\n\"STAT 167\": 3,\n\"STAT 183\": 3,\n\"STAT 190\": 3,\n\"STAT 199\": 3}',NULL,NULL);
/*!40000 ALTER TABLE `curricula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edit_history`
--

DROP TABLE IF EXISTS `edit_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `edit_history` (
  `Username` varchar(30) NOT NULL,
  `ID` int(10) DEFAULT NULL,
  `Datetime_of_edit` datetime DEFAULT NULL,
  `Edit_notes` tinytext DEFAULT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edit_history`
--

LOCK TABLES `edit_history` WRITE;
/*!40000 ALTER TABLE `edit_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `edit_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `electives`
--

DROP TABLE IF EXISTS `electives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `electives` (
  `Course_Code` varchar(10) NOT NULL,
  `Type` varchar(10) DEFAULT NULL,
  `Units` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`Course_Code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `electives`
--

LOCK TABLES `electives` WRITE;
/*!40000 ALTER TABLE `electives` DISABLE KEYS */;
/*!40000 ALTER TABLE `electives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gesubjects`
--

DROP TABLE IF EXISTS `gesubjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gesubjects` (
  `Course_Code` varchar(10) NOT NULL,
  `Type` varchar(10) DEFAULT NULL,
  `Units` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`Course_Code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gesubjects`
--

LOCK TABLES `gesubjects` WRITE;
/*!40000 ALTER TABLE `gesubjects` DISABLE KEYS */;
INSERT INTO `gesubjects` VALUES ('ARTS 1','REQUIRED',3.00),('COMM 10','REQUIRED',3.00),('ETHICS 1','REQUIRED',3.00),('HIST 1','REQUIRED',3.00),('HUM 3','ELECTIVE',3.00),('KAS 1','REQUIRED',3.00),('KAS 4','ELECTIVE',3.00),('MATH 10','ELECTIVE',3.00),('PHILARTS 1','ELECTIVE',3.00),('PHLO 1','ELECTIVE',3.00),('PI 10','REQUIRED',3.00),('PS 21','ELECTIVE',3.00),('SAS 1','ELECTIVE',3.00),('SCIENCE 10','ELECTIVE',3.00),('SCIENCE 11','ELECTIVE',3.00),('SOSC 3','ELECTIVE',3.00),('STS 1','REQUIRED',3.00),('WIKA 1','ELECTIVE',3.00);
/*!40000 ALTER TABLE `gesubjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `ID` varchar(10) NOT NULL,
  `First_Name` varchar(20) DEFAULT NULL,
  `Last_Name` varchar(20) DEFAULT NULL,
  `Program` varchar(5) DEFAULT NULL,
  `GWA` decimal(5,4) DEFAULT NULL,
  `Qualified` tinyint(1) DEFAULT 0,
  `Warnings` tinytext DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `student_program_fk` (`Program`),
  CONSTRAINT `student_program_fk` FOREIGN KEY (`Program`) REFERENCES `curricula` (`Program`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taken_courses`
--

DROP TABLE IF EXISTS `taken_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taken_courses` (
  `ID` int(5) NOT NULL,
  `Student_ID` varchar(10) NOT NULL,
  `Course_Code` varchar(10) DEFAULT NULL,
  `Course_Type` varchar(10) DEFAULT NULL,
  `Grade` varchar(4) DEFAULT NULL,
  `Units` varchar(4) DEFAULT NULL,
  `Weight` decimal(4,2) DEFAULT NULL,
  `Term` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`,`Student_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taken_courses`
--

LOCK TABLES `taken_courses` WRITE;
/*!40000 ALTER TABLE `taken_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `taken_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `Username` varchar(30) NOT NULL,
  `Password` char(16) DEFAULT NULL,
  `Type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-06 23:45:37
