(function() {
  sd3rklines = {
    'author' : 'Yawar Amin <yawar.amin@gmail.com'
  , 'version' : '0.1'
  };

  var dot = function(svgElem, x, y, r, color) {
    if (svgElem[0][0].nodeName != 'svg') return;

    svgElem.append('circle')
           .attr('cx', x)
           .attr('cy', y)
           .attr('r', r)
           .style('stroke', color)
           .style('stroke-width', r)
           .style('fill', color);
  }

  sd3rklines.sparkline = function(elem, props, data) {
    // Set defaults for sparkline properties
    if (!('width' in props)) props.width = 50;
    if (!('height' in props)) props.height = 12;
    if (!('minmax' in props)) props.minmax = false;
    if (!('firstlast' in props)) props.firstlast = false;
    if (!('lcl' in props)) props.lcl = 0;
    if (!('ucl' in props)) props.ucl = 0;
    if (!('thickness' in props)) props.thickness = 1.125;
    var margin = 2;
    var bandOpacity = .75;

    var chart = d3.select(elem);
    // This will allow us to overlap sparklines inside the same
    // chart
    if (chart[0][0].nodeName != 'svg') chart = chart.append('svg');
    chart = chart.attr('width', props.width + 2 * margin)
                 .attr('height', props.height + 2 * margin);

    var xCoord = d3.scale.linear()
       .domain([0, data.length - 1])
       .range([margin, props.width - margin]);

    var yCoord = d3.scale.linear()
       .domain([d3.min(data), d3.max(data)])
       .range([props.height + margin, margin]);

    var lineData = d3.svg.line()
       .x(function(d, i) { return xCoord(i); })
       .y(yCoord);

    chart.append('path')
         .attr('d', lineData(data))
         .style('stroke', 'black')
         .style('stroke-width', props.thickness)
         .style('fill', 'none');

    if (props.firstlast) {
      dot(chart, xCoord(0), yCoord(data[0]), props.thickness, 'red');
      dot(
        chart
      , xCoord(data.length - 1)
      , yCoord(data[data.length - 1])
      , props.thickness, 'red'
      );
    }

    if (props.minmax) {
      dot(
        chart
      , xCoord(data.indexOf(d3.min(data)))
      , yCoord(d3.min(data))
      , props.thickness
      , 'blue'
      );
      dot(
        chart
      , xCoord(data.indexOf(d3.max(data)))
      , yCoord(d3.max(data))
      , props.thickness
      , 'blue'
      );
    }

    if (Math.abs(props.ucl) + Math.abs(props.lcl) > 0) {
      chart.append('rect')
           .attr('x', 0)
           .attr('y', yCoord(props.ucl))
           .attr('width', props.width)
           .attr('height', yCoord(props.lcl))
           .style('fill', '#eee')
           .style('fill-opacity', bandOpacity);
    }
  }

  sd3rk = sd3rklines;
})();

