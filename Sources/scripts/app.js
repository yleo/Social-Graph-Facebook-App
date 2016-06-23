MyFriends = new Array();
MyFriendsID = new Array();
Graph = new Array();
coords = new Array();
number = 0;
links = 0;
var moy = 0;
var Tri = new Array();
var AutoComplete = new Array();
var NbResponse = 0;



function printf(m) {
	var t = document.getElementById('ConsoleDebug');
	t.innerHTML += m + "<br />";
}

function Friend(id, name, nb) {
	this.id = id;
	this.name = name;
	this.nb = nb;
}

function Search(element, tableau) {
	for (x in tableau) {
		if (tableau[x] == element) {
			return true
		};
	}
	return false;
}

function Traitement() {
	max = 0;
	max_id = 0;

	for (x = 0; x < number; x++) {
		if (Graph[x].length > max) {
			max_id = x;
			max = Graph[x].length;
		}
	}


	damping = 1 / max;

	function Point(x, y, vx, vy, force) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}

	function Coulomb_repulsion(a, x1, y1, x2, y2) {
		norm = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		cos = (x2 - x1) / norm;
		sin = (y2 - y1) / norm;
		return [a * cos / (norm + 1), a * sin / (norm + 1)];
	}

	function Coulomb2_repulsion(a, x1, y1, x2, y2) {
		norm = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		cos = (x2 - x1) / norm;
		sin = (y2 - y1) / norm;
		return [a * cos / (norm + 0.1), a * sin / (norm + 0.1)];
	}

	function Hooke_repulsion(x1, y1, x2, y2) {
		return [(x2 - x1), (y2 - y1)]
	}

	for (x = 0; x < number; x++) {
		var randomabs = Math.floor(Math.random() * 601);
		var randomord = Math.floor(Math.random() * 601);
		coords.push(new Point(randomabs, randomord, 0, 0));
	}


	for (i = 0; i < 100; i++) {

		for (x = 0; x < number; x++) {
			var force = [0, 0];
			for (y = 0; y < number; y++) {
				if (x != y) {
					var TempC = Coulomb_repulsion(-1000, coords[x].x, coords[x].y, coords[y].x, coords[y].y);
					force[0] += TempC[0];
					force[1] += TempC[1];
				}
			}
			var zmax = Graph[x].length;
			for (var z = 0; z < zmax; z++) {
				a = Hooke_repulsion(coords[x].x, coords[x].y, coords[Graph[x][z]].x, coords[Graph[x][z]].y);
				force[0] = force[0] + a[0];
				force[1] = force[1] + a[1];
			}
			coords[x].vx = (coords[x].vx + force[0]) * damping;
			coords[x].vy = (coords[x].vy + force[1]) * damping;
			coords[x].x += coords[x].vx;
			coords[x].y += coords[x].vy;
		}
	}

	for (i = 0; i < Math.min(number / 20, 15); i++) {
		for (x = 0; x < number; x++) {
			var force = [0, 0];
			for (y = 0; y < number; y++) {
				if (x != y) {
					var TempC = Coulomb2_repulsion(-1000, coords[x].x, coords[x].y, coords[y].x, coords[y].y);
					force[0] += TempC[0];
					force[1] += TempC[1];
				}
			}
			coords[x].vx = (coords[x].vx + force[0]) * damping;
			coords[x].vy = (coords[x].vy + force[1]) * damping;
			coords[x].x += coords[x].vx;
			coords[x].y += coords[x].vy;
		}
	}

	mx = coords[0].x;
	my = coords[0].y;
	max_x = coords[0].x;
	max_y = coords[0].y;
	min_x = coords[0].x;
	min_y = coords[0].y;
	for (x = 1; x < number; x++) {
		max_x = (coords[x].x > max_x) ? coords[x].x : max_x;
		min_x = (coords[x].x < min_x) ? coords[x].x : min_x;

		max_y = (coords[x].y > max_y) ? coords[x].y : max_y;
		min_y = (coords[x].y < min_y) ? coords[x].y : min_y;

		mx += coords[x].x;
		my += coords[x].y;
	}

	mx /= number;
	my /= number;

	onLoad();

	$('#Chargement').html('Calcul Communauté.')
	var t = setTimeout("$('#Chargement').hide()", 1000);

}

$(function () {


	(function () {
		var e = document.createElement('script');
		e.async = true;
		e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
		window.fbAsyncInit = function () {
			$('#Chargement').hide();

			var nodouble = true;

			FB.init({
				appId: '126547340780835',
				status: true,
				cookie: true,
				xfbml: true,
				oauth: true
			});

			var session_handle = function (response) {

					if (response.status != "connected") return $('#login').show();

					$('#login').hide();

					$('#Chargement').show();
					$('#Chargement').html('Chargement de la liste des amis.');
					FB.api('/me/friends', function (response) {

						if (nodouble) {

							nodouble = false;
							$('#Chargement').html('Recherche des amis communs. (0%)');
							response.data.forEach(function (friend) {
								Graph[number] = [];
								MyFriends[friend.id] = new Friend(friend.id, friend.name, number);
								MyFriendsID[number] = new Friend(friend.id, friend.name, number);
								number++;
							});

							var buckets = [];

							var j = -1;
							for (var i = 0; i < number; i++) {
								if (i % 45 == 0) {
									j++;
									buckets[j] = [] ;
								}
								buckets[j].push({
									method: "GET",
									relative_url: "/me/mutualfriends/" + MyFriendsID[i].id
								})
							}

							for (var i = 0, j = buckets.length; i < j; i++) {
								(function (i) {
									FB.api("/", "POST", {
										batch: buckets[i]
									}, function (response) {
										NbResponse++;
										$('#Chargement').html('Recherche des amis communs. (' + (100 * NbResponse / buckets.length) + '%)');
										for (var k = 0, l = response.length; k < l; k++) {
											var donnees = JSON.parse(response[k].body).data;
											for (var kk = 0, ll = donnees.length; kk < ll; kk++) {
												Graph[i * 45 + k].push(MyFriends[donnees[kk].id].nb);
												links++;
											}
										}
										if (NbResponse == buckets.length) {
											$('#Chargement').html('Création du Graph.')
											var t = setTimeout("Traitement()", 1);
										}
									});
								})(i);
							}

							for (var i = 0; i < number; i++) {
								Tri[i] = MyFriendsID[i];
							}

							Tri.sort(function (a, b) {
								return a.name > b.name ? 1 : -1
							});

							for (var i in Tri) {
								$('#select').append('<option value="' + Tri[i].nb + '">' + Tri[i].name + '</option>');
							}

							for (var i in Tri) {
								AutoComplete[i] = {
									"value": Tri[i].name,
									"id": Tri[i].nb
								};
							}
							$("#tags").autocomplete({
								source: AutoComplete,
								select: function (event, ui) {
									g.Colorier(ui.item.id);
								}
							});
						}
					});




					FB.XFBML.parse();
				};
			//FB.Event.subscribe('auth.sessionChange', session_handle);
			//FB.Event.subscribe('auth.login', session_handle);
			FB.getLoginStatus(session_handle);

		};
	}());
});