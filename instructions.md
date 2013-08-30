#Remote backup/restore
mongodump `coffee dumpRemote`
mongorestore `coffee restoreRemote`

#Dump Local
`
mrt
mongodump --port 3002 --db yt_meteor_com
`

#Extract news from Emailer Page
`
var data = $('.mcnImageCardBlockInner').map(function(index, article) {
	var result = {
		link: $(article).find('.mcnTextContent a').attr('href'),
		linkText: $(article).find('.mcnTextContent a').text(),
		thumbnail: $(article).find('.mcnImage').attr('src'),
		description: $(article)
			.find('.mcnTextContent')
			.clone()
			.children()
			.remove()
			.end()
			.text()
			.trim()
	}

	return result;
})

JSON.stringify(data,null,4)

//Load News

_.each(data, function(article){
	article.date = new Date();
	News.insert(article);	
});
`