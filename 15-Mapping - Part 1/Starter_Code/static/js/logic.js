// Radius Function
function markerSize(mag) {
    let radius = 1;
    if (mag > 0) {
      radius = mag ** 7;
    }
    return radius
  }
  
  // Earthquake depth function
  function chooseColor(depth) {
    let color = "grey";
  
    // Color depends on the depth
    if (depth <= 10) {
      color = "#85ff7a";
    } else if (depth <= 30) {
      color = "#ccff00";
    } else if (depth <= 50) {
      color = "#ffde21";
    } else if (depth <= 70) {
      color = "#ff7c43";
    } else if (depth <= 90) {
      color = "#ff4b33";
    } else {
      color = "#d20a2e";
    }
  
    // return color based on depth
    return (color);
  }
  
  function createMap(data, geo_data) {
    // Create the Base Layers
  
    // Define variables for our tile layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
 
  
    //  Create the Overlay layer for circles
    let circleArray = [];
  
    for (let i = 0; i < data.length; i++){
      let row = data[i];
      let location = row.geometry;
  
      // Create marker
      if (location) {
        // Extract coord
        let point = [location.coordinates[1], location.coordinates[0]];
  
        // Make marker
        let marker = L.marker(point);
        let popup = `<h1>${row.properties.title}</h1>`;
        marker.bindPopup(popup);
  
        // Create and define circle marker
        let circleMarker = L.circle(point, {
          fillOpacity: 0.75,
          color: chooseColor(location.coordinates[2]),
          fillColor: chooseColor(location.coordinates[2]),
          radius: markerSize(row.properties.mag)
        }).bindPopup(popup);
        circleArray.push(circleMarker);
      }
    }
    // Create the circle layer
    let circleLayer = L.layerGroup(circleArray);
  
    let baseLayers = {
      Street: street
    };
  
    let overlayLayers = {
      Circles: circleLayer
    }
  
    // Init the Map
    let myMap = L.map("map", {
      center: [40.7, -94.5],
      zoom: 4,
      layers: [street, circleLayer]
    });
    
    // Create the legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
  
      let legendInfo = "<h4>Earthquake Depth</h4>"
      legendInfo += "<i style='background: #85ff7a'></i>-10-10<br/>";
      legendInfo += "<i style='background: #ccff00'></i>10-30<br/>";
      legendInfo += "<i style='background: #ffde21'></i>30-50<br/>";
      legendInfo += "<i style='background: #ff7c43'></i>50-70<br/>";
      legendInfo += "<i style='background: #ff4b33'></i>70-90<br/>";
      legendInfo += "<i style='background: #d20a2e'></i>90+";
  
      div.innerHTML = legendInfo;
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  }
  
function doWork() {
  
    // Assemble the API query URL.
    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
  
    d3.json(url).then(function (data) {
    // make map with both datasets
    let geo_data = data.features;
        createMap(geo_data);
    });
};

  
doWork();
  