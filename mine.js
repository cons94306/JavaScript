//宣告寬與高的全域變數
var width; //column 行
var height;//row 列
var unclick_quantity;//尚未被點擊按鈕數量
var restart; //開始按鈕變數
var td; //td 將宣告為一個二維陣列變數
var mine_total; //地雷總數
var flag_quantity; //旗幟數量
var GameOver = false; //遊戲結束狀態
var timer=0;//計時器
var time_counter=0;//時間計數
var color;//呈現深淺顏色按鈕
	
function Menu() { //載入遊戲難度選擇畫面

	document.write('<title>Minesweeper</title>');
	document.write('<link rel="stylesheet" type="text/css" href="mine.css" />');
	document.write('<link rel="icon" href="./images/flag_icon.png" type="image/x-icon" />');

	document.write('<div class="wrapper">');
	document.write('<div class="container">');
	document.write('<form class="form">');
	document.write('<h1>Minesweeper</h1>');
	document.write('<button type="button" id="restart" onclick="Reset(10,10,10)" ">Easy</button><br>');
	document.write('<button type="button" id="restart" onclick="Reset(14,14,30)" ">Medium</button><br>');
	document.write('<button type="button" id="restart" onclick="Reset(18,18,70)" ">Hard</button>');
	document.write('</form>');
	document.write('</div>');
	document.write('<ul class="bg-bubbles">');
	for (var i = 0; i < 10; i++) {
	document.write('<li></li>');
	}
	document.write('</ul>');
	document.write('</div>');
	document.close();
}

function Reset(h,w,m) {
	//取得寛與高的控制權
	height = h;
	width = w;
	unclick_quantity = h * w;
	mine_total = m;
	GameOver = false;
	time_counter = 0;
	//重新初始畫面
	Init();
	clearInterval(timer);
	// timer=setInterval(function(){Clock_update()},100);
	timer = 0;
	flag_quantity = mine_total;
	Flag_update();
	Unclickg_update();
}

function Init() { //遊戲初始化
	document.write('<title>Minesweeper</title>');
	document.write('<link rel="stylesheet" type="text/css" href="mine.css" />');
	document.write('<link rel="icon" href="./images/flag_icon.png" type="image/x-icon" />');
	document.write('<div class="wrapper">');
	document.write('<div class="container">');
	document.write('<form>');
	document.write('<div class="dashboard">');
	document.write('<img src="./images/flag_icon.png"> <span id = "flag">0</span>&emsp;');
	document.write('<img src="./images/clock_icon.png"> <span id = "clock">0</span>&emsp;');
	document.write('<input type="image" id="restart" onclick="Menu()" img src="./images/refresh.png"></input><span id = "unclick">0</span>');
	document.write('</div>');
	
	// 繪製高(列)x寬(行)表格
	color = 0;// 按鈕變色用
	document.write('<table>');
	for (var i = 0; i < height; i++) {
		document.write('<tr>');
		if (width % 2 == 0) {
			color++;
		}
		for (var j = 0; j < width; j++) {
			document.write('<td  id="td_' 
					+ i + '_' + j + '" onclick="Left_click('
					+ i + ',' + j + ');" oncontextmenu="Right_click(' + i + ','
					+ j + ');return false;">');
			if (color % 2 == 0) {
				document.write('<img src="./images/button_0.png">');
			} else {
				document.write('<img src="./images/button_1.png">');
			}
			color++;
			document.write('</td>');
		}
		document.write('</tr>');
	}
	document.write('</table>');

	document.write('</form>');
	document.write('</div>');
	document.write('<ul class="bg-bubbles">');
	for (var i = 0; i < 10; i++) {
		document.write('<li></li>');
		}
	document.write('</ul>');
	document.write('</div>');
	document.close();// 完成HTML内文的寫入
	
	// 初始化二維陣列
	td = new Array();
	for (var i = 0; i < height; i++) {
		td[i] = new Array();
	}
	// 將每一個空格做初始化
	color = 0;// 按鈕變色用
	for (var i = 0; i < height; i++) {
		if (width % 2 == 0) {color++;}
		for (j = 0; j < width; j++) {
			td[i][j] = {
				MineQuantity : 0,// MineQuantity:設定其周邊的地雷數為0
				FlagQuantity : 0,// FlagQuantity:設定其周邊的旗幟數為0
				Bomb : false,// Bomb:設定空格本身是否被放置地雷
				Control : document.getElementById('td_' + i + '_' + j),// 取得按鈕控制權
				LState : false, // 記錄左鍵狀態: false: 尚未被點選,true:已經點選
				RState : 0, // 記錄右鍵狀態: 0:還原, 1:旗幟, 2:問號
				Color : color % 2
			};
			color++;
		}
	}
	
	// 亂數擺放地雷
	for (var i = 0; i < mine_total; i++) {
		// 亂數取得行與列的位置
		var a = Math.floor(Math.random() * height)
		var b = Math.floor(Math.random() * width)
		// 位置是否為空的
		if (td[a][b].Bomb == false) {
			td[a][b].Bomb = true;
			// 告知相鄰空格地雷數加1
			if (a > 0) {td[a - 1][b].MineQuantity++;
				if (b > 0) {td[a - 1][b - 1].MineQuantity++;}
				if (b + 1 < width) {td[a - 1][b + 1].MineQuantity++;}
			}
			if (a + 1 < height) {td[a + 1][b].MineQuantity++;
				if (b > 0) {td[a + 1][b - 1].MineQuantity++;}
				if (b + 1 < height) {td[a + 1][b + 1].MineQuantity++;}
			}
			if (b > 0) {td[a][b - 1].MineQuantity++;}
			if (b + 1 < height) {td[a][b + 1].MineQuantity++;}
		} else {
			i--;
		}
	}
}

