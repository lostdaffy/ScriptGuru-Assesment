const express = require('express');
const router = express.Router();
const Board = require('../models/Board');


router.get('/', async (req, res) => {
    try {
        let board = await Board.findOne();
        if (!board) {
            // seed a simple board
            board = await Board.create({
                title: 'Sample Board',
                lists: [
                    { title: 'To Do', cards: [{ title: 'Task 1' }, { title: 'Task 2' }], order: 0 },
                    { title: 'Doing', cards: [{ title: 'Task 3' }], order: 1 },
                    { title: 'Done', cards: [], order: 2 }
                ]
            });
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/', async (req, res) => {
    try {
        const payload = req.body;
        let board = await Board.findOne();
        if (!board) {
            board = await Board.create(payload);
        } else {
            board.title = payload.title;
            board.lists = payload.lists;
            await board.save();
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;