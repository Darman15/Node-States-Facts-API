// controller for states info
const e = require("express");
const { findOneAndDelete } = require("../model/States");
const StatesDB = require("../model/States");
const data = {
  states: require("../model/states.json"),
  setStates: function (data) {
    this.states = data;
  },
};

//  TODO: make MongoDB info show up when fun facts are included.
// function for getting all states
const getAllStates = async (req, res) => {
  let statesList;
  let jsonStates = data.states
  const {contig} = req.query
  console.log(contig);
  if(contig === "true") {

    // No idea why this only works with a function and will not work with !==st.code like below but do not touch it 
  function filterOutAkandHI(jsonStates)  {
    if(jsonStates.code == "AK" || jsonStates.code == "HI") {
      return false;
    }
    return true;
  }
  statesList  = jsonStates.filter(filterOutAkandHI);
      } 
  else if (contig === "false") {
    statesList  = jsonStates.filter(st => st.code === "AK" || st.code === "HI")
  } 
  else {
    statesList = data.states
  }
  let  statesFromDB = await StatesDB.find({});
  statesList.forEach(state => {
 const statesMatch = statesFromDB.find(st => st.stateCode === state.code) 
     if(statesMatch) {
       console.log(statesMatch.stateCode + " Matches " + state.code)
       state.funfacts = [...statesMatch.funfact]
 
     } 
  })
  res.json(statesList)
};
// end of Get All State Info
// --------------------------

//   function for getting all info from single State
const getSingleState = async (req, res) => {
  console.log("Reached here");
  let jsonStates = data.states;
  let  statesFromDB = await StatesDB.find({});
  const state = jsonStates.find((state) => state.code === req.params.state.toUpperCase());
  if (!state) {
    return res.status(400).json({ message: `State code ${req.params.code} not found` });
  }
  const stateMatch = statesFromDB.find(st => st.stateCode === state.code);
  if(stateMatch) {
    console.log(stateMatch.stateCode + " Matches " + state.code)
    state.funfacts = [...stateMatch.funfact]
  } 
  res.json(state);
};
//  end of Get Single State INFO
// ------------------------

// function for getting a random fact from a single State
const getSingleFunFact = async (req, res) => {
  console.log("Here from get single fun fact")
  let jsonStates = data.states;
  let  statesFromDB = await StatesDB.find({});
  const state = jsonStates.find((state) => state.code === req.params.state.toUpperCase());
  if (!state) {
    return res.status(400).json({ message: `State code ${req.params.code} not found` });
  }
  const stateMatch = statesFromDB.find(st => st.stateCode === state.code);
  if(stateMatch) {
    console.log(stateMatch.stateCode + " Matches " + state.code)
    state.funfacts = [...stateMatch.funfact]
  }
  // console.log(Math.floor(Math.random() * state.funfacts.length - 1) + 1)
  // console.log(state.funfacts[Math.floor(Math.random() * state.funfacts.length - 1) + 1])
  res.json({funfact: `${state.funfacts[Math.floor(Math.random() * state.funfacts.length - 1) + 1]}`});
}

// end of get Random fun fact from a state
// -------------------------------------------

// function to get state and capital returned
const getStateCapital = async (req, res) => {
  console.log("Here from getStateCapital");
  const state = data.states.find((state) => state.code === req.params.state.toUpperCase());
  console.log(state.capital_city);
  console.log(state.state);
  if (!state) {
    return res.status(400).json({ message: `State code ${req.params.code} not found` });
  }
  res.json({ state: `${state.state}`, capital: `${state.capital_city}` });
};
// end of get state and capital
// ---------------------------------------

// start of get state and Nickname returned
const getStateNickname = async (req, res) => {
  console.log("here from the getStateNickname Function");
  const state = data.states.find((state) => state.code === req.params.state.toUpperCase());
  console.log(state.nickname);
  console.log(state.state);
  if (!state) {
    return res.status(400).json({ message: `State code ${req.params.code} not found` });
  }
  res.json({ state: `${state.state}`, nickname: `${state.nickname}` });
};

