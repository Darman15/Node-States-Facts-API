const express = require("express");
const router = express.Router();
const statesController = require('../../controllers/statesController');


// get all states route
router.route("/")
    .get(statesController.getAllStates);
    
// get single state
router.route("/:state")
    .get(statesController.getSingleState);

router.route("/:state/funfact")
    .get(statesController.getSingleFunFact);    
    
// get state  capital info
router.route("/:state/capital")
    .get(statesController.getStateCapital)

// get state and state nickname
router.route("/:state/nickname")
    .get(statesController.getStateNickname)

// get state and population
router.route("/:state/population")    
    .get(statesController.getStatePopulation)

// get state and admission date
router.route("/:state/admission")
    .get(statesController.getStateAdmissionDate)

// create state code and facts route
router.route("/:state/funfact")
    .post(statesController.createStateInfo)
    .patch(statesController.updateStateInfo)
    .delete(statesController.deleteStateFunFact)

   


module.exports = router;
