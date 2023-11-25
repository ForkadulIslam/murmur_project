-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 25, 2023 at 02:58 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ventura_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `murmurs`
--

CREATE TABLE `murmurs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `murmurs`
--

INSERT INTO `murmurs` (`id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(19, 16, 'My first post', '2023-11-25 14:58:04', '2023-11-25 14:58:04'),
(20, 16, 'My 2nd Post', '2023-11-25 14:58:11', '2023-11-25 14:58:11');

-- --------------------------------------------------------

--
-- Table structure for table `murmur_likes`
--

CREATE TABLE `murmur_likes` (
  `id` int(11) NOT NULL,
  `murmur_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `created_at`, `updated_at`) VALUES
(16, 'Fuad hasan', '$2b$10$tYjGnjQbGY84p37800WP8uGkMoVb46.q7dTLLK5wPEs98WVATt6Aq', '2023-11-25 14:57:52', '2023-11-25 14:57:52');

-- --------------------------------------------------------

--
-- Table structure for table `user_followers`
--

CREATE TABLE `user_followers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `followed_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_followers`
--

INSERT INTO `user_followers` (`id`, `user_id`, `followed_by`, `created_at`, `updated_at`) VALUES
(15, 15, 1, '2023-11-25 14:54:27', '2023-11-25 14:54:27'),
(16, 15, 11, '2023-11-25 14:54:29', '2023-11-25 14:54:29'),
(17, 15, 13, '2023-11-25 14:54:46', '2023-11-25 14:54:46'),
(18, 15, 14, '2023-11-25 14:54:47', '2023-11-25 14:54:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `murmurs`
--
ALTER TABLE `murmurs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `murmur_likes`
--
ALTER TABLE `murmur_likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_followers`
--
ALTER TABLE `user_followers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `murmurs`
--
ALTER TABLE `murmurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `murmur_likes`
--
ALTER TABLE `murmur_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_followers`
--
ALTER TABLE `user_followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
