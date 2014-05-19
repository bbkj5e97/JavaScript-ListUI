/**
 * 
 * Flick処理クラス<br>
 * <br>
 * 
 * フリック（左右のみ）操作が行われたときに<br>
 * 登録されている関数をコールバックする<br>
 * <br>
 * 
 * 下記属性が指定されたHTML要素で、該当のイベントが発生したときに<br>
 * 値に指定されたスクリプトを実行する。<br>
 * ・onFlickLeft=""：左フリックの場合<br>
 * ・onFlickRight=""：右フリックの場合<br>
 * ※指定は左右片方のみでも可<br>
 * <br>
 * 
 * HTML設定例：<br>
 * &lt;a onFlickLeft=&quot;functionLeft(this)&quot; onFlickRight=&quot;functionRight(this)&quot;&gt;<br>
 * 
 */
function Flick() {

	var log = {
		debug: function(message) {
			// console.log(message);
		},
		err: function(message) {
			console.error(message);
		},
	};

	this.mTargetNode = null;
	this.mStartX = 0;
	this.mTimeStamp = 0;

	this.mListenerMouseLeave = null;
	this.mListenerClick = null;
	this.mListenerTouchLeave = null;
	this.mListenerTouchEnd = null;


	Flick.prototype._constructor = function() {
		log.debug("Flick._constructor()");

		this.initData();
		document.addEventListener("DOMContentLoaded", this.onloadAddFlickEventListener.bind(this), false);
	};


	Flick.prototype.initData = function() {
		log.debug("Flick.initData()");

		this.mTargetNode = null;
		this.mStartX = 0;
		this.mTimeStamp = 0;

		// .bind(this)を使用して、Listener登録したメソッドを、
		// removeできるようにするため、メンバ変数に持つ
		this.mListenerMouseLeave = null;
		this.mListenerClick = null;
		this.mListenerTouchLeave = null;
		this.mListenerTouchEnd = null;
	};


	Flick.prototype.onloadAddFlickEventListener = function() {
		log.debug("Flick.onloadAddFlickEventListener()");

		var oNode = document.body;
		this.addFlickEventListenerAll(oNode);
	};


	Flick.prototype.addFlickEventListenerAll = function(oNode) {
		// log.debug("Flick.addFlickEventListenerAll()");

		var aChildNodes = oNode.childNodes;
		for( var i = 0; i < aChildNodes.length; i++) {
			this.addFlickEventListenerAll(aChildNodes[i]);
			this.addFlickEventListener(aChildNodes[i]);
		}
	};


	Flick.prototype.addFlickEventListener = function(oNode) {
		// log.debug("Flick.addFlickEventListener()");

		try {
			var oFlickLeft = oNode.attributes.onflickleft;
			var oFlickRight = oNode.attributes.onflickright;
			if((oFlickLeft != null) || (oFlickRight != null)) {
				oNode.addEventListener("mousedown", this.onMouseDown.bind(this), false);
				oNode.addEventListener("touchstart", this.onTouchStart.bind(this), false);
			}
		}
		catch(e) {
		}
	};


	/** ******************************************************************************************************************** */


	Flick.prototype.addEventListener = function(oTargetNode) {
		log.debug("Flick.addEventListener()");

		this.removeEventListener(oTargetNode);

		this.mListenerMouseLeave = this.onMouseLeave.bind(this);
		oTargetNode.addEventListener("mouseleave", this.mListenerMouseLeave, false);

		this.mListenerClick = this.onClick.bind(this);
		oTargetNode.addEventListener("click", this.mListenerClick, false);

		this.mListenerTouchLeave = this.onTouchLeave.bind(this);
		oTargetNode.addEventListener("touchleave", this.mListenerTouchLeave, false);

		this.mListenerTouchEnd = this.onTouchEnd.bind(this);
		oTargetNode.addEventListener("touchend", this.mListenerTouchEnd, false);
	};


	Flick.prototype.removeEventListener = function(oTargetNode) {
		log.debug("Flick.removeEventListener()");

		if(this.mListenerMouseLeave != null) {
			oTargetNode.removeEventListener("mouseleave", this.mListenerMouseLeave, false);

		}
		this.mListenerMouseLeave = null;

		if(this.mListenerClick != null) {
			oTargetNode.removeEventListener("click", this.mListenerClick, false);
		}
		this.mListenerClick = null;

		if(this.mListenerTouchLeave != null) {
			oTargetNode.removeEventListener("touchleave", this.mListenerTouchLeave, false);

		}
		this.mListenerTouchLeave = null;

		if(this.mListenerTouchEnd != null) {
			oTargetNode.removeEventListener("touchend", this.mListenerTouchEnd, false);
		}
		this.mListenerTouchEnd = null;
	};


	/** ******************************************************************************************************************** */


	Flick.prototype.onMouseDown = function(mouseEvent) {
		log.debug("Flick.onMouseDown()");

		mouseEvent.preventDefault();
		// mouseEvent.stopPropagation();

		this.onStartEvent(mouseEvent.currentTarget, mouseEvent.pageX, mouseEvent.timeStamp);
	};


	Flick.prototype.onTouchStart = function(touchEvent) {
		log.debug("Flick.onTouchStart()");

		// touchEvent.preventDefault();
		// touchEvent.stopPropagation();

		var aTouches = touchEvent.changedTouches;
		var event = aTouches[0];

		this.onStartEvent(touchEvent.currentTarget, event.pageX, touchEvent.timeStamp);
	};


	Flick.prototype.onStartEvent = function(oTargetNode, nX, nTimeStamp) {
		log.debug("Flick.onStartEvent()");

		this.mTargetNode = oTargetNode;
		this.mStartX = nX;
		this.mTimeStamp = nTimeStamp;

		this.addEventListener(oTargetNode);
	};


	/** ******************************************************************************************************************** */


	Flick.prototype.onMouseLeave = function(mouseEvent) {
		log.debug("Flick.onMouseLeave");

		this.onOutEvent(mouseEvent);
	};


	Flick.prototype.onTouchLeave = function(touchEvent) {
		log.debug("Flick.onTouchLeave()");

		var aTouches = touchEvent.changedTouches;
		var event = aTouches[0];
		this.onOutEvent(event);
	};


	Flick.prototype.onOutEvent = function(event) {
		log.debug("Flick.onOutEvent()");

		this.removeEventListener(event.currentTarget);
		this.initData();
	};


	/** ******************************************************************************************************************** */


	Flick.prototype.onClick = function(mouseEvent) {
		log.debug("Flick.onMouseClick()");

		var bRet = this.onEndEvent(mouseEvent.currentTarget, mouseEvent.pageX, mouseEvent.timeStamp);
		if(bRet == true) {
			mouseEvent.preventDefault();
			mouseEvent.stopPropagation();
		}
	};


	Flick.prototype.onTouchEnd = function(touchEvent) {
		log.debug("Flick.onTouchEnd()");

		var aTouches = touchEvent.changedTouches;
		var eTouch = aTouches[0];
		var bRet = this.onEndEvent(touchEvent.currentTarget, eTouch.pageX, touchEvent.timeStamp);
		if(bRet == true) {
			touchEvent.preventDefault();
			touchEvent.stopPropagation();
		}
	};


	Flick.prototype.onEndEvent = function(oTargetNode, nX, nTimeStamp) {
		log.debug("Flick.onEndEvent()");

		var bRet = false;
		bRet = this._onEndEvent(oTargetNode, nX, nTimeStamp);
		this.removeEventListener(event.currentTarget);
		this.initData();

		return bRet;
	};


	Flick.prototype._onEndEvent = function(oTargetNode, nX, nTimeStamp) {
		log.debug("Flick._onEndEvent()");

		var bRet = false;
		if(oTargetNode != this.mTargetNode) {
			log.debug("TargetNode: " + oTargetNode + " != " + this.mTargetNode);
			return bRet;
		}

		if((this.mTimeStamp + 500) < nTimeStamp) {
			log.debug("TimeStamp:" + (nTimeStamp - this.mTimeStamp));
			return bRet;
		}

		var oFlick = null;
		var nRem = nX - this.mStartX;
		log.debug("フリック量 : " + nRem);
		if(nRem > 50) {
			log.debug("右フリック");
			try {
				oFlick = oTargetNode.attributes.onFlickRight;
			}
			catch(e) {
				log.debug(e.message);
			}
		}
		else if(nRem < -50) {
			log.debug("左フリック");
			try {
				oFlick = oTargetNode.attributes.onFlickLeft;
			}
			catch(e) {
				log.debug(e.message);
			}
		}
		else {
			return bRet;
		}

		// コールバック
		if(oFlick != null) {
			var sFunc = oFlick.value;
			sFunc = sFunc.replace("this", "oTargetNode"); // 仮処理
			sFunc = sFunc + ";";
			eval(sFunc);
			bRet = true;
		}
		else {
			log.debug("oFlick == null");
		}
		return bRet;
	};

	this._constructor();
}
var list_ui_flick = new Flick();
