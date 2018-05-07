var selected_quarter = "all"
var selected_div = "all"
var selected_campus = "all"
var selected_filter = "avg_lecture_length_day"

window.onAllChange =  function() {
  document.getElementById("sort").checked = false;
  var svg = d3.selectAll("svg");
  svg.remove();
  reload();
}

window.onQuarterChange = function(value) {
  selected_quarter = value;
  onAllChange();
}
window.onDivChange = function(value) {
  selected_div = value;
  onAllChange();
}
window.onCampusChange = function(value) {
  selected_campus = value;
  onAllChange();
}
window.onFilterChange = function(value) {
  selected_filter = value;
  onAllChange();
}


function calculateValue(d, index) {
  quarters = selected_quarter === "all" ? ["Fall", "Winter", "Spring"] : [selected_quarter]
  divs = selected_div === "all" ? ["Upper", "Lower"] : [selected_div]
  campuses = selected_campus === "all" ? ["North", "South"] : [selected_campus]

  var output = []
  quarters.forEach(quarter => {
    divs.forEach(div => {
      campuses.forEach(campus => {
        if (d.NorthOrSouth == campus) {
          if (d[quarter][div][selected_filter] !== 0){
            output.push(d[quarter][div][selected_filter])
          }
        }
      })
    })
  })

  if (output.length !== 0)
    var average = (output.reduce((a, b) => a + b, 0)/output.length);
  else
    var average = 0
  return average;
}

function compare(a, b) {
  return d3.ascending(a.major, b.major);
}

