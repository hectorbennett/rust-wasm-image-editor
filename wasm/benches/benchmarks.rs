use criterion::{criterion_group, criterion_main, Criterion};
use wasm::app::project::Project;


fn criterion_benchmark(c: &mut Criterion) {
    // c.bench_function("blend_pixels_old", |b| {
    //     b.iter(|| blend_pixels_old(black_box([1, 2, 3, 4]), black_box([5, 6, 7, 8])))
    // });

    // c.bench_function("blend_pixels", |b| {
    //     b.iter(|| blend_pixels(black_box([1, 2, 3, 4]), black_box([5, 6, 7, 8])))
    // });

    c.bench_function("recalculate_buffer", |b| {
        let mut project = Project::demo();
        b.iter(|| project.recalculate_buffer())
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
