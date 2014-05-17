/*
　独自に定義した名称

　　　class名							用途
  ul-li-demo-item
　ul-li-demo-menu					メニュー表示時のタグに設定
　ul-li-demo-menu-up				メニューをアイテムの上側に表示する場合に設定
　ul-li-demo-menu-down				メニューをアイテムの下側に表示する場合に設定
  ul-li-demo-menu-cover				メニュー表示中にマウス・タッチ等のイベントを取るためのタグに設定
  ul-li-demo-sort-handle			タスク並べ替え時のつまみ部分のタグに設定(有効時)
  ul-li-demo-sort-moving 　　　　　 タスク並び替え中のタグに設定
  ul-li-demo-level-[1-9]　　　　　　タスクの階層番号として設定
  ul-li-demo-level-up               タスクの階層番号の変更(up)中に設定
  ul-li-demo-level-down             タスクの階層番号の変更(down)中に設定


　　　属性名　　　　　　　　　　用途
  onLongClick			長押し時のコールバック関数設定用 ※未使用
　onFlickLeft			左フリック(右→左)時のコールバック関数設定用
　onFlickRight			右フリック(左→右)時のコールバック関数設定用
 */


/**
 * onClickExpandButton
 * 
 * 子タスクの表示・非表示を切り替える
 * 
 * @param oItem：クリックが発生したオブジェクト
 */
function onClickExpandButton(oItem) {
	cmnLog.funcIn(oItem);

	var oSelfTask = new Task(oItem);
	sState = oSelfTask.isShownChildren();
	if(sState == "block") {
		oSelfTask.hideChildren();
	}
	else {
		oSelfTask.showChildren();
	}
	cmnLog.funcOut();
}


/**
 * onClickMenuButton
 * 
 * メニューボタン押下処理
 * 
 * @param oItem：onClickが発生したオブジェクト
 */
function onClickMenuButton(oItem) {
	cmnLog.funcIn(oItem);

	var oSelfTask = new Task(oItem);
	var oNode = oSelfTask._getNodeByClassName("ul-li-demo-sort-moving");
	if(oNode != null) {
		// ソート中はメニューを表示しない
		cmnLog.funcOut();
		return;
	}

	var oMenuItems = new MenuItems();
	oMenuItems.push("fa-comment-o", "onClickDetail(this)");
	oMenuItems.push("fa-bookmark-o", "onClickBookmark(this)");
	oMenuItems.push("fa-plus", "onClickAddSubTask(this)");
	oMenuItems.push("fa-trash-o", "onClickRemove(this)");

	var oMenu = new Menu(oItem);
	oMenu.show(oMenuItems);

	cmnLog.funcOut();
}


function onClickDetail(oItem) {
	cmnLog.funcIn(oItem);
	toast.show("Not Implemented. (onClickDetail)");
	cmnLog.funcOut();
}


function onClickBookmark(oItem) {
	cmnLog.funcIn(oItem);
	toast.show("Not Implemented. (onClickBookmark)");
	cmnLog.funcOut();
}


function onClickAddSubTask(oItem) {
	cmnLog.funcIn(oItem);
	toast.show("Not Implemented. (onClickAddSubTask)");
	cmnLog.funcOut();
}


function onClickRemove(oItem) {
	cmnLog.funcIn(oItem);
	toast.show("Not Implemented. (onClickRemove)");
	cmnLog.funcOut();
}


/**
 * onFlickRightItem
 * 
 * 右フリック時処理 階層を下げる
 * 
 * @param oItem：右フリックが発生したオブジェクト
 */
function onFlickRightItem(oItem) {
	cmnLog.funcIn(oItem);
	onFlickItem(oItem, "FLICK_RIGHT");
	cmnLog.funcOut();
}


/**
 * onFlickLeftItem
 * 
 * 左フリック時処理 階層を上げる
 * 
 * @param oItem：左フリックが発生したオブジェクト
 */
function onFlickLeftItem(oItem) {
	cmnLog.funcIn(oItem);
	onFlickItem(oItem, "FLICK_LEFT");
	cmnLog.funcOut();
}


/**
 * onFlickItem
 * 
 * フリック時処理<br>
 * ・自身のレベル変更<br>
 * ・子タスクのレベル変更<br>
 * ・前タスクの親・子変更<br>
 * ・自身タスクの親・子変更<br>
 * 
 * @param oItem：フリックが発生したオブジェクト
 * @param sDirection：フリックの方向<br>
 *            "FLICK_RIGHT"：右フリック<br>
 *            "FLICK_LEFT"：左フリック<br>
 */
function onFlickItem(oItem, sDirection) {
	cmnLog.funcIn(oItem);

	var oSelfTask = new Task(oItem);
	var nSelfLevel = oSelfTask.getLevel();
	var oChildTasks = oSelfTask.getAllChildTasks(); // 自身のレベル変更後は、正しく子タスクを取得できないため、先に取得しておく

	var oPreviousTask = oSelfTask.getPreviousTask();
	var nPreviousLevel = oPreviousTask.getLevel();

	var bRet = false;
	if(sDirection == "FLICK_RIGHT") {
		if(nSelfLevel <= nPreviousLevel) {
			bRet = oSelfTask.upLevel();
		}
		else {
			bRet = false;
		}
	}
	else {
		bRet = oSelfTask.downLevel();
	}
	if(bRet == false) {
		toast.show("変更できません");
		cmnLog.funcOut();
		return;
	}

	// 子タスクのレベル更新処理
	for( var i = 0; i < oChildTasks.length; i++) {
		if(sDirection == "FLICK_RIGHT") {
			oChildTasks[i].upLevel();
		}
		else {
			oChildTasks[i].downLevel();
		}
	}

	// 自分・前後のLevelを取得
	// nPreviousLevel = oPreviousTask.getLevel();	// Previousは変更ないため
	nSelfLevel = oSelfTask.getLevel();
	var oNextTask = oSelfTask.getNextTask();
	var nNextLevel = 0;
	if(oNextTask != null) {
		nNextLevel = oNextTask.getLevel();
	}

	// PreviousTask更新処理
	if(nPreviousLevel == 0) {
	}
	else if(nSelfLevel == nPreviousLevel) {
		oPreviousTask.convertChildTask();
	}
	else if(nSelfLevel < nPreviousLevel) {
	}
	else if(nSelfLevel > nPreviousLevel) {
		oPreviousTask.convertParentTask();
	}
	else {
	}
	// SelfTask更新処理
	if(nNextLevel == 0) {
	}
	else if(nSelfLevel == nNextLevel) {
		oSelfTask.convertChildTask();
	}
	else if(nSelfLevel < nNextLevel) {
		oSelfTask.convertParentTask();
	}
	else if(nSelfLevel > nNextLevel) {
	}
	else {
	}

	cmnLog.funcOut();
}
