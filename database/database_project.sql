-- MySQL dump 10.13  Distrib 5.7.37, for Win64 (x86_64)
--
-- Host: localhost    Database: database_project
-- ------------------------------------------------------
-- Server version	5.7.37-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
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
  `Program` varchar(5) NOT NULL,
  `Curriculum` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`Program`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curricula`
--

LOCK TABLES `curricula` WRITE;
/*!40000 ALTER TABLE `curricula` DISABLE KEYS */;
/*!40000 ALTER TABLE `curricula` ENABLE KEYS */;
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
  `ID` int(5) NOT NULL,
  `First_Name` varchar(20) DEFAULT NULL,
  `Last_Name` varchar(20) DEFAULT NULL,
  `Program` varchar(5) DEFAULT NULL,
  `GWA` decimal(5,4) DEFAULT NULL,
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
  `Course_Code` varchar(10) NOT NULL,
  `Grade` decimal(3,2) DEFAULT NULL,
  `Units` decimal(3,2) DEFAULT NULL,
  `Weight` decimal(3,2) DEFAULT NULL,
  `Term` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`,`Course_Code`)
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
  `Password` varchar(20) DEFAULT NULL,
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

-- Dump completed on 2022-04-19 17:00:28
