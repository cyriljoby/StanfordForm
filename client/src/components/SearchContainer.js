import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";
import {useState, useMemo, useEffect} from "react";
import {
  narrowCities,
  narrowCounties,
  narrowDistricts,
  narrowSchools,
} from "../utils/schoolDataFetch";
import { Link } from "react-router-dom";
import { utils as XLSXUtils, writeFile as writeXLSXFile } from 'xlsx';
import { tobacco, postTobacco, cannabis, postCannabis, safety, healthy
} from "../utils/questions";


const SearchContainer = ({ startReload }) => {
  const {
    user,
    handleChange,
    isLoading,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchType,
    searchTeacher,
    searchBeforeAfter,
    stateOptions,
    countyOptions,
    districtOptions,
    cityOptions,
    schoolOptions,
    periodOptions,
    gradeOptions,
    teacherOptions,
    typeOptions,
    beforeAfterOptions,
    handleChanges,
    getResponseGroups,
    userLocations,
    currentSchoolIndex,
    shouldReload,
    allResponseGroups,
    getExport,
    exportData
  } = useAppContext();
  const [exportClicked, setExportClicked] = useState(false);
  const [questionsToAnswers, setQuestionsToAnswers] = useState({});
  let reorderedQuestionsToAnswers = {};

  useEffect(() => {
    if (exportClicked && exportData) {
      const worksheet = XLSXUtils.json_to_sheet(exportData);
      const workbook = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeXLSXFile(workbook, `data.xlsx`);
      handleChange(exportData,[])
      setExportClicked(false);
    }
  }, [exportData, exportClicked]);

  const createExcelSheet = async () => {
    await getResponseGroups(currentSchoolIndex, shouldReload, true)
    setExportClicked(true);
    
    
  };
  
  
  const createQuestionsToAnswersMap = (array, questionsToAnswers) => {
    reorderedQuestionsToAnswers = {};
    array.forEach((question) => {
      if ((questionsToAnswers).hasOwnProperty(question.question)) {
        reorderedQuestionsToAnswers[question.question] = questionsToAnswers[question.question];
      }
    });
    setQuestionsToAnswers(reorderedQuestionsToAnswers);
  };

  const formTimeType = (formType, when, data) => {
    if (formType === "You and Me, Together Vape-Free") {
      return when === "before" ? createQuestionsToAnswersMap(tobacco, data) : createQuestionsToAnswersMap(tobacco.concat(postTobacco), data);
    } else if (formType === "Smart Talk: Cannabis Prevention & Education Awareness") {
      return when === "before" ? createQuestionsToAnswersMap(cannabis, data) : createQuestionsToAnswersMap(cannabis.concat(postCannabis),data);
    }
    else if (formType === "Healthy Futures" ){
      return createQuestionsToAnswersMap(healthy, data)
    }
    else if (formType === "Safety First"){
      return createQuestionsToAnswersMap(safety, data)
    }
  };

  const narrowAllowedOptions = (searchType, searchValues) => {
    let values;

    if (user.role === "Teacher") {
      const allowedValues = userLocations.map(
        (location) => location[searchType]
      );
      values = searchValues.filter((value) => allowedValues.includes(value));
    } else if (user.role === "Standford Staff") {
      values = searchValues;
    } else {
      if (userLocations[0][searchType] === null) {
        values = searchValues;
      } else {
        values = searchValues.filter(
          (value) => value === userLocations[0][searchType]
        );
      }
    }

    if (values.length === 0) {
      values = ["all"];
    } else {
      values = ["all", ...values];
    }

    return values;
  };

  const handleLocalChange = (e) => {
    switch (e.target.name) {
      case "searchState":
        handleChanges({
          [e.target.name]: e.target.value,
          searchCounty: 'all',
          searchCity: 'all',
          searchDistrict: 'all',
          searchSchool: 'all',
          searchTeacher: 'all',
          countyOptions: narrowAllowedOptions(
              "county",
              narrowCounties({ state: e.target.value })
            ),
          cityOptions: narrowAllowedOptions(
              "city",
              narrowCities({ state: e.target.value })
            ),
          schoolOptions: narrowAllowedOptions(
              "school",
              narrowSchools({ state: e.target.value })
            ),
          districtOptions: narrowAllowedOptions(
              "district",
              narrowDistricts({ state: e.target.value })
            ),
        });
        break;
      case "searchCounty":
        handleChanges({
          [e.target.name]: e.target.value,
          searchCity: 'all',
          searchDistrict: 'all',
          searchSchool: 'all',
          searchTeacher: 'all',
          cityOptions: narrowAllowedOptions(
              "city",
              narrowCities({ county: e.target.value })
            ),
          schoolOptions: narrowAllowedOptions(
              "school",
              narrowSchools({ county: e.target.value })
            ),
          districtOptions: narrowAllowedOptions(
              "district",
              narrowDistricts({ county: e.target.value })
            ),
        });
        break;
      case "searchCity":
        handleChanges({
          [e.target.name]: e.target.value,
          searchDistrict: 'all',
          searchSchool: 'all',
          searchTeacher: 'all',
          districtOptions: narrowAllowedOptions(
              "district",
              narrowDistricts({ city: e.target.value, county: searchCounty, state: searchState })
            ),
          schoolOptions: narrowAllowedOptions(
              "school",
              narrowSchools({ city: e.target.value, county: searchCounty, state: searchState })
            ),
        });
        break;
      case "searchDistrict":
        handleChanges({
          [e.target.name]: e.target.value,
          searchSchool: 'all',
          searchTeacher: 'all',
          schoolOptions: narrowAllowedOptions(
              "school",
              narrowSchools({ district: e.target.value, county: searchCounty, state: searchState, city: searchCity })
            ),
        });
        break;
      case "searchSchool":
        handleChanges({
          searchTeacher: 'all',
          [e.target.name]: e.target.value,
        });
        break;
      case "searchTeacher":
        // get the second element of the teacher option array
        if (e.target.value === "all") {
          handleChanges({
            [e.target.name]: "all",
          });
          break;
        } else {
          const selectedTeacher = teacherOptions.find(
            (teacher) => teacher[0] === e.target.value
          );
          handleChanges({
            [e.target.name]: selectedTeacher ? selectedTeacher : "all",
          });
          break;
        }
      default:
        handleChanges({ [e.target.name]: e.target.value });
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const timeout = setTimeout(() => {
      startReload();
    }, 1000);

    return () => clearTimeout(timeout);
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          {/* search by state */}
          <FormRowSelect
            labelText="state"
            name="searchState"
            value={searchState}
            handleChange={handleLocalChange}
            list={stateOptions}
          />
          {/* search by county */}
          <FormRowSelect
            labelText="county"
            name="searchCounty"
            value={searchCounty}
            handleChange={handleLocalChange}
            list={countyOptions}
          />
          {/* search by city */}
          {user.role !== "District Admin" && (
          <FormRowSelect
            labelText="city"
            name="searchCity"
            value={searchCity}
            handleChange={handleLocalChange}
            list={cityOptions}
          />
          )}
          {/* search by district */}
          <FormRowSelect
            labelText="district"
            name="searchDistrict"
            value={searchDistrict}
            handleChange={handleLocalChange}
            list={districtOptions}
          />
          {/* search by school */}
          <FormRowSelect
            labelText="school"
            name="searchSchool"
            value={searchSchool}
            handleChange={handleLocalChange}
            list={schoolOptions}
          />
          {/* search by teacher */}
          <FormRowSelect
            labelText="teacher"
            name="searchTeacher"
            value={
              user.role === "Teacher"
                ? user.name
                : searchTeacher === "all"
                ? "all"
                : searchTeacher[0]
            }
            handleChange={handleLocalChange}
            list={
              user.role === "Teacher"
                ? [user.name]
                : ["all", ...teacherOptions.map((teacher) => teacher[0])]
            }
          />
          {/* search by grade */}
          <FormRowSelect
            labelText="grade"
            name="searchGrade"
            value={searchGrade}
            handleChange={handleLocalChange}
            list={gradeOptions}
          />
          {/* search by period */}
          <FormRowSelect
            labelText="period"
            name="searchPeriod"
            value={searchPeriod}
            handleChange={handleLocalChange}
            list={periodOptions}
          />
          {/* search by type */}
          <FormRowSelect
            labelText="form type"
            name="searchType"
            value={searchType}
            handleChange={handleLocalChange}
            list={typeOptions}
          />
          {/* search by before/after */}
          <FormRowSelect
            labelText="beforeAfter"
            name="searchBeforeAfter"
            value={searchBeforeAfter}
            handleChange={handleLocalChange}
            list={beforeAfterOptions}
          />
          <button
            className="btn btn-block btn-apply"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            search forms
          </button>
          <button
            className="btn btn-block btn-apply"
            disabled={isLoading}
            onClick={createExcelSheet}
            >
            export all data
          </button>
          <Link
            className="btn btn-block btn-obreak"
            disabled={isLoading}
            to={isLoading ? "#" : `/api/v1/form/`}
          >
            Overall Breakdown
          </Link>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
