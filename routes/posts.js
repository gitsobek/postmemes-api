const mongoose = require('mongoose')
const checkLogin = require('../middlewares/checkLogin')

const Post = mongoose.model('Post')

module.exports = app => {
    app.get('/api/posts/:id', checkLogin, async (req, res) => {
        const post = await Post.findOne({
            _user: req.user.id,
            _id: req.params.id
        })

        res.send(post)
    })

    app.get('/api/posts', checkLogin, async (req, res) => {
        const posts = await Post.find({ _user: req.user.id })

        res.send(posts)
    })

    app.post('/api/posts', checkLogin, async (req, res) => {
        const { title, content } = req.body

        const post = new Post({
            title,
            content,
            _user: req.user.id
        })

        try {
            await post.save()
            res.send(post)
        } catch (err) {
            res.send(400, err)
        }
    })
}