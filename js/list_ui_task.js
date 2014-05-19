/**
 * 
 * Task操作クラス<br>
 * <br>
 * 
 * タスクを階層(レベル)構造で操作するためのアクセッサを提供する<br>
 * <br>
 * 
 * @param oNode Task生成の基となるノードオブジェクト<br>
 * 
 */
function Task(oNode) {

	Task.prototype.CLASS_NAME_PIECE_LIST = "piece-list";
	Task.prototype.CLASS_NAME_PIECE = "ui-li-piece";
	Task.prototype.CLASS_NAME_PIECE_O = "ui-li-piece-o";
	Task.prototype.CLASS_NAME_PIECE_COLLAPSE = "ui-li-piece-collapse";
	Task.prototype.CLASS_NAME_PIECE_CHECK = "ui-li-piece-check";
	Task.prototype.CLASS_NAME_UI_LINK = "ui-link";
	Task.prototype.CLASS_NAME_SORTABLE_PLACEHOLDER = "ui-sortable-placeholder";

	Task.prototype.CLASS_NAME_LEVEL = "ul-li-demo-level-";
	Task.prototype.CLASS_NAME_LEVEL_UP = "ul-li-demo-level-up";
	Task.prototype.CLASS_NAME_LEVEL_DOWN = "ul-li-demo-level-down";
	Task.prototype.CLASS_NAME_ITEM = "ul-li-demo-item";
	Task.prototype.CLASS_NAME_SORT_HANDLE = "ul-li-demo-sort-handle";

	Task.prototype.CLASS_NAME_FA = "fa";
	Task.prototype.CLASS_NAME_FA_CHEVRON_RIGHT = "fa-chevron-right";
	Task.prototype.CLASS_NAME_FA_CHEVRON_DOWN = "fa-chevron-down";

	Task.prototype.ANIMATE_DURATION = 400; // アニメーションの時間


	/**
	 * ノードオブジェクト CLASS_NAME_PIECE_LIST or CLASS_NAME_PIECE
	 */
	this.mObjSelfNode;

	/**
	 * 自分がRootTask(CLASS_NAME_PIECE_LIST)かどうか
	 * 
	 * {Boolean} true：RootTask false：RootTaskではない
	 */
	this.isRootTask;

	/**
	 * コンストラクタ
	 * 
	 * @param oNode : Taskの基となるノードオブジェクト
	 */
	Task.prototype._constructor = function(oNode) {
		cmnLog.funcIn(oNode);

		this.mObjSelfNode = this._getSelfNode(oNode);
		this.isRootTask = this._isRootTask(oNode);

		cmnLog.funcOut(this.mObjSelfNode, this.isRootTask);
	};


	/**
	 * _getSelfNode
	 * 
	 * oNodeから自分のノードオブジェクト CLASS_NAME_PIECE_LIST or CLASS_NAME_PIECE を返却 ※_constructor()のみで使用
	 * 
	 * @returns 自分のノードオブジェクト CLASS_NAME_PIECE_LIST or CLASS_NAME_PIECE
	 */
	Task.prototype._getSelfNode = function(oNode) {
		var oSelfNode = null;

		var aClassList = oNode.classList;
		if(aClassList != null) {
			for( var i = 0; i < aClassList.length; i++) {
				switch(aClassList[i]) {
				case this.CLASS_NAME_PIECE_LIST:
				case this.CLASS_NAME_PIECE:
					oSelfNode = oNode;
					i = aClassList.length; // forを抜けるため
					break;
				default:
					break;
				}
			}
		}

		if(oSelfNode == null) {
			oSelfNode = oNode.parentNode;
			oSelfNode = this._getSelfNode(oSelfNode);
		}

		cmnLog.funcOut(oSelfNode);
		return oSelfNode;
	};


	/**
	 * _isRootTask
	 * 
	 * 自分がRootTask(CLASS_NAME_PIECE_LIST)かどうかを返却 ※_constructor()のみで使用
	 * 
	 * @returns {Boolean} true：RootTask false：RootTaskではない
	 */
	Task.prototype._isRootTask = function() {
		var aClassList = this.mObjSelfNode.classList;
		if(aClassList == null) {
			cmnLog.err("RootTaskか判断できません(mObjSelfNodeのclassListがありません)");
			cmnLog.funcOut(false);
			return false;
		}

		var bRet = false;
		for( var i = 0; i < aClassList.length; i++) {
			if(aClassList[i] == this.CLASS_NAME_PIECE_LIST) {
				bRet = true;
				break;
			}
		}
		cmnLog.funcOut(bRet);
		return bRet;
	};


	/**
	 * _addClassName
	 * 
	 * sTargetClassNameで指定されたノードオブジェクトのクラス名に sAddClassNameを追加する
	 * 
	 * @returns {Boolean} true：成功 false：失敗
	 */
	Task.prototype._addClassName = function(sTargetClassName, sAddClassName) {
		var oNode = this._getNodeByClassName(sTargetClassName);
		if(oNode == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var aClassList = oNode.classList;
		if(aClassList == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var sNewClassName = "";
		for( var i = 0; i < aClassList.length; i++) {
			sNewClassName += aClassList[i];
			sNewClassName += " ";
		}
		sNewClassName += sAddClassName;
		oNode.className = sNewClassName;

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * _removeClassName
	 * 
	 * sTargetClassNameで指定されたノードオブジェクトのクラス名から sRemoveClassNameを削除する
	 * 
	 * @returns {Boolean} true：成功 false：失敗
	 */
	Task.prototype._removeClassName = function(sTargetClassName, sRemoveClassName) {
		var oNode = this._getNodeByClassName(sTargetClassName);
		if(oNode == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var aClassList = oNode.classList;
		if(aClassList == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var sNewClassName = "";
		for( var i = 0; i < aClassList.length; i++) {
			if(aClassList[i] != sRemoveClassName) {
				sNewClassName += aClassList[i];
				sNewClassName += " ";
			}
		}
		sNewClassName = sNewClassName.substring(0, sNewClassName.length - 1);
		oNode.className = sNewClassName;

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * _replaceClassName
	 * 
	 * sTargetClassNameで指定されたノードオブジェクトのクラス名の中の sBeforeClassNameをsAfterClassNameに変更する
	 * 
	 * @returns {Boolean} true：成功 false：失敗
	 */
	Task.prototype._replaceClassName = function(sTargetClassName, sBeforeClassName, sAfterClassName) {
		var oNode = this._getNodeByClassName(sTargetClassName);
		if(oNode == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var aClassList = oNode.classList;
		if(aClassList == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var sNewClassName = "";
		for( var i = 0; i < aClassList.length; i++) {
			if(aClassList[i] == sBeforeClassName) {
				sNewClassName += sAfterClassName;
			}
			else {
				sNewClassName += aClassList[i];
			}
			sNewClassName += " ";
		}
		sNewClassName = sNewClassName.substring(0, sNewClassName.length - 1);
		oNode.className = sNewClassName;

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * _getNodeByClassNameEx
	 * 
	 * oNode配下から、クラス名にsTargetClassNameが含まれるノードオブジェクトを取得する ※子タスクは含まない
	 * 
	 * @param oNode : 検索基となるノードオブジェクト
	 * @param sTargetClassName : 取得するノードオブジェクトのクラス名
	 * 
	 * @returns {Node} ノードオブジェクト：成功 null：sTargetClassNameのノードオブジェクトがない
	 */
	Task.prototype._getNodeByClassNameEx = function(oNode, sTargetClassName) {

		var $base = $(oNode);
		var bRet = $base.hasClass(sTargetClassName);
		if(bRet == true) {
			cmnLog.funcOut(oNode);
			return oNode;
		}

		var $target = $base.find("." + sTargetClassName);
		var oTarget = $target.get(0);

		cmnLog.funcOut(oTarget);
		return oTarget;
	};


	/**
	 * _getNodeByClassName
	 * 
	 * クラス名にsTargetClassNameが含まれるノードオブジェクトを取得する(自身を含む) ※子タスクは含まない
	 * 
	 * @param sTargetClassName : 取得するノードオブジェクトのクラス名
	 * 
	 * @returns {Node} ノードオブジェクト：成功 null：sTargetClassNameのノードオブジェクトがない
	 */
	Task.prototype._getNodeByClassName = function(sTargetClassName) {
		var oChildNode = this._getNodeByClassNameEx(this.mObjSelfNode, sTargetClassName);
		cmnLog.funcOut(oChildNode);
		return oChildNode;
	};


	/**
	 * _getPreviousLI
	 * 
	 * 前(上)のCLASS_NAME_PIECEノードオブジェクトを返却
	 * 
	 * @returns {Node} CLASS_NAME_PIECEノードオブジェクト：成功 null：ない場合
	 */
	Task.prototype._getPreviousLI = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var oPreviousNode = null;
		var bRet = false;
		var $prev = $(this.mObjSelfNode);
		do {
			$prev = $prev.prev("." + this.CLASS_NAME_PIECE);
			oPreviousNode = $prev.get(0);
			if(oPreviousNode == null) {
				break;
			}
			bRet = $prev.hasClass(this.CLASS_NAME_SORTABLE_PLACEHOLDER);
		} while(bRet == true);

		cmnLog.funcOut(oPreviousNode);
		return oPreviousNode;
	};


	/**
	 * _getNextLI
	 * 
	 * 次(下)のCLASS_NAME_PIECEノードオブジェクトを返却
	 * 
	 * @returns {Node} CLASS_NAME_PIECEノードオブジェクト：成功 null：ない場合
	 */
	Task.prototype._getNextLI = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var oNextNode = null;
		var bRet = false;
		var $next = $(this.mObjSelfNode);
		do {
			$next = $next.next("." + this.CLASS_NAME_PIECE);
			oNextNode = $next.get(0);
			if(oNextNode == null) {
				break;
			}
			bRet = $next.hasClass(this.CLASS_NAME_SORTABLE_PLACEHOLDER);
		} while(bRet == true);

		cmnLog.funcOut(oNextNode);
		return oNextNode;
	};


	/**
	 * equals
	 * 
	 * 引数のoTaskと同じTaskかどうか
	 * 
	 * @returns {boolean} true：同じ false：不一致
	 */
	Task.prototype.equals = function(oTask) {
		if(oTask == null) {
			cmnLog.funcOut(false);
			return false;
		}

		var bRet = false;
		if(this.mObjSelfNode == oTask.mObjSelfNode) {
			bRet = true;
		}
		cmnLog.funcOut(bRet);
		return bRet;
	};


	/**
	 * getLevel
	 * 
	 * 第何階層かを返却
	 * 
	 * @returns {Number} 階層番号<br>
	 *          0：RootTask<br>
	 *          1～：Taskの階層番号<br>
	 *          -1：エラー<br>
	 */
	Task.prototype.getLevel = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(0);
			return 0;
		}

		var aClassList = this.mObjSelfNode.classList;
		if(aClassList == null) {
			cmnLog.err("Levelを取得できません(mObjSelfNodeのclassListがありません)");
			cmnLog.funcOut(-1);
			return -1;
		}

		var n = -1;
		var sLevel = null;
		for( var i = 0; i < aClassList.length; i++) {
			n = aClassList[i].indexOf(this.CLASS_NAME_LEVEL);
			if(n >= 0) {
				sLevel = aClassList[i].replace(this.CLASS_NAME_LEVEL, "");
				break;
			}
		}
		if(sLevel == null) {
			cmnLog.err("Levelを取得できません(mObjSelfNodeにCLASS_NAME_LEVELが含まれていません)");
			cmnLog.funcOut(-1);
			return -1;
		}

		var nLevel = Number(sLevel);

		var oUpNode = this._getNodeByClassName(this.CLASS_NAME_LEVEL_UP);
		var oDownNode = this._getNodeByClassName(this.CLASS_NAME_LEVEL_DOWN);
		if(oUpNode != null) {
			nLevel++;
		}
		else if(oDownNode != null) {
			nLevel--;
		}
		else {
		}
		cmnLog.funcOut(nLevel);
		return nLevel;
	};


	/**
	 * setLevel
	 * 
	 * 第何階層かを設定する
	 * 
	 * @param nLevel 層番号 1～9：Taskの階層番号
	 * @return {boolean} true：設定成功 false：設定失敗
	 */
	Task.prototype.setLevel = function(nLevel) {
		if((nLevel <= 0) || (nLevel > 10)) {
			// 設定値が範囲外
			cmnLog.funcOut(false);
			return false;
		}
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(false);
			return false;
		}

		var nOldLevel = this.getLevel();
		if(nOldLevel < 0) {
			cmnLog.funcOut(false);
			return false;
		}

		if(nOldLevel == nLevel) {
			cmnLog.funcOut(true);
			return true;
		}

		var sClassUpDown = null;
		if(nOldLevel < nLevel) {
			sClassUpDown = this.CLASS_NAME_LEVEL_UP;
		}
		else {
			sClassUpDown = this.CLASS_NAME_LEVEL_DOWN;
		}

		var oSelfTask = this;
		var strOldLevel = this.CLASS_NAME_LEVEL + nOldLevel.toString();
		var strNewLevel = this.CLASS_NAME_LEVEL + nLevel.toString();
		var nPadding = (nLevel - 1) * 20; // 本当はCSSの定義値を取得したほうがよい

		this._addClassName(strOldLevel, sClassUpDown); // アニメーション中のgetLevel()に対応するため

		var oCollapseNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_COLLAPSE);
		if(oCollapseNode != null) {
			$(oCollapseNode).animate({
				paddingLeft: nPadding + "px",
			}, {
				duration: this.ANIMATE_DURATION,
			});
		}

		var oCheckNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_CHECK);
		if(oCheckNode != null) {
			$(oCheckNode).animate({
				paddingLeft: nPadding + "px",
			}, {
				duration: this.ANIMATE_DURATION,
			});
		}

		nPadding += 20;
		var oItemNode = this._getNodeByClassName(this.CLASS_NAME_ITEM);
		$(oItemNode).animate({
			paddingLeft: nPadding + "px",
		}, {
			duration: this.ANIMATE_DURATION,
			complete: function() {
				oSelfTask._removeClassName(strOldLevel, sClassUpDown);
				oSelfTask._replaceClassName(strOldLevel, strOldLevel, strNewLevel);
			},
		});

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * upLevel
	 * 
	 * 自分のレベルを１つ上げる(右にずらす)
	 * 
	 * @return {boolean} true：設定成功 false：設定失敗
	 */
	Task.prototype.upLevel = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(false);
			return false;
		}

		var nNewLevel = this.getLevel() + 1;
		var bRet = this.setLevel(nNewLevel);
		return bRet;
	};


	/**
	 * downLevel
	 * 
	 * 自分のレベルを１つ下げる(左にずらす)
	 * 
	 * @return {boolean} true：設定成功 false：設定失敗
	 */
	Task.prototype.downLevel = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(false);
			return false;
		}

		var nNewLevel = this.getLevel() - 1;
		var bRet = this.setLevel(nNewLevel);
		return bRet;
	};


	/**
	 * RootTask(UL)を返却
	 * 
	 * @returns {Task} RootTask ※自身がRootTaskの場合もRootTask(自分)を返却
	 */
	Task.prototype.getRootTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合 自分を返却
			cmnLog.funcOut(this);
			return this;
		}

		var oRootNode = null;
		var oTmpNode = this.mObjSelfNode;
		do {
			oTmpNode = oTmpNode.parentNode;
			if(oTmpNode == null) {
				cmnLog.err("RootTaskを取得できません");
				return null;
			}
			oRootNode = this._getNodeByClassNameEx(oTmpNode, this.CLASS_NAME_PIECE_LIST);
		} while(oRootNode == null)

		var oRootTask = new Task(oRootNode);

		cmnLog.funcOut(oRootTask);
		return oRootTask;
	};


	/**
	 * getPreviousTask
	 * 
	 * 前(上)のタスクを返却 ※階層構造は無視
	 * 
	 * @returns {Task} ある場合：前(上)タスク ない場合：null
	 */
	Task.prototype.getPreviousTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var oPreviousTask = null;
		var oPreviousLI = this._getPreviousLI();
		if(oPreviousLI != null) {
			oPreviousTask = new Task(oPreviousLI);
		}
		else {
			// 前(上)がない場合は、RootTaskを返す
			oPreviousTask = this.getRootTask();
		}
		cmnLog.funcOut(oPreviousTask);
		return oPreviousTask;
	};


	/**
	 * getNextTask
	 * 
	 * 次(下)のタスクを返却 ※階層構造は無視
	 * 
	 * @returns {Task} ある場合：次(下)タスク ない場合：null
	 */
	Task.prototype.getNextTask = function() {
		var oNextLI = null;
		if(this.isRootTask == true) {
			// RootTaskの場合
			var oTmpNode = this.mObjSelfNode.firstChild;
			while(oTmpNode != null) {
				try {
					sTag = oTmpNode.tagName.toUpperCase();
					if(sTag == "LI") {
						oNextLI = oTmpNode;
						break;
					}
				}
				catch(e) {
					// 次に進む
				}
				oTmpNode = oTmpNode.nextSibling;
			}
		}
		else {
			oNextLI = this._getNextLI();
		}

		var oNextTask = null;
		if(oNextLI != null) {
			oNextTask = new Task(oNextLI);
		}

		cmnLog.funcOut(oNextTask);
		return oNextTask;
	};


	/**
	 * getParetTask
	 * 
	 * 親のタスクを返却
	 * 
	 * @returns {Task} ある場合：親タスク ない場合：null
	 */
	Task.prototype.getParetTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var oParetTask = null;
		var oPreviousTask = this;
		var nSelfLevel = this.getLevel();
		var nPreviousLevel = 0;
		do {
			oPreviousTask = oPreviousTask.getPreviousTask();
			if(oPreviousTask == null) {
				cmnLog.err("ParetTaskを取得できません");
				cmnLog.funcOut(null);
				return null;
			}
			nPreviousLevel = oPreviousTask.getLevel();

		} while(nPreviousLevel != (nSelfLevel - 1));

		oParetTask = oPreviousTask;
		cmnLog.funcOut(oParetTask);
		return oParetTask;
	};


	/**
	 * hasChildTask
	 * 
	 * 子タスクがあるかどうか
	 * 
	 * @returns {Boolean} true:子タスクあり false:子タスクなし
	 */
	Task.prototype.hasChildTask = function() {
		var bRet = false;

		var oCollapseNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_COLLAPSE);
		if(oCollapseNode != null) {
			bRet = true;
		}
		cmnLog.funcOut(bRet);
		return bRet;
	};


	/**
	 * getChildTasks
	 * 
	 * 子タスクを返却 ※ 直下の階層のみ
	 * 
	 * @returns {Array} ある場合：子タスクの配列 ない場合：length==0の配列
	 */
	Task.prototype.getChildTasks = function() {
		var aChildTasks = new Array();

		var oChildTask = this.getChildFirstTask();
		while(oChildTask != null) {
			aChildTasks.push(oChildTask);
			oChildTask = oChildTask.getNextSiblingTask();
		}

		cmnLog.funcOut(aChildTasks);
		return aChildTasks;
	};


	/**
	 * getAllChildTasks
	 * 
	 * 子タスクを返却 ※ すべての階層の子タスクを一次元配列にして返却
	 * 
	 * @returns {Array} ある場合：子タスクの配列 ない場合：length==0の配列
	 */
	Task.prototype.getAllChildTasks = function() {
		var aChildTasks = new Array();

		var nSelfLevel = this.getLevel();
		var nChildLevel = -1;
		var oChildTask = this.getNextTask();
		while(oChildTask != null) {
			nChildLevel = oChildTask.getLevel();
			if(nChildLevel <= nSelfLevel) {
				break;
			}
			aChildTasks.push(oChildTask);
			oChildTask = oChildTask.getNextTask();
		}
		cmnLog.funcOut(aChildTasks);
		return aChildTasks;
	};


	/**
	 * getChildFirstTask
	 * 
	 * 最初の子タスクを返却
	 * 
	 * @returns {Task} ある場合：最初の子タスク ない場合：null
	 */
	Task.prototype.getChildFirstTask = function() {
		var oChildTask = this.getNextTask();
		if(oChildTask == null) {
			cmnLog.funcOut(null);
			return null;
		}
		var nSelfLevel = this.getLevel();
		var nChildLevel = oChildTask.getLevel();
		if(nChildLevel != (nSelfLevel + 1)) {
			cmnLog.funcOut(null);
			return null;
		}

		cmnLog.funcOut(oChildTask);
		return oChildTask;
	};


	/**
	 * getChildLastTask
	 * 
	 * 最後の子タスクを返却 ※ 直下の階層
	 * 
	 * @returns {Task} ある場合：最後の子タスク ない場合：null
	 */
	Task.prototype.getChildLastTask = function() {
		var oChildLastTask = null;
		var oTmpTask = this.getChildFirstTask();
		while(oTmpTask != null) {
			oChildLastTask = oTmpTask;
			oTmpTask = oChildLastTask.getNextSiblingTask();
		}

		cmnLog.funcOut(oChildLastTask);
		return oChildLastTask;
	};


	/**
	 * getAllChildLastTask
	 * 
	 * 最後の子タスクを返却 ※ すべての階層の中で、一番最後(下)のタスク
	 * 
	 * @returns {Task} ある場合：最後の子タスク ない場合：null
	 */
	Task.prototype.getAllChildLastTask = function() {
		var oChildLastTask = null;
		var oTmpTask = this.getChildLastTask();
		while(oTmpTask != null) {
			oChildLastTask = oTmpTask;
			oTmpTask = oChildLastTask.getChildLastTask();

		}

		cmnLog.funcOut(oChildLastTask);
		return oChildLastTask;
	};


	/**
	 * getPreviousSiblingTask
	 * 
	 * 前(上)の兄弟タスクを返却
	 * 
	 * @returns {Task} ある場合：次の兄弟タスク ない場合：null
	 */
	Task.prototype.getPreviousSiblingTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var nSelfLevel = this.getLevel();
		var nPreviousLevel = -1;
		var oPreviousSiblingTask = null;
		var oPreviousTask = this.getPreviousTask();
		while(oPreviousTask != null) {
			nPreviousLevel = oPreviousTask.getLevel();
			if(nPreviousLevel == nSelfLevel) {
				oPreviousSiblingTask = oPreviousTask;
				break;
			}
			else if(nPreviousLevel < nSelfLevel) {
				break;
			}
			oPreviousTask = oPreviousTask.getPreviousTask();
		}

		cmnLog.funcOut(oPreviousSiblingTask);
		return oPreviousSiblingTask;
	};


	/**
	 * getNextSiblingTask
	 * 
	 * 次(下)の兄弟タスクを返却
	 * 
	 * @returns {Task} ある場合：次の兄弟タスク ない場合：null
	 */
	Task.prototype.getNextSiblingTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(null);
			return null;
		}

		var nSelfLevel = this.getLevel();
		var nNextLevel = -1;
		var oNextSiblingTask = null;
		var oNextTask = this.getNextTask();
		while(oNextTask != null) {
			nNextLevel = oNextTask.getLevel();
			if(nNextLevel == nSelfLevel) {
				oNextSiblingTask = oNextTask;
				break;
			}
			else if(nNextLevel < nSelfLevel) {
				break;
			}
			oNextTask = oNextTask.getNextTask();
		}

		cmnLog.funcOut(oNextSiblingTask);
		return oNextSiblingTask;
	};


	/**
	 * isShownChildren
	 * 
	 * 子タスクを表示しているかどうか
	 * 
	 * @returns {String} 表示中："block" 非表示："none" 子タスクなし：null
	 */
	Task.prototype.isShownChildren = function() {
		var oNode = this._getNodeByClassName(this.CLASS_NAME_FA_CHEVRON_DOWN);
		if(oNode != null) {
			cmnLog.funcOut("block");
			return "block";
		}
		oNode = this._getNodeByClassName(this.CLASS_NAME_FA_CHEVRON_RIGHT);
		if(oNode != null) {
			cmnLog.funcOut("none");
			return "none";
		}
		cmnLog.funcOut(null);
		return null;
	};


	/**
	 * showChildren
	 * 
	 * 子タスクを表示する
	 * 
	 * @returns {boolean} 成功：true 失敗：false
	 */
	Task.prototype.showChildren = function() {
		var bRet = this._replaceClassName(this.CLASS_NAME_FA, this.CLASS_NAME_FA_CHEVRON_RIGHT, this.CLASS_NAME_FA_CHEVRON_DOWN);
		if(bRet == false) {
			cmnLog.funcOut(false);
			return false;
		}

		var status = null;
		var aChildTasks = this.getChildTasks();
		for( var i = 0; i < aChildTasks.length; i++) {
			status = aChildTasks[i].isShownChildren();
			if(status == "block") {
				aChildTasks[i].showChildren();
			}
			$(aChildTasks[i].mObjSelfNode).slideDown(this.ANIMATE_DURATION);
		}

		cmnLog.funcOut(bRet);
		return bRet;
	};


	/**
	 * hideChildren
	 * 
	 * 子タスクを非表示にする
	 * 
	 * @returns {boolean} 成功：true 失敗：false
	 */
	Task.prototype.hideChildren = function() {
		var bRet = this._replaceClassName(this.CLASS_NAME_FA, this.CLASS_NAME_FA_CHEVRON_DOWN, this.CLASS_NAME_FA_CHEVRON_RIGHT);
		if(bRet == false) {
			cmnLog.funcOut(false);
			return false;
		}

		var aChildTasks = this.getAllChildTasks();
		for( var i = 0; i < aChildTasks.length; i++) {
			$(aChildTasks[i].mObjSelfNode).slideUp(this.ANIMATE_DURATION);
		}

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * isEnabledTask
	 * 
	 * タスクの状態がenable(オープン)かどうか
	 * 
	 * @returns {boolean} enable(オープン)：true disable(クローズ)：false
	 */
	Task.prototype.isEnabledTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(true);
			return true;
		}

		var bRet = false;
		var oNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_O);
		if(oNode == null) {
			bRet = true;
		}
		cmnLog.funcOut(bRet);
		return bRet;
	};


	/**
	 * convertParentTask
	 * 
	 * ペアレントタスクに変更する
	 * 
	 * @returns {boolean} 成功：true 失敗：false
	 */
	Task.prototype.convertParentTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(false);
			return false;
		}

		var bRet = this.hasChildTask();
		if(bRet == true) {
			cmnLog.funcOut(true);
			return true;
		}

		var oRemoveNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_CHECK);
		if(oRemoveNode != null) {
			this.mObjSelfNode.removeChild(oRemoveNode);
		}

		var oSanElement = document.createElement("SPAN");
		oSanElement.className = this.CLASS_NAME_PIECE_COLLAPSE;
		var oAElement = document.createElement("A");
		oAElement.className = this.CLASS_NAME_UI_LINK;
		oAElement.setAttribute("onclick", "onClickExpandButton(this)");
		var oIElement = document.createElement("I");
		oIElement.className = this.CLASS_NAME_FA + " " + this.CLASS_NAME_FA_CHEVRON_DOWN;

		oAElement.appendChild(oIElement);
		oSanElement.appendChild(oAElement);

		var oRefChild = this.mObjSelfNode.childNodes[1];
		this.mObjSelfNode.insertBefore(oSanElement, oRefChild);

		cmnLog.funcOut(true);
		return true;
	};


	/**
	 * convertParentTask
	 * 
	 * 子タスクに変更する
	 * 
	 * @returns {boolean} 成功：true 失敗：false
	 * 
	 * TODO : このタスクの発行者が自分の場合、CLASS_NAME_PIECE_CHECKを復活させる必要がある
	 */
	Task.prototype.convertChildTask = function() {
		if(this.isRootTask == true) {
			// RootTaskの場合
			cmnLog.funcOut(false);
			return false;
		}

		var bRet = this.hasChildTask();
		if(bRet == false) {
			cmnLog.funcOut(true);
			return true;
		}

		var oRemoveNode = this._getNodeByClassName(this.CLASS_NAME_PIECE_COLLAPSE);
		if(oRemoveNode != null) {
			this.mObjSelfNode.removeChild(oRemoveNode);
		}
		cmnLog.funcOut(true);
		return true;
	};


	// コンストラクタの処理を実行
	this._constructor(oNode);
}
