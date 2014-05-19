/**
 * 
 * MenuItemsクラス<br>
 * <br>
 * 
 * メニューに表示するアイテムを設定する<br>
 * アイコン：表示するFont Awesomeアイコン<br>
 * 関数名：アイコンがクリックされたときのコールバック関数<br>
 * <br>
 * 
 */
function MenuItems() {

	function MenuItem(sIconName, sFunctionName) {
		this.iconName = sIconName;
		this.functionName = sFunctionName;
	}


	this.mItems = new Array();
	this.length = 0;

	MenuItems.prototype.push = function(sIconName, sFunctionName) {
		var oMenuItem = new MenuItem(sIconName, sFunctionName);
		this.mItems.push(oMenuItem);
		this.length = this.mItems.length;
	};


	MenuItems.prototype.pop = function() {
		var oMenuItem = this.mItems.pop();
		this.length = this.mItems.length;
		return oMenuItem;
	};


	MenuItems.prototype.unshift = function(sIcon, sFunctionName) {
		var oMenuItem = new MenuItem(sIconName, sFunctionName);
		this.mItems.unshift(oMenuItem);
		this.length = this.mItems.length;
	};


	MenuItems.prototype.shift = function() {
		var oMenuItem = this.mItems.shift();
		this.length = this.mItems.length;
		return oMenuItem;
	};
}


/**
 * 
 * Menu表示クラス<br>
 * <br>
 * 
 * show()時に指定されたMenuItemsのアイコンを表示し、<br>
 * アイコンがクリックされたら、指定されたスクリプトをコールバックする<br>
 * <br>
 * 
 * @param oItem メニュー表示基となるHTMLエレメント
 * 
 */
