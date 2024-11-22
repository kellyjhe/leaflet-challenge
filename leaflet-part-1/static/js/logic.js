var myMap = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(myMap);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

fetch(link).then(response => response.json()).then(data => {
    plotEarthquakes(data.features);
});

function plotEarthquakes(earthquakes) {
    earthquakes.forEach(earthquake => {
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2];
        var coords = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        var place = earthquake.properties.place;

        var size = magnitude * 5;
        var color = getColor(depth);

        L.circleMarker(coords, {
            radius: size,
            fillColor: color,
            color: color,
            fillOpacity: 0.6,
            stroke: false
    }).addTo(myMap).bindPopup(`Place: ${place}</br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);

    });

    legend.addTo(myMap);

}

function getColor(depth) {
    return depth > 100 ? '#FF0000' :
        depth > 50 ? '#FF7F00' :
        depth > 20 ? '#FFFF00' :
        '#00FF00';
}

let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [0, 20, 50, 100];
    let colors = ['#00FF00', '#FFFF00', '#FF7F00', '#FF0000'];
    let labels = [];

    let legendInfo = "<div class=\"labels\">" + "<dv class=\"min\">" + limits[0] + "</div>" + "<div class=\"max\">" + limits[limits.length - 1] + "</div>" + "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};