function reload() {

  var width = 750,
      height = 750,
      barHeight = height / 2 - 80;

  var formatNumber = d3.format("s");

  var color = d3.scale.ordinal()
      .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

  var svg = d3.select("#radial-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "xMidYMin")
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  d3.json("/datasets/how-long-are-lectures/FINAL_DATA.json", function(error, data) {

    data = data.sort(compare)
    data = data.filter(d => calculateValue(d)!==0)

    var extent = d3.extent(data, function(d, index) { return calculateValue(d, index) });

    var barScale = d3.scale.linear()
        .domain(extent)
        .range([0, barHeight]);

    var keys = data.map(function(d,i) { return d.major; });
    var numBars = keys.length;

    var x = d3.scale.linear()
        .domain(extent)
        .range([0, -barHeight]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(3)
        .tickFormat(formatNumber);

    var circles = svg.selectAll("circle")
            .data(x.ticks(3))
          .enter().append("circle")
            .attr("r", function(d) {return barScale(d);})
            .style("fill", "none")
            .style("stroke", "#00a5ff")
            .style("stroke-dasharray", "2,2")
            .style("stroke-width",".5px");

    var arc = d3.svg.arc();

    var segments = svg.selectAll("path")
            .data(data)
          .enter().append("path")
            .each(function(d,i) {
              d.innerRadius = 0;
              d.outerRadius = barScale(+calculateValue(d));
              d.startAngle = (i * 2 * Math.PI) / numBars;
              d.endAngle = ((i + 1) * 2 * Math.PI) / numBars;
            })
            .style("fill", function (d) { return color(d.major); })
            .attr("d", arc);

    svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width","1.5px");

    var lines = svg.selectAll("line")
        .data(keys)
      .enter().append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "black")
        .style("stroke-width",".5px")
        .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

    svg.append("g")
      .attr("class", "x axis radial")
      .call(xAxis);

    var labelRadius = barHeight * 1.025;

    // Labels
    var labels = svg.append("g")
        .classed("labels", true);

    // labels.append("def")
    //     .append("path")
    //     .attr("id", "label-path")
    //     .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");


    labels.selectAll("text")
          .data(data)
        .enter().append("text")
          .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
          .each(function(d, i) { d.rot_angle = (d.angle * 180 / Math.PI - 90); })
          .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .style("font-weight","bold")
          .style("fill", function(d, i) {return "#3e3e3e";})
          .attr("class","text_lab")
          .attr("dy", ".35em")
          .attr("rot_angle", function(d,i) {return d.angle * 180 / Math.PI - 90;})
          .attr("transform", function(d) {
            return "rotate(" + (d.rot_angle) + ")"
                + "translate(" + (d.innerRadius + (barHeight*1.025)) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
                })
          .text(function(d) {return d.major.toUpperCase(); });

    d3.select("input").on("change", change);

    function change() {

      if (this.checked) {
        labels.selectAll(".text_lab").sort(function(a,b) { return calculateValue(b) - calculateValue(a); });
        segments.sort(function(a,b) { return calculateValue(b) - calculateValue(a); });

      }else {
        labels.selectAll(".text_lab").sort(function(a,b) { return d3.ascending(a.major, b.major) });
        segments.sort(function(a,b) { return d3.ascending(a.major, b.major); });
      };

      segments.transition().duration(2000).delay(100)
              .attrTween("d", function(d,index) {
                var i = d3.interpolate(d.startAngle, (index * 2 * Math.PI) / numBars );
                var u = d3.interpolate(d.endAngle, ((index + 1) * 2 * Math.PI) / numBars );
                return function(t) { d.endAngle = u(t); d.startAngle = i(t); return arc(d,index); };
              });

      labels.selectAll("text").transition().duration(2000).delay(100)
              .each( function(d, i) { d.rot_angle = (i*(360/numBars) -((180/2+(90 - 360/numBars))/2)); })
              .attr("transform", function(d) {
                return "rotate(" + (d.rot_angle) + ")"
                    + "translate(" + (d.innerRadius + (barHeight*1.025)) + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
                    })
              // .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      // labels.selectAll("text").exit().remove()
    }

    // scatterplot
    d3.json("/datasets/how-long-are-lectures/FINAL_DATA.json", function(error, data) {
      if (error) return;
      let arr = [];
      for (var i in data) {
        arr.push(data[i]);
      }
      //console.log(data);
      makeVis(arr);
    });

  });
}

function makeVis(data) {
  //for (var i in data) console.log(data[i]);
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var canvas = d3.select('#scatterplot').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Define scales
  var colorScale = d3.scale.category10();
  var xScale = d3.scale.linear()
    .domain([0, 500]) // TODO: set a better bound through the max function
    .range([0, width])
  var yScale = d3.scale.linear()
    .domain([0, 600]) // TODO: set a better bound through the max function
    .range([height, 0]); // y-axis is upper left downwards

  // Define axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  // Add x-axis to canvas
  canvas.append('g')
    .attr('class', 'x axis')
    // move axis to bottom of canvas
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('class', 'label')
    .attr('x', width) // x-offset from xAxis
    .attr('y', -6) // y-offset from xAxis
    .style('text-anchor', 'end') // right-justify
    .text('Lecture Size');

  // Add y-axis to canvas
  canvas.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)') // rotate text
    .attr('y', 15) // y-offset from yAxis
    .style('text-anchor', 'end')
    .text('Lecture Length');

  // Add tooltip to scatterplot div, visible on mouseover
  var tooltip = d3.select('#scatterplot').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Tooltip mouseover event handler
  var tipMouseover = function(d) {
    var color = colorScale(d.School);
    var html = "<div class='tooltip-box' style='background-color: " + color + ";'> Major: " + d.major + "<br/>" + "Average Lecture Length: " + d.Fall.Lower.avg_lecture_length_week + "<br/>" + "Average Lecture Size: " + d.Fall.Lower.avg_lecture_size + "</div>";
    tooltip.html(html)
      .style('left', (d3.event.pageX + 15) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px')
      .transition()
      .duration(200) // 200ms
      .style('opacity', 0.9);
  };

  // Tooltip mouseout event handler
  var tipMouseout = function(d) {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  };

  // Add data points
  canvas.selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 5.5) // radius size
    .attr('cx', function(d) { return 960 / (500 + margin.right) * d.Fall.Lower.avg_lecture_size })
    .attr('cy', function(d) { return ((600 - margin.top - margin.bottom) / 600) * (600 - d.Fall.Lower.avg_lecture_length_week) })
    .style("fill", function(d) { return colorScale(d.School); })
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
}

reload();
document.getElementById("sort").checked = false;
