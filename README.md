# Image Editor built with Rust/WebAssembly, TypeScript and React

![Screenshot 2023-03-10 153207](https://user-images.githubusercontent.com/23317027/224357385-d1576e8c-f9b2-45e7-b847-e373161f047c.png)

See a very early example in action at

https://seahorse-app-r8jlv.ondigitalocean.app/

## Contributing

Contributors welcome! Get in touch or check out the [good first issues](https://github.com/hectorbennett/rust-wasm-image-editor/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

## Requirements

- node v19.7.0 (Best to install via `nvm`)
- wasm-pack (installed globally with `npm install -g wasm-pack`)
- yarn

## Development

- Install packages with `yarn`. This should also automatically set up husky and install cargo watch and wasm-pack globally.
- Run the development environment with `yarn run dev`. This runs `yarn run dev:wasm` and `yarn run dev:js` simultaneously and watches for changes to both.

## Deployment

- You can test the Dockerfile with `docker build .`

## DigitalOcean app spec:

```
name: orca-app
region: lon
services:
- dockerfile_path: Dockerfile
  github:
    branch: main
    deploy_on_push: true
    repo: hectorbennett/rust-wasm-react-base
  http_port: 3000
  instance_count: 1
  instance_size_slug: basic-xxs
  name: rust-wasm-react-base
  routes:
  - path: /
  source_dir: /

```
