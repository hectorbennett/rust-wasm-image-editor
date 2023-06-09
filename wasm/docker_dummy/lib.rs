// This file is so docker can do build caching

#![feature(portable_simd)]


#[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;
