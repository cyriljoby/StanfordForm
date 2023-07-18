import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const tobacco = [
  {
    question:
      "Imagine you vape nicotine occasionally. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Imagine you vape nicotine daily.  How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Nicotine vapes are safer than cigarettes.",
    answers: [
      "Strongly agree",
      "Disagree",
      "Neither disagree nor agree",
      "Agree",
      "Strongly agree"
    ],
  },
  {
    question:
      "Imagine you vape nicotine occasionally:  How likely are you to become addicted?",
    answers: [
      "Not at all likely to become addicted",
      "Slightly likely to become addicted",
      "Moderately likely to become addicted",
      "Very likely to become addicted",
      "Extremely likely to become addicted"
    ],
  },
  {
    question:
      "Imagine you vape nicotine daily:  How likely are you to become addicted?",
    answers: [
      "Not at all likely to become addicted",
      "Slightly likely to become addicted",
      "Moderately likely to become addicted",
      "Very likely to become addicted",
      "Extremely likely to become addicted"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cigarette to smoke? ",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you an e-cigarette/vape?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target youth?",
      answers: [
        "Strongly agree",
        "Disagree",
        "Neither disagree nor agree",
        "Agree",
        "Strongly agree"
      ],
  },
  {
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target adults?",
      answers: [
        "Strongly agree",
        "Disagree",
        "Neither disagree nor agree",
        "Agree",
        "Strongly agree"
      ],
  },
  {
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target brown and black communities?",
      answers: [
        "Strongly agree",
        "Disagree",
        "Neither disagree nor agree",
        "Agree",
        "Strongly agree"
      ],
  },
  {
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target LGBTQI+ communities?",
      answers: [
        "Strongly agree",
        "Disagree",
        "Neither disagree nor agree",
        "Agree",
        "Strongly agree"
      ],
  },
  {
    question:
      "How much do you agree or disagree with the following statement: tobacco and vaping (e-cigarette) companies target current cigarette smokers?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How harmful are e-cigarettes to the environment?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "The 'vapor' that comes out of a vaping device is:",
    answers: [
      "Harmless water vapor",
      "Mostly water vapor with a few aerosolized chemicals in it",
      "An equal amount of water vapor with aerosolized and harmful chemicals",
      "Mostly aerosolized and harmful chemicals with a little water vapor",
      "Just aerosolized chemicals (no water vapor)"
    ],
  },
  {
    question:
      "What are your goals regarding vaping?",
    answers: [
      "I want to never use",
      "I want to cut back my vaping",
      "I want to quit completely",
      "I want to change what I vape",
      "I have not decided yet"
    ],
  }
];

const postTobacco = [
  {
    question:
      "Which best describes your plans regarding tobacco/nicotine/vaping:",
    answers: [
      "Stay tobacco/nicotine/vapingfree",
      "Reduce my use (cut-back)",
      "Quit",

    ]
  }
]


const cannabis = [
  {
    question:
      "Imagine you use cannabis products (smoke, vape, eat, or drink) occasionally. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Imagine you use cannabis products (smoke, vape, eat, or drink) daily.  How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you cannabis to smoke or vape?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cannabis edible?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How harmful are “disposable” (single use) cannabis vaping products to the environment? ",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "The “vapor” that comes out of cannabis vaping devices is:",
    answers: [
      "Harmless water vapor",
      "Mostly water vapor with a few aerosolized chemicals in it",
      "An equal amount of water vapor with aerosolized and harmful chemicals",
      "Mostly aerosolized and harmful chemicals with a little water vapor",
      "Just aerosolized chemicals (no water vapor)"
    ],
  },
  {
    question: "How much do agree or disagree with the following statement: Cannabis smoke/vapor is harmful to your lungs?",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree nor disagree",
      "Disagree",
      "Strongly disagree"
    ],
  },
  {
    question: "How much do agree or disagree with the following statement: Cannabis (any type) is harmful to the brain development of someone under the age of 21?",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree nor disagree",
      "Disagree",
      "Strongly disagree"
    ],
  },
];

const postCannabis = [
  {
    question:
      "Which best describes your plans regarding cannabis:",
    answers: [
      "Stay cannabis free",
      "Reduce my use (cut-back)",
      "Quit",
      
    ]
  }
]

