var mongoose = require('mongoose');
var Note = require('../models/Note')
module.exports = function(app){

    /**
     * Fetch all notes by parentId
     *
     * @return json
     */
    app.get('/note/fetchall',function(req, res){
        var parentId = req.body.parentId;
        var filter = {'parentId': parentId};
        var query = Note.find(filter, 'createdAt updatedAt content type parentId parentType parentId', { }).sort({date: 'desc'});
        query.exec(function (err, docs) {
            res.json(docs);
        });
    });

    /**
     * Fetch single note
     *
     * @return json
     */
    app.get('/note/fetch',function(req, res){
        var noteId = req.body.noteId;
        Note.findOne({_id: new mongoose.Schema.ObjectId(noteId)}, function (err, existingNote) {
            if(existingNote){
                res.json(existingNote);
            }
        });
    });

    /**
     * Insert note
     */
    app.post('/note/insert',function(req, res) {

        var note = new Note({
            createdAt: new Date(),
            updatedAt: new Date(),
            content : req.body.content || '',
            type : req.body.type || '',
            parentId : req.body.parentId || '',
            parentType : req.body.parentType || '',
            owner : req.body.owner || ''
        });

        note.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Note updated.' });
            res.redirect('/lead/index');
        });
    });

    /**
     * Delete note
     */
    app.post('/note/delete', function(req, res) {
        Note.remove({ _id: req.noteId }, function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Note has been deleted.' });
            res.redirect('/');
        });
    });

    /**
     * Edit note
     */
    app.post('/note/update',function(req, res) {
        var noteId = req.body._id;
        Note.findById(noteId, function(err, ExistingNote) {
            if (err) return next(err);
            ExistingNote.updatedAt = new Date();
            ExistingNote.content = req.body.content || '';
            ExistingNote.type = req.body.type || '';
            ExistingNote.parentId = req.body.parentId || '';
            ExistingNote.parentType = req.body.parentType || '';
            ExistingNote.owner = req.body.owner || '';

            ExistingNote.save(function(err) {
                if (err) return next(err);
                req.flash('success', { msg: 'Note saved.' });
                res.redirect('/lead/index');
            });
        });
    });
}