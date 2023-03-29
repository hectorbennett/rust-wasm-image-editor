# Image Editor built with Rust/WebAssembly, TypeScript and React

![Screenshot 2023-03-10 153207](https://user-images.githubusercontent.com/23317027/224357385-d1576e8c-f9b2-45e7-b847-e373161f047c.png)


See a very early example in action at

https://seahorse-app-r8jlv.ondigitalocean.app/

Contributors welcome! Get in touch!


## Requirements

- node v19.7.0
- wasm-pack (installed globally with `npm install -g wasm-pack`)
- yarn

## Development

 - Install packages with `yarn`. This should also automatically set up husky and install cargo watch.
 - Run the development environment with `yarn run dev`. This runs `yarn run dev:wasm` and `yarn run dev:js` simultaneously and watches for changes to both.

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
