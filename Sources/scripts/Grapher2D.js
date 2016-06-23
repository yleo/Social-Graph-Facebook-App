function Grapher2D() {
	this.n = 0;
	this.vertices = [];
	this.edgesl = [];
	this.edgesr = [];
	this.dragged = null;
	this.set = null;
	this.moyenne = new Array();
	this.commList = new Array();
	this.commBary = new Array();
	this.commVector = new Array();
	this.commView = -2;
	this.coords = new Array();
	this.commBox = new Array();
	this.need = true;
	this.clustering = new Array();
	this.clusteringComm = new Array();
	this.voisinCommLength = new Array();
}

Grapher2D.prototype.MakeGraph = function () {

	this.n = coords.length;
	this.vertices = [];
	this.edgesl = [];
	this.edgesr = [];
	var v;
	for (i in coords) {
		this.coords[i] = [(coords[i].x - mx) * 900 / (max_x - min_x), (coords[i].y - my) * 500 / (max_y - min_y)];
		v = new Vertex(this.coords[i][0], this.coords[i][1], i);
		this.vertices.push(v);
	}

	for (x in Graph) {
		moy = 0;
		for (y in Graph[x]) {
			if (x > Graph[x][y]) {
				this.edgesl.push(this.vertices[x]);
				this.edgesr.push(this.vertices[Graph[x][y]]);
			}
			moy += Math.sqrt((this.coords[Graph[x][y]][0] - this.coords[x][0]) * (this.coords[Graph[x][y]][0] - this.coords[x][0]) + (this.coords[Graph[x][y]][1] - this.coords[x][1]) * (this.coords[Graph[x][y]][1] - this.coords[x][1]));
		}
		if (moy) {
			this.moyenne[x] = moy / Graph[x].length;
		}
		else {
			this.moyenne[x] = -1;
		}
	}

}

Grapher2D.prototype.Colorier = function (i) {
	v = this.vertices[i];
	this.Fiche(i);
	this.set = v;
	this.need = true;
}

// pour sélectionner la communauté que l'on veut
Grapher2D.prototype.Need = function (k) {
	this.commView = k;
	this.need = true;
}

Grapher2D.prototype.BuildComm = function (community, trace) {

	function Intersection(arr1, arr2) {
		var r = [],
			o = {},
			l = arr2.length,
			i, v;
		for (i = 0; i < l; i++) {
			o[arr2[i]] = true;
		}
		l = arr1.length;
		for (i = 0; i < l; i++) {
			v = arr1[i];
			if (v in o) {
				r.push(v);
			}
		}
		return r;
	}

	var i = 0;

	for (x in community) {
		if (community[x].length > 0) {
			this.commList[i] = community[x];
			for (y in community[x]) {
				this.commVector[community[x][y]] = i;
			}
			i++;
		}
	}

	for (x in Graph) {
		this.clustering[x] = 0;
		this.clusteringComm[x] = 0;
		this.voisinCommLength[x] = 0;
	}
	for (x in Graph) {
		for (y in Graph[x]) {
			k = Graph[x][y];
			if (this.commVector[x] == this.commVector[k]) {
				this.voisinCommLength[x]++;
			}
			for (u in Graph[x]) {
				for (v in Graph[k]) {
					u1 = Graph[x][u];
					v1 = Graph[k][v];
					if (u1 == v1) {
						this.clustering[v1]++;
					}
					if (u1 == v1 && this.commVector[u1] == this.commVector[x] && this.commVector[u1] == this.commVector[k]) {
						this.clusteringComm[u1]++;
					}
				}
			}
		}
	}
	for (x in Graph) {
		if (Graph[x].length > 1) {
			this.clustering[x] = this.clustering[x] / (Graph[x].length * (Graph[x].length - 1));
		}
		if (this.voisinCommLength[x] > 1) {
			this.clusteringComm[x] = this.clusteringComm[x] / (this.voisinCommLength[x] * (this.voisinCommLength[x] - 1));
		}
	}

	if (trace) {
		var k = 1;
		for (x in this.commList) {
			repres = -1;
			valrep = -1;
			for (y in this.commList[x]) {
				var arr = Intersection(this.commList[x], Graph[this.commList[x][y]]);
				if (arr.length > valrep) {
					valrep = arr.length;
					repres = this.commList[x][y];
				}
			}
			if (this.commList[x].length > 1) {
				$('#selectComm').append('<option value="' + x + '">Communauté de ' + MyFriendsID[repres].name + '</option>');
				k++;
			}
		}
	}


	var n;
	for (m in this.commList) {
		var max1_x = -2000,
			min1_x = 2000,
			min1_y = 2000,
			max1_y = -2000;
		var mx1 = 0,
			my1 = 0;
		var number1 = this.commList[m].length;
		for (i = 0; i < this.commList[m].length; i++) {
			n = this.commList[m][i];
			max1_x = (coords[n].x > max1_x) ? coords[n].x : max1_x;
			min1_x = (coords[n].x < min1_x) ? coords[n].x : min1_x;

			max1_y = (coords[n].y > max1_y) ? coords[n].y : max1_y;
			min1_y = (coords[n].y < min1_y) ? coords[n].y : min1_y;

			mx1 += coords[n].x;
			my1 += coords[n].y;
		}

		mx1 /= number1;
		my1 /= number1;
		this.commBox[m] = [min1_x, max1_x, min1_y, max1_y];

		this.commBary[m] = [mx1, my1];
	}
}

