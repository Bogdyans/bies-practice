GRANT CONNECT ON DATABASE promtech TO user1;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO user1;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE ON TABLES TO user1;

-- Organization table
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO organizations (id ,name)
VALUES
    (1, 'First'),
    (2, 'Second');

-- Department table (Otdel)
CREATE TABLE otdels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id BIGINT NOT NULL,
    CONSTRAINT fk_otdel_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

INSERT INTO otdels (id ,name, organization_id)
VALUES
    (1, 'Firsto', 1),
    (2, 'Secondo', 1),
    (3, 'Thirdo', 2),
    (4, 'Fourtho', 1);

-- Role table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO roles (id, name, description)
VALUES
    (1, 'Admin', 'Adds and deletes users'),
    (2, 'User', 'Jsut a fellow worker'),
    (3, 'News Maker', 'Makes news');

-- User table (using BIGSERIAL instead of UUID)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO users(login, password_hash, role_id)
VALUES ('admin', '$2b$10$FVheI9md2B/QcDFpugVlB.df3GXt/YidAdN7hzRDqoBorIQHMIXKG', 1);

-- User profile table
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY,
    fio VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    job_title VARCHAR(50),
    otdel_id BIGINT,
    location VARCHAR(255),
    pseudonim VARCHAR(100),
    photo_url VARCHAR(255),
    CONSTRAINT fk_userprofile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_userprofile_otdel FOREIGN KEY (otdel_id) REFERENCES otdels(id)
);

-- Theme table
CREATE TABLE themes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO themes(id, name)
VALUES (1, 'hr'),
       (2, 'development'),
       (3, 'labor protection'),
       (4, 'it'),
       (5, 'social programs'),
       (6, 'sports');

-- Question table
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    theme_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_theme FOREIGN KEY (theme_id) REFERENCES themes(id),
    CONSTRAINT fk_question_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Answer table
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE ,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Document table
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    otdel_id BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_document_otdel FOREIGN KEY (otdel_id) REFERENCES otdels(id),
    CONSTRAINT fk_document_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- News table
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    organization_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    publish_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_news_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_news_user FOREIGN KEY (author_id) REFERENCES users(id)
);


CREATE TABLE news_photos (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    image_path VARCHAR(512) NOT NULL,
    caption VARCHAR(255),
    CONSTRAINT fk_photos_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

CREATE TABLE answer_people (
    question_theme_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL,
    user_profile_id BIGINT,
    CONSTRAINT fk_theme_id FOREIGN KEY (question_theme_id) REFERENCES themes(id) ON DELETE CASCADE,
    CONSTRAINT fk_profile_id FOREIGN KEY (user_profile_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY (question_theme_id, organization_id) -- Составной первичный ключ
);

-- Notification table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Индексы для улучшения производительности
CREATE INDEX idx_question_theme ON questions(theme_id);
CREATE INDEX idx_question_user ON questions(user_id);
CREATE INDEX idx_answer_question ON answers(question_id);
CREATE INDEX idx_document_otdel ON documents(otdel_id);
CREATE INDEX idx_news_organization ON news(organization_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_userprofile_otdel ON user_profiles(otdel_id);
CREATE INDEX idx_user_role ON users(role_id);

GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE questions_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE answers_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE news_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE news_photos_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE documents_id_seq TO user1;
GRANT USAGE, SELECT ON SEQUENCE notifications_id_seq TO user1;


