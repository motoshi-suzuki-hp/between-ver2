//駒の種類を数字で表す  C++のマクロっぽい表記（大文字）にしてみた
var OUT_OF_BOARD = 128;  
var EMPTY = 0;
var OU = 1;
var ENEMY = 2;
var EOU = ENEMY + OU;

var piece_board; //盤上の駒の画像のIDを入れておく変数

var selectedFlgB;  //盤上の駒が選択された状態かどうか

var clickRank,clickFile;  //駒を選択するときにクリックしたマスの段と筋

var selectedPiece; //選択された駒の種類

var board = []; //将棋盤の配列

var slb,slw;

var b;

var Direction = [];

Direction[0]  = new PiecePos(0,1);   //←
Direction[1]  = new PiecePos(1,1);   //←↓
Direction[2]  = new PiecePos(1,0);   //↓
Direction[3]  = new PiecePos(1,-1);  //→↓
Direction[4]  = new PiecePos(0,-1);  //→
Direction[5]  = new PiecePos(-1,-1); //→↑
Direction[6]  = new PiecePos(-1,0);  //↑
Direction[7]  = new PiecePos(-1,1);  //←↑

var CanGo = [
//←
[
  0,1,
  0,1
],

//←↓
[
  0,1,
  0,1
],

//↓
[
  0,1,
  0,1
],

//→↓
[
  0,1,
  0,1
],

//→
[
  0,1,
  0,1
],

//→↑
[
  0,1,
  0,1
],

//↑
[
  0,1,
  0,1
],

//←↑
[
  0,1,
  0,1
],

];

// var CanJump = [
// //←
// [
//   0,0,
//   0,0
// ],

// //←↓
// [
//   0,0,
//   0,0
// ],

// //↓
// [
//   0,0,
//   0,0
// ],

// //→↓
// [
//   0,0,
//   0,0
// ],

// //→
// [
//   0,0,
//   0,0
// ],

// //→↑
// [
//   0,0,
//   0,0
// ],

// //↑
// [
//   0,0,
//   0,0
// ],

// //←↑
// [
//   0,0,
//   0,0
// ],

// ];

//関数いろいろ
//先手の駒かどうか
var BlackKoma = function(piece){
	return (piece == OU);
}

//後手の駒かどうか
var WhiteKoma = function(piece){
	return (piece == EOU);
}

var Self = function(piece,turn){
	return (turn) ? BlackKoma(piece) : WhiteKoma(piece);
}

//駒かどうか
var Koma = function(piece){
	return ((piece == OU) || (piece == EOU));
}

//選択した駒が、選択したマスに動けるかどうかしらべる関数
var CanMove = function(pos){
	for(var i = 0; i < 8; i++){
		if(CanGo[i][selectedKoma]){
			if(pos.rank == FromClickDan + Direction[i].rank && pos.file == FromClickSuji + Direction[i].file)return 1;
			
			// if(CanJump[i][selectedKoma]){
			// 	for(var j = 1; j <= 8; j++){
			// 		var moved = new PiecePos(0,0);
			// 		moved.rank = FromClickDan + Direction[i].rank * j; moved.file = FromClickSuji + Direction[i].file * j;
			// 		if(pos.rank == moved.rank && pos.file == moved.file)return 1;
			// 		if(board[moved.rank][moved.file] != EMPTY)break;
			// 	}
			// }
			
		}
	}
	return 0;
}


var IsControl = function(pos,sengo){
	for(var i = 1; i <= 5; i++){
	for(var j = 1; j <= 7; j++){
		var piece = board[i][j];
		if(piece != EMPTY && Self(piece,sengo)){
			var start = new PiecePos(0,0);
			start.rank = i; start.file = j;
			
			for(var k = 0; k < 8; k++){
				var moved = new PiecePos(0,0);
				if(CanGo[k][piece]){
					moved.rank  = start.rank + Direction[k].rank;
					moved.file = start.file + Direction[k].file;
					if(Self(board[moved.rank][moved.file],sengo) || board[moved.rank][moved.file] == OUT_OF_BOARD)continue;
					if(moved.rank == pos.rank && moved.file == pos.file)return 1;
					
					// if(CanJump[k][piece]){
					// 	for(var l = 0; l < 8; l++){
					// 		moved.rank  += Direction[k].rank;
					// 		moved.file += Direction[k].file;
					// 		if(Self(board[moved.rank][moved.file],sengo) || board[moved.rank][moved.file] == OUT_OF_BOARD)break;
					// 		if(moved.rank == pos.rank && moved.file == pos.file)return 1;
					// 		if(board[moved.rank][moved.file] != EMPTY)break;
						
					// 	}
					
					// }
				}
			}
		}
	
	
	}
	}
	return 0;

}

