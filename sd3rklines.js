(function() {
  sd3rklines = {
    'author' : 'Yawar Amin <yawar.amin@gmail.com'
  , 'version' : '0.1'
  };

  var Dot = function(svgElem, x, y, r, color) {
    if (svgElem[0][0].tagName != 'svg') return;

    svgElem.append('circle')
           .attr('cx', x)
           .attr('cy', y)
           .attr('r', r)
           .style('stroke', color)
           .style('stroke-width', 0)
           .style('fill', color);
  }

  /*
  Sparkline(elem, props, data) - create and get an SVG element
  containing a sparkline

  elem - any HTML element. If an existing SVG element, the sparkline
  will be added inside.

  props - a JSON object of properties. Valid properties:

  - width : float - the intended width of the sparkline. Default 60.

  - height : float - the intended height of the sparkline. Default 12.

  - minmax : bool - whether to show the minimum and maximum value
    markers (dots). Default false.

  - firstlast : bool - whether to show the first and last value markers
    (dots). Default false.

  - lcl : float - the lower control limit at which to put the bottom of
    a translucent band overlaid on the sparkline. Terminology borrowed
    from process control charts. Default 0.

  - ucl : float - the upper control limit. See above. Default 0.

  data : Array (float) - the numbers to plot.

  Returns: an SVG element with one or more sparklines plotted inside.
  Each sparkline will be inside its own <g> container element.
  */
  sd3rklines.Sparkline = function(elem, props, data) {
    // Set defaults for sparkline properties
    if (!('width' in props)) props.width = 60;
    if (!('height' in props)) props.height = 12;
    if (!('minmax' in props)) props.minmax = false;
    if (!('firstlast' in props)) props.firstlast = false;
    if (!('lcl' in props)) props.lcl = 0;
    if (!('ucl' in props)) props.ucl = 0;
    if (!('thickness' in props)) props.thickness = 1.125;
    var bandOpacity = .75;

    var chart = d3.select(elem);
    // This will allow us to overlap sparklines inside the same
    // chart
    if (chart[0][0].tagName != 'svg') chart = chart.append('svg');
    chart = chart.attr('width', props.width)
                 .attr('height', props.height)

    var xCoord = d3.scale.linear()
       .domain([0, data.length - 1])
       .range([props.thickness, props.width - props.thickness]);

    var yCoord = d3.scale.linear()
       .domain([d3.min(data), d3.max(data)])
       .range([props.height - props.thickness, props.thickness]);

    var lineData = d3.svg.line()
       .x(function(d, i) { return xCoord(i); })
       .y(yCoord);

    chart.append('path')
         .attr('d', lineData(data))
         .style('stroke', 'black')
         .style('stroke-width', props.thickness)
         .style('fill', 'none');

    if (props.firstlast) {
      Dot(chart, xCoord(0), yCoord(data[0]), props.thickness, 'red');
      Dot(
        chart
      , xCoord(data.length - 1)
      , yCoord(data[data.length - 1])
      , props.thickness, 'red'
      );
    }

    if (props.minmax) {
      Dot(
        chart
      , xCoord(data.indexOf(d3.min(data)))
      , yCoord(d3.min(data))
      , props.thickness
      , 'blue'
      );
      Dot(
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

