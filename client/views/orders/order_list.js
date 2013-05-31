Template.orderList.helpers({
	myOrder: function() {
		return Order.findOne({
			user: '122',
			spree: Session.get('currentSpree')
		});
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
	'submit form': function(event) {

		event.preventDefault();
		console.log(this);

		var orderItem = {
			_id: Random.id(),
			name: $(event.target).find('[name=name]').val(),
			url: $(event.target).find('[name=url]').val(),
			code: $(event.target).find('[name=code]').val(),
			size: $(event.target).find('[name=size]').val(),
			color: $(event.target).find('[name=color]').val(),
			quantity: $(event.target).find('[name=quantity]').val(),
			price: $(event.target).find('[name=price]').val(),
			remarks: $(event.target).find('[name=remarks]').val(),
			alternatives: $(event.target).find('[name=alternatives]').val(),

			SGD: 40 //Calculate SGD
		}

		console.log(orderItem);
		
		Order.update(Session.get('currentOrder'), {
			$push: {
				items: orderItem
			}
		});
	}
});