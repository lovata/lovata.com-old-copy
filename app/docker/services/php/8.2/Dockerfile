FROM php:8.2-fpm

ARG WWWGROUP
ARG WWWUSER
ARG XDEBUG
ARG NODE_VERSION=18

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND noninteractive
ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y lsb-release libcurl4-openssl-dev gnupg gosu curl ca-certificates zip \
    unzip git supervisor sqlite3 libcap2-bin libpng-dev python2 libpq-dev libonig-dev libzip-dev \
    libicu-dev libxml2-dev jpegoptim optipng pngquant gifsicle vim libjpeg-dev libfreetype6-dev \
    libssh2-1-dev libssh2-1 libwebp-dev dnsutils \
    && php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer \
    && curl -sLS https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && apt-get install -y mariadb-client \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN pecl install -o -f redis xdebug \
    &&  rm -rf /tmp/pear \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql curl mbstring zip intl gd xml exif opcache curl \
    && docker-php-ext-enable pdo pdo_mysql curl mbstring zip intl gd xml exif redis xdebug curl

RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u $WWWUSER sail

COPY start-container /usr/local/bin/start-container
COPY php.ini /usr/local/etc/php/conf.d/99-sail.ini
COPY www.conf /usr/local/etc/php-fpm.d/www.conf

RUN chmod +x /usr/local/bin/start-container

STOPSIGNAL SIGQUIT

EXPOSE 8000
ENTRYPOINT ["start-container"]

