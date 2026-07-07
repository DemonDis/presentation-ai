-- ===========================================
-- НАЧАЛЬНЫЕ ПОЛЬЗОВАТЕЛИ
-- ===========================================
-- Этот скрипт выполняется при первом запуске контейнера
-- Добавляет начальных пользователей для входа по email/паролю
--
-- Пароль для всех пользователей: 123
-- Хэш: $2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G

INSERT INTO "User" ("id", "name", "email", "password", "role", "hasAccess", "createdAt", "updatedAt")
VALUES 
    ('filin', 'filin', 'filin@filin.filin', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sav', 'sav', 'sav@sav.sav', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('alx', 'alx', 'alx@alx.alx', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('dap', 'dap', 'dap@dap.dap', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('daa', 'daa', 'daa@daa.daa', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('yvi', 'yvi', 'yvi@yvi.yvi', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('kgv', 'kgv', 'kgv@kgv.kgv', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sdd', 'sdd', 'sdd@sdd.sdd', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('vev', 'vev', 'vev@vev.vev', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('mee', 'mee', 'mee@mee.mee', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('iea', 'iea', 'iea@iea.iea', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ass', 'ass', 'ass@ass.ass', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bma', 'bma', 'bma@bma.bma', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('knv', 'knv', 'knv@knv.knv', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('olegv', 'olegv', 'olegv@olegv.olegv', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sre', 'sre', 'sre@sre.sre', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('gsa', 'gsa', 'gsa@gsa.gsa', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('lsa', 'lsa', 'lsa@lsa.lsa', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sls', 'sls', 'sls@sls.sls', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ptl', 'ptl', 'ptl@ptl.ptl', '$2b$10$tcr78JldWX7M5DseacQ55uPc4V6hv0GK9ywp6zfqDXF3yzaPSRB1G', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
