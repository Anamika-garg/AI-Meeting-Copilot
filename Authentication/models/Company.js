import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  managerName: { type: String, required: true },
  managerEmail: { type: String, required: true },
  managerJiraId: { type: String, required: true }
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  numberOfDepartments: { type: Number, required: true },
  departments: [departmentSchema]   
});

export default mongoose.model("Company", companySchema);
