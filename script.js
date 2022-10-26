// python -m http.server 

$(document).ready(function () {
  // set up the canvas
  var margin = { top: 20, right: 30, bottom: 0, left: 10 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#div_a")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y-%m-%d");

    var rowConverter = function (d) {
      return {
        date: parseTime(d.date)
      };
    };


  d3.csv("GB_data.csv", rowConverter).then(function (data) {
    console.log(data);
    
//     d3.select("svg")
//       .selectAll("circle")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("r", function (d) {
//         return (
//           d.transit_stations * -1
//         )
//       })
//       .attr("cx", function(d,i){
//         return (
//           i * 10
//         )
//       })

  });



 });
