// Data
const usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(usgs_url).then(function (data) {
    //console.log(data);


    // Layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        Street: street,
        Topography: topo
    };

    var myMap = L.map("map", {
        center: [20.00, -1.00],
        zoom: 2,
        minZoom: 2,
        layers: street
    });

    L.control.layers(baseMaps).addTo(myMap);


    // Color
    function chooseColor(depth) {
        if (depth < 5) {
            return "darkgreen";
        } else if (depth < 20) {
            return "green";
        } else if (depth < 50) {
            return "yellow";
        } else if (depth < 100) {
            return "orange";
        } else {
            return "red";
        }
    }

    //Size / Radius
    function markerSize(number) {
        if (number == 0) {
            number = 1
        }
        return Math.sqrt(number) * 7;
    }

    var markers = {
        stroke: true,
        weight: 0.5
    };


    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, markers);
        },
        onEachFeature: function (feature, layer) {

            layer.on({
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.8
                    })
                },

                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    })
                }
            });

            let magnitude = feature.properties.mag
            let depth = feature.geometry.coordinates[2];

            layer.setStyle({
                radius: markerSize(parseInt(magnitude)),
                color: chooseColor(depth),
                fillColor: chooseColor(depth)
            })


            layer.bindPopup(
                "<h4> Magnitude: " + magnitude + "</h4>"
                + "<h4> Depth: " + depth + "</h4>"
                + "<h5> Location: " + feature.properties.place + "</h5>"

            )
        }
    }).addTo(myMap);


    // Legend

    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth</h4>";
        div.innerHTML += '<i style="background: darkgreen"></i><span> -10 to 5 </span><br>';
        div.innerHTML += '<i style="background: green"></i><span> 5 to 20 </span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span> 20 to 50 </span><br>';
        div.innerHTML += '<i style="background: orange"></i><span> 50 to 100 </span><br>';
        div.innerHTML += '<i style="background: red"></i><span> + 100 </span><br>';

        return div;
    };

    legend.addTo(myMap);


});
