// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
// =================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 70,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("assets/data/data.csv").then(WealthData => {
    // Step 4: Parse the data
    // Format the data and convert to numerical 
  
    // Format the data
    WealthData.forEach(data => {
    //   data.date = parseTime(data.date);
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });
  
  // Step 5: Create the scales for the chart
  // =================================
  var xLinearScale = getXScale(WealthData, chosenXAxis);

  var yLinearScale = getYScale(WealthData, chosenYAxis);  

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append an SVG group element to the SVG area, create the left axis inside of it
  chartGroup.append("g")
    .classed("yaxis", true)
    .call(leftAxis);

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("xaxis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(WealthData)
    .enter();

  circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".2");

  // appen initial text in circle
    circlesGroup
    .append("text")
    .style("font-size", "12px")
    .attr("dx", d => xLinearScale(d[chosenXAxis])-10)
    .attr("dy", d => yLinearScale(d[chosenYAxis])+15/3)
    .text(d => d.abbr);

  // Create group for 3 x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 3}, ${height + 20})`);

  var PovertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var AgeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var IncomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append 3 y axis
  var ObesityLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Obese (%)");

    var SmokesLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Smokes (%)");

    var HealthcareLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x and y scale for new data
      xLinearScale = getXScale(WealthData, chosenXAxis);
    //   yLinearScale = getYScale(WealthData, chosenYAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      //   yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      var circlesGroup = renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis);

      // updates tooltips with new info
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      // var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

      // changes classes to change bold text
      if (chosenXAxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "income") {
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

  // y axis labels event listener
  labelsGroup.selectAll("text").on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
         // replaces chosenXAxis with value
          chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x and y scale for new data
        //   xLinearScale = getXScale(WealthData, chosenXAxis);
        yLinearScale = getYScale(WealthData, chosenYAxis);

        // updates y axis with transition
        //   xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values        
        var circlesGroup = renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis);

       // updates tooltips with new info
       var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
       var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

       // changes classes to change bold text
      if (chosenXAxis === "smoke") {
       smokeLabel
            .classed("active", true)
            .classed("inactive", false);
       healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
       obesityLabel
            .classed("active", false)
            .classed("inactive", true);
      }
      else if (chosenXAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
  }
  });

});



// ============ FUNCTIONS ======================
// function used for updating x-scale var upon click on axis label
function getXScale(WealthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(WealthData, d => d[chosenXAxis]) * 0.8,
      d3.max(WealthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function getYScale(WealthData, chosenXAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(WealthData, d => d[chosenYAxis]) * 0.8,
        d3.max(WealthData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisBottom(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "age") {var xlabel = "Age:"}
  else if (chosenXAxis === "income") {var xlabel = "Income:"}
  else {var xlabel = "Poverty:"}

  if (chosenYAxis === "obesity"){var ylabel = "Obesity:"}
  else if (chosenYAxis === "smokes"){var ylabel = "Smokes:"}
  else {var ylabel = "Healthcare:"}

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([90, -80])
    .html(d =>`${d.state}<br>${xlabel} ${ylabel} ${d[chosenXAxis]}`);

  svg.call(toolTip);

  svg.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
