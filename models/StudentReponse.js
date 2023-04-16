import mongoose from 'mongoose'

const StudentResponseSchema = new mongoose.Schema(
  {
    formCode: {
      type: String,
      required: [true, 'Please provide code'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    grade: {
      type: String,
      required: [true, 'Please provide grade'],
      maxlength:10,
    },
    When: {
      type: String,
      enum: ['before', 'after'],
      required: [true, 'Please provide when'],
    },
    formType:{
      type: String,
      enum: ['tobacco', 'cannabis'],
      required: [true, 'Please provide form type'],
    },
    school:{
      type: String,
      required: [true, 'Please provide school'],
    },
    period:{
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('StudentResponseSchema', StudentResponseSchema)
