const usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(usgs_url).then(function(data) {
    //console.log(data);


var myMap = L.map("map", {
    center: [20.00, -1.00],
    zoom: 2,
    minZoom: 2
});

// tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Color
function chooseColor(depth) {                   
    if (depth < 5) {
        return "green";
    } else if (depth < 20) {
        return "darkgreen";
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
    if (number==0) {
        number=1
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
                    fillOpacity:0.8
                })
            },

            mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity:0.5
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

});
