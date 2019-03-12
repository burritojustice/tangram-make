#!/usr/bin/env node
const fs = require('fs');

const name = 'tangram-skeleton';
const html =
`<html lang="en-us">

<head>
   <meta charset="utf-8">
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
   <title>Tangram Skeleton</title>
   <script src="https://unpkg.com/leaflet@1.0.1/dist/leaflet.js"></script>
   <script src="https://unpkg.com/tangram/dist/tangram.min.js"></script>
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
   <link rel="stylesheet" href="index.css">
</head>
<body>
   <div id="map"></div>
   <script src="index.js"></script>
</body>
</html>
`;

const css =
`body {
   margin: 0px;
   border: 0px;
   padding: 0px;
   font-family: sans-serif;
   color: #333;
}

#map {
   height: 100%;
   width: 100%;
   position: absolute;
}

`;

const js =
`const tangram = Tangram.leafletLayer({
   scene: 'scene.yaml',
   events: {
      click: onMapClick
   }
})
const map = L.map('map', {
   center: [47.608013, -122.335167],
   zoom: 7.5,
   layers: [tangram],
   zoomControl: false
});
map.attributionControl.addAttribution('<a href="https://here.xyz">HERE XYZ</a> | <a href="https://www.openstreetmap.org/">OSM</a>');


function onMapClick () {}

`;

const yaml =
`cameras:
    camera1:
        type: perspective
sources:
    xyz_osm:
        type: MVT
        url: https://xyz.api.here.com/tiles/osmbase/256/all/{z}/{x}/{y}.mvt
        max_zoom: 16
    _xyz_space:
        type: GeoJSON
        url: https://xyz.api.here.com/hub/spaces/XYZ-SPACE-ID/tile/web/{z}_{x}_{y}
        url_params:
            access_token: XYZ-TOKEN

layers:
    xyz_space:
        data: { source: _xyz_space}
        draw:
            points:
                order: 10000000
                color: black
                width: 20px
                interactive: true
                collide: false
    earth:
        data: { source: xyz_osm }
        draw:
            polygons:
                order: function() { return feature.sort_rank; }
                color: '#E4E9EC'

    landuse:
        data: { source: xyz_osm }
        draw:
            polygons:
                order: function() { return feature.sort_rank; }
                color: [0.827, 0.890, 0.875, 1.00]

    water:
        data: { source: xyz_osm }
        draw:
            polygons:
                order: function() { return feature.sort_rank; }
                color: '#C3CDD4'

    roads:
        data: { source: xyz_osm }
        filter:
            not: { kind: [path, rail, ferry] }
        draw:
            lines:
                order: function() { return feature.sort_rank; }
                color: '#C3CDD4'
                width: 8
                cap: round
        highway:
            filter:
                kind: highway
            draw:
                lines:
                    order: function() { return feature.sort_rank; }
                    color: |
                        function() {
                            if ($zoom < 10) {
                                return '#BFBFBF';/*'#8B9ED4'*/;
                             } else {
                                 return 'white'/*'#8B9ED4'*/;
                             }
                        }
                    width: [[5, 5000], [8, 800], [10, 200], [12, 100],[14,40], [18, 20]]
                    outline:
                        color: lightgrey
                        width: [[16, 0], [18, 1.5]]
        minor_road:
            filter:
                kind: minor_road
            draw:
                lines:
                    order: function() { return feature.sort_rank; }
                    color: '#F8FAFB'
                    width: 5

    buildings:
        data: { source: xyz_osm }
        draw:
            polygons:
                order: function() { return feature.sort_rank; }
                color: '#E9EBEB'
        3d-buildings:
            filter: { $zoom: { min: 15 } }
            draw:
                polygons:
                    extrude: function () { return feature.height > 20 || $zoom >= 16; }
`

if (!fs.existsSync(`./${name}`)){
    fs.mkdirSync(`./${name}`);
}

fs.writeFile(`./${name}/index.html`, html, function (err) {
  if (err) throw err;
  console.log('html created');
});

fs.writeFile(`./${name}/index.js`, js, function (err) {
  if (err) throw err;
  console.log('javascript created');
});

fs.writeFile(`./${name}/index.css`, css, function (err) {
  if (err) throw err;
  console.log('css created');
});

fs.writeFile(`./${name}/scene.yaml`, yaml, function (err) {
  if (err) throw err;
  console.log('yaml created');
});