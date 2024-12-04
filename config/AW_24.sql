-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2024 a las 19:09:52
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aw_24`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones_accesibilidad`
--

CREATE TABLE `configuraciones_accesibilidad` (
  `id_usuario` int(11) NOT NULL,
  `paleta_colores` enum('alto_contraste','daltonismo','default') DEFAULT 'default',
  `tamano_fuente` enum('pequeno','mediano','grande') DEFAULT 'mediano',
  `nav_teclado` tinyint(1) DEFAULT 0,
  `acciones_personalizadas` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `capacidad_maxima` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL DEFAULT 'default.jpg',
  `tipo` enum('seminario','taller','conferencia') NOT NULL,
  `id_organizador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `descripcion`, `fecha`, `hora`, `ubicacion`, `capacidad_maxima`, `foto`, `tipo`, `id_organizador`) VALUES
(1, 'Taller de Programación', 'Aprende a programar en Python desde cero.', '2024-12-02', '14:00:00', 'Sala de Computación', 30, 'default.jpg', 'taller', 1),
(2, 'Conferencia de IA', 'Explorando el futuro de la inteligencia artificial.', '2024-12-03', '09:00:00', 'Centro de Convenciones', 200, 'default.jpg', 'conferencia', 1),
(3, 'Seminario de Marketing', 'Estrategias de marketing digital para el 2024.', '2024-12-04', '11:00:00', 'Sala de Conferencias A', 50, 'default.jpg', 'seminario', 1),
(4, 'Taller de Fotografía', 'Mejora tus habilidades fotográficas con expertos.', '2024-12-05', '15:00:00', 'Estudio de Fotografía', 20, 'default.jpg', 'taller', 1),
(5, 'Conferencia de Salud', 'Innovaciones en el cuidado de la salud.', '2024-12-06', '13:00:00', 'Auditorio de Medicina', 150, 'default.jpg', 'conferencia', 1),
(6, 'Seminario de Finanzas', 'Gestión financiera personal y empresarial.', '2024-12-07', '10:00:00', 'Sala de Conferencias B', 60, 'default.jpg', 'seminario', 2),
(7, 'Taller de Cocina', 'Cocina gourmet para principiantes.', '2024-12-08', '16:00:00', 'Cocina del Campus', 25, 'default.jpg', 'taller', 2),
(8, 'Conferencia de Educación', 'Nuevas metodologías en la educación.', '2024-12-09', '09:30:00', 'Centro Educativo', 120, 'default.jpg', 'conferencia', 1),
(9, 'Seminario de Derecho', 'Actualizaciones en leyes y regulaciones.', '2024-12-10', '11:30:00', 'Sala de Derecho', 80, 'default.jpg', 'seminario', 2),
(10, 'Taller de Música', 'Técnicas avanzadas de composición musical.', '2024-12-11', '14:30:00', 'Estudio de Música', 15, 'default.jpg', 'taller', 1),
(11, 'Conferencia de Medio Ambiente', 'Soluciones sostenibles para el futuro.', '2024-12-12', '10:00:00', 'Auditorio Verde', 180, 'default.jpg', 'conferencia', 1),
(12, 'Seminario de Historia', 'Explorando eventos históricos clave.', '2024-12-13', '13:00:00', 'Sala de Historia', 70, 'default.jpg', 'seminario', 1),
(13, 'Taller de Arte', 'Técnicas de pintura y escultura.', '2024-12-14', '15:00:00', 'Estudio de Arte', 20, 'default.jpg', 'taller', 1),
(14, 'Conferencia de Negocios', 'Innovaciones en el mundo empresarial.', '2024-12-15', '09:00:00', 'Centro de Negocios', 250, 'default.jpg', 'conferencia', 2),
(15, 'Seminario de Psicología', 'Nuevas investigaciones en psicología.', '2024-12-16', '11:00:00', 'Sala de Psicología', 90, 'default.jpg', 'seminario', 2),
(16, 'Taller de Jardinería', 'Cultivo y cuidado de plantas.', '2024-12-17', '14:00:00', 'Jardín Botánico', 30, 'default.jpg', 'taller', 2),
(17, 'Conferencia de Tecnología', 'Avances en tecnología de la información.', '2024-12-18', '10:30:00', 'Auditorio de Tecnología', 200, 'default.jpg', 'conferencia', 2),
(18, 'Seminario de Literatura', 'Análisis de obras literarias clásicas.', '2024-12-19', '13:30:00', 'Sala de Literatura', 50, 'default.jpg', 'seminario', 2),
(19, 'Taller de Diseño Gráfico', 'Herramientas y técnicas de diseño.', '2024-12-20', '15:30:00', 'Laboratorio de Diseño', 25, 'default.jpg', 'taller', 2),
(20, 'aaa', 'aaa', '2024-12-18', '11:11:00', 'Informatica', 12, '1733266043292-398414186.png', 'seminario', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `estado` enum('inscrito','lista_espera') NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `id_usuario`, `id_evento`, `estado`, `fecha_inscripcion`) VALUES
(11, 3, 1, 'inscrito', '2024-12-04 17:13:29'),
(17, 3, 2, 'inscrito', '2024-12-04 18:48:32'),
(18, 1, 3, 'inscrito', '2024-12-04 18:49:52'),
(19, 1, 2, 'inscrito', '2024-12-04 18:49:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `info` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `leida` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `id_usuario`, `tipo`, `info`, `fecha`, `leida`) VALUES
(1, 3, 'CANCELACION_EVENTO', '1', '2024-12-03 23:00:00', 1),
(2, 3, 'CONFIRMACION_INSCRIPCION', '3', '2024-12-04 13:58:38', 1),
(3, 3, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 13:58:46', 1),
(4, 3, 'CONFIRMACION_INSCRIPCION', '19', '2024-12-04 13:59:07', 0),
(5, 3, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 14:42:04', 0),
(6, 3, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 16:07:53', 0),
(7, 3, 'CONFIRMACION_INSCRIPCION', '3', '2024-12-04 16:08:02', 0),
(8, 3, 'CONFIRMACION_INSCRIPCION', '1', '2024-12-04 16:13:29', 0),
(9, 3, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 16:13:30', 1),
(10, 3, 'CONFIRMACION_INSCRIPCION', '3', '2024-12-04 16:16:31', 0),
(11, 3, 'CONFIRMACION_INSCRIPCION', '5', '2024-12-04 16:16:35', 1),
(12, 3, 'CONFIRMACION_INSCRIPCION', '4', '2024-12-04 16:16:38', 1),
(13, 3, 'DESINSCRIPCION_EVENTO', '2', '2024-12-04 16:26:42', 1),
(14, 1, 'CONFIRMACION_INSCRIPCION', '3', '2024-12-04 17:45:44', 0),
(15, 3, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 17:48:32', 0),
(16, 1, 'CONFIRMACION_INSCRIPCION', '3', '2024-12-04 17:49:52', 0),
(17, 1, 'CONFIRMACION_INSCRIPCION', '2', '2024-12-04 17:49:54', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('-gIb1CuNjU89jVKTmIAS-PzcsaFq9QX3', 1733421853, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":{\"id\":1,\"nombre\":\"Juan Pérez\",\"correo\":\"juan.perez@example.com\",\"contrasena\":\"1234\",\"telefono\":\"123456789\",\"facultad\":\"Informática\",\"rol\":\"organizador\"}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `facultad` varchar(255) NOT NULL,
  `rol` enum('organizador','asistente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `telefono`, `facultad`, `rol`) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '1234', '123456789', 'Informática', 'organizador'),
(2, 'María López', 'maria.lopez@example.com', '1234', '987654321', 'Economía', 'organizador'),
(3, 'asistente1', 'asistente1@gmail.com', '1234', '111111111', 'Medicina', 'asistente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuraciones_accesibilidad`
--
ALTER TABLE `configuraciones_accesibilidad`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
