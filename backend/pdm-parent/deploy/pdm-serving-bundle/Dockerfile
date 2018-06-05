# Docker image that contains a PdM Serving Layer application.
# > docker build -t "bistelinc/serving-rest:1.0.0" .

# Basic Docker image to run Java applications.
# This image is based on AlpineLinux to keep the size down, yet smaller images do exist.
# Includes BASH, since many Java applications like to have convoluted BASH start-up scripts.
# specific :8uXXXbYY tags (such as :8u102b14, :8u112b15)
# _unlimited -> Latest JRE8/JDK8 Version: 8u172b11
FROM anapsix/alpine-java:8_jdk_unlimited

# allow arg override of required env params
ARG SERVING_HOST
ENV SERVING_HOST=${SERVING_HOST}
ARG SERVING_PORT
ENV SERVING_PORT=${SERVING_PORT}

# repository
ARG SERVING_REPOSITORY_URL
ENV SERVING_REPOSITORY_URL=${SERVING_REPOSITORY_URL}
ARG SERVING_REPOSITORY_USER
ENV SERVING_REPOSITORY_USER=${SERVING_REPOSITORY_USER}
ARG SERVING_REPOSITORY_PASS
ENV SERVING_REPOSITORY_PASS=${SERVING_REPOSITORY_PASS}
ARG SERVING_REPOSITORY_MAX_POOLSIZE
ENV SERVING_REPOSITORY_MAX_POOLSIZE=${SERVING_REPOSITORY_MAX_POOLSIZE}
ARG SERVING_REPOSITORY_MIN_IDLE
ENV SERVING_REPOSITORY_MIN_IDLE=${SERVING_REPOSITORY_MIN_IDLE}

ENV COMPONENT=bistel-pdm
ENV HOME=/usr/local/${COMPONENT}/serving-rest

# Create directory to hold the application and all its contents in the Docker image.
RUN echo " ===== setting up serving-rest ===== " \
    && mkdir -p ${HOME}/config \
    && mkdir -p ${HOME}/logs \
    && mkdir -p ${HOME}/lib \
    && chmod -R ag+w ${HOME}

# Copy all the static contents to be included in the Docker image.
COPY target/serving-rest/pdm-serving-bundle-1.0-SNAPSHOT.jar ${HOME}
COPY src/main/resources/log4j.properties ${HOME}/config
COPY target/serving-rest/repository.properties ${HOME}/config
COPY target/serving-rest/lib/* ${HOME}/lib/
#RUN chmod +x ${HOME}/*.sh

#VOLUME ["${HOME}"]

EXPOSE 8080
EXPOSE 28000

WORKDIR ${HOME}

CMD java -Xmx512m -Xms256m -jar pdm-serving-bundle-1.0-SNAPSHOT.jar \
    -server ${SERVING_HOST} \
    -port ${SERVING_PORT} \
    -log4jConf ${HOME}/config/log4j.properties
