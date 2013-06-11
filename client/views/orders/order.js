Template.orderList.helpers({
	myOrder: function() {
		return Order.findOne({
			user: '122',
			spree: Session.get('currentSpree')
		});
	},
	sumPrice: function(order) {
		return _.reduce(order.items, function(memo, item) {
			return memo + item.price
		}, 0).toFixed(2);
	},
	sumSGD: function(order) {
		return _.reduce(order.items, function(memo, item) {
			return memo + item.SGD
		}, 0).toFixed(2);
	},
	getCurrency: function() {
		return Merchant.findOne(Session.get('currentMerchant')).currency;
	},
	getExchangeRate: function(currency) {
		return Exchange.findOne({
			currency: currency
		}).rate;
	}
});

Template.orderHistory.helpers({
	history: function() {
		return Order.find({
			//Check order = completed TODO
			spree: Session.get('currentSpree')
		}, {
			limit: 10
			//TODO Sort order?
		});
	},
	formatDate: function(date) {
		return date.toLocaleString();
	}
});

Template.orderItem.events({
	'click button.close': function(e) {
		//Delete
		Order.update(Session.get('currentOrder'), {
			$pull: {
				items: {
					'_id': this._id
				}
			}
		});
	}
});

Template.addOrderItem.events({
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
		console.log(this);

		var form = $(event.target);

		var orderItem = {
			_id: Random.id(),
			name: form.find('[name=name]').val(),
			url: form.find('[name=url]').val(),
			code: form.find('[name=code]').val(),
			size: form.find('[name=size]').val(),
			color: form.find('[name=color]').val(),
			quantity: form.find('[name=quantity]').val(),
			price: form.find('[name=price]').val(),
			remarks: form.find('[name=remarks]').val(),
			alternatives: form.find('[name=alternatives]').val(),

			SGD: form.find('[name=sgd]').val()
		}

		console.log(orderItem);

		var orderId = Session.get('currentOrder');
		if (orderId === undefined) {
			orderId = Order.insert({
				spree: Session.get('currentSpree'),
				user: '122', //TODO USER
				status: 1,
				items: [orderItem]
			});
		} else {
			Order.update(orderId, {
				$push: {
					items: orderItem
				}
			});
		}
	}
});