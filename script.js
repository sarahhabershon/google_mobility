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

  var dataPrep = function (d) {
    return {
      date: parseTime(d.date),
      transit: d.transit_stations,
      work: d.workplaces,
    };
  };

  d3.csv("GB_data.csv", dataPrep).then(function (data) {
    console.log(data);

    // List of groups = header of the csv files
    var keys = data.columns.slice(1);

    // Add X axis
    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear().domain([-100, 150]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // color palette
    var color = d3.scaleOrdinal().domain(keys).range(["#e41a1c", "#377eb8"]);

    //stack the data?
    var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
      data
    );

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr(
        "d",
        d3
          .area()
          .x(function (d, i) {
            return x(d.data.date);
          })
          .y0(function (d) {
            console.log(d.data);
            return 0;
          })
          .y1(function (d) {
            console.log(d.data.transit)
            return y(d.data.transit);
          })
      );
  });
});