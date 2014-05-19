/**
 * 
 * LongClick処理クラス<br>
 * <br>
 * 
 * マウス・タッチ等の長押し操作が行われたときに<br>
 * 登録されている関数をコールバックする<br>
 * <br>
 * 
 * 下記属性が指定されたHTML要素で、長押しイベントが発生したときに<br>
 * 値に指定されたスクリプトを実行する。<br>
 * ・onLongClick=""<br>
 * ※指定は左右片方のみでも可<br>
 * <br>
 * 
 * HTML設定例：<br>
 * &lt;a onLongClick=&quot;function(this)&quot;&gt;<br>
 * <br>
 * 
 * ※Android/iOS端末の標準ブラウザでは、ブラウザ側の動作(サブメニュー表示等)が<br>
 * 実行されてしまうため、別途その対応が必要。<br>
 * 
 */
function LongClick() {

	var log = {
		debug: function(message) {
			// console.log(message);
		},
		err: function(message) {
			console.error(message);
		},
	};

	LongClick.prototype.TIMER_ID_INIT = -1;
	this.mStartX = -1;
	this.mStartY = -1;
	this.mTimerId = this.TIMER_ID_INIT;
	this.mListenerMouseMove = null;
	this.mListenerMouseLeave = null;
	this.mListenerClick = null;
	this.mListenerTouchMove = null;
	this.mListenerTouchLeave = null;
	this.mListenerTouchEnd = null;


	LongClick.prototype._constructor = function() {
		log.debug("LongClick._constructor()");

		this.initData();
		document.addEventListener("DOMContentLoaded", this.onloadAddLongClickEventListener.bind(this), false);
	};


	LongClick.prototype.initData = function() {
		log.debug("LongClick.initData()");

		this.mStartX = -1;
		this.mStartY = -1;
		this.mTimerId = this.TIMER_ID_INIT;
		// .bind(this)を使用して、Listener登録したメソッドを、
		// removeできるようにするため、メンバ変数に持つ
		this.mListenerMouseMove = null;
		this.mListenerMouseLeave = null;
		this.mListenerClick = null;
		this.mListenerTouchMove = null;
		this.mListenerTouchLeave = null;
		this.mListenerTouchEnd = null;
	};


	LongClick.prototype.onloadAddLongClickEventListener = function() {
		log.debug("LongClick.onloadAddLongClickEventListener()");

		var oNode = document.body;
		this.addLongClickEventListenerAll(oNode);
	};


	LongClick.prototype.addLongClickEventListenerAll = function(oNode) {
		// log.debug("LongClick.addLongClickEventListenerAll()");

		var aChildNodes = oNode.childNodes;
		for( var i = 0; i < aChildNodes.length; i++) {
			this.addLongClickEventListenerAll(aChildNodes[i]);
			this.addLongClickEventListener(aChildNodes[i]);
		}
	};


	LongClick.prototype.addLongClickEventListener = function(oNode) {
		// log.debug("LongClick.addLongClickEventListener()");

		try {
			var oLongClick = oNode.attributes.onlongclick;
			if(oLongClick != null) {
				oNode.addEventListener("mousedown", this.onMouseDown.bind(this), false);
				oNode.addEventListener("touchstart", this.onTouchStart.bind(this), false);
			}
		}
		catch(e) {
		}
	};


	/** ******************************************************************************************************************** */


	LongClick.prototype.addEventListener = function(oTargetNode) {
		log.debug("LongClick.addEventListener()");

		this.removeEventListener(oTargetNode);

		this.mListenerMouseMove = this.onMouseMove.bind(this);
		oTargetNode.addEventListener("mousemove", this.mListenerMouseMove, false);

		this.mListenerMouseLeave = this.onMouseLeave.bind(this);
		oTargetNode.addEventListener("mouseleave", this.mListenerMouseLeave, false);

		this.mListenerClick = this.onClick.bind(this);
		oTargetNode.addEventListener("click", this.mListenerClick, false);

		this.mListenerTouchMove = this.onTouchMove.bind(this);
		oTargetNode.addEventListener("touchmove", this.mListenerTouchMove, false);

		this.mListenerTouchLeave = this.onTouchLeave.bind(this);
		oTargetNode.addEventListener("touchleave", this.mListenerTouchLeave, false);

		this.mListenerTouchEnd = this.onTouchEnd.bind(this);
		oTargetNode.addEventListener("touchend", this.mListenerTouchEnd, false);
	};


	LongClick.prototype.removeEventListener = function(oTargetNode) {
		log.debug("LongClick.removeEventListener()");

		if(this.mListenerMouseMove != null) {
			oTargetNode.removeEventListener("mousemove", this.mListenerMouseMove, false);

		}
		this.mListenerMouseMove = null;

		if(this.mListenerMouseLeave != null) {
			oTargetNode.removeEventListener("mouseleave", this.mListenerMouseLeave, false);

		}
		this.mListenerMouseLeave = null;

		if(this.mListenerClick != null) {
			oTargetNode.removeEventListener("click", this.mListenerClick, false);
		}
		this.mListenerClick = null;

		if(this.mListenerTouchMove != null) {
			oTargetNode.removeEventListener("touchmove", this.mListenerTouchMove, false);

		}
		this.mListenerTouchMove = null;

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


	LongClick.prototype.onMouseDown = function(mouseEvent) {
		log.debug("LongClick.onMouseDown()");

		mouseEvent.preventDefault();
		// mouseEvent.stopPropagation();

		this.onStartEvent(mouseEvent.currentTarget, mouseEvent.screenX, mouseEvent.screenY);
	};


	LongClick.prototype.onTouchStart = function(touchEvent) {
		log.debug("LongClick.onTouchStart()");

		// touchEvent.preventDefault();
		// touchEvent.stopPropagation();

		var aTouches = touchEvent.changedTouches;
		var event = aTouches[0];
		this.onStartEvent(touchEvent.currentTarget, event.screenX, event.screenY);
	};


	LongClick.prototype.onStartEvent = function(oTargetNode, nX, nY) {
		log.debug("LongClick.onStartEvent()");

		this.mStartX = nX;
		this.mStartY = nY;
		this.mTimerId = window.setTimeout(this.onTimeout.bind(this, oTargetNode), 1000);
		this.addEventListener(oTargetNode);
	};


	/** ******************************************************************************************************************** */


	LongClick.prototype.onMouseMove = function(mouseEvent) {
		log.debug("LongClick.onMouseMove");

		this.onMoveEvent(mouseEvent.currentTarget, mouseEvent.screenX, mouseEvent.screenY);
	};


	LongClick.prototype.onTouchMove = function(touchEvent) {
		log.debug("LongClick.onTouchMove()");

		var aTouches = touchEvent.changedTouches;
		var event = aTouches[0];
		this.onMoveEvent(touchEvent.currentTarget, event.screenX, event.screenY);
	};


	LongClick.prototype.onMoveEvent = function(oTargetNode, nX, nY) {
		log.debug("LongClick.onMoveEvent()");

		var nRemX = nX - this.mStartX;
		log.debug("移動量(X) : " + nRemX);
		var nRemY = nY - this.mStartY;
		log.debug("移動量(Y) : " + nRemY);

		if(Math.abs(nRemY) < 10) { // Xは、Androidで正しくとれなかったため、評価しない
			return;
		}

		if(this.mTimerId > this.TIMER_ID_INIT) {
			window.clearTimeout(this.mTimerId);
			this.mTimerId = this.TIMER_ID_INIT;
			this.removeEventListener(event.currentTarget);
			this.initData();
		}
	};


	/** ******************************************************************************************************************** */


	LongClick.prototype.onMouseLeave = function(mouseEvent) {
		log.debug("LongClick.onMouseLeave()");

		this.onLeaveEvent(mouseEvent.currentTarget);
	};


	LongClick.prototype.onTouchLeave = function(touchEvent) {
		log.debug("LongClick.onTouchLeave()");

		this.onLeaveEvent(touchEvent.currentTarget);
	};


	LongClick.prototype.onLeaveEvent = function(oTargetNode) {
		log.debug("LongClick.onLeaveEvent()");

		if(this.mTimerId > this.TIMER_ID_INIT) {
			window.clearTimeout(this.mTimerId);
			this.mTimerId = this.TIMER_ID_INIT;
		}

		this.removeEventListener(event.currentTarget);
		this.initData();
	};


	/** ******************************************************************************************************************** */


	LongClick.prototype.onClick = function(mouseEvent) {
		log.debug("LongClick.onClick()");

		var bRet = this.onEndEvent(mouseEvent.currentTarget);
		if(bRet == true) {
			mouseEvent.preventDefault();
			mouseEvent.stopPropagation();
		}
	};


	LongClick.prototype.onTouchEnd = function(touchEvent) {
		log.debug("LongClick.onTouchEnd()");

		var bRet = this.onEndEvent(touchEvent.currentTarget);
		if(bRet == true) {
			touchEvent.preventDefault();
			touchEvent.stopPropagation();
		}
	};


	LongClick.prototype.onEndEvent = function(oTargetNode) {
		log.debug("LongClick.onEndEvent()");

		var bRet = false;
		if(this.mTimerId > this.TIMER_ID_INIT) {
			window.clearTimeout(this.mTimerId);
			this.mTimerId = this.TIMER_ID_INIT;
			bRet = false;
		}
		else {
			bRet = true;
		}

		this.removeEventListener(oTargetNode);
		this.initData();

		return bRet;
	};


	/** ******************************************************************************************************************** */


	LongClick.prototype.onTimeout = function(oTargetNode) {
		log.debug("LongClick.onTimeout()");

		this.mTimerId = this.TIMER_ID_INIT;

		var oLongClick = null;
		try {
			oLongClick = oTargetNode.attributes.onlongclick;
		}
		catch(e) {
		}
		// コールバック
		if(oLongClick != null) {
			var sFunc = oLongClick.value;
			sFunc = sFunc.replace("this", "oTargetNode"); // 仮処理
			eval(sFunc);
		}
	};


	this._constructor();
};
// var list_ui_long_click = new LongClick();	// LongClickは使用しないため無効化
