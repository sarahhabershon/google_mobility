
console.log("wt")

var mydata = d3.csv("GB_data.csv")

console.log(mydata)

var svg = d3.select("svg");
var circle = svg.selectAll("circle")
    .data([32, 57, 112, 293]);
var circleEnter = circle.enter().append("circle");
