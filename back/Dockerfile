FROM php:8.2-cli

WORKDIR /var/www/html

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    unzip \
    libicu-dev \
    && docker-php-ext-install intl mysqli

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]