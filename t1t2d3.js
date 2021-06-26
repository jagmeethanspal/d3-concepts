
		var margin=30, width = 1000, height=500, gMargin = 15;
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
				.domain(points)
				.range([300+margin, width-margin]);

			scaleY = d3.scaleLinear()
				.domain(values)
				.range([height-margin, 10*margin]);

			var svg = d3.select('svg');

			offset.forEach(element => {
				svg.append('line')
					.attr('class', 'dot')
					.style('opacity', 1)
					.attr('x1', scaleX(element.step))
					.attr('y1', (height-margin))
					.attr('x2', scaleX(element.step))
					.attr('y2', scaleY(element.value));

			});
		}

		function delta(data) {

			var d = [];
			var i=0;
			data.forEach(element => {
				d.push({step: i++, value: element.t2 - element.t1});
			});

			return (d);
		}

		function display(data) { 

			var svg = d3.select('#chart')
				.append('svg')
				.attr('width', width + 'px')
				.attr('height', height + 'px');

			
			console.log("Title");
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
				.attr('x1', 100)
				.attr('y1', function(d){
					//console.log(d.t1);
					return tScale(d.t1);
				})
				.attr('x2', 100)
				.attr('y2', function(d){
					lValues.push(d.t1);
					rValues.push(d.t2);
					return tScale(d.t1);
				});

				//lAxis = d3.axisLeft(tScale).ticks(10, "+f");
				lAxis = d3.axisLeft(tScale).tickValues(lValues);
				lAxisG = svg.append('g')
	                .attr('id', 'lAxis')
	                .attr('class', 'axis');

	            lAxisG.call(lAxis)
	                .attr('transform', 'translate(100,0)');


				rAxis = d3.axisRight(tScale).tickValues(rValues);
				rAxisG = svg.append('g')
	                .attr('id', 'rAxis')
	                .attr('class', 'axis');

	            rAxisG.call(rAxis)
	                .attr('transform', 'translate(200,0)');

				update();
		}

		function update() {
			lines.transition()
				.delay(function(d,i){
					//return (d.t2-d.t1)*10000*i;
					return i*10;
				})
				.attr('x2', 200)
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

        