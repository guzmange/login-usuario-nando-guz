/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100137
 Source Host           : localhost:3306
 Source Schema         : admin_usuarios

 Target Server Type    : MySQL
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 20/04/2019 00:20:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for funcionalidades
-- ----------------------------
DROP TABLE IF EXISTS `funcionalidades`;
CREATE TABLE `funcionalidades`  (
  `Id_Funcionalidad` int(4) NOT NULL,
  `Funcionalidad` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Url` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Activo` bit(1) NOT NULL,
  PRIMARY KEY (`Id_Funcionalidad`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for perfil_funcionalidad
-- ----------------------------
DROP TABLE IF EXISTS `perfil_funcionalidad`;
CREATE TABLE `perfil_funcionalidad`  (
  `Id_Perfil` int(4) NOT NULL,
  `Id_funcionalidad` int(4) NOT NULL,
  INDEX `IdPerfil_PerfilFuncionalidad`(`Id_Perfil`) USING BTREE,
  INDEX `IdFuncionalidad_PerfilFuncionalidad`(`Id_funcionalidad`) USING BTREE,
  CONSTRAINT `IdFuncionalidad_PerfilFuncionalidad` FOREIGN KEY (`Id_funcionalidad`) REFERENCES `funcionalidades` (`Id_Funcionalidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `IdPerfil_PerfilFuncionalidad` FOREIGN KEY (`Id_Perfil`) REFERENCES `perfiles` (`Id_Perfil`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for perfil_usuarios
-- ----------------------------
DROP TABLE IF EXISTS `perfil_usuarios`;
CREATE TABLE `perfil_usuarios`  (
  `Id_Perfil` int(4) NOT NULL,
  `Id_Usuario` bigint(8) NOT NULL,
  INDEX `IdPerfil_PerfilUsuarios`(`Id_Perfil`) USING BTREE,
  INDEX `IdUsuario_PerfilUsuario`(`Id_Usuario`) USING BTREE,
  CONSTRAINT `IdPerfil_PerfilUsuarios` FOREIGN KEY (`Id_Perfil`) REFERENCES `perfiles` (`Id_Perfil`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `IdUsuario_PerfilUsuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of perfil_usuarios
-- ----------------------------
INSERT INTO `perfil_usuarios` VALUES (1, 1);

-- ----------------------------
-- Table structure for perfiles
-- ----------------------------
DROP TABLE IF EXISTS `perfiles`;
CREATE TABLE `perfiles`  (
  `Id_Perfil` int(4) NOT NULL AUTO_INCREMENT,
  `Perfil` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Activo` bit(1) NOT NULL,
  PRIMARY KEY (`Id_Perfil`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of perfiles
-- ----------------------------
INSERT INTO `perfiles` VALUES (1, 'Administrador', b'1');
INSERT INTO `perfiles` VALUES (2, 'Usuario Superior', b'1');
INSERT INTO `perfiles` VALUES (3, 'Usuario', b'1');

-- ----------------------------
-- Table structure for usuarios
-- ----------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios`  (
  `Id_Usuario` bigint(8) NOT NULL AUTO_INCREMENT,
  `Nombre_Completo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Cedula` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Nombre_Usuario` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Clave` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Ultimo_Login` datetime(6) NOT NULL,
  `PrimerLogin` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`Id_Usuario`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usuarios
-- ----------------------------
INSERT INTO `usuarios` VALUES (1, 'Administrador', 'admin@admin.com', '11111111', 'admin', 'admin', '2019-04-19 23:38:02.000000', 1);

SET FOREIGN_KEY_CHECKS = 1;
