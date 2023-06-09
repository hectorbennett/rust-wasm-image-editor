################
##### rust
FROM rust:1.66 as wasm_build

WORKDIR /app

# use nightly rust
# RUN rustup override set nightly-2022-12-12
RUN rustup toolchain install nightly-2022-12-12
RUN rustup component add rust-src --toolchain nightly-2022-12-12

# Install wasm pack and wasm-bindgen-cli
RUN cargo +nightly-2022-12-12 install wasm-pack
RUN cargo +nightly-2022-12-12 install wasm-bindgen-cli
# RUN cargo +nightly-2022-12-12 wasm-bindgen-cli

# Cache dependencies by building a dummy project
COPY wasm/Cargo.toml .
RUN mkdir src && touch src/lib.rs && mkdir benches && touch benches/benchmarks.rs
RUN cargo +nightly-2022-12-12 build

# Now copy all the files from wasm
COPY wasm/ .

# compile multi-threaded
RUN rustup override set nightly-2022-12-12 && RUSTFLAGS='-C target-feature=+atomics,+bulk-memory,+mutable-globals' rustup run nightly-2022-12-12 wasm-pack build --target web --release --out-dir pkg-parallel -- --features parallel -Z build-std=panic_abort,std

# compile single-threaded
RUN rustup run nightly-2022-12-12 wasm-pack build --target web --release


################
##### node
FROM node:19.7.0 as ts_build

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts && yarn cache clean

COPY . .

COPY --from=wasm_build /app wasm

ENV NODE_ENV=production
EXPOSE 3000

# Build js
RUN yarn run build:js

# Serve
CMD ["yarn", "run", "serve"]
