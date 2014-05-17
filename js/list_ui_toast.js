function Toast() {

	Toast.prototype.CLASS_NAME_TOAST = "ul-li-demo-toast";

	var mTimerId = -1;

	Toast.prototype.LENGTH_SHORT = 2 * 1000; // 2秒
	Toast.prototype.LENGTH_MIDIUM = 5 * 1000; // 5秒
	Toast.prototype.LENGTH_LONG = 10 * 1000; // 10秒


	Toast.prototype.show = function(sMessage /* , [nLength] */) {

		this.hide(); // 表示中の場合のために、一度消す

		var nLength = null;
		if(arguments.length == 2) {
			nLength = arguments[1];
		}
		if(nLength == null) {
			nLength = this.LENGTH_SHORT;
		}
		var oDivElement = document.createElement("DIV");
		oDivElement.id = "ID_TOAST";
		oDivElement.className = this.CLASS_NAME_TOAST;

		var oPElement = document.createElement("P");
		oPElement.innerText = sMessage;
		oDivElement.appendChild(oPElement);
		document.body.appendChild(oDivElement);

		var nLeft = window.innerWidth / 2 - oDivElement.offsetWidth / 2;
		oDivElement.style.left = nLeft.toString() + "px";
		var nTop = window.innerHeight + window.scrollY - oDivElement.offsetHeight - 20;
		oDivElement.style.top = nTop.toString() + "px";

		$(oDivElement).animate({
			opacity: "1.0",
		}, {
			duration: 200,
		});

		mTimerId = setTimeout("toast.hide()", nLength);
	};


	Toast.prototype.hide = function() {

		window.clearTimeout(mTimerId);
		mTimerId = -1;
		var oDivElement = document.getElementById("ID_TOAST");
		if(oDivElement == null) {
			return;
		}

		$(oDivElement).animate({
			opacity: "0",
		}, {
			duration: 400,
			complete: function() {
				document.body.removeChild(oDivElement);
			},
		});
	};
};

var toast = new Toast();
