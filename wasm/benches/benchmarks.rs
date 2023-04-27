use criterion::{black_box, criterion_group, criterion_main, Criterion};
use wasm::app::utils::{blend_pixels, blend_pixels_old};

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("blend_pixels", |b| {
        b.iter(|| blend_pixels(black_box([1, 2, 3, 4]), black_box([5, 6, 7, 8])))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
