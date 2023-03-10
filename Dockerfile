FROM node:19.7.0

ENV NODE_ENV=production

# Install rust
# Get Rust; NOTE: using sh for better compatibility with other base images
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Add .cargo/bin to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Check cargo is visible
RUN cargo --help

WORKDIR /app
COPY package*.json ./

RUN npm install -g wasm-pack
RUN yarn run ci

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
RUN yarn run build
CMD ["npm", "run", "serve"]
