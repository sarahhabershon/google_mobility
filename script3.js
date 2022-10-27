
$(document).ready(function () {

    d3.csv("GB_data.csv").then(function (data) {
         console.log(data)

// let data = [];
// let features = ["A","B","C","D","E","F"];
// //generate the data
// for (var i = 0; i < 3; i++){
//     var point = {}
//     //each feature will be a random number from 1-9
//     features.forEach(f => point[f] = 1 + Math.random() * 8);
//     data.push(point);
// }
console.log(data);

    let features = data.columns;

      //generate the data
    //   for (var i = 0; i < 3; i++) {
    //     var point = {};
    //     //each feature will be a random number from 1-9
    //     features.forEach((f) => (point[f] = 1 + Math.random() * 8));
    //     data.push(point);
    //   }
    //   console.log(data);

      let svg = d3
        .select("body")
        .append("svg")
        .attr("width", 600)
        .attr("height", 600);

      let radialScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
      let ticks = [100];

      ticks.forEach((t) =>
        svg
          .append("circle")
          .attr("cx", 300)
          .attr("cy", 300)
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("r", radialScale(t))
      );

      ticks.forEach((t) =>
        svg
          .append("text")
          .attr("x", 305)
          .attr("y", 300 - radialScale(t))
          .text(t.toString())
      );

      function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return { x: 300 + x, y: 300 - y };
      }

      for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
        let line_coordinate = angleToCoordinate(angle, 150);
        let label_coordinate = angleToCoordinate(angle, 150);

        //draw axis line
        // svg
        //   .append("line")
        //   .attr("x1", 300)
        //   .attr("y1", 300)
        //   .attr("x2", line_coordinate.x)
        //   .attr("y2", line_coordinate.y)
        //   .attr("stroke", "black");

        //draw axis label
        svg
          .append("text")
          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y)
          .text(ft_name);
      }

      let line = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveCardinal);;
      
        let colors = [
            "#e41a1c",
            "#377eb8",
            "#4daf4a",
            "#984ea3",
            "#ff7f00",
            "#ffff33",
            "#a65628",
            "#f781bf",
            "#D84A2B",
            "#6FD82B"
        ];
      
        // let colors = d3
        // .scaleOrdinal()
        // .domain(features)
        // .range([
        //   "#e41a1c",
        //   "#377eb8",
        //   "#4daf4a"
        //   "#984ea3",
        //   "#ff7f00",
        //   "#ffff33"
        //   "#a65628",
        //   "#f781bf"
        //   "#D84A2B",
        //   "#6FD82B"
        // ]);


      function getPathCoordinates(data_point) {
        let coordinates = [];
        for (var i = 0; i < features.length; i++) {
          let ft_name = features[i];
          let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
      }

      for (var i = 0; i < data.length; i++) {
        let d = data[i];
        let color = colors[i];
        let coordinates = getPathCoordinates(d);

        //draw the path element
        svg
          .append("path")
          .datum(coordinates)
          .attr("d", line)
          .attr("stroke-width", 3)
          .attr("stroke", color)
          //.attr("fill", color)
          .attr("fill", "#6FD82B")
          .attr("stroke-opacity", 0.1)
          .attr("opacity", 0.05);
      }
    });
})
  // set up the canvas

