var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
	var SIZES = {
		point : 15,
		//comumn : 30 + 2,
		ball : 0,
		pointsbar : 20,
		margin : {
			x : 10,
			y : 10
		},
		box : 400,
		lamp : {
			length : 384,//350 < 400!
			height : 83//70
		}
	}
	var BOX   = 1,
		EMPTY = 0;
	var levels = [];
	
	var N,
	  W,  E,
		S;
	N = 1;
	W = 2;
	E = 3;
	S = 4;

	var Game = {
		width      		: 0,//9 | 7
		height     		: 0,//6 | 9
		//objectsnum 		: 5,//6
		up				: false,
		map : [],
		lamps : [],
		lampspatch : [],
		logmap : function(){// выводит первоначальный массив в консоль
			for(y in this.map) {
				var str = "";
				for(x in this.map[y]) {
					str += this.map[y][x] + ' ';
				}
				console.log(str);
			}
		},
		logarr2 : function(a){// выводит в консоль двумерный массив
			for(i in a) {
				var str = "";
				for(j in a[i]) {
					str += a[i][j] + ' ';
				}
				console.log(str);
			}
		},
		getlamp : function(x, y) {
			//console.log(x + ' ' + y);
			if(y < 0 || y > this.lamps.length - 1) {
				return 0;
			} else if(x < 0 || x > this.lamps[y].length - 1) {
				return 0;
			}
			return this.lamps[y][x];
		},
		iscorrect : function() {
			var a, b,
				c, d,
				e, f;
			for(y in this.lamps) {
				var even_y = ( y % 2 );
				for(x in this.lamps[y]) {
					var even_x = ( x % 2 );
					var _x = parseInt(x);
					var _y = parseInt(y);
					a = this.getlamp(_x, _y);
					b = this.getlamp(_x + 1, _y);
					c = this.getlamp(_x, _y + 1);
					d = this.getlamp(_x + 1, _y + 1);
					e = this.getlamp(_x, _y + 2);
					f = this.getlamp(_x + 1, _y + 2);
					if(
						(a == b && b == d && d == 1 && even_y === 0) ||
						(b == c && c == d && d == 1 && even_y === 1) ||
						(b == c && c == f && f == 1 && even_y === 1) ||
						(a == c && c == e && e == 1 && even_y === 1) ||
						(a == c && c == d && d == e && e == 1)
					) {
						console.log( 'a ' + (a == b && b == d && d == 1 && even_y === 0) );
						console.log( 'b ' + (b == c && c == d && d == 1 && even_y === 1) );
						console.log( 'c ' + (b == c && c == f && f == 1 && even_y === 1) );
						console.log( 'd ' + (a == c && c == e && e == 1 && even_y === 1) );
						console.log( 'e ' + (a == c && c == d && d == e && e == 1) );
						return false;
					}
				}
			}
			return true;
		},
		lamparoundbox : function(_x, _y) {
			var _a,
			  _b, _c,
				_d;
			_a = Game.lamps[_y * 2][_x];
			_b = Game.lamps[_y * 2 + 1][_x];
			_c = Game.lamps[_y * 2 + 1][_x + 1];
			_d = Game.lamps[_y * 2 + 2][_x];
			return _a + _b + _c + _d;
		},
		lamponbox : function(c) {
			var _x,_y;
			_x = parseInt(c.x);
			_y = parseInt(c.y);
			var even_y = ( _y % 2 );
			if(even_y == 0) {//horizontally
				var _y0, _y1;
				_y0 = (_y / 2 - 1);
				_y1 = (_y / 2);
				if(_y0 > 0) {
					console.log('---01', _x, _y1);
					if( this.lamparoundbox(_x, _y0) > this.map[_y0][_x] && 
					this.map[_y0][_x] > 0) {
						console.log('---1');
						return false
					}
				}
				if(_y1 < this.map.length) {
					if( this.lamparoundbox(_x, _y1) > this.map[_y1][_x] && this.map[_y1][_x] > 0 ) {
					console.log('---2');
						return false
					}
				}
			} else {//vertically
				var _x0, _x1, _yy;
				_yy = _y/2|0;
				_x0 = _x - 1;
				_x1 = _x;
				if(_x0 >= 0) {
					if( this.lamparoundbox(_x0, _yy) > this.map[_yy][_x0] && this.map[_yy][_x0] > 0) {
						console.log('---3');
						return false
					}
				}
				if(_x1 < Game.map[_yy].length) {
					if( this.lamparoundbox(_x1, _yy) > this.map[_yy][_x1] && this.map[_yy][_x1] > 0) {
						console.log('---4');
						return false
					}
				}
			}
			return true;
		},
		checklampscountaround : function() {
			//console.group('lamps around');
			for(y in Game.map) {
				for(x in Game.map[y]) {
					var _x,_y;
					_x = parseInt(x);
					_y = parseInt(y);
					if(Game.map[y][x] > 0) {
						var count = Game.lamparoundbox(_x ,_y);
						var i = (Game.map[_y][_x] - count);
						$('#x_y_' + _x + '_' + _y).html(i);
					}
				}
			}
			for(y in Game.map) {
				for(x in Game.map[y]) {
					if(Game.map[y][x] > 0) {
						var _x,_y;
						_x = parseInt(x);
						_y = parseInt(y);

						var count = Game.lamparoundbox(_x ,_y);
						if(count !== Game.map[_y][_x]) {
							return false;
						}
					}
				}
			}
			//console.groupEnd()
			return true;
		},
		lamp : {
			horizontally : function(c) {
				return ( c.direction === E || c.direction === W );
			},
//			upright : function(c) {
//				return ( c.direction === N || c.direction === S );
//			},
			NE : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === 0) {return false;}
					console.log(c.y - 1, c.x + 1)
					if(Game.lamps[c.y - 1][c.x + 1] === 0) {return false;}
				} else {
					if(c.x == Game.lamps[c.y].length - 1) {return false;}
					if(Game.lamps[c.y - 1][c.x] === 0) {return false;}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x + 1):(c.x) ),
					y : c.y - 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?N:E )
				}
			},

			E : function(c) {//only for gorisontale
				if(c.x === Game.lamps[c.y].length - 1) {return false;}
				if(Game.lamps[c.y][c.x + 1] === 0) {return false;}
				return {
					x : c.x + 1,
					y : c.y,
					direction : E
				}
			},
			SE : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === Game.lamps.length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x + 1] === 0) {return false;}
				} else {
					if(c.x === Game.lamps[c.y].length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x] === 0) {return false}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x + 1):(c.x) ),
					y : c.y + 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?S:E )
				}
			},
			S : function(c) {//only for vertically
				if(c.y === Game.lamps.length - 2) {return false;}
				if(Game.lamps[c.y + 2][c.x] == 0) {return false;}
				console.log('line 174:' + Game.lamps[c.y][c.x + 2], c.y + 2, c.x);
				return {
					x : c.x,
					y : c.y + 2,
					direction : S
				}
			},
			SW : function(c) {
				console.log('i\'m here', c.x, c.y, ( ( Game.lamp.horizontally(c) === true )?S:W ));
				if( Game.lamp.horizontally(c) ) {
					if(c.y === Game.lamps.length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x] === 0) {return false;}
				} else {
					if(c.x === 0) {return false;}
					if(Game.lamps[c.y + 1][c.x - 1] === 0) {return false}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x):(c.x - 1) ),
					y : c.y + 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?S:W )
				}
			},
			W : function(c) {//only for gorisontale
				if(c.x === 0) {return false;}
				if(Game.lamps[c.y][c.x - 1] === 0) {return false;}
				return {
					x : c.x - 1,
					y : c.y,
					direction : W
				}
			},
			NW : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === 0) {return false;}
					if(Game.lamps[c.y - 1][c.x] === 0) {return false;}
				} else {
					if(c.x == 0) {return false;}
					if(Game.lamps[c.y - 1][c.x - 1] === 0) {return false;}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x):(c.x - 1) ),
					y : c.y - 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?N:W )
				}
			},
			N : function(c) {//only for vertically
				if(c.y === 1) {return false;}
				if(Game.lamps[c.y - 2][c.x] === 0) {return false;}
				return {
					x : c.x,
					y : c.y - 2,
					direction : N
				}
			}
		},
		checkpatch : function() {
			var c0 = 0;
			var c = 0;
			var lcount = 0;
			patchcount = 0;
			for(y in Game.lamps){
				for(x in Game.lamps[y]){
					if(Game.lamps[y][x] === 1) {
						lcount++;
						if(c0 === 0) {
							c0 = {
								'x' : parseInt(x),
								'y' : parseInt(y)
							}
							c = {
								'x' : parseInt(x),
								'y' : parseInt(y)
							}
						}
					}
				}
			}
			//Game.initlampspatch();
			
			// первый шаг так и так чётный
			// идём по часовой стрелке
			// lamp.NE(c)
			// lamp.E(c)
			// lamp.SE(c)
			
			
			c.direction = E;
			var count = 0;
			console.log('__direction0__', c.direction, count);
			c = Game.lamp.NE(c)
				? Game.lamp.NE(c)
				: Game.lamp.E(c)
					? Game.lamp.E(c)
					: Game.lamp.SE(c)
						? Game.lamp.SE(c)
						: false;
			if(!c){return false;}
			count++;
			console.log('__direction__', c.direction, count);
			console.log(c);
			console.log(c0);
			while( !(c.x == c0.x && c.y == c0.y) ) {
				//var even_y = ( c.y % 2 );
				//if( even_y === 1 ) {
				//	// --
				//} else {
				//	// |
				//}
				switch(c.direction) {
					case N :
						c = Game.lamp.NW(c)
							? Game.lamp.NW(c)
							: Game.lamp.N(c)
								? Game.lamp.N(c)
								: Game.lamp.NE(c)
									? Game.lamp.NE(c)
									: false;
						break;
					case E :
						c = Game.lamp.NE(c)
							? Game.lamp.NE(c)
							: Game.lamp.E(c)
								? Game.lamp.E(c)
								: Game.lamp.SE(c)
									? Game.lamp.SE(c)
									: false;
						break;
					case S :
						c = Game.lamp.SW(c)
							? Game.lamp.SW(c)
							: Game.lamp.S(c)
								? Game.lamp.S(c)
								: Game.lamp.SE(c)
									? Game.lamp.SE(c)
									: false;
						break;
					case W :
						c = Game.lamp.NW(c)
							? Game.lamp.NW(c)
							: Game.lamp.W(c)
								? Game.lamp.W(c)
								: Game.lamp.SW(c)
									? Game.lamp.SW(c)
									: false;
						break;
				}
				console.log('direction', c.direction);
				if(!c){return false;}
				count++;
			}
			c.count = count;
			return c;
		},
		drawbox : function(x, y){//j, i
			if(Game.map[y][x] === 0) {return;}
			var l = $('<div>')
				.addClass('column')
//				.addClass(((Game.map[y][x] === 0)?'boxh':'box'))
				.addClass('box')
				.attr('id', ( 'x_y_' + x + '_' + y ) )
//				.addClass('e' + Game.map[y][x])
//				.data('x', x).data('y', y)
				.css({
					left   : ( SIZES.ball * x + SIZES.margin.x),
					top    : ( SIZES.ball * y ),
					width  : SIZES.ball,
					height : SIZES.ball,
					'line-height' : ( SIZES.ball + 'px' )
				})
				.html(this.map[y][x]);
			return l;
		},
		drawlamp : function(x, y, f){//j, i
			var s = ( SIZES.lamp.length / SIZES.box * SIZES.ball );//lamp size
			var h = ( SIZES.lamp.height / SIZES.box * SIZES.ball );//lamp size
			var l = $('<div>')
				//.addClass('column')
				.addClass('lamp')
				.addClass( ((f)?'glamp':'vlamp') )
				.attr('id', ( 'l_x_y_' + x + '_' + y ) )
				.data({
					'x' : x,
					'y' : y
				})
//				.addClass('e' + Game.map[y][x])
//				.data('x', x).data('y', y)
				.css({
//					left   : ( SIZES.ball * x + SIZES.margin.x + ((f)?(SIZES.ball / 2):0) - (s / 2) ),
					left : ( SIZES.margin.x + (SIZES.ball * x) + ((f)?(SIZES.ball / 2):0)  - (((f)?s:h) / 2) ),
//					top    : ( y * (SIZES.lamp / (SIZES.box - SIZES.lamp)) * SIZES.ball  - (s / 2) ),//( SIZES.ball * y ) 
					top : (SIZES.ball * y / 2) - (((!f)?s:h) / 2),
					width  : (f)?s:h,
					height : (f)?h:s
				})
			return l;
		},
		draw : function(){
			console.log('start draw');
			$('#map').html('');
			for(y in this.map) {
				for(x in this.map[y]) {
					$('#map').append(this.drawbox(x, y));
				}
			}

			for(var y = 0; y < this.map.length * 2 + 1; y++) {
				this.lamps[y] = [];
				this.lampspatch[y] = [];
				var f = (y % 2 === 0);
				var l = this.map[0].length + ( (f)?0:1 );
				for(var x = 0; x < l; x++) {
					this.lamps[y][x] = 0;
					this.lampspatch[y][x] = 0;
					$('#map').append(this.drawlamp(x, y, f));
				}
			}
			$('.lamp').click(function() {
				console.log('click');
				var c = $(this).data();
				Game.lamps[c.y][c.x] = (Game.lamps[c.y][c.x] === 0)?1:0;
				if(!Game.iscorrect()) {
					Game.lamps[c.y][c.x] = (Game.lamps[c.y][c.x] === 0)?1:0;
					return;
				}
				if(!Game.lamponbox(c)) {
					console.log('boobs');
					Game.lamps[c.y][c.x] = (Game.lamps[c.y][c.x] === 0)?1:0;
					return;
				}
				if( $(this).hasClass('glamp') ) {
					$(this).toggleClass('glampl')
						   .toggleClass('glamp');
				} else if( $(this).hasClass('glampl') ) {
					$(this).toggleClass('glampl')
						   .toggleClass('glamp');
				} 
				if( $(this).hasClass('vlamp') ) {
					$(this).toggleClass('vlampl')
						   .toggleClass('vlamp');
				} else if( $(this).hasClass('vlampl') ) {
					$(this).toggleClass('vlampl')
						   .toggleClass('vlamp');
				}
				if( Game.checklampscountaround() ) {// нужное количество ламп вокруг квадратов
					// TODO проверка цепочки
					console.log('набрано нужное количество ламп вокруг квадратов');
					
					var c = Game.checkpatch();
					if(c) {
						var i = 0;for(y in Game.lamps)for(x in Game.lamps[y])i+=Game.lamps[y][x];
						console.log('chain count ' + c.count + ' ' + i);
						if(c.count == i) {
							var p = parseInt(localStorage.closedchainpoints);
							localStorage.closedchainpoints = p + c.count;
							Game.win();
						}
					} else {
						//console.log('not chain', c0);
					}
				}
			});
		},
		win : function() {
			$('#youwin').show();
			//$('#gamescreen').hide();
			var l = parseInt(localStorage.closedchainlevel);
			if(l < levels.length - 1) {
				localStorage.closedchainlevel = l + 1;
				setTimeout(function() {
					Game.startgame();
					//$('#gamescreen').show();
					$('#youwin').hide();
				}, 3000);
			}
		},
		startgame : function(){
			
			$('#points').html(localStorage['closedchainpoints']);
			$('#level').html(localStorage['closedchainlevel']);
			// для каждой новой карты (другого размера)
			var l = parseInt(localStorage['closedchainlevel']);
			this.map = levels[l].map;
			$('#gamescreen').show();
			$('#startscreen').hide();
			
			var mapsize = {
				x : Game.map[0].length,
				y : Game.map.length
			}

			if(mapsize.x > mapsize.y){
				SIZES.ball = GAMESPACE.X / mapsize.x;
			} else {
				if( GAMESPACE.X / mapsize.x * mapsize.y > GAMESPACE.Y ){
					SIZES.ball = GAMESPACE.Y / mapsize.y;
				} else {
					SIZES.ball = GAMESPACE.X / mapsize.x;
				}
			}
			$('#map').css({
				left   : SIZES.margin.x * SCALINGFACTOR,//( SIZES.margin.x * SCALINGFACTOR ),
				top    : ( SIZES.margin.y * SCALINGFACTOR + SIZES.pointsbar * SCALINGFACTOR ),
				width  : GAMESPACE.X,
				height : GAMESPACE.Y//, border : '1px solid #f00'
			});
			//SIZES.margin.x = ( ( DWIDTH - (SIZES.ball * mapsize.x) ) / 2 - SIZES.margin.x * SCALINGFACTOR);
			SIZES.margin.x = ( ( DWIDTH - (SIZES.ball * mapsize.x) ) / 2 ) - SIZES.margin.x;
			console.log(SIZES.margin.x);
			// ----------------------------------------
			this.draw();
		},
		initmatchesarr : function() {
			//this.mathes = [];
			for(y in this.map){
				this.matches[y] = []
				for(x in this.map[y]) {
					this.matches[y][x] = 0;
				}
			}
		},
		initfallarr : function() {
			//this.mathes = [];
			for(y in this.map){
				this.fall[y] = []
				for(x in this.map[y]) {
					this.fall[y][x] = 0;
				}
			}
		},
		clearmatchesarr : function() {
			for(y in this.map){
				for(x in this.map[y]) {
					this.matches[y][x] = 0;
				}
			}
		},
		clearfallarr : function() {
			for(y in this.map){
				for(x in this.map[y]) {
					this.fall[y][x] = 0;
				}
			}
		},
		clearmatches : function() {
			$('.column').each(function() {
				var c = $(this).data();
				if( Game.matches[c.y][c.x] === 1) {
					$(this).hide('normal');
					//Game.map[c.y][c.x] = EMPTY;
				}
			});
		},
		init : function(){
			//$('#mapsplash').append(' in');
			if(
				typeof(localStorage['closedchainlevel']) === 'undefined' ||
				typeof(localStorage['closedchainpoints']) === 'undefined'
			){
				localStorage['closedchainlevel'] = 0;
				localStorage['closedchainpoints'] = 0;
			}
			$('#points').html(localStorage['closedchainpoints']);
			$('#level').html(localStorage['closedchainlevel']);
			//this.drawmap();
		}
	}
//----------------------------------------------------------------------------------------------------------------------------------------------------
	$(document).ready(function(){
		Game.init();
		
		DWIDTH = document.body.clientWidth;
		DHEIGHT	= document.body.clientHeight;
		SCALINGFACTOR = DWIDTH / 320;
		BANNERHEIGHT = SCALINGFACTOR * 50;
		SIZES.margin.x = SIZES.margin.x * SCALINGFACTOR;
		SIZES.margin.y = SIZES.margin.y * SCALINGFACTOR;
		
		GAMESPACE = {
			X : DWIDTH - ( SIZES.margin.x * 2 ),
			Y : DHEIGHT - BANNERHEIGHT - SIZES.margin.y - SIZES.pointsbar
		}
		$('#youwin').css('width', (DWIDTH - 30 + 'px'));
		$('#playbutton').css({
			width : (270 * SCALINGFACTOR) + 'px',
			height : (87 * SCALINGFACTOR) + 'px',
			left : (DWIDTH / 2 - 134 * SCALINGFACTOR) + 'px',
			bottom : 120 * SCALINGFACTOR
		})
		.click(function(){
			Game.startgame();
		});
		$('#pointsbar').css({
			height        : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' ),
			'line-height' : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' )
		});
		
		//Game.startgame();
	});