Grapher2D.prototype.Fiche = function (i) {
	document.getElementById("Nom").innerHTML = MyFriendsID[i].name;
	document.getElementById("photo").src = 'https://graph.facebook.com/' + MyFriendsID[i].id + '/picture';
	document.getElementById("ComAmi").innerHTML = Graph[i].length + ' amis communs';
	document.getElementById("Clustering").innerHTML = 'Clustering : ' + this.clustering[i].toFixed(2);
	document.getElementById("ClusteringComm").innerHTML = 'Clustering Community : ' + this.clusteringComm[i].toFixed(2);
	return;
}

Grapher2D.prototype.FicheCommunity = function (i) {
	//TO DO : nombre de gens dans la communité, ....
	/*document.getElementById("Dist").innerHTML = 'Distance '+ this.moyenne[i].toFixed(2);*/
	this.need = true;
	return;
}

Grapher2D.prototype.SetDragged = function (x, y, r) {
	var u = new Point(x, y, 0);
	var v;
	var nr = r;
	if (this.commView > 0) {
		var min2_x = this.commBox[this.commView][0],
			max2_x = this.commBox[this.commView][1],
			min2_y = this.commBox[this.commView][2],
			max2_y = this.commBox[this.commView][3];
		var newx = ((x) * ((max2_x - min2_x) / 870) + this.commBary[this.commView][0] - mx) * (900 / (max_x - min_x));
		var newy = ((y) * ((max2_y - min2_y) / 500) - my + this.commBary[this.commView][1]) * (500 / (max_y - min_y));
		u = new Point(newx, newy, 0);
		r = r * ((max2_x - min2_x) / 870) * (900 / (max_x - min_x));
	}
	var max = -1,
		val = r;
	for (i = 0; i < this.n; i++) {
		v = this.vertices[i];
		var dist = u.distance2D(u, v);
		if (dist < r) {
			if (dist < val) {
				val = dist;
				max = i;
			}
		}
	}
	if (max != -1) {
		v = this.vertices[max];
		this.Fiche(max);
		this.dragged = v;
		this.set = v;
	}
	max = -1;
	val = r;
}

Grapher2D.prototype.MoveDragged = function (x, y) {
	if (!this.dragged) return;
	var newx = x;
	var newy = y;
	if (this.commView > 0) {
		var min2_x = this.commBox[this.commView][0],
			max2_x = this.commBox[this.commView][1],
			min2_y = this.commBox[this.commView][2],
			max2_y = this.commBox[this.commView][3];
		var newx = ((x) * ((max2_x - min2_x) / 870) + this.commBary[this.commView][0] - mx) * (900 / (max_x - min_x));
		var newy = ((y) * ((max2_y - min2_y) / 500) - my + this.commBary[this.commView][1]) * (500 / (max_y - min_y));
	}
	this.coords[this.dragged.z][0] = newx;
	this.coords[this.dragged.z][1] = newy;
	this.dragged.x = newx;
	this.dragged.y = newy;
}


Grapher2D.prototype.StopDragging = function () {
	this.dragged = null;
}