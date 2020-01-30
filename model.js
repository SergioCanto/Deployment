let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

let comentariosCollection = mongoose.Schema({
    id: { type: String },
    titulo: {type:String},
    autor: { type: String },
    contenido: { type: String },
    fecha: {type: Date}
});

let comentario = mongoose.model('comments', commentsCollection);

let commentList = {
    get: function () {
        return comentario.find()
            .then( response => { return response;})
            .catch(err => { throw Error(err);});
    },
    getByAut: function (autor) {
        return comentario.find({ 'autor': autor })
            .then(response => { return response; })
            .catch(err => { throw Error(err); });
    },
    add: function (newComment) {
        return comentario.create(newComment)
            .then(response => { return response })
            .catch(err => { throw Error(err);})
    },
    edit: function (id, update) {
        return comentario.findOneAndUpdate(id, update,{new: true})
            .then(response => { return response })
            .catch(error => { throw Error(error); });
    },
    delete: function (id) {
        return comentario.findOneAndDelete({ 'id': id })
            .then(response => { return response; })
            .catch(err => { throw Error(err);});
    }
}

module.exports = { commentList };