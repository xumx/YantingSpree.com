console.time('loadData');

// if (Meteor.users.find().count() === 0) {
// 	var id = Accounts.createUser({
// 		username: 'admin',
// 		password: 'apple1',
// 		profile: {
// 			email: 'deepthought@gmail.com'
// 		}
// 	});

// 	Roles.addUsersToRoles(id, 'admin');
// }

// if (Exchange.find().count() === 0) {
// 	Exchange.insert({
// 		currency: 'USD',
// 		rate: 1.33
// 	});
// 	Exchange.insert({
// 		currency: 'AUD',
// 		rate: 1.4
// 	});
// 	Exchange.insert({
// 		currency: 'GBP',
// 		rate: 2.12
// 	});
// 	Exchange.insert({
// 		currency: 'EUR',
// 		rate: 1.77
// 	});
// 	Exchange.insert({
// 		currency: 'HKD',
// 		rate: 1.38
// 	});
// 	Exchange.insert({
// 		currency: 'RMB',
// 		rate: 0.22
// 	});
// 	Exchange.insert({
// 		currency: 'NT',
// 		rate: 0.046
// 	});
// 	Exchange.insert({
// 		currency: 'KRW',
// 		rate: 0.00125
// 	});
// }

// if (Merchant.find().count() === 0) {
// 	Merchant.insert({
// 		_id: 'Forever 21',
// 		url: 'http://www.forever21.com/',
// 		speed: '3~4 weeks',
// 		shipping: '$4.20 SGD per unit',
// 		currency: 'USD',
// 		cap: '$USD 300',
// 		open: true
// 	});

// 	Merchant.insert({
// 		_id: 'New Look',
// 		url: 'http://www.newlook.com/',
// 		speed: '2~4 weeks',
// 		shipping: 'Direct free international shipping',
// 		currency: 'GBP',
// 		cap: 'GBP£60',
// 		open: false
// 	});

// 	Merchant.insert({
// 		_id: 'Armani Exchange',
// 		url: 'http://www.armaniexchange.com/',
// 		speed: '2~4 weeks',
// 		shipping: '<p>Via CGW (5%)</p><ul><li>0.5 unit – Accessories/Underwear/Shades</li><li>1 unit – Tops/Bra/Belts</li><li>1.5 unit – Sweaters/Skirts/Shorts/Clutches</li><li>2 unit – Long Tops &amp; Tunics/Dresses/Pants/Overall/Jumper </li><li>2.5 unit – Hoodies</li></ul><p>Men\'s clothings will be 0.5 unit additional for each item.If ordering shades, i\'ll not be liable for any breakage from F21 to me, and mailing from me to you.Sorry, not taking in bags, shoes &amp; fedora.I reserve the right to amend shipping units when arrived.</p>',
// 		currency: 'USD',
// 		cap: 'US$ 300',
// 		open: false
// 	});

// 	Merchant.insert({
// 		_id: 'New Look',
// 		url: 'http://www.victoriassecret.com',
// 		speed: '2~4 weeks',
// 		shipping: '$3.20 SGD per unit',
// 		currency: 'EUR',
// 		cap: '$USD 300',
// 		open: false
// 	});

// 	Merchant.insert({
// 		_id: 'Victoria 4',
// 		url: 'http://www.victoriassecret.com',
// 		speed: '2~4 weeks',
// 		shipping: '$3.20 SGD per unit',
// 		currency: 'USD',
// 		cap: '$USD 300',
// 		open: false
// 	});
// }

console.timeEnd('loadData');