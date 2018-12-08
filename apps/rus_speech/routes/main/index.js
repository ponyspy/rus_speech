module.exports = function(Model) {
	var module = {};

	var Post = Model.Post;

	module.index = function(req, res) {
		Post.find().exec(function(err, posts) {
			res.render('main/index.pug', { posts: posts });
		});
	};

	return module;
};