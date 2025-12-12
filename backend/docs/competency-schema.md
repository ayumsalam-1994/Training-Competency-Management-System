# Competency & Certificate Database Schema Design

## Overview
This schema supports competency tracking, user progress, and certificate management with expiry notifications.

## Tables

### 1. competencies
Stores available competencies in the system.

```sql
CREATE TABLE competencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique identifier
- `name`: Competency name (e.g., "Basic Safety Training")
- `description`: Detailed description of what this competency covers
- `level`: Difficulty level
- `created_at`, `updated_at`: Timestamps

### 2. user_competencies
Tracks which users have achieved which competencies.

```sql
CREATE TABLE user_competencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  competency_id INT NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_competency (user_id, competency_id)
);
```

**Fields:**
- `id`: Unique identifier
- `user_id`: Reference to users table
- `competency_id`: Reference to competencies table
- `proficiency_level`: User's skill level for this competency
- `achieved_at`: When the user achieved this competency
- `notes`: Additional notes or assessor comments
- **Constraint**: One user can only achieve a competency once (UNIQUE KEY)

### 3. certificates
Stores issued certificates with expiry tracking.

```sql
CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  competency_id INT NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  pdf_path VARCHAR(500),
  verification_code VARCHAR(100) UNIQUE,
  status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
  issued_by INT,
  revoked_at TIMESTAMP NULL,
  revoked_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE,
  FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Unique identifier
- `user_id`: Who received the certificate
- `competency_id`: Which competency this certificate is for
- `issued_at`: When the certificate was issued
- `expires_at`: When the certificate expires (NULL for non-expiring certificates)
- `pdf_path`: File path to generated PDF
- `verification_code`: Unique code for certificate verification (anti-fraud)
- `status`: Current status of the certificate
- `issued_by`: Admin/Manager who issued the certificate
- `revoked_at`, `revoked_reason`: Audit trail if certificate is revoked

### 4. competency_requirements (Optional - Future Enhancement)
Maps competencies to courses/quizzes for automatic achievement.

```sql
CREATE TABLE competency_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competency_id INT NOT NULL,
  requirement_type ENUM('course', 'quiz', 'manual') NOT NULL,
  requirement_id INT,
  passing_score INT,
  FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE
);
```

## Relationships

```
users (1) ----< (many) user_competencies (many) >---- (1) competencies
users (1) ----< (many) certificates (many) >---- (1) competencies
users (1) ----< (many) certificates [issued_by]
```

## Indexes for Performance

```sql
-- Speed up user competency lookups
CREATE INDEX idx_user_competencies_user ON user_competencies(user_id);
CREATE INDEX idx_user_competencies_competency ON user_competencies(competency_id);

-- Speed up certificate searches
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_competency ON certificates(competency_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_expires ON certificates(expires_at);
```

## Sample Data

```sql
-- Sample competencies
INSERT INTO competencies (name, description, level) VALUES
('Basic Safety Training', 'Fundamental workplace safety protocols and procedures', 'beginner'),
('Advanced Technical Skills', 'Advanced programming and system administration', 'advanced'),
('Leadership Fundamentals', 'Basic leadership principles and team management', 'intermediate'),
('Data Analysis', 'Data visualization and statistical analysis', 'intermediate'),
('Project Management', 'Agile methodologies and project planning', 'advanced');
```

## Migration Strategy

1. Run table creation scripts in order (respects foreign keys)
2. Seed sample competencies
3. Test with existing user accounts
4. Add indexes after initial data load for better performance

## Notes for Implementation

- Use transactions when creating certificates (user_competencies + certificates)
- Set up a cron job to check `expires_at` daily and send notifications
- Generate unique `verification_code` using crypto library
- Store PDF files in `backend/uploads/certificates/` directory
- Consider adding `certificate_templates` table for customizable designs
