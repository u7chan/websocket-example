FROM node:22-bullseye-slim

WORKDIR /workspace
COPY . /workspace

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    openssh-client \
    zip \
    locales \
    && npm i -g bun \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV LANG="ja_JP.UTF-8" \
    LANGUAGE="ja_JP:ja" \
    TZ=Asia/Tokyo
