import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect, useRef } from "react";
import Logo2 from "../assets/images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import {
  narrowDistricts,
  narrowCities,
  narrowCounties,
  narrowSchools,
  getDistrictCounty,
} from "../utils/schoolDataFetch";
import CreateLocPopup from "../components/CreateLocPopup";

const SelectLoc = ({ noCode }) => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    addLocation,
    isLoading,
    successAlert,
    exists,
    selectLocSchools,
    setToNarrowSchools,
  } = useAppContext();
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [state, setState] = useState("default");
  const [city, setCity] = useState("default");
  const [school, setSchool] = useState("default");
  const [district, setDistrict] = useState("default");
  const [county, setCounty] = useState("default");
  const [form, setForm] = useState("default");
  const [when, setWhen] = useState("default");

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [grade, setGrade] = useState("default");
  const location = useLocation();
  const locationState = location?.state || {}; // Default to an empty object if location.state is null or undefined
  const { adminTeacher } = locationState;
  const { selectSchool } = locationState;
  const { fromProfile } = locationState;
  let { forOther } = locationState;
  forOther = forOther !== undefined ? forOther : null;
  let { requestedName } = locationState;
  const [multiplePeriods, setMultiplePeriods] = useState(false);
  let adminroles = [
    "Site Admin",
    "District Admin",
    "County Admin",
    "State Admin",
    "Stanford Staff",
  ];
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let adminbool = false;
  const [additionalLoc, setAdditionalLoc] = useState(false);

  const [numOfLocations, setNumOfLocations] = useState(
    user?.adminTeacher && user?.role != "Stanford Staff"
      ? userLocations
        ? userLocations.length
        : 1
      : userLocations
      ? userLocations.length
      : 1
  );

  useEffect(() => {
    if (userLocations) {
      setNumOfLocations(userLocations.length+1);
    }
  }, [userLocations]);
  
  const showCounty =
    !fromProfile &&
    !selectSchool &&
    (user?.role === "District Admin" || user?.role === "County Admin");
  const showCity =
    user?.role === "Site Admin" ||
    user?.role === "Teacher" ||
    noCode ||
    selectSchool ||
    fromProfile ||
    forOther;
  const showDistrict =
    !fromProfile && !selectSchool && user?.role === "District Admin";
  const showSchool =
    user?.role === "Site Admin" ||
    user?.role === "Teacher" ||
    noCode ||
    selectSchool ||
    fromProfile ||
    forOther;
  const showMultiplePeriods =
    user?.role === "Teacher" ||
    selectSchool ||
    fromProfile ||
    user?.role == "Site Admin";
  const showAdditionalLoc =
    user?.role === "Teacher" || selectSchool || fromProfile;
  useEffect(() => {
    setState("default");
    setCity("default");
    setSchool("default");
    setDistrict("default");
    setCounty("default");
    setForm("default");
    setWhen("default");
  }, []);

  useEffect(() => {
    if (isFormSubmitted && !exists && !additionalLoc) {
      adminroles.map((role) => {
        if (role === user.role) {
          adminbool = true;
        }
      });
      setIsFormSubmitted(false);
      setAdditionalLoc(false);
      if (adminbool) {
        if (adminTeacher && user.role !== "Site Admin") {
          setTimeout(() => {
            navigate("/selectLoc", {
              state: {
                adminTeacher: false,
                selectSchool: true,
                fromProfile: false,
              },
            });
          }, 2000);
          return;
        }
        if (user.adminTeacher) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } 
        else {
          setTimeout(() => {
            navigate("/metrics");
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
    setIsFormSubmitted(false);
    setAdditionalLoc(false);
  }, [isFormSubmitted]);
  useEffect(() => {
    if (user?.role === "Site Admin" || user?.role === "Teacher" || noCode) {
      if (state !== "default" && city !== "default" && school !== "default") {
        // just do this whole thing in app context later

        try {
          console.log("getting district and county");
          console.log(state, city, school);
          const { foundDistrict, foundCounty } = getDistrictCounty(
            state,
            city,
            school
          );
          console.log(foundDistrict, foundCounty);

          setDistrict(foundDistrict);
          setCounty(foundCounty);
        } catch (err) {
          setDistrict("custom");
          setCounty("custom");
        }
      }
    }
  }, [school]);

  const handleChange = (field, value) => {
    if (field === "state") {
      setState(value);
      setCity("default");
      setSchool("default");

      if (value !== "default") {
        setCities(narrowCities({ state: value }));
        setCounties(narrowCounties({ state: value }));
      }
    } else if (field === "county") {
      setCounty(value);
      setDistrict("default");

      if (value !== "default") {
        setDistricts(narrowDistricts({ state, county: value }));
      }
    } else if (field === "city") {
      setCity(value);
      setSchool("default");

      if (value !== "default") {
        setDistricts(narrowDistricts({ state, city: value }));
        setToNarrowSchools({
          reactState: "selectLocSchools",
          state,
          city: value,
        });
      }
    } else if (field === "district") {
      setDistrict(value);
    } else if (field === "school") {
      setSchool(value);
    }
  };

  useEffect(() => {
    if (selectLocSchools.length > 0) {
      setSchools(selectLocSchools);
    }
  }, [selectLocSchools]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forOther) {
      console.log("hi");
      if (
        state === "default" ||
        (showCounty && county === "default") ||
        (showCity && city === "default") ||
        (showDistrict && district === "default") ||
        (showSchool && school === "default")
      ) {
        displayAlert();
        return;
      }
      await addLocation({
        state: state,
        county: county !== "default" ? county : null,
        city: city !== "default" ? city : null,
        district: district !== "default" ? district : null,
        school: school !== "default" ? school : null,
        requesterId: forOther,
      });
      setIsFormSubmitted(true);
      return;
    }
    if (noCode) {
      if (
        state != "default" ||
        grade != "default" ||
        county != "default" ||
        city != "default" ||
        district != "default" ||
        school !== "default"
      ) {
        successAlert("Redirecting...");

        setTimeout(() => {
          navigate("/joinedForm", {
            state: {
              state,
              county,
              district,
              school,
              city,
              noCode,
            },
          });
        }, 2000);
      } else {
        displayAlert();
      }
    } else {
      if (
        state === "default" ||
        (showCounty && county === "default") ||
        (showCity && city === "default") ||
        (showDistrict && district === "default") ||
        (showSchool && school === "default")
      ) {
        displayAlert();
        return;
      }

      await addLocation({
        multiplePeriods: multiplePeriods,
        state: state,
        county: county !== "default" ? county : null,
        city: city !== "default" ? city : null,
        district: district !== "default" ? district : null,
        school: school !== "default" ? school : null,
      });

      if (additionalLoc) {
        setState("default");
        setCounty("default");
        setCity("default");
        setDistrict("default");
        setSchool("default");
        setMultiplePeriods(false);
        setNumOfLocations(numOfLocations + 1);
      }

      setIsFormSubmitted(true);
    }

    handleChange({ name: "selectLocSchools", value: [] });
  };

  const [displayAddPopup, setDisplayAddPopup] = useState(false);

  return (
    <>
      {displayAddPopup && <CreateLocPopup setDisplay={setDisplayAddPopup} />}
      <div
        className="full-page"
        style={{ display: "grid", alignItems: "center", padding: "0 1rem" }}
      >
        <Wrapper style={{ paddingBottom: "1.5rem" }}>
          <form className="form" onSubmit={handleSubmit}>
            {showAlert && <Alert />}
            <div className="form">
              <h3 className="form-title">
                {forOther
                  ? "Select Location for "
                  : noCode ||
                    user?.role === "Teacher" ||
                    selectSchool ||
                    fromProfile
                  ? "Select School"
                  : user.role === "Site Admin"
                  ? "Select School Location"
                  : "Select Admin Location"}
                {forOther
                  ? requestedName
                  : numOfLocations > 1 && !noCode
                  ? ` ${numOfLocations}`
                  : ""}
              </h3>

              <h4 className="form-title">State</h4>
              <select
                name="aliasChoice"
                value={state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="form-select"
              >
                <option value={"default"}>Choose your State</option>
                {states.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </select>
              {showCounty && (
                <>
                  <h4 className="form-title">County</h4>
                  <select
                    name="aliasChoice"
                    value={county}
                    onChange={(e) => handleChange("county", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>Choose your County</option>
                    {counties.map((county, index) => {
                      if (county === "custom") {
                        if (counties.length === 1) {
                          return (
                            <option key={index} value={county}>
                              Doesn't apply
                            </option>
                          );
                        } else {
                          return <></>;
                        }
                      }

                      return (
                        <option key={index} value={county}>
                          {county}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {showCity && (
                <>
                  <h4 className="form-title">City</h4>
                  <select
                    name="aliasChoice"
                    value={city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>Choose your City</option>
                    {cities.map((city, index) => {
                      return (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {showDistrict && (
                <>
                  <h4 className="form-title">District</h4>
                  <select
                    name="aliasChoice"
                    value={district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>Choose your District</option>
                    {districts.map((district, index) => {
                      if (district === "custom") {
                        if (districts.length === 1) {
                          return (
                            <option key={index} value={district}>
                              Doesn't apply
                            </option>
                          );
                        } else {
                          return <></>;
                        }
                      }

                      return (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {showSchool && (
                <>
                  <h4 className="form-title">School</h4>
                  <select
                    name="aliasChoice"
                    value={school}
                    onChange={(e) => handleChange("school", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>Choose your School</option>
                    {schools.map((school, index) => {
                      return (
                        <option key={index} value={school}>
                          {school}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}

              {!noCode && showMultiplePeriods && (
                <>
                  <hr />
                  <label className="checkbox-container">
                    I teach multiple classes/periods at this location
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="aliasChoice"
                      checked={multiplePeriods}
                      onChange={(e) => setMultiplePeriods(e.target.checked)}
                    />
                    <span className="checkbox-checkmark"></span>
                  </label>
                </>
              )}
              {!noCode && showAdditionalLoc && user.role !== "Site Admin" && (
                <>
                  <hr />
                  <label className="checkbox-container">
                    I would like to submit an additional location
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="aliasChoice"
                      checked={additionalLoc}
                      onChange={(e) => {
                        setAdditionalLoc(e.target.checked);
                      }}
                    />
                    <span className="checkbox-checkmark"></span>
                  </label>
                </>
              )}

              <button
                className="btn btn-block"
                type="submit"
                disabled={isLoading}
                onSubmit={(e) => handleSubmit(e.target.value)}
                style={{ marginTop: "1.38rem" }}
              >
                {isLoading ? "Please Wait..." : "submit"}
              </button>
              {!noCode && (user?.adminTeacher && numOfLocations >= 1) ||
              user?.role == "Site Admin" ||
              user?.role === "Teacher"||
              user?.role=="Stanford Staff" ? (
                <p>
                  Don't see your school?{" "}
                  <button
                    className="link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setDisplayAddPopup(true);
                    }}
                  >
                    Click here
                  </button>
                </p>
              ) : null}
              {numOfLocations > 1 && !noCode ? (
                <>
                  <br />
                  <div
                    className="dashboard-link"
                    style={{
                      display: "flex",
                      columnGap: "0.5rem",
                      marginTop: "1rem",
                      alignContent: "center",
                      minWidth: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isLoading ? "Please Wait..." : "Go to Dashboard"}
                    <Link
                      to="/"
                      disabled={isLoading}
                      className="location-icon"
                      style={{ fontSize: "1.5rem" }}
                    >
                      <BsArrowRight />
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </form>
        </Wrapper>
        <img width="200" height="100" src={Logo2} className="corner-logo" />
      </div>
    </>
  );
};

export default SelectLoc;
