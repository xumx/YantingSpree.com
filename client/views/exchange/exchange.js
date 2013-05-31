Template.exchange.helpers({
	rates: function() {
		return Exchange.find();
	},
	isAdmin: function() {
		return Session.get('isAdmin');
	}
});

Template.exchange.events({
	'change input': function(e) {
		Exchange.update(this._id, {
			$set: {
				'rate': $(e.target).val()
			}
		}, function(error) {
			if (error) {
				// display the error to the user
				alert(error.reason);
			}
		});
	}
});