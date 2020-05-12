var width = window.innerWidth * .9,
  height = window.innerHeight * .75;

// GENERAL CASE VIZ
var viz1 = {
  'id' : 1,
  'svg' : null,
  'slider' : null,
  'r0slider' : null,
  'PLAYING': false, 

  'student_nodes' : null,
  'infectedStudents' : [],
  'healthy_count' : 0,
  'infected_count' : 0,
  'recovered_count' : 0,
  'sliderOldVal' : 0,
  'datasetPath' : '/datasets/covid-model/general_case.json',

  // MODEL ASSUMPTIONS
  'r0' : 5.7,  // FROM CDC
  'numClasses' : 3,   //num classes each student is enrolled in
  'infectionLength' : 1, //how many weeks a student is contagious for
  'numExposed' : 8, //how many others one student exposes per class
  'p' : null, //probabilty of each exposed student of getting infected
  'initialCases' : 1
}
viz1.p = viz1.r0 / (viz1.infectionLength * viz1.numClasses * viz1.numExposed);

// EDGE CASE VIZ
var viz2 = {
  'id' : 2,
  'svg' : null,
  'slider' : null,
  'r0slider' : null,
  'PLAYING': false,

  'student_nodes' : null,
  'infectedStudents' : [],
  'healthy_count' : 0,
  'infected_count' : 0,
  'recovered_count' : 0,
  'sliderOldVal' : 0,
  'datasetPath' : '/datasets/covid-model/best_case.json',

  // MODEL ASSUMPTIONS
  'r0' : 5.7,  // FROM CDC
  'numClasses' : 1,   //num classes each student is enrolled in
  'infectionLength' : 1, //how many weeks a student is contagious for
  'numExposed' : 8, //how many others one student exposes per class
  'p' : null, //probabilty of each exposed student of getting infected
  'initialCases' : 1
}
viz2.p = viz2.r0 / (viz2.infectionLength * viz2.numClasses * viz2.numExposed);


// statuses
const HEALTHY = 0;
const INFECTED = 1;
const RECOVERED = 2;
const healthy_color = '#7CA5B8';
const infected_color = '#c32148';
const recovered_color = '#F2BAC9';

const SIMULATION_WEEKS = 11;


loadNodes(viz1, initViz);
loadNodes(viz2, initViz);

// loadNodes(viz1, runSiumulation);
// loadNodes(viz2, runSiumulation);

function loadNodes(viz, callback) {
  d3.json(viz.datasetPath).then(function(json) {
    viz.student_nodes = json.nodes;
    viz.student_nodes.forEach(function(d) {
      switch (d.status) {
        case 0: //healthy
          viz.healthy_count++;
          break;
        case 1: //infected
          viz.infected_count++;
          viz.infectedStudents.push(d.id);
          break;
        case 2: //recovered
          viz.recovered_count++;
          break;
      }
    });
    callback(viz);
  });  
}

