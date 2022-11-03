let parseTime = d3.timeParse("%Y-%m-%d");

// function to parse the data
dataPrep = function (d) {
  return {
    date: parseTime(d.date).toDateString(),
    place: d.place,
    value: d.value
  };
};

// set the dimension variables
let width = 1000;
let height = width;
let margin = 10;
let innerRadius = 0;
let outerRadius = width / 2 - margin;
let startDate = "Tue Feb 18 2020";



$(document).ready(function () {
  d3.csv("GB_data_head_long.csv", dataPrep).then(function (data) {
    console.log(data);
     // create an array of unique dates to iterate over for the animation
    let uniqueDates = Array.from(new Set(data.map((d) => d.date)))

    // filter the dataset by date
    let dataAt = function(thisDate){
        let x = data.filter((d) => d.date === thisDate)
        return x
    }

    // set the initial frame to the first date in the unique dates array 
    let currentData = dataAt(uniqueDates[0]);

    // set up the axes
    x = d3
      .scaleBand()
      .domain(data.map((d) => d.place))
      .range([0, 2 * Math.PI])
      .align(0);

    let y = d3
      .scaleLinear()
      .domain([
        0, d3.max(data, (d) => d.value)])
      .range([innerRadius, outerRadius]);


    let xAxis = (g) =>
      g.attr("text-anchor", "middle").call((g) =>
        g
          .selectAll("g")
          .data(dataAt(startDate))
          .enter()
          .append("g")
          .attr(
            "transform",
            (d) => `
          rotate(${((x(d.place) + x.bandwidth() / 2) * 180) / Math.PI +235})
          translate(${outerRadius},0)
        `
          )
        .call((g) => g.append("line").attr("x2", -500).attr("stroke", "#000"))
          .call((g) =>
            g
              .append("text")
              .attr("transform", (d) =>
                (x(d.place) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) <
                Math.PI
                  ? "rotate(90) translate(0,16)"
                  : "rotate(-90) translate(0,-9)"
              )
              .text((d) => d.place)
          )
      );

    let yAxis = (g) =>
      g
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .call((g) =>
          g
            .selectAll("g")
            .data(y.ticks().reverse())
            .join("g")
            .attr("fill", "none")
            .call((g) =>
              g
                .append("circle")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 0.9)
                .attr("r", y)
            )
        );

    let svg = d3
      .select("body")
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    
    let area = d3
      .areaRadial()
      .curve(d3.curveCardinalClosed.tension(0))
      .angle((d) => x(d.place));

    let path = svg
      .append("path")
      .attr("fill", "lightsteelblue")
      .attr("fill-opacity", 0.2)
      .attr("d", area.innerRadius(0).outerRadius((d) => y(d.value))(currentData))
      .join("path")


      for (let i = 0; i < uniqueDates.length; i++) {
        currentData = dataAt(uniqueDates[i]);
        console.log("poo");
        console.log(currentData);

        path
          .transition()
          .duration(400)
          .attr(
            "d",
            area.innerRadius(0).outerRadius((d) => y(d.value))(currentData)
          );
      }



  });

}); // set up the canvas
