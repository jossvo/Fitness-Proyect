import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ProfileSidebar } from "../userComponents/profileSidebar.jsx";
import "../../styles/coachStyle.css";

export const ProgramTemplate = () => {
  const { store, actions } = useContext(Context);
  const {setNewElement,getDetails} = actions;
  const [allowPopulation, setAllowPopulation] = useState(false)

  const [exercise, setExercise] = useState();
  const [userID, setUserID] = useState();
  const [UserAssignHelp,setUserAssignHelp] = useState("")
  const [workoutID, setWorkoutID] = useState();

  const [workoutImage,setWorkoutImage]=useState("https://picsum.photos/seed/picsum/200/200")
  const [isPublicState, setIsPublicState] = useState(true);
  const [disableList, setDisableList] = useState(false);

  useEffect(() => {
    if(store.wkID){
      async function fetchData(){
        actions.getDetails('workouts',store.wkID);
      }
      fetchData()
      setWorkoutID(store.wkID)
    }
  },[store.wkID]);

  // useEffect and function to populate form with fetch data
  useEffect(() => {
    setData()
  },[store["workoutsDetail"]]);

  async function setData(){
    if(store["workoutsDetail"]){
      let workout = store["workoutsDetail"]
      setWorkoutImage(workout.wk_image)
      document.getElementById("inputWorkoutName").value=workout.name
      document.getElementById("inputWorkoutWeeks").value=workout.weeks
      document.getElementById("inputWorkoutDays").value=workout.days_per_week
      document.getElementById("inputWorkoutDifficulty").value=workout.difficulty
      document.getElementById("inputWorkoutDescription").value=workout.description
      document.getElementById("inputWorkoutType").value=workout.isPublic
    }
  }


  let exercises = [
    { label: "ejercicio 1", value: "1" },
    { label: "ejercicio 2", value: "2" },
    { label: "ejercicio 3", value: "3" },
  ];
  let users = [
    { label: "usuario 1", value: "1" },
    { label: "usuario 2", value: "2" },
    { label: "usuario 3", value: "3" },
  ];

  function handleSelectExerciseChange(e) {
    if(e!==null)setExercise(e.value);
    else setExercise(e)
  }
  function handleSelectUserChange(e) {
    if(e!==null){
        setUserID(e.value)
        setUserAssignHelp("")
    }
    else{
        setUserID(e)
        setUserAssignHelp("Workout must be assigned to user if private")
    }
  }
  function handleOtherExerciseCheckbox(e) {
    if (e.target.checked)setDisableList(true)
    else setDisableList(false);
  }
  function workoutTypeChange(e){
    e.target.value==="false"?setIsPublicState(false)
    :setIsPublicState(true)
    if(!isPublicState)setUserAssignHelp("")
  }
  //New exercise Div
  function allowNewExercise() {
    if (disableList) {
      return (
        <div className="newExerciseCreateWorkoutDiv row">
          <div className="row gx-3 mb-3">
            <div className="col-md-7">
              <label className="small mb-1" htmlFor="inputNewExercise">
                New Exercise Name
              </label>
              <input
                required
                className="form-control"
                id="inputNewExercise"
                type="text"
                placeholder="Enter your first name"
                name="new_exercise"
              />
            </div>

            <div className="col-md-5">
              <label className="small mb-1" htmlFor="inputNewExerciseVideo">
                New Exercise Video
              </label>
              <input
                className="form-control"
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                id="inputNewExerciseVideo"
              />
            </div>
          </div>

          <div className="row gx-3 mb-3">
            <div className="col-md-12">
              <label
                htmlFor="inputNewExerciseDescription"
                className="small mb-1"
              >
                New Exercise Description
              </label>
              <textarea
                className="form-control"
                id="inputNewExerciseDescription"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
      );
    }
  }


  // Update profile data from Account Details form
  async function updateData(e) {
    e.preventDefault();
    if(!isPublicState && !userID){
        setUserAssignHelp("Workout must be assigned to user if private")
        return false
    }
    const data = new FormData(e.target);
    data.set('is_public',data.get('type'))
    if(userID)data.set('user_id',userID)

    // for (var pair of data.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    // }
    if(!workoutID){
      let response = await setNewElement('workouts',data)
      if(response !="ok"){
        alert("Something went wrong! Please try again")
      }else window.location.reload(true)
    }else{
      // To be defined 'PATCH' method for workout info
      console.log("This will be the patch method")
    }

  }

  return (
      <div
        className="container overflow-auto"
        style={{ height: "95vh", width: "90%", marginTop: "5vh" }}
      >
        <div
          className="row"
          style={{ marginBottom: "calc(var(--bs-gutter-x))" }}
        >
          <div className="col-xl-12">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Workout Details</div>
              <form onSubmit={updateData}>
                <div
                    className="row gx-3 mb-3 workoutDetailsDiv"
                    style={{ paddingLeft: "calc(var(--bs-gutter-x) * .5)" }}
                >
                    <div
                    id="workoutImage"
                    className="col-md-4 card-body  "
                    style={{
                        backgroundImage:`url(${workoutImage})`,
                        backgroundSize:"cover",
                        borderRight: "2px",
                        borderColor: "black",
                        }}
                    >
                      <div className="d-flex align-items-end h-100">
                        <div className="d-flex flex-column p-2 rounded" style={{backgroundColor:"white"}}>
                          <label className="form-label" htmlFor="inputWorkoutImage">
                            Workout Image
                          </label>
                          <input
                              required
                              name="file"
                              className="form-control form-control-sm"
                              accept="image/png, image/jpeg"
                              id="inputWorkoutImage"
                              type="file"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8" style={{paddingLeft:"0px"}}>
                        <div className="card-body">
                            <div className="row gx-3 mb-3">
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="inputWorkoutName">
                                    Workout Name
                                    </label>
                                    <input
                                        required
                                        className="form-control"
                                        id="inputWorkoutName"
                                        type="text"
                                        placeholder="Enter your last name"
                                        name="name"
                                    />
                                </div>
                            </div>
                            <div className="row gx-3 mb-3">
                                <div className="col-md-3">
                                    <label className="form-label" htmlFor="inputWorkoutWeeks">
                                        Weeks
                                    </label>
                                    <select
                                        name="weeks"
                                        className="form-select"
                                        aria-label="Default select example"
                                        id="inputWorkoutWeeks"
                                    >
                                        {[...Array(16).keys()].slice(1).map((week,index) =>{
                                            return(
                                                <option value={week} key={index}>{week}</option>
                                            )}
                                        )}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label" htmlFor="inputWorkoutDays">
                                        Days/Week
                                    </label>
                                    <select
                                        name="days_per_week"
                                        className="form-select"
                                        aria-label="Default select example"
                                        id="inputWorkoutDays"
                                    >
                                        {[...Array(8).keys()].slice(1).map((day,index) =>{
                                            return <option value={day} key={index}>{day}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label" htmlFor="inputWorkoutDifficulty">
                                        Difficulty
                                    </label>
                                    <select
                                        name="difficulty"
                                        className="form-select"
                                        aria-label="Default select example"
                                        id="inputWorkoutDifficulty"
                                    >
                                        {["easy","medium","hard"].map((difficulty,index)=>{
                                            return <option value={difficulty} key={index}>{difficulty}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-3" style={{ position: "relative" }}>
                                    <label className="form-label" htmlFor="inputWorkoutType">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        className="form-select"
                                        aria-label="Default select example"
                                        id="inputWorkoutType"
                                        onChange={workoutTypeChange}
                                    >
                                        {[{type:"public",value:true},{type:"private",value:false}].map((elem,index)=>{
                                            return <option value={elem.value} key={index}>{elem.type}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="row gx-3 mb-3">
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="inputUserToAssign">
                                        User To Assign Workout
                                    </label>
                                    <Select
                                        isClearable={true}
                                        placeholder="Select exercise..."
                                        id="inputUserToAssign"
                                        options={users}
                                        onChange={handleSelectUserChange}
                                        isDisabled={isPublicState}
                                    />
                                    <div id="UserAssignHelp" className="form-text" style={{color:"red"}} >
                                        {UserAssignHelp}                    
                                    </div>
                                </div>
                            </div>
                            <div className="row gx-3 mb-3">
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="inputWorkoutDescription" >Workout Description</label>
                                    <textarea className="form-control" id="inputWorkoutDescription" rows="3" name="description" required></textarea>
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit">
                                {workoutID?"Update Workout":"Create Workout"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {workoutID?<div className="row gx-3 mb-3">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Exercise order</div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">Exercise Details</div>
              <div className="card-body">
                <form onSubmit={updateData}>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-10">
                      <label className="small mb-1" htmlFor="inputExercise">
                        Exercise Library
                      </label>
                      <Select
                        required={true}
                        isClearable={true}
                        placeholder="Select exercise..."
                        id="inputExercise"
                        options={exercises}
                        onChange={handleSelectExerciseChange}
                        isDisabled={disableList}
                      />
                    </div>
                    <div className="col-md-2" style={{ position: "relative" }}>
                      <div
                        className="form-check"
                        style={{ position: "absolute", top: "40%" }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                          onChange={handleOtherExerciseCheckbox}
                        />
                        <label
                          className="small mb-1"
                          htmlFor="flexCheckChecked"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Section visible if want to create a new exercise */}
                  {allowNewExercise()}

                  <div className="row gx-3 mb-3">
                    <div className="col-md-2">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Week
                      </label>
                      <select
                        name="gender"
                        className="form-select"
                        aria-label="Default select example"
                        id="inputGender"
                      >
                        <option defaultValue disabled>
                          Choose One
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Day
                      </label>
                      <select
                        name="gender"
                        className="form-select"
                        aria-label="Default select example"
                        id="inputGender"
                      >
                        <option defaultValue disabled>
                          Choose One
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Order
                      </label>
                      <select
                        name="gender"
                        className="form-select"
                        aria-label="Default select example"
                        id="inputGender"
                      >
                        <option defaultValue disabled>
                          Choose One
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputFirstName">
                        First name
                      </label>
                      <input
                        required
                        className="form-control"
                        id="inputFirstName"
                        type="text"
                        placeholder="Enter your first name"
                        name="first_name"
                      />
                      <div
                        id="FirstNameHelp"
                        className="form-text"
                        style={{ color: "red" }}
                      ></div>
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLastName">
                        Last name
                      </label>
                      <input
                        required
                        className="form-control"
                        id="inputLastName"
                        type="text"
                        placeholder="Enter your last name"
                        name="last_name"
                      />
                      <div
                        id="LastNameHelp"
                        className="form-text"
                        style={{ color: "red" }}
                      ></div>
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit">
                    Save changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        :""}
      </div>
  );
};
