FROM ubuntu:20.04

RUN mkdir -p /var/www/html/
WORKDIR /var/www/html/

ARG WWWGROUP
ARG WWWUSER

ENV TZ=UTC

ARG PHP_VERSION="8.2"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update \
    && apt install -y python3 python3-dev python3-pip ansible libcurl4-openssl-dev \
    gnupg gosu ca-certificates curl libzip-dev zip unzip git supervisor software-properties-common \
    certbot \
    && apt clean

RUN add-apt-repository -y ppa:ondrej/php \
    && apt update \
    && apt install -y php${PHP_VERSION}-cli php${PHP_VERSION}-zip \
    php${PHP_VERSION}-mbstring php${PHP_VERSION}-dom \
    php${PHP_VERSION}-pgsql php${PHP_VERSION}-mysql \
    php${PHP_VERSION}-redis php${PHP_VERSION}-curl \
    php${PHP_VERSION}-gd

RUN php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog

RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u $WWWUSER sail

CMD ["bash"]
