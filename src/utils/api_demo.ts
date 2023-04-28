export default async function api_demo(api) {
  await api.create_project();
  // red square layer
  await api.set_primary_colour(255, 0, 0, 150);
  await api.select_rect(100, 150, 150, 150);
  await api.fill_selection();

  // green square layer
  await api.create_layer();
  await api.set_primary_colour(0, 255, 0, 150);
  await api.select_rect(220, 100, 180, 150);
  await api.fill_selection();

  // blue circle layer
  await api.create_layer();
  await api.set_primary_colour(0, 0, 255, 150);
  await api.select_ellipse(180, 200, 200, 200);
  await api.fill_selection();

  // clear selection
  await api.select_none();

  const state = await api.state;
  const layer_uids = get_layer_uids(state);
  await api.reeorder_layers(layer_uids.reverse());
}

const get_layer_uids = (state) => {
  return state.projects.get(state.active_project_uid).layers.map((layer) => layer.uid);
};
