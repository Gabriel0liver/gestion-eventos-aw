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
-- Base de datos: `AW_24`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones_accesibilidad`
--

CREATE TABLE `configuraciones_accesibilidad` (
  `id_usuario` int(11) NOT NULL,
  `paleta_colores` enum('alto_contraste','daltonismo','default') DEFAULT 'default',
  `tamano_fuente` enum('pequeno','mediano','grande') DEFAULT 'mediano'
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
(1, 'Programación dos personas', 'Aprende a programar en Python desde cero.', '2024-12-02', '14:00:00', 'Sala de Computación', 2, 'default.jpg', 'taller', 1),
(2, 'Conferencia de IA', 'Explorando el futuro de la inteligencia artificial.', '2024-12-03', '09:00:00', 'Centro de Convenciones', 200, 'default.jpg', 'conferencia', 1),
(3, 'Seminario de Marketing', 'Estrategias de marketing digital para el 2024.', '2024-12-04', '11:00:00', 'Sala de Conferencias A', 50, 'default.jpg', 'seminario', 1),
(4, 'Taller de Fotografía', 'Mejora tus habilidades fotográficas con expertos.', '2024-12-05', '15:00:00', 'Estudio de Fotografía', 20, 'default.jpg', 'taller', 1),
(5, 'Conferencia de Salud', 'Innovaciones en el cuidado de la salud.', '2024-12-06', '13:00:00', 'Auditorio de Medicina', 150, 'default.jpg', 'conferencia', 1),
(6, 'Seminario de Finanzas', 'Gestión financiera personal y empresarial.', '2024-12-07', '10:00:00', 'Sala de Conferencias B', 60, 'default.jpg', 'seminario', 1),
(7, 'Taller de Cocina', 'Cocina gourmet para principiantes.', '2024-12-08', '16:00:00', 'Cocina del Campus', 25, 'default.jpg', 'taller', 1),
(8, 'Conferencia de Educación', 'Nuevas metodologías en la educación.', '2024-12-09', '09:30:00', 'Centro Educativo', 120, 'default.jpg', 'conferencia', 1),
(9, 'Seminario de Derecho', 'Actualizaciones en leyes y regulaciones.', '2024-12-10', '11:30:00', 'Sala de Derecho', 80, 'default.jpg', 'seminario', 1),
(10, 'Taller de Música', 'Técnicas avanzadas de composición musical.', '2024-12-11', '14:30:00', 'Estudio de Música', 15, 'default.jpg', 'taller', 1);

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


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Juan', 'juan@ucm.es', '1234', '123456789', 'Informática', 'organizador'),
(2, 'Pablo', 'pablo@ucm.es', '1234', '123456789', 'Informática', 'asistente'),
(3, 'Miguel', 'miguel@ucm.es', '1234', '123456789', 'Informática', 'asisente');

--
-- Volcado de datos para la tabla `configuraciones_accesibilidad`
--

INSERT INTO `configuraciones_accesibilidad` (`id_usuario`, `paleta_colores`, `tamano_fuente`) VALUES
(1, 'default', 'mediano'),
(2, 'default', 'mediano'),
(3, 'default', 'mediano');

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `id_usuario`, `id_evento`, `estado`, `fecha_inscripcion`) VALUES
(1, 3, 1, 'inscrito', '2024-12-04 17:13:29'),
(2, 3, 1, 'inscrito', '2024-12-04 18:48:32');


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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
