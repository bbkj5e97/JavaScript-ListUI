JavaScript-ListUI
=================

### 対応内容
##### 1.　リストアイテムの並べ替え
　リストアイテム右側のアイコンをドラッグ＆ドロップすることでタスクを並べ替え。  
　ドロップされた位置にあわせて、階層(レベル)を変更。  
　並べ替えたタスクの子タスクも併せて移動する。
  
##### 2.　リストアイテムの階層(レベル)変更
　リストアイテムで左右フリックすると  
　左フリックで階層をアップ(左に移動)。  
　右フリックで階層をダウン(右に移動)。  
  
##### 3.　子タスクの表示・非表示切り替え
　リストアイテム左側のコラプスをクリックすると、子タスクの表示・非表示を切り替え。  
  
##### 4.　メニュー表示
　リストアイテム右側のアイコンをクリックするとメニューを表示。  
　表示するアイコンは、仮です。  
　そのアイコンクリック時の処理も、仮実装（Toast表示のみ）。  
  
=================
  
### 追加ライブラリ
　./js/jquery-ui-1.10.4.min.js　　　　　リスト並べ替えのために追加  
　./js/jquery.ui.touch-punch.min.js　　 リスト並べ替えをスマホで使えるようにするために追加  
  
=================
  
### 作成ファイル一覧
　./index.html　　　　　　　　灯(ともす)のタスクリストをベースに作成　※変更点の詳細は*下記参照*。  
　./js/list_ui_cmnlog.js　　　ログ表示処理  
　./js/list_ui_toast.js　　　 Toast表示処理  
　./js/list_ui_flick.js　　　 フリックイベント処理  
　./js/list_ui_long_click.js　長押しイベント処理　※未使用  
　./js/list_ui_task.js　　　　タスクを階層(レベル)構造で操作するためのアクセッサを提供  
　./js/list_ui_sortable.js　　リスト並べ替え処理  
　./js/list_ui_menu.js　　　　メニュー表示処理  
　./js/list_ui_demo.js　　　　index.htmlの各エレメントに設定したonClick等のコールバック関数を定義  
　./css/list_ui_demo.css　　　追加したクラス用のスタイル定義  
  
=================
  
### js中で参照しているclass名・ID
##### 1.　class名
　piece-list  
　ui-li-piece  
　ui-li-piece-o  
　ui-li-piece-collapse  
　ui-li-piece-check  
　ui-link　　　　　　　　　※jqueryで定義  
　ui-sortable-placeholder　※jquery-uiで定義  
　fa　　　　　　　　　　　 ※font-awesomeで定義  
　fa-chevron-right　　　　 ※font-awesomeで定義  
　fa-chevron-down　　　　　※font-awesomeで定義  
  
##### 2.　ID
　なし  
  
=================
  
### 独自定義したclass名・ID・属性名
##### 1.　class名
　ul-li-demo-item　　　　　 各リストアイテムのリンクを含んでいる<A>エレメントに設定  
　ul-li-demo-menu　　　　　 メニュー表示時のエレメントに設定  
　ul-li-demo-menu-up　　　　メニューをアイテムの上側に表示する場合に設定  
　ul-li-demo-menu-down　　　メニューをアイテムの下側に表示する場合に設定  
　ul-li-demo-menu-cover　　 メニュー表示中にマウス・タッチ等のイベントを取るためのエレメントに設定  
　ul-li-demo-sort-handle　　タスク並べ替え時のつまみ部分のエレメントに設定(有効時)  
　ul-li-demo-sort-moving　　タスク並び替え中のエレメントに設定  
　ul-li-demo-toast　　　　　Toast表示時のエレメントに設定  
　ul-li-demo-level-[1-9]　　タスクの階層番号として設定  
　ul-li-demo-level-up　　　 タスクの階層番号の変更(up)中に設定  
　ul-li-demo-level-down　　 タスクの階層番号の変更(down)中に設定  
  
##### 2.　ID
　ID_TOAST　　　　　　　　　Toast表示時のエレメントに設定  
　ID_LIST_UI_MENU　　　　　 メニュー表示のエレメントに設定  
　ID_LIST_UI_MENU_COVER　　 メニュー表示中にマウス・タッチ等のイベントを取るためのエレメントに設定  
  
##### 3.　属性名
　onFlickLeft　　　　　　　 左フリック(右→左)時のコールバック関数設定用  
　onFlickRight　　　　　　　右フリック(左→右)時のコールバック関数設定用  
　onLongClick　　　　　　　 長押し時のコールバック関数設定用 ※未使用  
　data-callback　　　　　　 メニュー表示時に設定されたコールバック関数名の保存用  
  
=================
  
### index.htmlの対応内容
1.　リストアイテム並べ替えのため、&lt;UL&gt;に以下属性を追加  
　　data-split-icon="bars"  
  
2.　Task操作のため、各&lt;LI&gt;のclass名に以下を追加  
　　ul-li-demo-level-[1-9]  
  
3.　Task操作のため、各&lt;LI&gt;配下の&lt;A&gt;に以下属性を追加  
　　class="ul-li-demo-item"  
  
4.　フリックのため、各&lt;LI&gt;配下の&lt;A&gt;に以下属性を追加  
　　onFlickLeft="onFlickLeftItem(this)" onFlickRight="onFlickRightItem(this)"  
  
5.　リストアイテム並べ替え・メニュー表示のため、各&lt;LI&gt;直下の最後に以下エレメントを追加。  
　　&lt;a class="ul-li-demo-sort-handle" onClick="onClickMenuButton(this)"&gt;&lt;/a&gt;  
  
6.　子タスクの表示・非表示切り替えのため、"ui-li-piece-collapse"配下の&lt;A&gt;に以下属性を追加  
　　onClick="onClickExpandButton(this)"  
  
