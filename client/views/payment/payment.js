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
	'click a.checkout': function(event) {
		$(event.target).siblings('.paymentForm').toggleClass('hide animated bounceInDown');
	},
	'click input[name=useAlternateShippingAddress]': function(event) {
		$(event.target).parents('.paymentForm').find('textarea').toggle();
	},
	'click a.make-payment': function(event) {
		event.preventDefault();

		var form = $(event.target).parents('.paymentForm'),

			payment = {
				date: form.find('input[name="date"]').val(),
				target: form.find('input[name=targetBank]:checked').val(),
				method: form.find('input[name=paymentMethod]:checked').val(),
				amount: form.find('input[name="payment-amount"]').val(),
				transaction: form.find('input[name="payment-transaction-number"]').val(),
				user: Meteor.userId(),
				verified: false,
				order: this._id
			}

		console.log(payment);

		Payment.insert(payment);

		if (form.find('input[name=useAlternateShippingAddress]:checked').length > 0) {
			Order.update(this._id, {
				$set: {
					useAlternateShippingAddress: $(event.target).is(':checked')
				}
			});

			var altAddress = form.find('textarea[name=alternateShippingAddress]').val();
			Order.update(this._id, {
				$set: {
					alternateShippingAddress: altAddress
				}
			});

			Meteor.call('sendMail', "deepthought@gmail.com", "Order " + this.int_id + "has alternate shipping address", "Alternate Address: <br>" + altAddress);
		}

		Order.update(this._id, {
			$inc: {
				status: 1
			}
		});

		Meteor.Messages.sendSuccess('Payment has been submitted for verification. =)');
	}
});

Template.payment2.helpers({
	calculateAmount: function() {
		var total = 0;

		// total += actualCost
		// total += handlingFee
		// total += extraCosts

		if (this.bubble) {
			total += 1;
		}

		if (this.box) {
			total += 1.2;
		}

		if (this.shippingMethod == 'Registered Mail') {
			total += 2.14
		} else if (this.shippingMethod == 'TA-Q-BIN') {
			total += 1.14
		} else if (this.shippingMethod == 'Normal Mail') {
			total += 1.14
		}

		return 'SGD' + (Math.ceil(total * 100) / 100).toFixed(2);
	},
	shippingMethodCost: function() {
		var text = '';

		if (this.bubble) {
			text += 'Bubble Wrap - $1 <br/>';
		}

		if (this.box) {
			text += 'Carton Box - $2 <br/>';
		}

		if (this.shippingMethod == 'Registered Mail') {
			text += 'Registered Mail - $2.14';
		} else if (this.shippingMethod == 'TA-Q-BIN') {
			text += 'Registered Mail - $1.14';
		} else if (this.shippingMethod == 'Normal Mail') {
			text += 'Registered Mail - $1.14';
		}

		text += '<br/>';

		return new Handlebars.SafeString(text);
	}
});

Template.payment2.events({
	'click input[name=shippingMethod]': function() {
		Order.update(this._id, {
			$set: {
				shippingMethod: $("input[name=shippingMethod]:checked").val()
			}
		});
	},
	'click input[name=box]': function(event) {
		Order.update(this._id, {
			$set: {
				box: $(event.target).is(':checked')
			}
		});
	},
	'click input[name=bubble]': function(event) {
		Order.update(this._id, {
			$set: {
				bubble: $(event.target).is(':checked')
			}
		});
	},
	'click a.make-payment': function(event) {
		event.preventDefault();

		var form = $(event.target).parents('.box-content'),

			payment = {
				date: form.find('input[name="date"]').val(),
				target: form.find('input[name=targetBank]:checked').val(),
				method: form.find('input[name=paymentMethod]:checked').val(),
				amount: form.find('input[name="payment-amount"]').val(),
				transaction: form.find('input[name="payment-transaction-number"]').val(),
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