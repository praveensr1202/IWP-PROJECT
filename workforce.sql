-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2021 at 03:42 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workforce`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` text NOT NULL,
  `date` text NOT NULL,
  `address` varchar(200) NOT NULL,
  `customer_ph_no` bigint(20) NOT NULL,
  `prof_name` text NOT NULL,
  `service_name` text NOT NULL,
  `prof_ph_no` bigint(20) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `prof_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `service_id`, `user_id`, `status`, `date`, `address`, `customer_ph_no`, `prof_name`, `service_name`, `prof_ph_no`, `price`, `prof_id`) VALUES
(1, 1, 2, 'COMPLETED', '09-12-2021', '8-2-120/202 NOOR nagar NBTR Hospital ', 7639124776, 'mahesh', 'AC servicing', 8897936536, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `otp_auth`
--

CREATE TABLE `otp_auth` (
  `id` int(11) NOT NULL,
  `otp` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp_auth`
--

INSERT INTO `otp_auth` (`id`, `otp`, `email`) VALUES
(1, 388076, 'maheshchowdary13102001@gmail.com'),
(2, 288172, 'maheshmodi555@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `professionals`
--

CREATE TABLE `professionals` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` text NOT NULL,
  `ph_no` bigint(20) NOT NULL,
  `userid` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `pincode` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `professionals`
--

INSERT INTO `professionals` (`id`, `email`, `name`, `ph_no`, `userid`, `status`, `pincode`) VALUES
(1, 'maheshchowdary13102001@gmail.com', 'mahesh', 8897936536, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prof_otp_auth`
--

CREATE TABLE `prof_otp_auth` (
  `id` int(11) NOT NULL,
  `otp` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prof_otp_auth`
--

INSERT INTO `prof_otp_auth` (`id`, `otp`, `email`) VALUES
(1, 948401, 'maheshchowdary13102001@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `prof_requests`
--

CREATE TABLE `prof_requests` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `ph_no` bigint(20) NOT NULL,
  `work_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_name` text NOT NULL,
  `price_type` text NOT NULL,
  `price` int(11) NOT NULL,
  `time` int(11) DEFAULT NULL,
  `additional_charges` int(11) NOT NULL,
  `prof_id` int(11) NOT NULL,
  `status` text NOT NULL DEFAULT 'ADDED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_name`, `price_type`, `price`, `time`, `additional_charges`, `prof_id`, `status`) VALUES
(1, 'AC servicing', 'constant', 250, NULL, 1, 1, 'ADDED'),
(2, 'AC repair', 'duration', 200, 2, 1, 1, 'REMOVED'),
(3, 'AC Installation', 'constant', 400, NULL, 0, 1, 'ADDED'),
(4, 'AC Uninstalling', 'constant', 300, NULL, 1, 1, 'REMOVED');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `status`) VALUES
(1, 'maheshchowdary13102001@gmail.com', 1),
(2, 'maheshmodi555@gmail.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_auth`
--
ALTER TABLE `otp_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `professionals`
--
ALTER TABLE `professionals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prof_otp_auth`
--
ALTER TABLE `prof_otp_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prof_requests`
--
ALTER TABLE `prof_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `otp_auth`
--
ALTER TABLE `otp_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `professionals`
--
ALTER TABLE `professionals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prof_otp_auth`
--
ALTER TABLE `prof_otp_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prof_requests`
--
ALTER TABLE `prof_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
