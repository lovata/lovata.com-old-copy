FROM php:8.2-fpm

ARG APP_ENV=${APP_ENV:-local}
ARG NODE_VERSION=18

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND noninteractive
ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y lsb-release libcurl4-openssl-dev gnupg gosu curl ca-certificates zip \
    unzip git supervisor sqlite3 libcap2-bin libpng-dev libpq-dev libonig-dev libzip-dev \
    libicu-dev libxml2-dev jpegoptim optipng pngquant gifsicle vim libjpeg-dev libfreetype6-dev libwebp-dev \
    libssh2-1-dev libssh2-1 nginx python3 python3-pip \
    && curl -sLS https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer \
    && apt-get install -y mariadb-client \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql curl mbstring zip intl gd xml exif opcache curl \
    && docker-php-ext-enable pdo pdo_mysql curl mbstring zip intl gd xml exif redis curl

COPY docker/services/php/8.2/build/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/services/php/8.2/build/nginx.conf /etc/nginx/nginx.conf
COPY docker/services/nginx/config/domain.conf /etc/nginx/conf.d/default.conf
COPY docker/services/php/8.2/build/start-container /usr/local/bin/start-container
COPY docker/services/php/8.2/php.ini /usr/local/etc/php/conf.d/99-sail.ini
COPY docker/services/nginx/config/snippets/ /etc/nginx/snippets/
COPY ./ /var/www/html/

RUN sed -i -e 's/backend.loc/127.0.0.1/g' /etc/nginx/snippets/php.conf \
        && chmod +x /usr/local/bin/start-container

RUN composer install --no-dev -q --no-ansi --no-interaction --no-progress --prefer-dist --no-scripts  \
    && composer clearcache \
    && composer run-script post-autoload-dump \
    && chown -hR www-data:www-data ./* \
    && php artisan vite:ci && php artisan vite:build --clean \
    && find . -type d \( -path './plugins' -or  -path './storage' -or  -path './themes' -or  -path './plugins/*' -or  -path './storage/*' -or  -path './themes/*' \) -exec chmod g+ws {} \;

# CLEANING
RUN rm -rf /var/www/html/docker \
    && rm -rf /var/www/html/.github \
    && rm -rf /var/www/html/Makefile \
    && rm /var/www/html/docker-compose.yml \
    && rm /var/www/html/phpcs.xml \
    && rm /var/www/html/phpunit.xml \
    && rm /var/www/html/README.md

EXPOSE 8000
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["start-container"]

