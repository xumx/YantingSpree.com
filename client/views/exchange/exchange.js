Template.exchange.rates = function() {
	return Exchange.find({}, {
		sort: {
			_id: 1
		}
	});
};