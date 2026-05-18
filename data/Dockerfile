FROM postgres:15

# Установка переменных окружения для PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=presentation_ai

# Создание директории для данных
RUN mkdir -p /var/lib/postgresql/data

# Экспортируем порт PostgreSQL
EXPOSE 5432