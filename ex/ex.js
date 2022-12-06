//駒の種類を数字で表す  C++のマクロっぽい表記（大文字）にしてみた
var OUT_OF_BOARD = 128;  
var EMPTY = 0;
var OU = 1;
var ENEMY = 1;
var EOU = ENEMY + OU;


var piece_board; //盤上の駒の画像のIDを入れておく変数
var piece_black_capture; //先手の駒台の駒の画像のIDを入れておく変数
var piece_white_capture; //後手の駒台の駒の画像のIDを入れておく変数
var piece_promotion_window;  //成／不成を選択するウインドウに表示する駒の画像のIDを入れておく変数
var promotion_window;  //成／不成を選択するウインドウの画像のIDを入れておく変数

var selectedFlgB;  //盤上の駒が選択された状態かどうか
var selectedFlgC;  //持ち駒が選択された状態かどうか
var PromotionWindowFlg;  //成／不成を選択するウインドウが表示されているかどうか

var clickRank,clickFile;  //駒を選択するときにクリックしたマスの段と筋
var ToClickDan,ToClickSuji;  //用意したけどけっきょく使わなかった

var selectedPiece; //選択された駒の種類
var teban;  //手番 trueが先手番  falseが後手番

var board = []; //将棋盤の配列
var capture = []; //持ち駒の配列

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
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//←↓
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//↓
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//→↓
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//→
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//→↑
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//↑
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],

//←↑
[
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1,
//  歩香桂銀金角飛玉と杏圭全金馬竜
  1
],



];

var CanJump = [
//←
[
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //←↓
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //↓
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //→↓
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //→
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //→↑
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //↑
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],
    
    //←↑
    [
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1,
    //  歩香桂銀金角飛玉と杏圭全金馬竜
      1
    ],

];
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

var Enemy = function(piece,turn){
	return (!turn) ? BlackKoma(piece) : WhiteKoma(piece);
}

// //成ることができる駒かどうか
// var CanPromoteKoma = function(piece){
// 	var k = piece & ~ENEMY;
// 	return (FU <= k && k <= HI && k != KI && k != OU);
// }

//駒かどうか
var Koma = function(piece){
	return ((piece == OU) || (piece == EOU));
}

// //先手の陣地かどうか
// var BlackArea = function(rank,file){
// 	return (1 <= rank && rank <= 9 && 1 <= file && file <= 7);
// }

// //後手の陣地かどうか
// var WhiteArea = function(rank,file){
// 	return (1 <= rank && rank <= 3 && 1 <= file && file <= 7);
// }

// //盤上のマスがどうか　番兵おいたからつくった意味があまりない関数
// var WithinBoard = function(pos){
// 	return (1 <= pos.rank && pos.rank <= 9 && 1 <= pos.file && pos.file <= 9);
// }

// //成ることができるかどうか
// var CanPromote = function(piece,teban,rank,file){
// 	return (CanPromoteKoma(piece) && (BlackKoma(piece) && WhiteArea(rank,file) || WhiteKoma(piece) && BlackArea(rank,file)));
// }

// var MustPromote = function(piece,turn,rank,file){
// 	if((piece & ~ENEMY) == KY || (piece & ~ENEMY) == FU){
// 		if(turn && rank <= 1)return 1;
// 		if(!turn && rank >= 9)return 1;
// 	}
		
// 	if((piece & ~ENEMY) == KE){
// 		if(turn && rank <= 2)return 1;
// 		if(!turn && rank >= 8)return 1;
// 	}
	
// 	return 0;
	
// }

