Template.payment1.helpers({
	stage: function(s) {
		return (this.status == s);
	},
	sumPrice: function() {
		if (this.items) {
			return _.reduce(this.items, function(memo, item) {
				return memo + item.price
			}, 0).toFixed(2);
		}
	},
	sumSGD: function() {
		if (this.items) {
			return _.reduce(this.items, function(memo, item) {
				console.log(item.SGD)
				return memo + item.SGD
			}, 0).toFixed(2);
		}
	},
	getCurrency: function() {
		return Merchant.findOne(Spree.findOne(this.spree).merchant).currency;
	},
	getExchangeRate: function(currency) {
		return Exchange.findOne({
			currency: currency
		}).rate;
	}
});

Template.payment1.events({
	'click a.checkout': function() {
		$('#payment1-form').toggleClass('hide animated bounceInDown');
	},
	'click a.make-payment': function() {
		var form = $(e.target).closest('.box-content'),

			payment = {
				transaction: form.find('input[name="payment-transaction-number"]').val(),
				account: form.find('input[name="account-number"]').val(),
				amount: form.find('input[name="payment-amount"]').val(),
				bank: form.find('input[name="bank-name"]').val(),
				date: form.find('input[name="date"]').val(),
				user: Meteor.userId(),
				verified: false,
				order: this._id
			}

		console.log(payment);

		Payment.insert(payment);

		Order.update(this._id, {
			$inc: {
				status: 1
			}
		});

		Meteor.Messages.sendSuccess('Payment has been submitted for verification. =)');
	}
});

Template.payment2.helpers({

});

Template.payment2.events({
	'click a.make-payment': function(e) {
		e.preventDefault();

		var form = $(e.target).closest('.box-content'),

			payment = {
				transaction: form.find('input[name="payment-transaction-number"]').val(),
				account: form.find('input[name="account-number"]').val(),
				amount: form.find('input[name="payment-amount"]').val(),
				bank: form.find('input[name="bank-name"]').val(),
				date: form.find('input[name="date"]').val(),
				user: Meteor.userId(),
				verified: false,
				order: this._id
			}

		console.log(payment);

		Payment.insert(payment);

		Order.update(this._id, {
			$inc: {
				status: 1
			}
		});

		Meteor.Messages.sendSuccess('Payment has been submitted for verification. =)');
	}
});