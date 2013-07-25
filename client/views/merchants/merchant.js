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

Template.merchantList.helpers({
	allMerchants: function() {
		return Merchant.find({}, {
			sort: {
				open: -1,
				_id: 1
			}
		});
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