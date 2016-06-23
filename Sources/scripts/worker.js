var running = false;
var Graph = new Array();


onmessage = function (event) {
	if (running == false) {
		running = true;
		run(event.data);
	}
};


function run(Graph) {

	// Initialisation
	function Suppression(i, tab) {
		for (var j = 0; j < tab.length; j++) {
			if (tab[j] == i) {
				tab[j] = tab[tab.length - 1];
				tab.pop();
				return tab;
			}
		}
		return tab;
	}

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


	var n = Graph.length;
	var m = 0;

	var Communaute = new Array();
	var MyComm = new Array();
	var CommArreteInterne = new Array();
	var CommArreteIncidente = new Array();
	var Degre = new Array();
	var DegreInterne = new Array();

	for (var i = 0; i < n; i++) {

		Communaute[i] = [i];
		MyComm[i] = i;
		CommArreteInterne[i] = 0;
		CommArreteIncidente[i] = Graph[i].length;
		m += CommArreteIncidente[i];
		Degre[i] = CommArreteIncidente[i];
		DegreInterne[i] = 0;
	}

	// Calcul
	for (var iter = 0; iter < 10; iter++) {
		var gain = false;

		for (var i = 0; i < n; i++) {
			// Pour chaque noeud
			var Ci = MyComm[i];
			var Meilleur = 0;
			var MeilleurComm = Ci;

			var DeltaQ = new Array();

			for (var k = 0; k < n; k++) {
				DeltaQ[k] = 0;
			}


			MyComm[i] = -1;
			CommArreteInterne[Ci] -= DegreInterne[i];
			CommArreteIncidente[Ci] += 2 * DegreInterne[i];
			CommArreteIncidente[Ci] -= Degre[i];
			var VoisinComm = Intersection(Communaute[Ci], Graph[i]);
			for (var k = 0; k < VoisinComm.length; k++) {
				DegreInterne[VoisinComm[k]]--;
			}
			Communaute[Ci] = Suppression(i, Communaute[Ci]);

			for (var k = 0; k < Graph[i].length; k++) {
				var j = Graph[i][k];
				var Cj = MyComm[j];
				if (DeltaQ[Cj] == 0) {
					var Ki_in = Intersection(Communaute[Cj], Graph[i]).length;
					DeltaQ[Cj] = (Ki_in) / m - (2.0 * Degre[i] * (CommArreteIncidente[Cj] + Degre[i] - Ki_in)) / (m * m);
					if (DeltaQ[Cj] > Meilleur) {
						Meilleur = DeltaQ[Cj];
						MeilleurComm = Cj;
					}
				}
			}

			if (MeilleurComm != Ci) {
				gain = true;
			}
			MyComm[i] = MeilleurComm;
			var VoisinComm = Intersection(Communaute[MeilleurComm], Graph[i]);
			DegreInterne[i] = VoisinComm.length;
			for (var k = 0; k < VoisinComm.length; k++) {
				DegreInterne[VoisinComm[k]]++;
			}
			CommArreteInterne[MeilleurComm] += DegreInterne[i];
			CommArreteIncidente[MeilleurComm] -= 2 * DegreInterne[i];
			CommArreteIncidente[MeilleurComm] += Degre[i];
			Communaute[MeilleurComm].push(i);
		}
	}

	postMessage(Communaute);
}