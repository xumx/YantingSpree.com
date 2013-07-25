Template.exchange.helpers({
	rates: function() {
		return Exchange.find({}, {
			sort: {
				_id: 1
			},
			reactive: false
		});
	}
});

Template.exchange.events({
	'change input': function(e) {
		Exchange.update(this._id, {
			$set: {
				'rate': $(e.target).val()
			}
		});
	}
});