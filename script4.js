// python -m http.server

let parseTime = d3.timeParse("%Y-%m-%d");
let dateStringency = [];

// function to parse the data
dataPrep = function (d) {
  dateStringency.push([
    parseTime(d.date).toDateString(),
    d.StringencyIndex_Average_ForDisplay,
  ]);

  return {
    date: parseTime(d.date).toDateString(),
    place: d.place,
    value: d.value,
  };
};

$(document).ready(function () {
  d3.csv("GB_data_long.csv", dataPrep).then(function (data) {
    console.log(dateStringency);

    // set the dimension variables
    let height = document.querySelector("#vizcol").offsetHeight;
    let width = height;
    let margin = 30;
    let innerRadius = 0;
    let outerRadius = width / 2 - margin;
    let startDate = "Tue Feb 18 2020";

    // create an array of unique dates to iterate over for the animation
    // let uniqueDates = Array.from(new Set(data.map((d) => d.date)));

    let uniqueDateStringency = Array.from(
      new Set(dateStringency.map(JSON.stringify)),
      JSON.parse
    );

    // filter the dataset by date to get iterable chunks
    let dataAt = function (thisDate) {
      console.log(thisDate);
      let x = data.filter((d) => d.date === thisDate);
      return x;
    };

    // set the initial frame to the first date in the unique dates array
    let currentData = dataAt(startDate);
    console.log(currentData);

    let colour = d3
      .scaleSequential()
      .domain([0, 45])
      .interpolator(d3.interpolatePuBu);

    // Legend(d3.scaleSequential([5, 45], d3.interpolatePuBu), {
    //   title: "Response Stringency Index",
    // });

    // set up the axes
    x = d3
      .scaleBand()
      .domain(data.map((d) => d.place))
      .range([0, 2 * Math.PI])
      .align(0);

    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
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
          rotate(${((x(d.place) + x.bandwidth() / 2) * 180) / Math.PI + 235})
          translate(${outerRadius},0)
        `
          )
          .call((g) =>
            g
              .append("text")
              .attr("id", function(d,i) {return d.place})
              .classed("labels", true)
              .attr("transform", (d) =>
                (x(d.place) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) <
                Math.PI
                  ? "rotate(90) translate(0,14)"
                  : "rotate(-270) translate(0,9)"
              )
              .text((d) => d.place)
          )
      );

    let yAxis = (g) =>
      g
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
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
                .attr("stroke-opacity", 0.1)
                .attr("r", y)
            )
        ); 

    let svg = d3
      .select("#vizdiv")
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
      .attr("fill", function () {
        return colour(uniqueDateStringency[0][1]);
      })
      .attr("fill-opacity", 0.6)
      .attr(
        "d",
        area.innerRadius(0).outerRadius((d) => y(d.value))(currentData)
      )
      .join("path");

    let dateLabel = d3
      .select("#dateLabel")
      .append("p")
      .text(uniqueDateStringency[0][0]);

    let iterator = 0;

    let update = function (i) {
      console.log(uniqueDateStringency[i][0]);

      path
        .transition()
        .duration(400)
        .attr(
          "d",
          area.innerRadius(0).outerRadius((d, i) => y(d.value))(
            dataAt(uniqueDateStringency[i][0])
          )
        )
        .attr("fill", function () {
          return colour(uniqueDateStringency[i][1]);
        });

      dateLabel.text(uniqueDateStringency[i][0]);


        // iterator++;
    };

    // setInterval(function () {
    //   update(iterator);
    // }, 50);

    //    https://d3-graph-gallery.com/graph/density_slider.html
    let stringencyContainer = d3.select(".stringencyContainer");
    let stringencySvg = d3.select("#stringencysvg");
    stringencyContainer.style.backgroundColor = "red";

    let stringencyContainerWidth = document.querySelector(".stringencyContainer").offsetWidth;
    // let thumbWidth = document.querySelector(".slider::-webkit-slider-thumb").offsetWidth;
    

    // var x = stringencySvg.getAttribute("width");
    // console.log(x)
    var svgHeight = x + 30;
    console.log(stringencySvg)

    stringencySvg
      .selectAll("rect")
      .attr("width", stringencyContainerWidth - 25)
      .data(dateStringency)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        return (stringencyContainerWidth / dateStringency.length) * i;
      })
      .attr("y", function (d, i) {
        return 1;
      })
      .attr("width", function (d) {
        return stringencyContainerWidth / dateStringency.length;
      })
      .attr("height", 20)
      .style("fill", function (d) {
        console.log(d[1]);
        return colour(d[1]);
      });

    d3.select("#mySlider")
      .attr("min", 0)
      .attr("max", uniqueDateStringency.length - 1)
      .attr("value", 0)
      .style("background", function(){console.log(stringencySvg.node());
      return stringencySvg.node();})
      .on("input", function (d) {
        i = this.value;
        console.log(i);
        update(i);
      });
  });
}); // set up the canvas
