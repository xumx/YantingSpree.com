Template.welcome.helpers({
	news: function() {
		return News.find({}, {
			sort: {
				date: -1
			},
			limit: 15
		});
	}
});


Template.welcome.rendered = function() {
	$('#isotope').isotope();
};

Template.welcome.created = function() {

	var feed = new Instafeed({
		target: 'instafeed',
		get: 'user',
		userId: 1154094,
		accessToken: '1154094.467ede5.fef059d889264c35b9d993489d449997',
		template: '<li><a href="{{link}}" target="_blank"><img src="{{image}}" /></a></li>',
		success: function() {
			_.defer($('#ri-grid').gridrotator({
				nochange : [0,1,2,3,4]
			}));
		}
	});

	feed.run();

};