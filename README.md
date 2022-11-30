# Image Editor built with Rust/WebAssembly, TypeScript and React

See a very early example in action at

https://seahorse-app-r8jlv.ondigitalocean.app/


Version 1:
 - [x] Resizable UI
 - [x] Settings - Keyboard shortcuts - https://mantine.dev/others/spotlight/
 - [x] Command pallette - https://mantine.dev/others/spotlight/
 - [ ] Square select
 - [ ] Oval select
 - [ ] New
 - [ ] Open
 - [ ] Save
 - [ ] Export
 - [ ] Resize Canvas
 - [ ] Resize layers
 - [ ] Move layers
 - [ ] Reorder layers
 - [ ] Store settings and state in localStorage (or similar)
 - [ ] Select All
 - [ ] Select None
 - [ ] Invert Selection
 - [ ] Colour picker
 - [ ] Paintbrush tool with brush sizes and brush types
 - [ ] Eraser
 - [ ] Zoom
 - [ ] App Name
 - [ ] Favicon
 - [ ] Page title
 - [ ] Persist state on refresh
 - [ ] Remove 'any' types.
 - [ ] Error boundaries
 - [ ] Language support

Version 2:
 - [ ] Light and dark Theme
 - [ ] Customise keyboard shortcuts
 - [ ] undo/redo


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
