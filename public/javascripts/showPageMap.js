mapboxgl.accessToken = mapToken;
const campgroundMap = JSON.parse(campground);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campgroundMap.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campgroundMap.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campgroundMap.title}</h3><p>${campgroundMap.location}</p>`
    )
  )
  .addTo(map);