function Menu(oItem) {

	Menu.prototype.ID_MENU = "ID_LIST_UI_MENU";
	Menu.prototype.ID_MENU_COVER = "ID_LIST_UI_MENU_COVER";
	Menu.prototype.CLASS_NAME_MENU = "ul-li-demo-menu";
	Menu.prototype.CLASS_NAME_MENU_UP = "ul-li-demo-menu-up";
	Menu.prototype.CLASS_NAME_MENU_DOWN = "ul-li-demo-menu-down";
	Menu.prototype.CLASS_NAME_MENU_COVER = "ul-li-demo-menu-cover";


	this.mSelfItem = null;
	this.mStartListener = null;
	this.mEndListener = null;
	this.mLeaveListener = null;


	Menu.prototype._constructor = function(oItem) {
		cmnLog.funcIn();

		this.mSelfItem = oItem;

		this.mStartListener = null;
		this.mEndListener = null;
		this.mLeaveListener = null;

		cmnLog.funcOut();
	};


	Menu.prototype.show = function(oMenuItems) {
		cmnLog.funcIn();

		var oItem = this.mSelfItem;

		// メニュー表示用オブジェクトを生成
		var oDivElement = document.createElement("DIV");
		oDivElement.id = this.ID_MENU;
		oDivElement.className = this.CLASS_NAME_MENU + " " + this.CLASS_NAME_MENU_UP;

		var oAElement = null;
		var oIElement = null;
		var oMenuItem = null;
		while(oMenuItems.length > 0) {
			oMenuItem = oMenuItems.shift();
			oIElement = document.createElement("I");
			oIElement.className = "fa " + oMenuItem.iconName;
			oAElement = document.createElement("A");
			if(oMenuItem.functionName != null) {
				oAElement.setAttribute("data-callback", oMenuItem.functionName);
			}
			oAElement.onclick = this.onClickMenuIcon.bind(this);
			oAElement.appendChild(oIElement);
			oDivElement.appendChild(oAElement);
		}

		document.body.appendChild(oDivElement);


		// 表示位置の設定
		nLeft = oItem.offsetLeft + oItem.offsetWidth - oDivElement.offsetWidth - 4;
		oDivElement.style.left = nLeft.toString() + "px";

		// Topは、クリックされたアイテムの上側に表示する
		var oRect = oItem.getBoundingClientRect();
		var nTop = window.scrollY + oRect.top - oDivElement.offsetHeight;

		// 画面からはみだす場合は、アイテムの下側に表示する
		if(nTop < window.scrollY) {
			oDivElement.className = this.CLASS_NAME_MENU + " " + this.CLASS_NAME_MENU_DOWN; // 吹き出しの向きを変えるため
			nTop = window.scrollY + oRect.bottom;
		}
		oDivElement.style.top = nTop.toString() + "px";


		// どこかクリックされたら、メニューを非表示にするためのイベントリスナを登録
		var oCoverElement = document.createElement("DIV");
		oCoverElement.id = this.ID_MENU_COVER;
		oCoverElement.className = this.CLASS_NAME_MENU_COVER;
		oCoverElement.style.top = "0px";
		oCoverElement.style.left = "0px";
		oCoverElement.style.width = document.body.scrollWidth + "px";
		oCoverElement.style.height = document.body.scrollHeight + "px";
		document.body.insertBefore(oCoverElement, oDivElement);

		this.mStartListener = this.onStartListener.bind(this);
		oCoverElement.addEventListener("mousedown", this.mStartListener, true);
		oCoverElement.addEventListener("touchstart", this.mStartListener, true);

		cmnLog.funcOut();

	};


	Menu.prototype.onClickMenuIcon = function(event) {
		cmnLog.funcIn();

		// イベントリスナを解除
		var oNode = document.getElementById(this.ID_MENU_COVER);
		oNode.removeEventListener("mousedown", this.mStartListener, false);
		oNode.removeEventListener("touchstart", this.mStartListener, false);
		this.mStartListener = null;
		// メニューを非表示
		this.hide();

		// コールバック
		var oSelfNode = event.currentTarget;
		var sCallBackName = oSelfNode.getAttribute("data-callback");
		if(sCallBackName != null) {
			sCallBackName = sCallBackName.replace("this", "this.mSelfItem");
			sCallBackName += ";";
			cmnLog.debug(sCallBackName);
			eval(sCallBackName);
		}
		cmnLog.funcOut();
	};


	Menu.prototype.hide = function() {
		cmnLog.funcIn();

		var oNode = document.getElementById(this.ID_MENU);
		document.body.removeChild(oNode);

		oNode = document.getElementById(this.ID_MENU_COVER);
		document.body.removeChild(oNode);

		cmnLog.funcOut();
	};


	Menu.prototype.onStartListener = function(event) {
		cmnLog.funcIn(event);

		event.preventDefault();
		event.stopPropagation();

		var oNode = document.getElementById(this.ID_MENU_COVER);

		// イベントリスナを解除
		oNode.removeEventListener("mousedown", this.mStartListener, false);
		oNode.removeEventListener("touchstart", this.mStartListener, false);
		this.mStartListener = null;
		// イベントリスナを登録
		this.mEndListener = this.onEndListener.bind(this);
		oNode.addEventListener("click", this.mEndListener, false);
		oNode.addEventListener("touchend", this.mEndListener, false);

		this.mLeaveListener = this.onLeaveListener.bind(this);
		oNode.addEventListener("mouseleave", this.mLeaveListener, false);
		oNode.addEventListener("touchleave", this.mLeaveListener, false);

		// メニューを非表示にする
		this.hide();

		cmnLog.funcOut();
	};


	Menu.prototype.onEndListener = function(event) {
		cmnLog.funcIn(event);

		event.preventDefault();
		event.stopPropagation();

		var oNode = document.getElementById(this.ID_MENU_COVER);
		// イベントリスナを解除
		oNode.removeEventListener("click", this.mEndListener, false);
		oNode.removeEventListener("touchend", this.mEndListener, false);
		this.mEndListener = null;
		oNode.removeEventListener("mouseleave", this.mLeaveListener, false);
		oNode.removeEventListener("touchleave", this.mLeaveListener, false);
		this.mLeaveListener = null;

		cmnLog.funcOut();
	};


	Menu.prototype.onLeaveListener = function(event) {
		cmnLog.funcIn(event);

		var oNode = document.getElementById(this.ID_MENU_COVER);
		// イベントリスナを解除
		oNode.removeEventListener("click", this.mEndListener, false);
		oNode.removeEventListener("touchend", this.mEndListener, false);
		this.mEndListener = null;
		oNode.removeEventListener("mouseleave", this.mLeaveListener, false);
		oNode.removeEventListener("touchleave", this.mLeaveListener, false);
		this.mLeaveListener = null;

		cmnLog.funcOut();
	};

	this._constructor(oItem);
}
