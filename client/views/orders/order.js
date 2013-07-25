Template.orderList.helpers({
	myOrder: function() {
		return Order.findOne({
			user: Meteor.userId(),
			spree: Session.get('currentSpree'),
			status: 1
		});
	}
});

Template.orderSummary.helpers({
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
})

Template.orderSummary.events({
	'click #checkout': function() {
		$('#payment-form').toggleClass('hide animated bounceInDown');
	},
	'click #make-payment': function() {
		var payment = {
			amount: $('input[name="payment-amount"]').val(),
			transaction: $('input[name="payment-transaction-number"]').val(),
			verified: false,
			user: Meteor.userId(),
			order: this._id
		}

		console.log(payment);

		Payment.insert(payment);

		Order.update(this._id, {
			$inc: {
				status: 1
			}
		});

		Meteor.Messages.sendSuccess('Payment has been submitted for verification.');
	}
})

Template.orderHistory.helpers({
	history: function() {
		return Order.find({
			status: {
				$not: 1
			},
			spree: Session.get('currentSpree')
		}, {
			limit: 10,
			sort: [
				["lastUpdate", "desc"]
			]
			//TODO Sort order?
		});
	}
});

Template.orderItem.events({
	'click button.close': function(e) {
		//Delete
		var orderId = Session.get('currentOrder')
		Order.update(orderId, {
			$pull: {
				items: {
					'_id': this._id
				}
			}
		});

		//If item list is empty, delete order
		if (Order.findOne(orderId).items.length === 0) {
			Order.remove(orderId);
			Session.set('currentOrder', undefined);
		} else {
			Order.update(orderId, {
				$set: {
					lastUpdate: new Date()
				}
			});
		}
	}
});

Template.addOrderItem.helpers({
	getCurrency: function() {
		return Merchant.findOne(Session.get('currentMerchant')).currency;
	}
});

Template.addOrderItem.events({
	'click .box-header': function (e) {
		$(e.target).next().slideToggle();
	},
	'change input[name=url]': function(e) {

		$('#scraperSpinner').toggleClass('icon-spin icon-refresh');
		var url = $(e.target).val();
		Meteor.call("fetchImage", url, function(error, result) {
			$('#scraperSpinner').toggleClass('icon-spin icon-refresh');
			console.log(result);

			if (result.thumbnail) {
				$('#scrapedItemThumbnail').attr('src', result.thumbnail);
				$('#scrapedItemThumbnail-box').toggleClass('hidden animated bounceInLeft')
			}

			if (result.name) {
				$('input[name=name]').val(result.name).css('color', '#78cd51');
			}

			if (result.price) {
				$('input[name=price]').val(result.price).css('color', '#78cd51');
			}

			if (result.code) {
				$('input[name=code]').val(result.code).css('color', '#78cd51');
			}
		});
	},
	'change input[name=price]': function(event) {
		var merc = Merchant.findOne(Session.get('currentMerchant'));
		var exchange = Exchange.findOne({
			currency: merc.currency
		});
		var sgd = $(event.target).val() * exchange.rate;
		sgd = (Math.ceil(sgd * 10) / 10).toFixed(2);
		$('input[name=sgd]').val(sgd);
		$('#SGD').text('SGD$' + sgd);
	},
	'submit form': function(event) {
		event.preventDefault();

		var form = $(event.target);

		var orderItem = {
			_id: Random.id(),
			name: form.find('[name=name]').val(),
			url: form.find('[name=url]').val(),
			code: form.find('[name=code]').val(),
			size: form.find('[name=size]').val(),
			color: form.find('[name=color]').val(),
			quantity: parseInt(form.find('[name=quantity]').val()),
			price: parseFloat(form.find('[name=price]').val()),
			remarks: form.find('[name=remarks]').val(),
			alternatives: form.find('[name=alternatives]').val(),
			SGD: parseFloat(form.find('[name=sgd]').val()),
			thumbnail: form.find('#scrapedItemThumbnail').attr('src') || undefined
		}

		console.log(orderItem);

		var orderId = Session.get('currentOrder');
		if (orderId === undefined) {
			orderId = Order.insert({
				spree: Session.get('currentSpree'),
				user: Meteor.userId(),
				status: 1,
				lastUpdate: new Date(),
				items: [orderItem]
			});
		} else {
			Order.update(orderId, {
				$push: {
					items: orderItem
				}
			});

			Order.update(orderId, {
				$set: {
					lastUpdate: new Date()
				}
			});
		}
	}
});