function PiecePos(rank,file,piece){
	this.rank  = rank;
	this.file  = file;
	this.piece = piece;
}

PiecePos.prototype = {
	Add: function(pos1,pos2){
		this.rank = pos1.rank + pos2.rank;
		this.file = pos1.file + pos2.file;
	}
}

function Move(from,to,piece,promotion,capture){
	this.from = from;
	this.to   = to;
	this.piece = piece;
	this.promotion = promotion;
	this.capture = capture;
}


function Position(){
	this.Board = [];
	

	for(var i = 0; i <= 6; i++){
		this.Board[i] = [];
		for(var j = 0; j <= 8; j++){
			this.Board[i][j] = OUT_OF_BOARD;
		}
	}
		
	for(var i = 1; i <= 5; i++){
	for(var j = 1; j <= 7; j++){
		this.Board[i][j] = EMPTY;	
	}
	}

	
	this.turn = true;
	this.blackKingPos = new PiecePos(0,0);
	this.whiteKingPos = new PiecePos(0,0);
	
	}
	
Position.prototype = {
	
	Set_default: function(){
		this.Board[1][2] = EOU;
		this.Board[1][3] = EOU;
		this.Board[1][4] = EOU;
		this.Board[1][5] = EOU;
		this.Board[1][6] = EOU;
		this.Board[5][2] = OU;
		this.Board[5][3] = OU;
		this.Board[5][4] = OU;
		this.Board[5][5] = OU;
		this.Board[5][6] = OU;
		
	},
	
	do_move: function(move){
		if(move.from.file == 0 && move.from.rank == 0){
			this.Board[move.to.rank][move.to.file] = move.piece;
			this.turn = !this.turn;
		}
		
		else{
			this.Board[move.to.rank][move.to.file] = this.Board[move.from.rank][move.from.file];
			this.Board[move.from.rank][move.from.file] = EMPTY;
			
			this.turn = !this.turn;
		}
	},
	
	undo_move: function(move){
		if(move.from.file == 0 && move.from.rank == 0){
			this.Board[move.to.rank][move.to.file] = EMPTY;
			this.turn = !this.turn;
		}
		
		else{
			this.Board[move.from.rank][move.from.file] = this.Board[move.to.rank][move.to.file];
			this.Board[move.to.rank][move.to.file] = EMPTY;
			
			if((move.piece & ~ENEMY) == OU){
				if(move.piece == OU ){
					this.blackKingPos.rank  = move.from.rank;
					this.blackKingPos.file  = move.from.file;
				}
				else{
					this.whiteKingPos.rank  = move.from.rank;
					this.whiteKingPos.file  = move.from.file;
				}
			}
			
			this.turn = !this.turn;
		}
	
	},
	
	IsControl: function(pos,turn){
		for(var i = 1; i <= 5; i++){
		for(var j = 1; j <= 7; j++){
			var piece = this.Board[i][j];
			if(piece != EMPTY && Self(piece,turn)){
				var start = new PiecePos(0,0);
				start.rank = i; start.file = j;
				
				for(var k = 0; k < 8; k++){
					var moved = new PiecePos(0,0);
					if(CanGo[k][piece]){
						moved.rank  = start.rank + Direction[k].rank;
						moved.file = start.file + Direction[k].file;
						if(Self(this.Board[moved.rank][moved.file],turn) || this.Board[moved.rank][moved.file] == OUT_OF_BOARD)continue;
						if(moved.rank == pos.rank && moved.file == pos.file)return 1;
						
						// if(CanJump[k][piece]){
						// 	for(var l = 0; l < 7; l++){
						// 		moved.rank  += Direction[k].rank;
						// 		moved.file  += Direction[k].file;
						// 		if(Self(this.Board[moved.rank][moved.file],turn) || this.Board[moved.rank][moved.file] == OUT_OF_BOARD)break;
						// 		if(moved.rank == pos.rank && moved.file == pos.file)return 1;
						// 	}
						// }
					}
				}
			}
		}
		}
		return 0;

	
	},
	
	//ある駒が、あるマスに動けるかどうかしらべる関数
	CanMove: function(pos,piece){
		for(var i = 0; i < 8; i++){
			if(CanGo[i][piece]){
				if(pos.rank == clickRank + Direction[i].rank && pos.file == clickFile + Direction[i].file)return 1;
				
				// if(CanJump[i][piece]){
				// 	for(var j = 1; j <= 8; j++){
				// 		var moved = new PiecePos(0,0);
				// 		moved.rank = clickRank + Direction[i].rank * j; moved.file = clickFile + Direction[i].file * j;
				// 		if(pos.rank == moved.rank && pos.file == moved.file)return 1;
				// 		if(this.Board[moved.rank][moved.file] != EMPTY)break;
				// 	}
				// }
				
			}
		}
		return 0;
	},

}
	

