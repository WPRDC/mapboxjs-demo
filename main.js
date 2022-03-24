// add your own access token here, this one only works on the github page
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJjbDE1OG9ucjgwZXVnM2pydmFzYXl6YWlyIn0.ckCSKmvQ0SL5QtktP1GFpw';

// instantiate our map, center and zoom specify the default viewport
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stevendsaylor/ckd6iq0n702if1inv6rbbq5bg',
    center: [-79.99, 40.44],  // pittsburgh-ish
    zoom: 11.15
});


// when our map object is ready, tell it add sources and layers
map.on('load', () => {
    // This is the geojson representation of the City of Pittsburgh Water Feature data (drinking/monument fountains, spray parks etc.)
    map.addSource('water-features', {
        'type': 'geojson',
        'data': 'https://data.wprdc.org/dataset/fe7cfb11-9f33-4590-a5ee-04419f3f974a/resource/f7c252a5-28be-43ab-95b5-f3eb0f1eef67/download/wf_img.geojson'
    });

    // Add a layer showing the water features
    map.addLayer({
        'id': 'water-features/circle',
        'type': 'circle',
        'source': 'water-features',
        'paint': {
            'circle-color': '#12bdd3',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    // We pass three arguments to `map.on`.
    //  1st: name of the action we want it to listen to: 'click'
    //  2nd: the id of the layer we want it to listen for 'click's on: 'water-features/circle'
    map.on(
        'click',
        'water-features/circle',
        (e) => {
            // Copy coordinates array to place our popup
            const coordinates = e.features[0].geometry.coordinates.slice();

            // get the properties from the water-feature feature we clicked on.
            const properties = e.features[0].properties;


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            // make our new popup with the properties data for our clicked feature
            const popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                        <h1 class="popup-title">${properties.name}</h1>
                        <div class="id-field">${properties.id}</div>
                        <div class="record">
                            <span class="field">Type:</span>
                            <span class="value">${properties.feature_type}</span>
                        </div>
                        <div class="record">
                            <span class="field">Make:</span>
                            <span class="value">${properties.make}</span>
                        </div>
                        <div class="record">
                            <span class="field">Control Type:</span>
                            <span class="value">${properties.control_type}</span>
                        </div>
                        <img src="${properties.image}" class="image" alt="photo of ${properties.name}"">
                `)
            // add it to the map
            popup.addTo(map);
        });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'water-features/circle', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'water-features/circle', () => {
        map.getCanvas().style.cursor = '';
    });
});
