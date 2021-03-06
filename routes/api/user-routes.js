const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    
  // Access our User model and run .findAll() method)
  User.findAll({
      attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne( {
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: `User with id ${req.params.id} not found`});
            return
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/users
router.post('/', (req, res) => {
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {
        where: {
            id: req.params.id
        },
        individualHooks:true
    })
    .then(dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({message: `User with id ${req.params.id} not found`});
            return
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

  
// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: `User with id ${req.params.id} not found`});
            return
        }
        res.json(dbUserData)
    })
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.post('/login', (req,res) => {
    // Query Operation
    // expects {email: username123@email.com, password: 'password123'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json( {message: `No account with ${req.body.email} found!`});
        }

        // res.json( {user: dbUserData})
        // Verify User
        const isValidPassword = dbUserData.checkPassword(req.body.password);
        if (!isValidPassword) {
            res.status(400).json( {message: `Password does not match our records`});
            return;
        }
        res.json( { user:dbUserData, message: 'You are now logged in!' } );
    })
});

module.exports = router;