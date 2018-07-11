FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive
ENV XDG_CONFIG_HOME="/config" XDG_DATA_HOME="/config"
ENV LANG='C.UTF-8' LANGUAGE='C.UTF-8' LC_ALL='C.UTF-8'
ENV TERM="xterm"
ENV DOCKER="YES"

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    apt-utils \
	apt-transport-https ca-certificates \
	build-essential \
	#nano \
	#wget \
	curl \
	gnupg \
	#unzip \
	#htop \
	tzdata && \
	# install node
    curl -sL https://deb.nodesource.com/setup_8.x |bash -  && \
    apt-get install -y nodejs && \
    # install s6-overlay
    curl -s -o - -L "https://github.com/just-containers/s6-overlay/releases/download/v1.20.0.0/s6-overlay-amd64.tar.gz" | tar xzf - -C / && \
	# make folders
	mkdir -p /app /config && \
	# cleanup
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf \ 
	/tmp/* \
	/var/lib/apt/lists/* \
	/var/tmp/* 			

# create user 
RUN useradd -u 1000 -U -d /config -s /bin/false abc && \
    usermod -G users abc

# Copy App to App Folder
COPY app/ /app/

# Install app dependencies
RUN cd /app/ && \
    npm install
    
# Copy etc files
# COPY root/ /

VOLUME ["/config"]

WORKDIR /app

ENTRYPOINT ["/init"]

CMD ["node","/app/index.js"]