// use wasm::api::Api;

#[test]
fn it_adds_two() {
    assert_eq!(4, 2 + 2);
}

// #[test]
// fn test_fill_rectangle() {
//     let mut api: Api = Api::init();
//     let project_uid = api.create_project("test_project", 500, 500);
//     api.set_active_project(project_uid);
//     let layer_uid = api.create_layer("layer 1", 500, 500);
//     api.set_active_layer(layer_uid);

//     // draw a rectangle near the middle
//     api.set_primary_colour(255, 100, 100, 255);
//     api.select_rect(100, 100, 100, 100);
//     api.fill_selection();

//     // draw a second rectangle in the bottom right corner
//     api.set_primary_colour(1, 2, 3, 4);
//     api.select_rect(400, 400, 100, 100);
//     api.fill_selection();

//     // top left pixel is empty
//     assert_eq!(api.pick_colour(0, 0), [0, 0, 0, 0]);

//     // the pixel at (100, 100) is the first colour
//     assert_eq!(api.pick_colour(100, 100), [255, 100, 100, 255]);

//     // the pixel in the bottom right corner is the second colour
//     assert_eq!(api.pick_colour(450, 450), [1, 2, 3, 4]);
// }
