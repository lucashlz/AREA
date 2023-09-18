FROM cirrusci/flutter:2.5.0

WORKDIR /usr/src/app

COPY front/mobileapp/ .

RUN flutter build apk

RUN mv build/app/outputs/flutter-apk/app-release.apk /shared/client.apk
