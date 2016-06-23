<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
  <title>Social Graph by frobic-yleo</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js" type="text/javascript" charset="utf-8"></script>
  <script src="scripts/app.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript" src="scripts/Point.js"></script> 
		<script type="text/javascript" src="scripts/Vertex.js"></script> 
		<script type="text/javascript" src="scripts/Grapher2D.js"></script> 
		<script type="text/javascript" src="scripts/Control.js"></script>
		<script type="text/javascript" src="scripts/slider.js"></script>

	<link rel="stylesheet" href="jquery/themes/base/jquery.ui.all.css">
	<script src="jquery/jquery-1.6.2.js"></script>
	<script src="jquery/ui/jquery.ui.core.js"></script>
	<script src="jquery/ui/jquery.ui.widget.js"></script>
	<script src="jquery/ui/jquery.ui.position.js"></script>
	<script src="jquery/ui/jquery.ui.autocomplete.js"></script>
	<link rel="stylesheet" href="jquery/demos/demos.css">

  <link rel="stylesheet" href="stylesheets/style.css" type="text/css" media="screen" title="no title" charset="utf-8" />
</head>
<body>
<div id="Chargement"></div>

<div id="center">
	<p class="ui-widget centered">
	<input id="tags" placeholder="- Trouve ton ami -" />
    <select onchange = "g.Need($(this).val())" id="selectComm" name="champs">
	<option value="-2"> - Communauté -</option>
	<option value="-2">Aucune</option>
	<option value="-1">Toutes</option>	
    </select>
    </p>
</div>
  <div id="fb-root"></div>
  <div id="login"><fb:login-button>Connect with Facebook</fb:login-button></div>
<div class="fiche">
    <table>
    <tr>
    <td><fb:profile-pic style="float:left" uid="loggedinuser" size="square" facebook-logo="true"></fb:profile-pic></td>
    <td><p><img id="photo" src="scripts/Unknown.jpg" /></p></td>
    <td>	
    <table><tr id="Nom"></tr><tr id="ComAmi"></tr><tr id="Clustering"></tr><tr id="ClusteringComm"></tr></table>
    </td>
    </tr>
    </table>
    </div>


<div style="float:left ; margin : 14px"></div>
<canvas style="clear : both" height="450" width="1410" id="c"> </canvas>

<p>Fait avec amour... par LEO Yannick et ROBIC Florent</p>

<img id="dot" src="scripts/dot.png" style="display: none;">
<img id="dotselect" src="scripts/dotselect.png" style="display: none;">
<img id="dot1" src="scripts/dot1.png" style="display: none;">
<img id="dot2" src="scripts/dot2.png" style="display: none;">
<img id="dot3" src="scripts/dot3.png" style="display: none;">
<img id="dot4" src="scripts/dot4.png" style="display: none;">
<img id="dot5" src="scripts/dot5.png" style="display: none;">
<img id="dot6" src="scripts/dot6.png" style="display: none;">
<img id="dot7" src="scripts/dot7.png" style="display: none;">
<!--<img id="dot8" src="scripts/dot8.png" style="display: none;">-->

<div id="ConsoleDebug">
</div>
</body>
</html>
