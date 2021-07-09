
		var margin=30, width = 800, height=600, gMargin = 100;
		var offsetChartWidth = 800, offsetChartHeight=300;
		var lines, tScale;
		const lValues = [];
		const rValues = [];


		//d3.csv('t1t2-skew.csv').then(function(data){
		function load_dataset(csv) {
			data = d3.csvParse(csv)

			// Remove any old chart before loading a new one
			d3.selectAll('svg').remove();

			display(data);
			displayOffset(data);
		}

		function displayOffset(data) {
			var offset = delta(data);

			points = d3.extent(offset,function(d){
				return parseFloat(d.step);
			});
		
			values = d3.extent(offset,function(d){
				return parseFloat(d.value);
			});
		
			scaleX = d3.scaleLinear()
				.domain([points[0]*95/100, points[1]*105/100])
				.range([gMargin, offsetChartWidth-margin]);

			scaleY = d3.scaleLinear()
				.domain([values[0]*95/100, values[1]*105/100])
				.range([offsetChartHeight-margin, margin]);

            var svg = d3.select('#chartOffset')
				.style('opacity', 1)
				.style('width', offsetChartWidth+1 + 'px')
				.style('height', offsetChartHeight+1 + 'px')
				.append('svg')
				.attr('width', offsetChartWidth + 'px')
				.attr('height', offsetChartHeight + 'px');

			offset.forEach(element => {
				svg.append('line')
					.attr('class', 'dot')
					.style('opacity', 0.5)
					.attr('x1', scaleX(element.step))
					.attr('y1', (offsetChartHeight-margin))
					.attr('x2', scaleX(element.step))
					.attr('y2', scaleY(element.value));

			});

			yAxis = d3.axisLeft(scaleY).ticks(10);
			yAxisG = svg.append('g')
				.attr('id', 'yAxis')
				.attr('class', 'axis');

			yAxisG.call(yAxis)
				.attr('transform', 'translate(' + (gMargin) + ',0)');

			xAxis = d3.axisBottom(scaleX).ticks(10);
			xAxisG = svg.append('g')
				.attr('id', 'xAxis')
				.attr('class', 'axis');

			xAxisG.call(xAxis)
				.attr('transform', 'translate(0,' + (offsetChartHeight-margin) + ')');

			addWaterMark('#chartOffset', offsetChartWidth, offsetChartHeight);
		}

		function addWaterMark(chart, width, height) {

 			var chart = d3.select(chart);
			var svg = chart.selectAll('svg');

			var h = Math.random()*100;
			while (h<height) {
				var w = Math.random()*100;
				while (w < width) {
					svg.append('text')
		            	.attr('x', w)
		            	.attr('y', h)
		            	//.attr('text-anchor', 'middle')
		            	.text('(c)AVChrono')
		            	.attr('class', 'watermark');
				
					w += 600 + Math.random()*100;
				}
				h += 200 + Math.random()*100;
			}

		}

		function delta(data) {

			var d = [];
			var i=0;
			data.forEach(element => {
				let t1 = (element.t1).split(".");
				let t2 = (element.t2).split(".");
				let result = 0;
				if(t1[0] == t2[0]) {
			    	result = t2[1] - t1[1];
				} else {
					result = (element.t2 - element.t1)*1000000000;
				}
				d.push({T2: element.t2, T1: element.t1, value: result, step: i++});
			});

			console.log(d);

			return (d);
		}

		function display(data) { 

			var svg = d3.select('#chart')
				.style('opacity', 1)
				.style('width', width + 'px')
				.style('height', height + 'px')
				.append('svg')
				.attr('width', width + 'px')
				.attr('height', height + 'px');

			
			//console.log("10 Float");
			//console.log(data);

			t1MinMax = d3.extent(data,function(d){
				return parseFloat(d.t1);
			});

			t2MinMax = d3.extent(data,function(d){
				return parseFloat(d.t2);
			});

			minTime = t1MinMax[0]<t2MinMax[0]?t1MinMax[0]:t2MinMax[0];
			maxTime = t1MinMax[1]>t2MinMax[1]?t1MinMax[1]:t2MinMax[1];


			tScale = d3.scaleLinear()
				.domain([minTime, maxTime])
				.range([margin, height-margin])

			lines = svg.selectAll('.dot')
				.data(data)
				.enter()
				.append('line')
				.attr('class', 'dot')
				.style('opacity', 0.3)
				.attr('x1', margin*3)
				.attr('y1', function(d){
					//console.log(d.t1);
					return tScale(d.t1);
				})
				.attr('x2', margin*3)
				.attr('y2', function(d){
					lValues.push(d.t1);
					rValues.push(d.t2);
					return tScale(d.t1);
				});

				lAxis = d3.axisLeft(tScale).ticks(10, "+f");
				//lAxis = d3.axisLeft(tScale).tickValues(lValues);
				lAxisG = svg.append('g')
	                .attr('id', 'lAxis')
	                .attr('class', 'axis');

	            lAxisG.call(lAxis)
	                .attr('transform', 'translate(' + (margin*3) + ',0)');


				rAxis = d3.axisRight(tScale).ticks(10, "+f");
				rAxisG = svg.append('g')
	                .attr('id', 'rAxis')
	                .attr('class', 'axis');

	            rAxisG.call(rAxis)
	                .attr('transform', 'translate(' + (width-(margin*3)) + ',0)');

				update();
				addWaterMark('#chart', width, height);
		}

		function update() {
			lines.transition()
				.delay(function(d,i){
					//return (d.t2-d.t1)*10000*i;
					return i*10;
				})
				.attr('x2', width-(margin*3))
				.attr('y2', function(d){
					return tScale(d.t2);
				})
		}

		function upload_button(el, callback){
			var uploader = document.getElementById(el);
			var reader = new FileReader();

			reader.onload = function(e) {
				var contents = e.target.result;
				callback(contents);
			}

			uploader.addEventListener("change", handleFiles, false);

			function handleFiles() {
				var file = this.files[0];
				reader.readAsText(file);
			}
		}

