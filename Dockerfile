FROM node:19.7.0

# Install rust
# Get Rust; NOTE: using sh for better compatibility with other base images
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Add .cargo/bin to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Check cargo is visible
RUN cargo --help

# Install wasm-pack
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install nightly toolchain
RUN rustup toolchain install nightly-2022-12-12 && rustup component add rust-src --toolchain nightly-2022-12-12

WORKDIR /app
COPY package*.json ./

# Install yarn packages
RUN yarn run ci --ignore-scripts

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Build wasm single-threaded
RUN yarn run build:wasm-single-threaded

# Build wasm multi-threaded
RUN yarn run build:wasm-multi-threaded

# Build js
RUN yarn run build:js

# Serve
CMD ["yarn", "run", "serve"]
