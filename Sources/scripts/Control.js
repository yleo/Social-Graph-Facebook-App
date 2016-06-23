window.requestAnimFrame = (function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function ( /* function */ callback, /* DOMElement */ element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

webworker = new Worker('scripts/worker.js');
webworker.onmessage = function (event) {
	if (event.data && (event.data + "").match(/^log:/i)) {
		console.log(event.data.match(/^log:\s*(.*)/)[1]);
	}
	else {
		g.BuildComm(event.data, true);
	}
}


function onLoad() {

	imgselect = document.getElementById("dotselect");
	image = new Array();
	image[0] = document.getElementById("dot");
	for (i = 1; i < 8; i++) {
		image[i] = document.getElementById("dot" + i);
	}
	canv = document.getElementById("c");
	canv.onmousedown = onMD;
	canv.onmousemove = onMM;
	canv.onmouseup = onMU;
	window.onhashchange = function () {
		rebuildGraph();
	}
	w = canv.width = window.innerWidth - 30;
	h = canv.height = 600;
	hw = w / 2;
	hh = h / 2;
	minx = miny = maxx = maxy = 0;


	c = canv.getContext("2d");

	g = new Grapher2D();
	g1 = new Grapher2D();

	webworker.postMessage(Graph);

	new Slider('repSL', {
		value: 0.5,
		animation_callback: function (v) {}
	});
	new Slider('attSL', {
		value: 0.5,
		animation_callback: function (v) {}
	});
/*
				new Slider('damSL', {
					value:0.5,
					animation_callback: function(v) {
						g.damping = 0.5+v*0.45;
						g.stable = false;
					}
				});
				*/
	rebuildGraph();
	onEF();
}

function onMD(e) {
	g.SetDragged(mouseX(e) - hw, mouseY(e) - hh, 13);
}

function onMM(e) {
	g.MoveDragged(mouseX(e) - hw, mouseY(e) - hh);
}

function onMU(e) {
	g.StopDragging();
}

function mouseX(e) {
	return e.clientX - e.target.offsetLeft;
}

function mouseY(e) {
	return e.clientY - e.target.offsetTop;
}


function rebuildGraph() {
	g.MakeGraph();
}

function onEF() {
	window.requestAnimFrame(onEF, canv);
	redraw();
}

function sorter(a, b) {
	return a.z - b.z
}

function redraw() {
	if (g.dragged || g.need) {

		g.need = false;

		c.fillStyle = "#ffffff";

		c.fillStyle = "rgb(255,0,0)";
		c.clearRect(0, 0, 1358, 600);

		var u, v;

		for (i = 0; i < g.n; i++) {
			v = g.vertices[i];
			v.px = v.x;
			v.py = v.y;
		}

		c.lineWidth = 2;
		c.strokeStyle = "#c34747";
		for (i = 0; i < g.edgesl.length; i++) {
			u = g.edgesl[i];
			v = g.edgesr[i];
			var upx = u.px;
			var upy = u.py;
			var vpx = v.px;
			var vpy = v.py;
			if (g.commView > 0) {
				var min2_x = g.commBox[g.commView][0],
					max2_x = g.commBox[g.commView][1],
					min2_y = g.commBox[g.commView][2],
					max2_y = g.commBox[g.commView][3];
				upx = ((g.coords[u.z][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
				upy = ((g.coords[u.z][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
				vpx = ((g.coords[v.z][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
				vpy = ((g.coords[v.z][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
			}
			if (g.commView < 0) {
				c.beginPath();
				c.moveTo(upx + hw, upy + hh);
				c.lineTo(vpx + hw, vpy + hh);
				c.closePath();
				c.stroke();
			}
			else if (g.commVector[u.z] == g.commView && g.commVector[v.z] == g.commView) {
				c.beginPath();
				c.moveTo(upx + hw, upy + hh);
				c.lineTo(vpx + hw, vpy + hh);
				c.closePath();
				c.stroke();
			}
			if (g.set) {
				if (u.z == g.set.z || v.z == g.set.z) {
					c.strokeStyle = "#dfd130";
					if (g.commView > 0) {
						var min2_x = g.commBox[g.commView][0],
							max2_x = g.commBox[g.commView][1],
							min2_y = g.commBox[g.commView][2],
							max2_y = g.commBox[g.commView][3];
						upx = ((g.coords[u.z][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
						upy = ((g.coords[u.z][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
						vpx = ((g.coords[v.z][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
						vpy = ((g.coords[v.z][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
					}
					if (g.commView < 0) {
						c.beginPath();
						c.moveTo(upx + hw, upy + hh);
						c.lineTo(vpx + hw, vpy + hh);
						c.closePath();
						c.stroke();
					}
					else if (g.commVector[u.z] == g.commView && g.commVector[v.z] == g.commView) {
						c.beginPath();
						c.moveTo(upx + hw, upy + hh);
						c.lineTo(vpx + hw, vpy + hh);
						c.closePath();
						c.stroke();
					}
					c.strokeStyle = "#c34747";
				}
			}
		}
		var iw, kw;
		for (i = 0; i < g.n; i++) {
			v = g.vertices[i];
			iw = 30;
			kw = iw * 0.4;
			if (g.commView > 0) {
				var min2_x = g.commBox[g.commView][0],
					max2_x = g.commBox[g.commView][1],
					min2_y = g.commBox[g.commView][2],
					max2_y = g.commBox[g.commView][3];
			}

			if (g.set && v.z == g.set.z) {
				if (g.commView < 0) {
					c.drawImage(imgselect, v.px - kw + hw, v.py - kw + hh, 2 * iw / 3, 2 * iw / 3);
				}
				else {
					var px = ((g.coords[i][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
					var py = ((g.coords[i][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
					c.drawImage(imgselect, px - kw + hw, py - kw + hh, 2 * iw / 3, 2 * iw / 3);
				}
			}
			else {

				if (g.commView == -2) {
					c.drawImage(image[0], v.px - kw + hw, v.py - kw + hh, 2 * iw / 3, 2 * iw / 3);
				}
				else if (g.commView == -1) {
					c.drawImage(image[g.commVector[i] % 7 + 1], v.px - kw + hw, v.py - kw + hh, 2 * iw / 3, 2 * iw / 3);
				}
				else if (g.commVector[i] == g.commView) {
					var px = ((g.coords[i][0]) * ((max_x - min_x) / 900) - g.commBary[g.commView][0] + mx) * (870 / (max2_x - min2_x));
					var py = ((g.coords[i][1]) * ((max_y - min_y) / 500) + my - g.commBary[g.commView][1]) * (500 / (max2_y - min2_y));
					c.drawImage(image[g.commVector[i] % 7 + 1], px - kw + hw, py - kw + hh, 2 * iw / 3, 2 * iw / 3);
				}
			}
			if (v.px < minx) minx = v.px;
			else if (v.px > maxx) maxx = v.px;
			if (v.py < miny) miny = v.py;
			else if (v.py > maxy) maxy = v.py
		}
		minx = Math.max(minx + hw, 0);
		miny = Math.max(miny + hh, 0);
		maxx = Math.min(maxx + hw, w);
		maxy = Math.min(maxy + hh, h);
	}
}