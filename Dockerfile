################
##### rust
FROM rust:1.66 as wasm_build

WORKDIR /app

# use nightly rust
RUN rustup toolchain install nightly-2022-12-12
RUN rustup component add rust-src --toolchain nightly-2022-12-12

# Install wasm pack
RUN cargo +nightly-2022-12-12 install wasm-pack

# Cache dependencies by building a dummy project
COPY wasm/Cargo.toml .
COPY wasm/docker_dummy/lib.rs src/lib.rs
RUN mkdir benches && touch benches/benchmarks.rs

# compile dummy multi-threaded
RUN rustup override set nightly-2022-12-12 && RUSTFLAGS='-C target-feature=+atomics,+bulk-memory,+mutable-globals' rustup run nightly-2022-12-12 wasm-pack build --target web --release --out-dir pkg-parallel -- --features parallel -Z build-std=panic_abort,std

# compile dummy single-threaded
RUN rustup run nightly-2022-12-12 wasm-pack build --target web --release

# delete the dummy lib.rs
RUN rm src/lib.rs

# Now copy all the files from wasm
COPY wasm/ .

# compile real multi-threaded
RUN rustup override set nightly-2022-12-12 && RUSTFLAGS='-C target-feature=+atomics,+bulk-memory,+mutable-globals' rustup run nightly-2022-12-12 wasm-pack build --target web --release --out-dir pkg-parallel -- --features parallel -Z build-std=panic_abort,std

# compile real single-threaded
RUN rustup run nightly-2022-12-12 wasm-pack build --target web --release


################
##### node
FROM node:19.7.0 as ts_build

WORKDIR /app

# Cache dependencies by just copying package info
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts && yarn cache clean

# Now copy everything into our directory
COPY . .
COPY --from=wasm_build /app wasm

ENV NODE_ENV=production

# Build js
RUN yarn run build:js

# Serve
EXPOSE 3000
CMD ["yarn", "run", "serve"]
