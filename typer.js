var Score = Backbone.Model.extend({
	defaults:{
		"score":0,
		"correct":1,
		"wrong":2
	},
	add: function(value) {
		this.set("score", this.get("score") + value);
	},
	substract: function() {
		this.set("score", this.get("score") - this.get("wrong"));
	},
});

var Word = Backbone.Model.extend({
	move: function() {
		this.set({y:this.get('y') + this.get('speed')});
	}
});

var Words = Backbone.Collection.extend({
	model:Word
});

var WordView = Backbone.View.extend({
	initialize: function() {
		this.$el.css({position:'absolute'});
		var string = this.model.get('string');
		var letter_width = 25;
		for(var i = 0;i < string.length;i++) {
			this.$el
				.append($('<div>', {class: 'chars'})
					.css({
						width:letter_width + 'px',
					})
					.text(string.charAt(i).toUpperCase()));
		}

		this.listenTo(this.model, 'remove', this.remove);

		this.render();
	},

	render:function() {
		var string = this.model.get('string');
		var letter_width = 25;
		var word_width = string.length * letter_width;
		if(this.model.get('x') + word_width > $(window).width()) {
			this.model.set({x:$(window).width() - word_width});
		}
		this.$el.css({
			top:this.model.get('y') + 'px',
			left:this.model.get('x') + 'px'
		});
		var highlight = this.model.get('highlight');
		this.$el.find('div').each(function(index,element) {
			if(index < highlight) {
				$(element).addClass('chain').removeClass('normal');
			} else {
				$(element).addClass('normal').removeClass('chain');
			}
		});
		return this;
	}
});

var TyperView = Backbone.View.extend({
	initialize: function() {
		var wrapper = $('<div>', {id: "wrapper"});
		this.wrapper = wrapper;

		var self = this;
		var text_input = $('<input>', {class: 'form-control game-input'})
			.keyup(function(e) {
				var words = self.model.get('words');
				var score = self.model.get('score');
				var scored = false;
				var typed_string = $(this).val();
				//abaikan tombol2 khusus (mis: backspace, alt-tab, dll)
				if (e.which < 65 || e.which > 90) return;

				for(var i = 0;i < words.length;i++) {
					var word = words.at(i);
					var string = word.get('string');
					if(string.toLowerCase().indexOf(typed_string.toLowerCase()) === 0) {
						score.add(1);
						scored = true;
						word.set({highlight:typed_string.length});
						if(typed_string.length == string.length) {
							score.add(5);
							scored = true;
							$(this).val('');
						}
					} else if(word.get('highlight') > 0) {
						score.substract();
						scored = true;
						word.set({highlight:0});
					} else {
						word.set({highlight:0});
					}
				}
				if(!scored) {
					score.substract();
				}
			});

		this.$el
			.append(wrapper
				.append($('<form>', {role:'form'})
					.submit(function() { return false;})
					.append(text_input)
				)
			);

		text_input.css({left:((wrapper.width() - text_input.width()) / 2) + 'px'});
		text_input.focus();

		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		var model = this.model;
		var words = model.get('words');
		var score = model.get('score');

		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);
			if(!word.get('view')) {
				var word_view_wrapper = $('<div>');
				this.wrapper.append(word_view_wrapper);
				word.set({
					view:new WordView({
						model: word,
						el: word_view_wrapper
					})
				});
			} else {
				word.get('view').render();
			}
		}
		$("#score").text(score.get("score"));
		return this;
	}
});

var Typer = Backbone.Model.extend({
	defaults:{
		max_num_words:10,
		min_distance_between_words:50,
		words:new Words(),
		score:new Score(),
		min_speed:1,
		max_speed:5,
		paused: false
	},

	initialize: function() {
		new TyperView({
			model: this,
			el: $('#game-container')
		});
	},

	start: function() {
		self = this;
		var animation_delay = 40;
		setInterval(function() {
			if(!self.get("paused")) {
				self.iterate();
			}
		},animation_delay);
		//alternatively
		// this.iterate();
		// window.requestAnimationFrame(this.start.bind(this));
	},

	iterate: function() {
		var words = this.get('words');
		if(words.length < this.get('max_num_words')) {
			var top_most_word;
			for(var i = 0;i < words.length;i++) {
				var word = words.at(i);
				if(!top_most_word) {
					top_most_word = word;
				} else if(word.get('y') < top_most_word.get('y')) {
					top_most_word = word;
				}
			}

			if(!top_most_word || top_most_word.get('y') > this.get('min_distance_between_words')) {
				var random_company_name_index = this.random_number_from_interval(0,company_names.length - 1);
				var string = company_names[random_company_name_index];
				var filtered_string = '';
				for(var j = 0;j < string.length;j++) {
					if(/^[a-zA-Z()]+$/.test(string.charAt(j))) {
						filtered_string += string.charAt(j);
					}
				}

				var word = new Word({
					x:this.random_number_from_interval(0,$(window).width()),
					y:0,
					string:filtered_string,
					speed:this.random_number_from_interval(this.get('min_speed'),this.get('max_speed'))
				});
				words.add(word);
			}
		}

		var words_to_be_removed = [];
		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);
			word.move();

			if(word.get('y') > $(window).height() || word.get('move_next_iteration')) {
				words_to_be_removed.push(word);
			}

			if(word.get('highlight') && word.get('string').length == word.get('highlight')) {
				word.set({move_next_iteration:true});
			}
		}

		for(var i = 0;i < words_to_be_removed.length;i++) {
			words.remove(words_to_be_removed[i]);
		}

		this.trigger('change');
	},

	random_number_from_interval: function(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
});