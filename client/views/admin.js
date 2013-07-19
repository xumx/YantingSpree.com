Template.verifyPayment.helpers({
	payments: function() {
		return Payment.find({
			verified: false
		});
	}
});

Template.verifyPayment.events({
	'click a[name="verify-payment"]': function() {
		Payment.update(this._id, {
			verified: true
		});

		Order.update(this.order, {
			$inc: {
				status: 1
			}
		});
		console.log('Payment verified');
	},
	'click a[name="reject-payment"]': function() {
		Payment.remove(this._id);

		Order.update(this.order, {
			$inc: {
				status: -1
			}
		});
		console.log('Payment verified');
	}
});