function Left_click(i, j) { //左键事件處理程式

	if(timer==0){
		timer=setInterval(function(){Clock_update()},100);
	}

	if (GameOver) return;// 遊戲結束狀態,不處理任何事件
	if (td[i][j].RState > 0) return; // 是否被右鍵鎖住
	if (td[i][j].LState == true){
		if(td[i][j].MineQuantity == td[i][j].FlagQuantity)
		CheckAround(i,j);
	return;
	} // 是否被左鍵鎖住
	
	td[i][j].LState = true;//左鍵鎖定
	
	if (!td[i][j].Bomb) { // 不是地雷
		td[i][j].Control.innerHTML = '<img src="./images/mine_quantity_' + td[i][j].MineQuantity + '.png">';
		unclick_quantity--;
		Unclickg_update();
	} else { // 地雷,顯示已爆彈
		td[i][j].Control.innerHTML = '<img src="./images/bomb_0.png">';//誤觸炸彈
		GameOver = true; // 設定結束狀態
		clearInterval(timer);
		alert("You Lose!!");
		for (var a = 0; a < height; a++) {
			for (var b = 0; b < width; b++) {
				if (td[a][b].Bomb == true) {
					if (td[a][b] != td[i][j]) {
						if(td[a][b].RState==1){
							td[a][b].Control.innerHTML = '<img src="./images/bomb_2.png">';//插旗炸彈
						}else{
							td[a][b].Control.innerHTML = '<img src="./images/bomb_1.png">';//未發現炸彈
						}
					}
				}
			}
		}
	}

	if (td[i][j].MineQuantity == 0) { // 周圍沒地雷的時候
		CheckAround(i, j);
	}
	
	if (unclick_quantity == mine_total && !td[i][j].Bomb && !GameOver) {//勝利條件
		ClickAll();
		GameOver = true;
		clearInterval(timer);
		alert("You Win!!");
	}

}

function Right_click(i, j) { //右键事件處理程式
	if (GameOver) return;// 遊戲結束狀態,不處理任何事件
	if (td[i][j].LState) return; // 左鍵已經被點選了
	
	// 右鍵狀態值加1，再取其餘數即可進行狀態輪轉
	td[i][j].RState = (td[i][j].RState + 1) % 3;
	
	switch(td[i][j].RState){
	case 0:// 還原到未點選狀態
		td[i][j].Control.innerHTML = '<img src="./images/button_' + td[i][j].Color + '.png">';
		break;
	case 1:// 顯示旗幟
		td[i][j].Control.innerHTML = '<img src="./images/flag_' + td[i][j].Color + '.png">';
		flag_quantity--;

		a=i;b=j;
		if (a > 0) {td[a - 1][b].FlagQuantity++;
				if (b > 0) {td[a - 1][b - 1].FlagQuantity++;}
				if (b + 1 < width) {td[a - 1][b + 1].FlagQuantity++;}
			}
			if (a + 1 < height) {td[a + 1][b].FlagQuantity++;
				if (b > 0) {td[a + 1][b - 1].FlagQuantity++;}
				if (b + 1 < height) {td[a + 1][b + 1].FlagQuantity++;}
			}
			if (b > 0) {td[a][b - 1].FlagQuantity++;}
			if (b + 1 < height) {td[a][b + 1].FlagQuantity++;}

		break;
	case 2:// 顯示問號
		td[i][j].Control.innerHTML = '<img src="./images/mark_' + td[i][j].Color + '.png">';
		flag_quantity++;

		a=i;b=j;
		if (a > 0) {td[a - 1][b].FlagQuantity--;
				if (b > 0) {td[a - 1][b - 1].FlagQuantity--;}
				if (b + 1 < width) {td[a - 1][b + 1].FlagQuantity--;}
			}
			if (a + 1 < height) {td[a + 1][b].FlagQuantity--;
				if (b > 0) {td[a + 1][b - 1].FlagQuantity--;}
				if (b + 1 < height) {td[a + 1][b + 1].FlagQuantity--;}
			}
			if (b > 0) {td[a][b - 1].FlagQuantity--;}
			if (b + 1 < height) {td[a][b + 1].FlagQuantity--;}

		break;
	}

	Flag_update();
}

function CheckAround(i, j) { //當按下周圍炸彈為0，自動點擊周圍按鈕
	if (i > 0 && td[i - 1][j].LState == false) {Left_click(i - 1, j);}
	if (i + 1 < height && td[i + 1][j].LState == false) {Left_click(i + 1, j);}
	if (j > 0 && td[i][j - 1].LState == false) {Left_click(i, j - 1);}
	if (j + 1 < width && td[i][j + 1].LState == false) {Left_click(i, j + 1);}
	if (i > 0 && j > 0 && td[i - 1][j - 1].LState == false) {Left_click(i - 1, j - 1);}
	if (i > 0 && j + 1 < width && td[i - 1][j + 1].LState == false) {Left_click(i - 1, j + 1);}
	if (i + 1 < height && j > 0 && td[i + 1][j - 1].LState == false) {Left_click(i + 1, j - 1);}
	if (i + 1 < height && j + 1 < width && td[i + 1][j + 1].LState == false) {Left_click(i + 1, j + 1);}
}

function ClickAll() { //勝利時將剩下的全部點開
	for (var a = 0; a < height; a++) {
		for (var b = 0; b < width; b++) {
			if (td[a][b].Bomb == false && td[a][b].LState == false) {
				Left_click(a, b);
			}
		}
	}
}

function Flag_update() {
	document.getElementById('flag').innerHTML = flag_quantity;
}

function Clock_update() {
	document.getElementById('clock').innerHTML = (time_counter+=0.1).toFixed(1);
}

function Unclickg_update() {
	document.getElementById('unclick').innerHTML = unclick_quantity;
}