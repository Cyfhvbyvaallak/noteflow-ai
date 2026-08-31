-- NoteFlow AI: Intelligent Speech-to-Study Automation Platform
-- Database Schema for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `noteflow_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `noteflow_ai`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Lectures Table
CREATE TABLE IF NOT EXISTS `lectures` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `source_type` ENUM('RECORDING', 'AUDIO_UPLOAD', 'VIDEO_UPLOAD', 'PDF_UPLOAD') NOT NULL DEFAULT 'AUDIO_UPLOAD',
    `file_path` VARCHAR(500) NULL,
    `duration` INT DEFAULT 0 COMMENT 'Duration in seconds',
    `status` ENUM('UPLOADED', 'TRANSCRIBING', 'TRANSCRIBED', 'GENERATING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'UPLOADED',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_lectures_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_lectures_user_id` (`user_id`),
    INDEX `idx_lectures_status` (`status`),
    INDEX `idx_lectures_subject` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Transcripts Table
CREATE TABLE IF NOT EXISTS `transcripts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lecture_id` INT NOT NULL UNIQUE,
    `transcript_text` LONGTEXT NOT NULL,
    `language` VARCHAR(50) DEFAULT 'en',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_transcripts_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE,
    INDEX `idx_transcripts_lecture_id` (`lecture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Summaries Table
CREATE TABLE IF NOT EXISTS `summaries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lecture_id` INT NOT NULL UNIQUE,
    `summary_text` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_summaries_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE,
    INDEX `idx_summaries_lecture_id` (`lecture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. KeyPoints Table
CREATE TABLE IF NOT EXISTS `key_points` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lecture_id` INT NOT NULL,
    `content` JSON NOT NULL COMMENT 'JSON array of key bullet points with title and details',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_key_points_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE,
    INDEX `idx_key_points_lecture_id` (`lecture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. RevisionNotes Table
CREATE TABLE IF NOT EXISTS `revision_notes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lecture_id` INT NOT NULL,
    `content` JSON NOT NULL COMMENT 'JSON object containing topics, important_concepts, definitions, explanations, examples, quick_revision_points',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_revision_notes_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE,
    INDEX `idx_revision_notes_lecture_id` (`lecture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Quizzes Table
CREATE TABLE IF NOT EXISTS `quizzes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lecture_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quizzes_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE,
    INDEX `idx_quizzes_lecture_id` (`lecture_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Questions Table
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` INT NOT NULL,
    `question` TEXT NOT NULL,
    `option_a` VARCHAR(500) NOT NULL,
    `option_b` VARCHAR(500) NOT NULL,
    `option_c` VARCHAR(500) NOT NULL,
    `option_d` VARCHAR(500) NOT NULL,
    `correct_answer` VARCHAR(10) NOT NULL COMMENT 'A, B, C, or D',
    `explanation` TEXT NOT NULL,
    CONSTRAINT `fk_questions_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
    INDEX `idx_questions_quiz_id` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. QuizAttempts Table
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `quiz_id` INT NOT NULL,
    `score` INT NOT NULL,
    `percentage` DECIMAL(5,2) NOT NULL,
    `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quiz_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_quiz_attempts_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
    INDEX `idx_quiz_attempts_user_id` (`user_id`),
    INDEX `idx_quiz_attempts_quiz_id` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notes Table
CREATE TABLE IF NOT EXISTS `notes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `lecture_id` INT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `subject` VARCHAR(100) DEFAULT 'General',
    `tags` VARCHAR(255) DEFAULT '',
    `is_favorite` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notes_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE SET NULL,
    INDEX `idx_notes_user_id` (`user_id`),
    INDEX `idx_notes_lecture_id` (`lecture_id`),
    INDEX `idx_notes_subject` (`subject`),
    INDEX `idx_notes_favorite` (`is_favorite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
