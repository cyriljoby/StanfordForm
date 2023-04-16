import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import StudentReponse from "../models/StudentReponse.js";

const getStudentResponses = async(req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  const token = user.createJWT();
  attachCookie({ res, token });

  const {
    school,
    teacherId,
    grade,
    period,
    formType,
    When
  } = req.query;

  const teacher = await User.findOne({ _id: teacherId })

  console.log({ teacher, teacherId })

  const queryObject = {
    school,
    teacher: teacherId,
    formType,
  };

  if (grade && grade !== 'all') {
    queryObject.grade = grade;
  }
  if (period && period !== 'all') {
    queryObject.period = period;
  }
  if (When && When !== 'all') {
    queryObject.When = When;
  }

  console.log({ queryObject })
  const studentResponses = await StudentReponse.find(queryObject)

  res.status(StatusCodes.OK).json({ teacherName: teacher.name, studentResponses });
}

export { getStudentResponses }