function initViz(viz) {
  viz.svg = d3
      .select('.graph.viz' + viz.id)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // assign coordinates - generates randomly (sum of 2 uniform distributions) scaled to width/height
  viz.student_nodes.forEach(function(d) {
    let n = 3;
    let x = 0;
    let y = 0;
    for (let i = 0; i < n; i++) {
      x += Math.random();
      y += Math.random();
    }
    d.x = x/n * width;
    d.y = y/n * height;
  });

  const node = viz.svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .selectAll('circle')
    .data(viz.student_nodes)
    .join('circle')
    .attr('r', 3)
    .attr('id', d => {
      return 'v' + viz.id + 's' + d.id;
    })
    .attr('fill', d => {
      switch (d.status) {
        case 0: //healthy
          return healthy_color;
        case 1: //infected
          return infected_color;
        case 2: //recovered
          return recovered_color;
      }
    })
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  // init legend
  let keys = ['Healthy', 'Infected', 'Recovered'];

  viz.svg
    .append('circle')
    .attr('cx', 10)
    .attr('cy', 10)
    .attr('r', 5)
    .attr('fill', healthy_color);

  viz.svg
    .append('circle')
    .attr('cx', 10)
    .attr('cy', 30)
    .attr('r', 5)
    .attr('fill', infected_color);

  viz.svg
    .append('circle')
    .attr('cx', 10)
    .attr('cy', 50)
    .attr('r', 5)
    .attr('fill', recovered_color);

  //Add one dot in the legend for each name.
  viz.svg
    .selectAll('mylabels')
    .data(keys)
    .enter()
    .append('text')
    .attr('x', 20)
    .attr('y', function(d, i) {
      return 10 + i * 20;
    })
    .text(function(d) {
      return d;
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');
  
  // init slider
  viz.slider = d3
    .sliderHorizontal()
    .min(0)
    .max(11)
    .step(1)
    .fill('blue')
    .width(width * .55)
    .displayValue(true);
  
  viz.slider.on('onchange', val => {
    if (val < viz.sliderOldVal || viz.PLAYING) {
      viz.slider.silentValue(viz.sliderOldVal);
      return;
    }
    runInfections(viz);
    viz.sliderOldVal = val;
  });
  
  d3.select('.slider.viz' + viz.id)
    .append('svg')
    .attr('width', width * .6)
    .attr('height', 80)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(viz.slider);

  d3.select('.r0slider.viz' + viz.id)
    .on('input', function() {
      viz.r0 = this.value;
      viz.p = viz.r0 / (viz.infectionLength * viz.numClasses * viz.numExposed);
      d3.select('.r0val.viz' + viz.id)
        .html("R<sub>0</sub> = " + Number(viz.r0).toFixed(1));
    });
  
  // init buttons
  d3.select('.restart.button.viz' + viz.id)
    .on('click', () => restart(viz));
  
  d3.select('.play.button.viz' + viz.id)
    .on('click', () => {
      let background_color = '#008CBA';
      let color = 'white';
      if (viz.PLAYING) {
        background_color = 'white';
        color = 'black';
      }
      d3.select('.play.button.viz' + viz.id)
        .style("background-color", background_color)
        .style("color", color);
      playSimulation(viz);
    });

  // start running
  initializeCases(viz);
  updateCountDisplays(viz);
  showVis(viz);
}

function showVis(viz) {
  d3.select(".loader-wrapper.viz" + viz.id).style('display', 'none');
  d3.select("#viz" + viz.id).style('display', 'block');
}

// for testing & collecting data purposes - doesn't show viz
function runSiumulation(viz) {
  let r0_arr = [1, 2.5, 4, 5.7, 7]
  let results = "r0,week,healthy,infected,recovered,total_cases\n";
  for (r of r0_arr) {
    viz.r0 = r;
    viz.p = viz.r0 / (viz.infectionLength * viz.numClasses * viz.numExposed);
    // results.push(restart(viz, true));
    let init = restart(viz, true);
    let total_cases = init[1] + init[2];
    results += r + ",0," + init[0] + "," + init[1] + "," + init[2] + "," + total_cases + "\n";
    for (let i = 0; i < SIMULATION_WEEKS; i++) {
      let nums = runInfections(viz, true);
      results += r + "," + (i+1) + ",";
      for (n of nums) {
        results += n + ",";
      }
      results += (nums[1] + nums[2]) + ","
      // results.push(runInfections(viz, true));
      results += "\n";
    }
    
  }
  console.log(viz.id, results);
  let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/results;charset=utf-8,' + encodeURI(results);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'results.csv';
    hiddenElement.click();
}

// to automatically run with the play button 
async function playSimulation(viz) {
  if (viz.PLAYING) {
    viz.PLAYING = false;  //stop play
    return;
  }
  // at end of slider -> restart to week 0 before playing
  if (viz.sliderOldVal === SIMULATION_WEEKS) {
    restart(viz);
    d3.select('.play.button.viz' + viz.id)
      .style("background-color", '#008CBA')
      .style("color", 'white');
    await sleep(1400);
  }
  viz.PLAYING = true;

  for (let i = viz.sliderOldVal+1; i <= SIMULATION_WEEKS; i++) {
    if (!viz.PLAYING)
      return;
    viz.slider.silentValue(i);
    viz.sliderOldVal = i;
    runInfections(viz);
    await sleep(1400);
  }
  viz.PLAYING = false;
  d3.select('.play.button.viz' + viz.id)
    .style("background-color", 'white')
    .style("color", 'black');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}