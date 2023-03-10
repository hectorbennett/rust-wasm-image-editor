# Image Editor built with Rust/WebAssembly, TypeScript and React

See a very early example in action at

https://seahorse-app-r8jlv.ondigitalocean.app/

Contributors welcome! Get in touch!

## Requirements

 - node v19.7.0
 - wasm-pack (installed globally with `npm install -g wasm-pack`)
 - yarn

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
