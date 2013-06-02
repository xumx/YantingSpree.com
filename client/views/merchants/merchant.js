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
		return Merchant.find();
	}
});

Template.merchantList.events({
	'click button[name=open]': function() {
		Merchant.update(this._id, {
			$set: {
				open: true
			}
		});


		// Spree.insert({
		// 	merchant: 'Forever 21',
		// 	status: 'open',
		// 	cap: '$USD 300',
		// 	startDate: new Date('20 May 2013'),
		// 	endDate: new Date('30 May 2013'),
		// 	counter: '13',
		// });

	},
	'click button[name=close]': function() {
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
			Spree.update(spreeId, {
				$set: {
					status: 'close'
				}
			});
		}
	},
	'click button[name=save]': function(event) {
		var id = this._id;
		var form = $(event.target).closest('form');


		this._id = form.find('[name=_id]').val();
		this.url = form.find('[name=url]').val();
		this.speed = form.find('[name=speed]').val();
		this.shipping = form.find('[name=shipping]').val();
		this.currency = form.find('[name=currency]').val();
		this.remarks = form.find('[name=remarks]').val();

		console.log(this);
		Merchant.update(id, this);
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
		return date.toLocaleDateString();
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
			speed: $(event.target).find('[name=speed]').val(),
			shipping: $(event.target).find('[name=shipping]').val(),
			currency: $(event.target).find('[name=currency]').val(),
			remarks: $(event.target).find('[name=remarks]').val()
		}

		console.log(newMerchant);
		Merchant.insert(newMerchant);
	}
});