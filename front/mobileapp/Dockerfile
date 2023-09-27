FROM mobiledevops/flutter-sdk-image:latest

USER root

RUN mkdir /apk

WORKDIR /app

RUN flutter create mobileapp

WORKDIR /app/mobileapp

COPY ./lib ./lib

COPY ./assets ./assets

COPY ./fonts ./fonts

RUN flutter pub add http

RUN flutter pub get

RUN flutter build apk

RUN mv build/app/outputs/apk/release/app-release.apk /apk/
