# Vite + React + TypeScript + Rust/WebAssembly
A minimal docker project for running a vite application on DigitalOcean with React, TypeScript and Rust/WebAssembly/Wasm all working out of the box. 

See an example in action at

https://orca-app-byv23.ondigitalocean.app/


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