// end of get state and Nickname
// -----------------------------------

// Start of get state and population
const getStatePopulation = async (req, res) => {
  console.log("Here from getStatePopulation Function");
  const state = data.states.find((state) => state.code === req.params.state.toUpperCase());
  console.log(state.state);
  console.log(state.population);

  res.json({ state: `${state.state}`, population: `${state.population}` });
};
// end of get state and population
// ---------------------------------------

// Start of get state and admission date function
const getStateAdmissionDate = async (req, res) => {
  console.log("here from getStateAdmissionDate function");
  const state = data.states.find((state) => state.code === req.params.state.toUpperCase());
  console.log(state.state);
  console.log(state.admission_date);
  res.json({ state: `${state.state}`, admitted: `${state.admission_date}` });
};
// end of get state and admission date
// ------------------------------------------


//  function for creating a state code and state fun fact
const createStateInfo = async (req, res) => {
  console.log("Here");
  if (!req?.body?.state) {
    return res.status(400).json({ message: "stateCode " });
  }
  const foundState = await StatesDB.findOne({ stateCode: req.body.state.toUpperCase() });
  if (!foundState) {
    try {
      const result = await StatesDB.create({
        stateCode: req.body.state,
        funfact: req.body.funfact,
      });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
    }
  }
  else if (foundState && foundState.funfact[0]) {
    console.log("Reached here two")
      const result = await StatesDB.updateOne(
        {stateCode: req.body.state},
       {$addToSet: {funfact: req.body.funfact}}
       )
       res.status(201).json(result);
  }    
 };
// end of POST/Create route
// --------------------------------

// function for updating a state in mongo
const updateStateInfo = async (req, res) => {
  console.log("Here from update State Info function")
  console.log(req.params.state)
  if (!(req?.params?.state)) {
    return res.status(400).json({ message: "State code required" });
  }

  const state = await StatesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  let index = req.body.index + 1;
  console.log(index)

  if(!state) {
    return res.status(400).json({"message": `No state matches the ${req.params.state} code.`})
  }

  // check for index in body
  if(!index) {
    return res.status(400).json({"message": `State fun fact index value is required`})
  }

  index = index - 1;
  console.log(index);
  console.log(state.funfact.length)
  if(!req.body.funfact) {
    return res.status(400).json({"message": `State fun fact value required`});
  }

  if(index < 0 || req.body.index > state.funfact.length) {
    return res.status(400).json({'message': `No Fun Fact found at the index entered for the state entered`})
  }

// update the quote at the correct index
 console.log(state.funfact[index]) 
  state.funfact[index] = req.body.funfact;
  const result = await state.save();
  res.json(result) 
 
  console.log(state.funfact[index])


  // if (!state) {
  //   return res
  //     .status(204)
  //     .json({ message: `State code ${req.body.stateCode} not found` });
  // }

  // if (req.body?.funfact) state.funfact = req.body.funfact;
  // const result = await state.save();
  // res.json(result);
};
// end of patch state route
// ----------------------------

// function for deleting a state fun fact from the array of fun facts
const deleteStateFunFact = async (req, res) => {
  let index = req?.body?.index + 1

  if(!index) {
    return res.status(400).json({"message": 'Index required in request body'})
  }

  index = index - 1;
  const foundState = await StatesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  if(!foundState || foundState == null) {
    return res.json({"message": `No state matches ${req.params.state}.`})
  }
console.log(foundState.funfact[index])
foundState.funfact.splice(index, 1)
const result = await foundState.save();


console.log(result);
res.json(result)
};

module.exports = {
  getAllStates,
  getSingleState,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmissionDate,
  getSingleFunFact,
  createStateInfo,
  updateStateInfo,
  deleteStateFunFact,
};
