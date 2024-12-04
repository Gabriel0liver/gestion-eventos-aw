-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2024 a las 01:14:00
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
(1, 3, 1, 'inscrito', '2024-12-04 00:14:20'),
(2, 3, 20, 'inscrito', '2024-12-04 00:28:35');

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
('tDrWJRSv2hD3hncg8seXLMHQT6kZvAAQ', 1733357626, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":{\"id\":3,\"nombre\":\"asistente1\",\"correo\":\"asistente1@gmail.com\",\"contrasena\":\"1234\",\"telefono\":\"111111111\",\"facultad\":\"Medicina\",\"rol\":\"asistente\"}}');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