//将棋盤全体（持ち駒もふくむ）を表示する
var showBoard = function(p){

	var fragment = document.createDocumentFragment();
	
	for(var rank = 1; rank <= 5; rank++){
	for(var file = 1; file <= 7; file++){
		var c = piece_board[p.Board[rank][file]].cloneNode(true); //駒画像の要素を複製
		c.style.left = 5 + ((file - 1) * 12.9) + "vw";         //位置を調節
		c.style.top = 0 + ((rank - 1) * 16) + "vh"; 
		c.removeAttribute("id");
		fragment.appendChild(c);

		if(p.Board[rank][file] != EMPTY && p.Board[rank][file] != OUT_OF_BOARD){  //もしマスに駒があれば
			(function(){
				var ocp_pos = new PiecePos(rank,file);
				c.onclick = function(){   //クリックされたらこの関数が呼び出される
					(p.turn == BlackKoma(p.Board[ocp_pos.rank][ocp_pos.file])) ? SelectSelfKoma(p,ocp_pos) : SelectEnemyKoma(p,ocp_pos);
				};
			})();
		}

		if(p.Board[rank][file] == EMPTY){    //もしマスに駒がなければ
			(function(){
				var emp_pos = new PiecePos(rank,file);
				c.onclick = function(){
					SelectEmptyCell(p,emp_pos);
					}
			})();
		}
	}
	}
	
	b.appendChild(fragment);                                //"board"に駒画像のノードを追加
	
	//手番の表示
	var TebanMessage = document.getElementById("TebanMessage");
	var TebanMessage_ref = document.getElementById("TebanMessage-ref");
	
	(p.turn) ? TebanMessage.innerHTML = "Black<br>" : TebanMessage.innerHTML = "White<br>";
	(p.turn) ? TebanMessage_ref.innerHTML = "Black<br>" : TebanMessage_ref.innerHTML = "White<br>";
};


//手番の駒をクリックしたときにつかう関数
var SelectSelfKoma = function(p,pos){  
	
	if(p.turn){
		slb.style.left =  5 + ((pos.file - 1) * 12.85) + "vw";
		slb.style.top = 0 + ((pos.rank - 1) * 16) + "vh";
		slb.onclick = function(){
			selectedFlgB = false; 
			slb.parentElement.removeChild(slb);
			}
		b.appendChild(slb);
	}

	else{
		slw.style.left = 5 + ((pos.file - 1) * 12.85) + "vw";
		slw.style.top = 0 + ((pos.rank - 1) * 16)+ "vh";
		slw.onclick = function(){
			selectedFlgB = false; 
			slw.parentElement.removeChild(slw);
		}
		b.appendChild(slw);
	}
	selectedFlgB = true; 
	selectedPiece = p.Board[pos.rank][pos.file];
	clickRank = pos.rank; clickFile = pos.file; 
};


//空のマスをクリックしたときにつかう関数
var SelectEmptyCell = function(p,pos){
	
	var sec_move = new Move();
	
	//もし駒が選択された状態なら
	if(selectedFlgB && p.CanMove(pos,selectedPiece)){
		
		var sec_from = new PiecePos(clickRank,clickFile);
		sec_move.from    = sec_from;
		sec_move.to      = pos;
		sec_move.piece   = selectedPiece;
		sec_move.capture = EMPTY;
		
		selectedFlgB = false;   
		(p.turn) ? b.removeChild(slb) : b.removeChild(slw);

		selectedPiece = EMPTY;
		p.do_move(sec_move);
		var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
		(check) ? p.undo_move(sec_move) : showBoard(p);
	}
	
}


//ページ読み込み時に以下の処理を実行
window.onload = function(){    
	
	b = document.getElementById("board");
	
	//選択フラグを初期化
	selectedFlgB = false;
	
	//選択した状態の画像のIDを取得
	slb = document.getElementById("selected_black");
    slw = document.getElementById("selected_white");  
	
	//pieceにコマ画像のIDを入れておく
	piece_board = [
	document.getElementById("cell_board"),
	document.getElementById("OU_black"),
	document.getElementById("cell_board"),
	document.getElementById("OU_white"),
	document.getElementById("cell_board"),
	];
	
	var p = new Position();
	
	p.Set_default();

	//将棋盤全体（持ち駒もふくむ）を表示する
	showBoard(p);
};

	
	
