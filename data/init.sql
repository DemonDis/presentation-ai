-- ===========================================
-- НАЧАЛЬНЫЕ ПОЛЬЗОВАТЕЛИ
-- ===========================================
-- Этот скрипт выполняется при первом запуске контейнера
-- Добавляет начальных пользователей для входа по email/паролю
--
-- Пароль для всех пользователей: 123
-- Хэш: $2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G

-- Администратор (пароль: 123)
INSERT INTO "User" ("id", "name", "email", "password", "role", "hasAccess", "createdAt", "updatedAt")
VALUES (
    'admin_user_001',
    'Администратор',
    'admin@presentation-ai.local',
    '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Тестовый пользователь (пароль: 123)
INSERT INTO "User" ("id", "name", "email", "password", "role", "hasAccess", "createdAt", "updatedAt")
VALUES (
    'test_user_001',
    'Тестовый пользователь',
    'user@presentation-ai.local',
    '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G',
    'USER',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;