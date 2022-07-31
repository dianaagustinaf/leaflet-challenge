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
function chooseColor(country) {                   
    if (country == "Ukraine") {
        return "black";
    } else {
        return "orange";
    }
}

//Size / Radius
function markerSize(number) {
    if (number==0) {
        number=1
    }
    return Math.sqrt(number) * 4;
  }

var markers = {
    //opacity: 0.7,       // onEachFeature
    //fillOpacity: 0.7,
    color: "orange",
    //fillColor: "orange",
    //radius: 5,
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

            //click: zoomToFeature
            });

        // layer.setStyle({
        //     radius: markerSize(parseInt(feature.properties.fatalities)),
        //     fillColor: chooseColor(feature.properties.country)
        // })


        layer.bindPopup("<h5> Location: " + feature.properties.place
            + "</h5> <br> Event Date: " + feature.properties.event_date
            + "<br>Magnitude: " + feature.properties.mag
        )
    }
}).addTo(myMap);

});
