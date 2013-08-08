Template.orderList.helpers({
	myOrder: function() {
		return Order.findOne({
			user: Meteor.userId(),
			spree: Session.get('currentSpree'),
			status: 0
		});
	}
});

Template.orderHistory.helpers({
	history: function() {
		return Order.find({
			status: {
				$not: 0
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
	'click .box-header': function(e) {
		$(e.target).next().slideToggle();
	},
	'input input[name=url]': function(e) {
		if (e.target.validity.valid) {
			$('#scraperSpinner').toggleClass('icon-spin icon-refresh');
			var url = $(e.target).val();
			Meteor.call("fetchImage", url, function(error, result) {
				$('#scraperSpinner').toggleClass('icon-spin icon-refresh');
				console.log(result);

				if (result.thumbnail) {
					$('#scrapedItemThumbnail').attr('src', result.thumbnail);
					$('#scrapedItemThumbnail-box').removeClass('hide').addClass('animated bounceInLeft');
				}

				if (result.name) {
					$('input[name=name]').val(result.name).css('color', '#78cd51');
				}

				if (result.price) {
					$('input[name=price]').val(result.price).css('color', '#78cd51');

					var merc = Merchant.findOne(Session.get('currentMerchant'));
					var exchange = Exchange.findOne({
						currency: merc.currency
					});


					sgd = (Math.ceil(result.price * exchange.rate * 10) / 10).toFixed(2);
					$('input[name=sgd]').val(sgd);
					$('#SGD').text('SGD$' + sgd);
				}

				if (result.code) {
					$('input[name=code]').val(result.code).css('color', '#78cd51');
				}
			});
		}
	},
	'input input[name=price]': function(event) {
		var merc = Merchant.findOne(Session.get('currentMerchant'));
		var exchange = Exchange.findOne({
			currency: merc.currency
		});
		var sgd = +$(event.target).val() * exchange.rate;
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

			var nextInt_id = Order.findOne({}, {
				sort: {
					int_id: -1
				},
				transform: function(data) {
					return data.int_id + 1;
				}
			}) || 12345;

			orderId = Order.insert({
				spree: Session.get('currentSpree'),
				lastUpdate: new Date(),
				user: Meteor.userId(),
				int_id: nextInt_id,
				items: [orderItem],
				status: 0
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

		//Reset
		form[0].reset();
		form.find('input').css('color', 'rgb(85, 85, 85)');
		$('#scrapedItemThumbnail-box').addClass('hide').removeClass('animated bounceInLeft');
	}
});