const safety = [
  {
    question:"The safest path for teens is to avoid drugs altogether, including alcohol, cigarettes, cannabis, and prescription drugs (outside of a doctor’s recommendations).",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree or disagree",
      "Disagree",
      "Strongly disagree"
    ]
  },

  {
    question:"Some youth will choose to try drugs, regardless of the risks. In order to reduce potential harm, young people need strategies for keeping themselves and their friends safer when they do encounter drugs.",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree or disagree",
      "Disagree",
      "Strongly disagree"
    ]
  },

  {
    question:"Using e-cigarettes and/or cannabis vapes are an unhealthy way to cope with stress.",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree or disagree",
      "Disagree",
      "Strongly disagree"
    ]
  },

  {
    question:"How hard would it be for you to refuse, or say “no” to, a friend who offered you drugs?",
    answers:[
      "very easy",
      "easy",
      "neither hard or easy",
      "Hard",
      "very hard"
    ]
  },

  {
    question:"Describe how to identify alcohol poisoning.",
    answers:[
      "Rapid heart beat, high fever, uncontrollable shaking, fast pulse",
      "Difficulty breathing, rash, eyes rolled back, trembling",
      "Clammy skin, unresponsiveness, puking, slowed breathing",
      "All of the above",
      "I don’t know"

    ]
  },

  {
    question:"If someone drinks too much alcohol, vomits and passes out, you should let them sleep it off.",
    answers:[
      "Strongly agree",
      "Agree",
      "Disagree",
      "Strongly disagree",
      "Don't know"
    ]
  },

  {
    question:"The “vapor” that comes out of a vaping device is: ",
    answers:[
      "harmless water vapor",
      "mostly water vapor with a few aerosolized chemicals in it",
      "an equal amount of water vapor with aerosolized and harmful chemicals",
      "mostly aerosolized and harmful chemicals with a little water vapor",
      "just aerosolized chemicals (no water vapor)"
    ]
  },

  {
    question:"How harmful are “disposable” (single use) vaping products to the environment?",
    answers:[
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful",
    ]
  },

  {
    question:"Imagine you use cannabis products (smoke, vape, eat, or drink) occasionally. How harmful would this be for your health?",
    answers:[
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful",
    ]

  },

  {
    question:"Imagine you use cannabis products (smoke, vape, eat, or drink) daily.  How harmful would this be for your health?",
    answers:[
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful",
    ]
  },

  {
    question:"It is safe to take Adderall and other prescription stimulants to stay awake and study.",
    answers:[
      "Strongly agree",
      "Agree",
      "Disagree",
      "Strongly disagree",
      "Don't know"
    ]
  },

  {
    question:"If someone has had too much to drink and fallen asleep on the floor, I should do the following:  (check all that apply)",
    answers:[
      "Just let them sleep it off",
      "Call 911",
      "Turn them onto their side",
      "Give them water to drink",
      "Call their parents",
      "None of the above",

    ]
  },


  {
    question:"Imagine someone has taken a pill and you don't know what was in, and the person is now passed out on the floor.  What should you do? (check all that apply)",
    answers:[
      "Let them sleep it off",
      "Call 911",
      "Turn them onto their side",
      "Give Naloxone",
      "Give them water to drink",
      "None of the above",
    ]
  },

  {
    question:"Fentanyl is a drug that you can find in nature.",
    answers:[
      "Agree",
      "Disagree",
      "Strongly disagree",
      "Don't know"
    ]
  },

  {
    question:"Is it easy to know whether a pill has fentanyl in it.",
    answers:[
      "Agree",
      "Disagree",
      "Strongly disagree",
      "Don't know"
    ]
  },

  {
    question:"It is ok to use another person’s prescription drugs.",
    answers:[
      "Agree",
      "Disagree",
      "Strongly disagree",
      "Don't know"
    ]
  }


]


const Form = () => {
  const {
    user,
    showAlert,
    teacher,
    displayAlert,
    updateLocation,
    isLoading,
    enterCode,
    submitForm,
    successAlert,
  } = useAppContext();

  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  let selected = [];
  let names = [];

  // const handleOptionChange = (optionValue) => {
  //   if (selectedOptions.includes(optionValue)) {
  //     setSelectedOptions(selectedOptions.filter((option) => option !== optionValue));
  //   } else {
  //     setSelectedOptions([...selectedOptions, optionValue]);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = [];
  
    names.forEach((name) => {
      const question = name;
      const answers = [];
  
      let checks = document.getElementsByName(name);
      for (var check of checks) {
        if (check.checked) {
          answers.push(check.value);
        }
      }
  
      formData.push({ question, answers });
    });
    console.log(formData)
  
    // Rest of the code
    submitForm(
      formData,
      localStorage.getItem("code"),
      info["grade"],
      info["when"],
      info["form"],
      info["school"],
      info["period"]
    );
    successAlert("Form Sucessfully Completed. Redirecting...");
    setTimeout(() => {
      navigate("/success", {});
    }, 3000);
  };

  const [usedForm, setUsedForm] = useState(() => {
    if (info["form"] === "You and Me, Together Vape-Free") {
      return info["when"] === "before" ? tobacco : tobacco.concat(postTobacco);
    } else if (info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness") {
      return info["when"] === "before" ? cannabis : cannabis.concat(postCannabis);
    }
    else if (info["form"] === "Safety First"){
      return safety
    }
  });

  return (
    <Wrapper style={{ margin: "2rem auto",  maxWidth: "700px" }}>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{`${info.form}`}</h3>
        {usedForm.map((element, index) => (
          <div key={index}>
            <div style={{ display: "flex", columnGap: "0.35rem" }}>
              <p>{names.push(element["question"])}.</p>
              <p>{element["question"]}</p>
            </div>
            {element["question"].includes("check all that apply") ? (
              element["answers"].map((answer, index) => (
                <label key={index} className="container">
                  <span>{answer}</span>
                  <input type="checkbox" name={element["question"]} value={answer} />
                  <span className="checkmark"></span>
                </label>
              ))
            ) : (
              element["answers"].map((answer, index) => (
                <label key={index} className="container">
                  <span>{answer}</span>
                  <input type="radio" value={answer} name={element["question"]} />
                  <span className="checkmark"></span>
                </label>
              ))
            )}
          </div>
        ))}

        {showAlert && <Alert />}
        <button
          className="btn btn-block"
          type="submit"
          onSubmit={(e) => handleSubmit(e.target.value)}
          style={{ marginTop: "1.38rem" }}
        >
          submit
        </button>
      </form>
    </Wrapper>
  );
};
export default Form;
