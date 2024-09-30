-- Adminer 4.8.1 MySQL 11.1.6-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `shibes`;
CREATE TABLE `shibes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `dogeAddress` varchar(255) DEFAULT NULL,
  `bname` varchar(255) DEFAULT NULL,
  `bemail` varchar(255) DEFAULT NULL,
  `bcountry` varchar(255) DEFAULT NULL,
  `baddress` varchar(255) DEFAULT NULL,
  `bpostalCode` varchar(255) DEFAULT NULL,
  `amount` decimal(20,8) DEFAULT NULL,
  `PaytoDogeAddress` varchar(255) DEFAULT NULL,
  `paid` tinyint(1) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 2024-09-30 11:43:21
