const express = require('express');
const Projects = require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: "error fetching projects ..."})
    })
})

router.get('/:id', validateId(), (req, res) => {
    res.status(200).json(req.project);
});

router.post('/', validatePostData(), (req, res) => {
    res.status(201).json(req.project)
});

router.get('/:id/actions', validateProjectId(), (req, res) => {
    res.status(200).json(req.actions)
});

router.put('/:id', (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json(project)
            }; 
        })
        .catch(error => {
            res.status(500).json({ message: "Error updating project"})
        });
})

router.delete('/:id', (req, res) => {
    Projects.remove(req.params.id)
        .then(count => {
            if(count > 0 ) {
                res.status(200).json({ count: count, message: "Project is gone forever" })
            } else {
                res.status(404).json({message: "Project with that ID does not exist"})
            }
        })
        .catch(error => {
            res.status(500).json({message: "Error deleting project"})
        })
})


module.exports = router;

function validateId() {
    return (req, res, next) => {
        Projects.get(req.params.id)
        .then(project => {
            if (project) {
                req.project = project
                next()
            } else {
                res.tatus(404).json({message: "Project with that ID does not exist ..."})
            };
        })
        .catch(error => {
            res.status(500).json({message: "Error fetching project"})
        });
    };
};

function validateProjectId() {
    return (req, res, next) => {
        Projects.getProjectActions(req.params.id)
            .then(actions => {
                if (actions) {
                    req.actions = actions
                    next()
                } else {
                    res.status(404).json({ message: "Actions do not exist for this ID"})
                }
            })
            .catch(error => {
                res.status(500).json({ message: "Error fetching actions"})
            })
    }
}

function validatePostData() {
    return(req, res, next) => {
        const {name, description} = req.body;
        const project = {name, description};

        Projects.insert(project)
            .then(project => {
                if (name && description) {
                    req.project = project
                    next()
                } else {
                    res.status(400).json({message: "Projects must have name and description"})
                    next()
                };
            })
            .catch(error => {
                res.status(500).json({message: "Error occurred while addding project" })
            })
    };
};