//選択した駒が、選択したマスに動けるかどうかしらべる関数
var CanMove = function(pos){
	for(var i = 0; i < 8; i++){
		if(CanGo[i][selectedKoma]){
			if(pos.rank == FromClickDan + Direction[i].rank && pos.file == FromClickSuji + Direction[i].file)return 1;
			
			if(CanJump[i][selectedKoma]){
				for(var j = 1; j <= 8; j++){
					var moved = new PiecePos(0,0);
					moved.rank = FromClickDan + Direction[i].rank * j;
                    moved.file = FromClickSuji + Direction[i].file * j;
					if(pos.rank == moved.rank && pos.file == moved.file)return 1;
					if(board[moved.rank][moved.file] != EMPTY)break;
				}
			}
			
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
			start.rank = i;
            start.file = j;
			
			for(var k = 0; k < 8; k++){
				var moved = new PiecePos(0,0);
				if(CanGo[k][piece]){
					moved.rank  = start.rank + Direction[k].rank;
					moved.file = start.file + Direction[k].file;
					if(Self(board[moved.rank][moved.file],sengo) || board[moved.rank][moved.file] == OUT_OF_BOARD)continue;
					if(moved.rank == pos.rank && moved.file == pos.file)return 1;
					
					if(CanJump[k][piece]){
						for(var l = 0; l < 8; l++){
							moved.rank  += Direction[k].rank;
							moved.file += Direction[k].file;
							if(Self(board[moved.rank][moved.file],sengo) || board[moved.rank][moved.file] == OUT_OF_BOARD)break;
							if(moved.rank == pos.rank && moved.file == pos.file)return 1;
							if(board[moved.rank][moved.file] != EMPTY)break;
						
						}
					
					}
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
	
	// this.Capture = [];
	// this.Capture[0] = [];
	// this.Capture[1] = [];
	
	this.FuFlg = [];
	this.FuFlg[0] = [];
	this.FuFlg[1] = [];
	
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

	// for(var i = 0; i <= 1; i++){
	// for(var j = 0; j <= 7; j++){
	// 	this.Capture[i][j] = EMPTY;
	// }	
	// }
	
	for(var i = 1; i <= 9; i++){
		this.FuFlg[0][i] = false;
		this.FuFlg[1][i] = false;
	}	
	
	this.turn = true;
	this.blackKingPos = new PiecePos(0,0);
	this.whiteKingPos = new PiecePos(0,0);
	
}
	
Position.prototype = {
	
	//SearchKing: function(){},
	//EvalPiece: function(){},
	
	
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

		
		// for(var piece = 1; piece <= 7; piece++){
		// 	this.Capture[0][piece] = 0;
		// 	this.Capture[1][piece] = 0;
		// }
		
		for(var i = 1; i <= 9; i++){
			this.FuFlg[0][i] = true;
			this.FuFlg[1][i] = true;
		}
		
		// this.blackKingPos.rank = 5;
		// this.blackKingPos.file = 5;
		// this.whiteKingPos.rank = 1;
		// this.whiteKingPos.file = 5;
		
	},
	
	do_move: function(move){
		if(move.from.file == 0 && move.from.rank == 0){
			this.Board[move.to.rank][move.to.file] = move.piece;
			// this.Capture[+this.turn][move.piece & ~ENEMY]--;
			if((move.piece & ~ENEMY) == FU)this.FuFlg[+this.turn][move.to.file] = true;
			this.turn = !this.turn;
		}
		
		else{
			var temp = this.Board[move.to.rank][move.to.file];
			this.Board[move.to.rank][move.to.file] = this.Board[move.from.rank][move.from.file];
			this.Board[move.from.rank][move.from.file] = EMPTY;
			
			if((move.piece & ~ENEMY) == OU){
				if(move.piece == OU){
					this.blackKingPos.rank = move.to.rank;
					this.blackKingPos.file = move.to.file;
				}
				else{
					this.whiteKingPos.rank = move.to.rank;
					this.whiteKingPos.file = move.to.file;
				}
			}
			
			if(move.promotion)this.Board[move.to.rank][move.to.file] += PROMOTED;
		
			if(move.capture != EMPTY && Koma(move.capture) && move.capture == temp){
				// this.Capture[+this.turn][move.capture & ~ENEMY & ~PROMOTED]++;
				if((move.capture & ~ENEMY) == FU)this.FuFlg[+!this.turn][move.to.file] = false;
			}
			
			if((move.piece & ~ENEMY) == 1 && move.promotion)(this.turn) ? this.FuFlg[1][move.to.file] = false : this.FuFlg[0][move.to.file] = false;
			
			this.turn = !this.turn;
		}
	},
	
	undo_move: function(move){
		if(move.from.file == 0 && move.from.rank == 0){
			this.Board[move.to.rank][move.to.file] = EMPTY;
			// this.Capture[+!this.turn][move.piece & ~ENEMY]++;
			if((move.piece & ~ENEMY) == 1)this.FuFlg[+!this.turn][move.to.file] = false;
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
			
			if(move.promotion)this.Board[move.from.rank][move.from.file] -= PROMOTED;
			
			if(move.capture != EMPTY && Koma(move.capture)){
				this.Board[move.to.rank][move.to.file] = move.capture;
				// this.Capture[+!this.turn][move.capture & ~ENEMY & ~PROMOTED]--;
				if((move.capture & ~ENEMY) == 1)this.FuFlg[+this.turn][move.to.file] = true;
			}
			
			if((move.piece & ~ENEMY) == 1 && move.promotion)(!this.turn) ? this.FuFlg[1][move.to.file] = true : this.FuFlg[0][move.to.file] = true;
			
			this.turn = !this.turn;
		}
	
	},
	
	IsControl: function(pos,turn){
		for(var i = 1; i <= 5; i++){
		for(var j = 1; j <= 7; j++){
			var piece = this.Board[i][j];
			if(piece != EMPTY && Self(piece,turn)){
				var start = new PiecePos(0,0);
				start.rank = i;
                start.file = j;
				
				for(var k = 0; k < 8; k++){
					var moved = new PiecePos(0,0);
					if(CanGo[k][piece]){
						moved.rank  = start.rank + Direction[k].rank;
						moved.file = start.file + Direction[k].file;
						if(Self(this.Board[moved.rank][moved.file],turn) || this.Board[moved.rank][moved.file] == OUT_OF_BOARD)continue;
						if(moved.rank == pos.rank && moved.file == pos.file)return 1;
						if(Enemy(this.Board[moved.rank][moved.file],turn))continue;
						
						if(CanJump[k][piece]){
							for(var l = 0; l < 7; l++){
								moved.rank  += Direction[k].rank;
								moved.file  += Direction[k].file;
								if(Self(this.Board[moved.rank][moved.file],turn) || this.Board[moved.rank][moved.file] == OUT_OF_BOARD)break;
								if(moved.rank == pos.rank && moved.file == pos.file)return 1;
								if(Enemy(this.Board[moved.rank][moved.file],turn))break;
							}
						}
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
				
				if(CanJump[i][piece]){
					for(var j = 1; j <= 8; j++){
						var moved = new PiecePos(0,0);
						moved.rank = clickRank + Direction[i].rank * j;
                        moved.file = clickFile + Direction[i].file * j;
						if(pos.rank == moved.rank && pos.file == moved.file)return 1;
						if(this.Board[moved.rank][moved.file] != EMPTY)break;
					}
				}
				
			}
		}
		return 0;
	}

	// CanDrop: function(pos,piece){
	// 	if((piece & ~ENEMY) == KY || (piece & ~ENEMY) == FU){
	// 		if(this.turn && pos.rank <= 1)return 0;
	// 		if(!this.turn && pos.rank >= 9)return 0;
			
	// 		if((piece & ~ENEMY) == FU){
	// 			if(this.turn && this.FuFlg[+this.turn][pos.file])return 0;
	// 			if(!this.turn && this.FuFlg[+this.turn][pos.file])return 0;
	// 		}
	// 	}
		
	// 	if((piece & ~ENEMY) == KE){
	// 		if(this.turn && pos.rank <= 2)return 0;
	// 		if(!this.turn && pos.rank >= 8)return 0;
	// 	}
		
	// 	return 1;
	
	// }
}
	

//将棋盤全体（持ち駒もふくむ）を表示する
var showBoard = function(p){

	var fragment = document.createDocumentFragment();
	
	for(var rank = 1; rank <= 5; rank++){
	for(var file = 1; file <= 7; file++){
		var c = piece_board[p.Board[rank][file]].cloneNode(true); //駒画像の要素を複製
		c.style.left = 4 + ((file - 1) * 13) + "vw";         //位置を調節
		c.style.top = 6 + ((rank - 1) * 16) + "vh"; 
		c.removeAttribute("id");
		fragment.appendChild(c);

		if(p.Board[rank][file] != EMPTY && p.Board[rank][file] != OUT_OF_BOARD){  //もしマスに駒があれば
			(function(){
				var _rank = rank, _file = file;    //rankとfileは1ずつ足されていくので覚えておく
				var ocp_pos = new PiecePos(rank,file);
				c.onclick = function(){   //クリックされたらこの関数が呼び出される
					(p.turn == BlackKoma(p.Board[ocp_pos.rank][ocp_pos.file]) && !PromotionWindowFlg) ? SelectSelfKoma(p,ocp_pos) : SelectEnemyKoma(p,ocp_pos);
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
	
	(p.turn) ? TebanMessage.innerHTML = "先手番です<br>" : TebanMessage.innerHTML = "後手番です<br>";
};


//手番の駒をクリックしたときにつかう関数
var SelectSelfKoma = function(p,pos){  
	
	if(p.turn){
		slb.style.left =  3.7 + ((pos.file - 1) * 13) + "vw";
		slb.style.top = 5.7 + ((pos.rank - 1) * 16) + "vh";
		slb.onclick = function(){
			selectedFlgB = false; 
			slb.parentElement.removeChild(slb);
			}
		b.appendChild(slb);
	}

	else{
		slw.style.left = 3.7 + ((pos.file - 1) * 13) + "vw";
		slw.style.top = 5.7 + ((pos.rank - 1) * 16)+ "vh";
		slw.onclick = function(){
			selectedFlgB = false; 
			slw.parentElement.removeChild(slw);
		}
		b.appendChild(slw);
	}
	selectedFlgB = true; 
	// selectedFlgC = false; 
	selectedPiece = p.Board[pos.rank][pos.file];
	clickRank = pos.rank;
    clickFile = pos.file; 
};


//敵の駒をクリックしたときにつかう関数
var SelectEnemyKoma = function(p,pos){
	// var cb = document.getElementById("capture_black"), cw = document.getElementById("capture_white");
	
	//盤上の駒を選択している状態なら
	if(selectedFlgB && p.CanMove(pos,selectedPiece)){
		var sek_move = new Move();
		
		var sek_from = new PiecePos(clickRank,clickFile);
		sek_move.from    = sek_from;
		sek_move.to      = pos;
		sek_move.piece   = selectedPiece;
		sek_move.capture = p.Board[pos.rank][pos.file];
		
		selectedFlgB = false; 
		// selectedFlgC = false; 
		(p.turn) ? b.removeChild(slb) : b.removeChild(slw);
		
		// if((CanPromote(selectedPiece,p.turn,pos.rank,pos.file) || CanPromote(selectedPiece,p.turn,clickRank,clickFile))){
		// 	if(MustPromote(selectedPiece,p.turn,pos.rank,pos.file)){
		// 		sek_move.promotion = true;
		// 		selectedPiece = EMPTY;
		// 		p.do_move(sek_move);
		// 		var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
		// 		(check) ? p.undo_move(sek_move) : showBoard(p);
		// 	}
		// }
		
		// else{
			selectedPiece = EMPTY;
			p.do_move(sek_move);
			var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
			(check) ? p.undo_move(sek_move) : showBoard(p);
		// }
	}
	//持ち駒を選択している状態なら
	// if(selectedFlgC){
	// 	(p.turn) ? cb.removeChild(slb) : cw.removeChild(slw);
	// }
// selectedFlgC = false;

}


//空のマスをクリックしたときにつかう関数
var SelectEmptyCell = function(p,pos){ 
	var cb = document.getElementById("capture_black"), cw = document.getElementById("capture_white");
	
	var sec_move = new Move();
	
		//もし駒が選択された状態なら
	if(selectedFlgB && p.CanMove(pos,selectedPiece)){
		
		var sec_from = new PiecePos(clickRank,clickFile);
		sec_move.from    = sec_from;
		sec_move.to      = pos;
		sec_move.piece   = selectedPiece;
		sec_move.capture = EMPTY;
		
		selectedFlgB = false;   
		// selectedFlgC = false;
		(p.turn) ? b.removeChild(slb) : b.removeChild(slw);
		
		// if(CanPromote(selectedPiece,p.turn,pos.rank,pos.file) || CanPromote(selectedPiece,p.turn,clickRank,clickFile)){
		// 	if(MustPromote(selectedPiece,p.turn,pos.rank,pos.file)){
		// 		sec_move.promotion = true;
		// 		selectedPiece = EMPTY;
		// 		p.do_move(sec_move);
		// 		var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
		// 		(check) ? p.undo_move(sec_move) : showBoard(p);
		// 	}
		// }
		
		// else{
			selectedPiece = EMPTY;
			p.do_move(sec_move);
			var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
			(check) ? p.undo_move(sec_move) : showBoard(p);
		// }
	}
	
	// if(selectedFlgC && p.CanDrop(pos,selectedPiece)){
	// 	var sec_from = new PiecePos(0,0);
	// 	sec_move.from    = sec_from;
	// 	sec_move.to      = pos;
	// 	sec_move.piece   = selectedPiece;
	// 	sec_move.capture = EMPTY;
		
	// 	(p.turn) ? cb.removeChild(slb) : cw.removeChild(slw);
		
	// 	if(p.turn){
	// 		while(cb.firstChild){
	// 			cb.removeChild(cb.firstChild);
	// 		}
	// 	}
	// 	else{
	// 		while(cw.firstChild){
	// 			cw.removeChild(cw.firstChild);
	// 		}
	// 	}
	// 	selectedPiece = EMPTY;

	// 	selectedFlgB = false;   
	// 	selectedFlgC = false; 
		
	// 	p.do_move(sec_move);
	// 	var check = (p.turn) ? p.IsControl(p.whiteKingPos,true) : p.IsControl(p.blackKingPos,false);
	// 	(check) ? p.undo_move(sec_move) : showBoard(p);
		
	// 	showBoard(p);     
	// }
}

	




//ページ読み込み時に以下の処理を実行
window.onload = function(){    
	
	b = document.getElementById("board");
	
	//選択フラグを初期化
	selectedFlgB = false;
	selectedFlgC = false;
	PromotionWindowFlg = false;
	
	//選択した状態の画像のIDを取得
	slb = document.getElementById("selected_black");
    slw = document.getElementById("selected_white");  
	
	//pieceにコマ画像のIDを入れておく
	piece_board = [
	document.getElementById("cell_board"),
	document.getElementById("OU_black"),
	document.getElementById("OU_white"),
	document.getElementById("cell_board"),
	];
	

	

	var p = new Position();
	
	p.Set_default();
	

	//将棋盤全体（持ち駒もふくむ）を表示する
	showBoard(p);
};

	
	
