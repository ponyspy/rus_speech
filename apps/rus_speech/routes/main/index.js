module.exports = function(Model) {
	var module = {};

	var Post = Model.Post;
	var Category = Model.Category;

	module.index = function(req, res) {
		Post.find().populate('categorys').exec(function(err, posts) {
			Category.find().exec(function(err, categorys) {
				res.render('main/index.pug', { posts: posts, categorys: categorys });
			});
		});
	};

	module.post = function(req, res) {
		var id = req.params.id;

		Post.findById(id).populate('categorys').exec(function(err, post) {
			res.render('main/post.pug', { post: post });
		});
	};

	return module;
};