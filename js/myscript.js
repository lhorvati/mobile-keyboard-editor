/* MYSCRIPT.JS ======================================= */


/* Mobile Main Nav =================== */
$(function() {
	$(".keyboard-item").click(function() {
		$(this).toggleClass("toggle");
	});
});



/* Pressed btn =================== */
$(function() {
	$(".keyboard-item.special").click(function() {
		$(this).toggleClass("pressed");
	});
});