FROM php:8.2-cli

ENV TZ=Europe/Moscow
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

COPY crontab /etc/cron.d/app-cron
RUN chmod 0644 /etc/cron.d/app-cron

CMD ["cron", "-f"]