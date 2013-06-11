Template.merchantList.helpers({
	merchantsWithOpenSpree: function() {
		return Spree.find({
			'status': 'open'
		}, {
			transform: function(data) {
				return data.merchant;
			}
		});
	},
	allMerchants: function() {
		return Merchant.find({}, {
			sort: {
				open: -1,
				_id: 1
			}
		});
	},
	counter: function() {
		var c = Spree.findOne({
			merchant: this._id
		}, {
			sort: {
				counter: -1
			},
			transform: function(data) {
				return data.counter;
			}
		});

		if (c) {
			return c;
		} else {
			return 0;
		}
	}
});

Template.merchantList.events({
	'click a[name=open]': function(event) {
		Merchant.update(this._id, {
			$set: {
				open: true
			}
		});

		var nextSequenceNo = Spree.findOne({
			merchant: this._id
		}, {
			sort: {
				counter: -1
			},
			transform: function(data) {
				return data.counter ? data.counter + 1 : 1;
			}
		});

		Spree.insert({
			merchant: this._id,
			status: 'open',
			startDate: new Date(),
			endDate: new Date().addDays(7),
			counter: nextSequenceNo,
		});

		setTimeout((function(ele) {
			return function() {
				console.log(ele.position().top);
				var top = ele.position().top - 70;
				$(window).scrollTop(top);
			}
		})($(event.target).closest('.panel')), 50);

	},
	'click a[name=close]': function(event) {
		Merchant.update(this._id, {
			$set: {
				open: false
			}
		});

		var spree = Spree.findOne({
			'merchant': this._id,
			'status': 'open'
		});

		if (spree) {
			Spree.update(spree._id, {
				$set: {
					status: 'close'
				}
			});
		}

		setTimeout((function(ele) {
			return function() {
				console.log(ele.position().top);
				var top = ele.position().top - 70;
				$(window).scrollTop(top);
			}
		})($(event.target).closest('.panel')), 50)
	},
	'click a[name=update]': function(event) {
		var id = this._id;
		var form = $(event.target).closest('form');


		this._id = form.find('[name=_id]').val();
		this.url = form.find('[name=url]').val();
		this.banner = form.find('[name=banner]').val();
		this.speed = form.find('[name=speed]').val();
		this.shipping = form.find('[name=shipping]').val();
		this.currency = form.find('[name=currency]').val();
		this.cap = form.find('[name=cap]').val();
		this.remarks = form.find('[name=remarks]').val();

		console.log(this);
		Merchant.update(id, this);
	},
	'click a[name=delete]': function(event) {
		if (confirm("Confirm Delete Merchant")) {
			Merchant.remove(this._id);
		}
	}
})

Template.merchantPage.helpers({
	merchant: function() {
		return Merchant.findOne(Session.get('currentMerchant'));
	},
	openSpree: function() {
		return Spree.findOne({
			'merchant': Session.get('currentMerchant'),
			'status': 'open'
		});
	},
	formatDate: function(date) {
		if (date) {
			monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
			]
			return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
		} else {
			Proxino.log("Date Undefined")
			return '';
		}
	},
	history: function(limit) {

	}
});

Template.addMerchant.events({
	'submit form': function(event) {
		event.preventDefault();

		var newMerchant = {
			_id: $(event.target).find('[name=_id]').val(),
			url: $(event.target).find('[name=url]').val(),
			banner: $(event.target).find('[name=banner]').val(),
			speed: $(event.target).find('[name=speed]').val(),
			shipping: $(event.target).find('[name=shipping]').val(),
			currency: $(event.target).find('[name=currency]').val(),
			cap: $(event.target).find('[name=cap]').val(),
			remarks: $(event.target).find('[name=remarks]').val()
		}

		console.log(newMerchant);
		Merchant.insert(newMerchant);
	}
});